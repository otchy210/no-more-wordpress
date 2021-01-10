import path from 'path';
import fs from 'fs/promises';
import config from './config.mjs';
import template from './template.mjs';
import { isDevMode } from './common.mjs';
import { loadPostData } from './PostData.mjs';

const DATA_ROOT = path.resolve(config.dirs.data);
const DOCS_ROOT = path.resolve(isDevMode() ? config.dirs.devDocs : config.dirs.docs);

const main = async () => {
    const postData = await loadPostData();
    await fs.mkdir(DOCS_ROOT, {recursive: true});
    await handleBlogPosts(postData);
    await handlePagePosts(postData);

    // const posts = [];
    // await handleDir([], posts);
    // const blogPosts = posts
    //     .filter(post => post.type === 'post')
    //     .sort((left, right) => right.time - left.time);
    // await buildBlogLists(blogPosts);
};

const handleBlogPosts = async ({ blogPosts }) => {
    let offset = 0;
    while (true) {
        const articles = [];
        for (let i = 0; i < 5 ; i++) {
            const j = offset + i;
            if (j >= blogPosts.length) {
                break;
            }
            const post = blogPosts[j];
            await writePost(post, blogPosts[j+1], blogPosts[j-1]);
            const article = template.article(post);
            articles.push(article);
        }
        offset += 5;
        const page = offset / 5;
        const hasPrev = offset <= blogPosts.length;
        const prev = hasPrev ? {
            path: getBlogListPath(page + 1),
            title: '古い投稿'
        } : null;
        const next = page !== 1 ? {
            path: getBlogListPath(page - 1),
            title: '新しい投稿'
        } : null;
        const htmlDir = page === 1 ? DOCS_ROOT : `${DOCS_ROOT}/page/${page}`;
        const html = template.page({
            body: articles.join('\n'),
            prev,
            next
        });
        await fs.mkdir(htmlDir, {recursive: true});
        const htmlPath = `${htmlDir}/index.html`;
        await fs.writeFile(htmlPath, html);
        if (!hasPrev) {
            break;
        }
    }
};

const handlePagePosts = async ({ pagePosts }) => {
    pagePosts.forEach(post => writePost(post));
};

const writePost = async (post, prev, next) => {
    const html = template.page({...post, prev, next});
    const htmlDir = `${DOCS_ROOT}${post.path}`;
    await fs.mkdir(htmlDir, {recursive: true});
    const htmlPath = `${htmlDir}/index.html`;
    await fs.writeFile(htmlPath, html);
};

const handleDir = async (dirPaths, posts) => {
    const post = await handlePost(dirPaths);
    if (post) {
        posts.push(post);
    }
    const currDir = `${DATA_ROOT}/${dirPaths.join('/')}`;
    const paths = await fs.readdir(currDir);
    for (const path of paths) {
        const nextPath = `${currDir}/${path}`;
        const stat = await fs.lstat(nextPath);
        if (stat.isDirectory()) {
            await handleDir([...dirPaths, path], posts);
        }
    }
};

const handlePost = async (dirPaths) => {
    const path = `/${dirPaths.join('/')}/`;
    const dataDir = `${DATA_ROOT}${path}`;
    const contentPath = `${dataDir}content.html`;
    const stat = await fs.lstat(contentPath).catch(() => {/* ignore */});
    if (!stat || !stat.isFile()) {
        return false;
    }
    const meta = await getPostMeta(dataDir);
    const content = await fs.readFile(contentPath, 'utf-8');
    const [title, body] = content.split('\n----------------\n');
    const post = {
        ...meta,
        title,
        body
    };
    const html = template.page(post);

    const htmlDir = `${DOCS_ROOT}/${dirPaths.join('/')}`;
    await fs.mkdir(htmlDir, {recursive: true});
    const htmlPath = `${htmlDir}/index.html`;
    await fs.writeFile(htmlPath, html);
    return {
        ...post,
        path,
        body: truncate(body)
    };
}

const getPostMeta = async (dir) => {
    const path = `${dir}/meta.json`;
    const stat = await fs.lstat(path).catch(() => {/* ignore */});
    if (!stat || !stat.isFile()) {
        return {};
    }
    const json = await fs.readFile(path, 'utf-8');
    return JSON.parse(json);
};

const truncate = (content) => {
    const noTagContent = content.split(/<[^>]+>/).join(' ').split(/\s+/).join(' ');
    if (noTagContent.length < 120) {
        return noTagContent;
    }
    return `${noTagContent.substr(0, 120)}…`;
};

const buildBlogLists = async (blogPosts) => {
    let offset = 0;
    while (true) {
        const articles = [];
        for (let i = 0; i < 5 ; i++) {
            const j = offset + i;
            if (j >= blogPosts.length) {
                break;
            }
            const post = blogPosts[j];
            const article = template.article(post);
            articles.push(article);
        }
        offset += 5;
        const page = offset / 5;
        const hasPrev = offset <= blogPosts.length;
        const prev = hasPrev ? {
            path: getBlogListPath(page + 1),
            title: '古い投稿'
        } : null;
        const next = page !== 1 ? {
            path: getBlogListPath(page - 1),
            title: '新しい投稿'
        } : null;
        const htmlDir = page === 1 ? DOCS_ROOT : `${DOCS_ROOT}/page/${page}`;
        const html = template.page({
            body: articles.join('\n'),
            prev,
            next
        });
        await fs.mkdir(htmlDir, {recursive: true});
        const htmlPath = `${htmlDir}/index.html`;
        await fs.writeFile(htmlPath, html);
        if (!hasPrev) {
            break;
        }
    }
};

const getBlogListPath = (page) => {
    return page === 1 ? '/' : `/page/${page}/`;
};

main().catch(err => {
    console.error(err);
});
