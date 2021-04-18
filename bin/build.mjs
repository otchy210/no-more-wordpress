import path from 'path';
import fs from 'fs/promises';
import rcopy from 'recursive-copy';
import config from './config.mjs';
import template from './template.mjs';
import { isDevMode } from './common.mjs';
import { usePostData, truncate } from './PostData.mjs';
import { useMetaData } from './MetaData.mjs';
import Sitemap from './Sitemap.mjs';

const DOCS_ROOT = path.resolve(isDevMode() ? config.dirs.devDocs : config.dirs.docs);

const main = async () => {
    const startTime = Date.now();
    console.log('Start writing HTML files.');
    if (isDevMode()) {
        copyStaticFiles();
    }
    await fs.mkdir(DOCS_ROOT, {recursive: true});
    await handleBlogPosts();
    await handlePagePosts();
    await handleMontlyArchives();
    await handleCategories();
    await handleTags();
    await Sitemap.write(`${DOCS_ROOT}/sitemap.xml`);
    console.log(`Done! (Built ${template.getTotalPages()} pages in ${Date.now() - startTime} msecs)`);
};

const copyStaticFiles = async () => {
    const dataRoot = path.resolve(config.dirs.data);
    const docsRoot = path.resolve(config.dirs.docs);
    const paths = await fs.readdir(docsRoot);
    paths.forEach(async (path) => {
        if (['page', 'category', 'tag'].some(d => d === path)) {
            return;
        }
        const docPath = `${docsRoot}/${path}`;
        const docStat = await fs.lstat(docPath);
        if (!docStat.isDirectory()) {
            return;
        }
        const dataPath = `${dataRoot}/${path}`;
        const dataStat = await fs.lstat(dataPath).catch(e=>{});
        if (dataStat?.isDirectory()) {
            return;
        }
        await rcopy(docPath, `${DOCS_ROOT}/${path}`, {overwrite: true});
    })
};

const handleBlogPosts = async () => {
    const { blogPosts } = await usePostData();
    for (let i = 0; i < blogPosts.length; i++) {
        const post = blogPosts[i];
        await writePost(post, blogPosts[i+1], blogPosts[i-1]);
    }
    await writeArchivePages(
        '/',
        null,
        null,
        blogPosts
    );
};

const handlePagePosts = async () => {
    const { pagePosts } = await usePostData();
    for (let post of pagePosts) {
        await writePost(post);
    }
};

const handleMontlyArchives = async () => {
    const { posts, monthlyArchives } = await usePostData();
    for (const [rootPath, paths] of Object.entries(monthlyArchives)) {
        const [_, yyyy, mm] = rootPath.split('/');
        const year = parseInt(yyyy);
        const month = parseInt(mm);
        const monthlyPosts = [];
        paths.forEach(path => {
            monthlyPosts.push(posts[path]);
        });
        await writeArchivePages(
            rootPath,
            `月別: ${year} 年 ${month} 月`,
            null,
            monthlyPosts,
            0.4
        );
    }
};

const handleCategories = async () => {
    const { posts, categories: postCategories } = await usePostData();
    const { categories } = await useMetaData();
    for (const [slug, paths] of Object.entries(postCategories)) {
        const category = categories[slug];
        const rootPath = `/category/${slug}/`;
        const categoryPosts = [];
        paths.forEach(path => {
            categoryPosts.push(posts[path]);
        });
        await writeArchivePages(
            rootPath,
            `カテゴリ: ${category.label}`,
            category.description,
            categoryPosts,
            0.3
        );
    };
};

const handleTags = async () => {
    const { posts, tags: postTags } = await usePostData();
    const { tags } = await useMetaData();
    for (const [slug, paths] of Object.entries(postTags)) {
        const tag = tags[slug];
        const rootPath = `/tag/${slug}/`;
        const tagPosts = [];
        paths.forEach(path => {
            tagPosts.push(posts[path]);
        });
        await writeArchivePages(
            rootPath,
            `タグ: ${tag.label}`,
            null,
            tagPosts,
            0.2
        );
    };
};

const ONE_DAY = 1000 * 60 * 60 * 24;
const TWO_WEEKS = ONE_DAY * 7 * 2;
const TWO_MONTHS = ONE_DAY * 60;
const HALF_YEAR = ONE_DAY * 365/2;
const ONE_YEAR = ONE_DAY * 365;
const now = Date.now();
const calcPriority = (time) => {
    if (!time) {
        return 0.5;
    }
    const diff = now - time.getTime();
    if (diff < ONE_DAY) {
        return 1;
    }
    if (diff < TWO_WEEKS) {
        return 0.9;
    }
    if (diff < TWO_MONTHS) {
        return 0.8;
    }
    if (diff < HALF_YEAR) {
        return 0.7;
    }
    if (diff < ONE_YEAR) {
        return 0.6;
    }
    return 0.5;
}

const writePost = async (post, prev, next) => {
    const priority = calcPriority(post.time);
    const html = await template.page({...post, prev, next}, {priority});
    const htmlDir = `${DOCS_ROOT}${post.path}`;
    await fs.mkdir(htmlDir, {recursive: true});
    const htmlPath = `${htmlDir}/index.html`;
    await fs.writeFile(htmlPath, html);
};

const writeArchivePages = async (rootPath, title, description, posts, priority = 0.5) => {
    for (let offset = 0; offset * 5 < posts.length; offset++) {
        const isRoot = rootPath === '/' && offset === 0;
        const page = offset + 1;
        const articles = [];
        for (let i = 0; i < 5; i++) {
            const index = offset * 5 + i;
            const post = posts[index];
            if (!post) {
                break;
            }
            const article = template.article(post, i === 0);
            articles.push(article);
        }
        const prev = (offset + 1) * 5 < posts.length ? {
            path: getArchivePagePath(rootPath, page + 1),
            title: '古い投稿'
        } : null;
        const next = page !== 1 ? {
            path: getArchivePagePath(rootPath, page - 1),
            title: '新しい投稿'
        } : null;
        const path = getArchivePagePath(rootPath, page);
        const htmlDir = `${DOCS_ROOT}${path}`;
        const body = articles.join('\n');
        const html = await template.page({
            path,
            body,
            title,
            description,
            truncatedBody: truncate(body),
            prev,
            next,
            time: isRoot ? new Date() : null
        }, {
            priority: isRoot ? 1 : priority
        });
        await fs.mkdir(htmlDir, {recursive: true});
        const htmlPath = `${htmlDir}index.html`;
        await fs.writeFile(htmlPath, html);
    }
};

const getArchivePagePath = (rootPath, page) => {
    return page === 1 ? rootPath : `${rootPath}page/${page}/`;
};

main().catch(err => {
    console.error(err);
});
