import path from 'path';
import fs from 'fs/promises';
import config from './config.mjs';
import { newConnection } from './mysql.mjs';
import jsdom from 'jsdom';
const { JSDOM } = jsdom;

const DATA_ROOT = path.resolve(config.dirs.data);

const conn = newConnection(config.mysql);

const main = async () => {
    await fs.mkdir(DATA_ROOT, {recursive: true});

    conn.connect();

    const terms = await getTerms(conn);
    const metaPath = `${DATA_ROOT}/meta.json`;
    const meta = {
        categories: terms.categories,
        tags: terms.tags
    };
    await fs.writeFile(metaPath, prettyStringify(meta));

    const posts = await getPosts(conn);
    posts.forEach(post => {
        const {id} = post;
        handlePost(post, terms.posts[id]);
    });
};

const getTerms = async (conn) => {
    const {results} = await conn.query(`
        SELECT
            rel.object_id AS id,
            tax.taxonomy,
            tax.description,
            terms.name,
            terms.slug
        FROM
            wp_term_relationships AS rel
            JOIN
                wp_term_taxonomy AS tax
            ON
                rel.term_taxonomy_id = tax.term_taxonomy_id
            JOIN
                wp_terms AS terms
            ON
                tax.term_id = terms.term_id
    `);
    const terms = {
        categories: {},
        tags: {},
        posts: {}
    };
    results.forEach(({id, taxonomy, description, name, slug}) => {
        switch (taxonomy) {
            case 'category':
                if (!terms.posts[id]) {
                    terms.posts[id] = {};
                }
                if (!terms.posts[id].categories) {
                    terms.posts[id].categories = [];
                }
                terms.posts[id].categories.push(slug);
                if (terms.categories[slug]) {
                    return;
                }
                terms.categories[slug] = {
                    label: name,
                    description
                };
                return;
            case 'post_tag':
                if (!terms.posts[id]) {
                    terms.posts[id] = {};
                }
                if (!terms.posts[id].tags) {
                    terms.posts[id].tags = [];
                }
                terms.posts[id].tags.push(slug);
                if (terms.tags[slug]) {
                    return;
                }
                terms.tags[slug] = {
                    label: name
                };
                return;
        }
    });
    return terms;
};

const getPosts = async (conn) => {
    const {results} = await conn.query(`
        SELECT
            posts.ID AS id,
            posts.post_date AS date,
            posts.post_content AS content,
            posts.post_title AS title,
            posts.post_name AS name,
            posts.post_type AS type,
            parent.post_name AS parentName
        FROM
            wp_posts AS posts
            LEFT JOIN
                wp_posts AS parent
            ON
                posts.post_parent = parent.ID
        WHERE
            posts.post_type IN ('post', 'page') AND
            posts.post_status = 'publish'
        `);
    return results;
};

const handlePost = async (post, terms) => {
    const {date, title, content, type} = post;
    const path = getPostPath(post);

    const dataDir = `${DATA_ROOT}/${path}`;
    await fs.mkdir(dataDir, {recursive: true});

    const metaPath = `${dataDir}/meta.json`;
    const meta = {
        ...terms,
        type,
        time: date.getTime(),
    };
    if (type === 'page') {
        delete meta.categories;
        delete meta.tags;
    }
    await fs.writeFile(metaPath, prettyStringify(meta));

    const contentPath = `${dataDir}/content.html`;
    const contentBody = `${title}\n----------------\n${addBr(content.replace(/\/\/s\.otchy\.net\//g, '/wp/'))}`;
    await fs.writeFile(contentPath, contentBody);
};

const getPostPath = (post) => {
    const {type, name, parentName} = post;
    switch (type) {
        case 'post':
            const postDatePath = getPostDatePath(post);
            return `${postDatePath}/${name}`;
        case 'page':
            return [parentName, name].filter(n => n).join('/');
    }
    throw new Error(`Unknown post_type: ${type}`);
};

const getPostDatePath = (post) => {
    const {date} = post;
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    return `${y}${m.toString().padStart(2, '0')}${d.toString().padStart(2, '0')}`;
};

const blockTagNames = new Set([
    'ADDRESS',
    'ARTICLE',
    'ASIDE',
    'BLOCKQUOTE',
    'CANVAS',
    'DD',
    'DIV',
    'DL',
    'DT',
    'FIELDSET',
    'FIGCAPTION',
    'FIGURE',
    'FOOTER',
    'FORM',
    'H1',
    'H2',
    'H3',
    'H4',
    'H5',
    'H6',
    'HEADER',
    'HR',
    'LI',
    'MAIN',
    'NAV',
    'NOSCRIPT',
    'OL',
    'P',
    'PRE',
    'SECTION',
    'TABLE',
    'TFOOT',
    'UL',
    'VIDEO'
]);

const isBlock = (elem) => {
    if (!elem) {
        return true;
    }
    return blockTagNames.has(elem.tagName);
}

const addBr = (content) => {
    const dom = new JSDOM(content);
    const body = dom.window.document.body;
    const results = [];
    pushInnerHtml(body, results);
    return results.join('');
};

const pushInnerHtml = (elem, results) => {
    const children = Array.from(elem.childNodes);
    let prev = null;
    for (const curr of children) {
        switch (curr.nodeType) {
            case 1: // ELEMENT_NODE
                const html = curr.outerHTML;
                if (curr.tagName === 'PRE') {
                    results.push(html.split('&nbsp;').join(' '));
                } else if (!isBlock(curr)) {
                    results.push(html);
                } else if (isBlock(curr)) {
                    const startTag = html.substr(0, html.indexOf('>') + 1);
                    results.push(startTag);
                    pushInnerHtml(curr, results);
                    const endTag = html.substr(html.lastIndexOf('<'));
                    results.push(endTag);
                }
                break;
            case 3: // TEXT_NODE
                const text = curr.textContent;
                if (
                    isBlock(prev) &&
                    text.length > 0 &&
                    text.charAt(0) === '\n'
                ) {
                    results.push('\n');
                    results.push(text.substr(1).split('\n').join('<br>\n'));
                } else {
                    results.push(text.split('\n').join('<br>\n'));
                }
                break;
        }
        prev = curr;
    }
}

const prettyStringify = (object) => {
    return JSON.stringify(object, null, 2);
}

main().catch(err => {
    console.error(err);
}).finally(() => {
    conn.end();
});
