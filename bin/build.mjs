import path from 'path';
import fs from 'fs/promises';
import config from './config.mjs';
import template from './template.mjs';
import { isDevMode } from './common.mjs';
import { loadPostData } from './PostData.mjs';
import { loadMetaData } from './MetaData.mjs';

const DOCS_ROOT = path.resolve(isDevMode() ? config.dirs.devDocs : config.dirs.docs);

const main = async () => {
    const postData = await loadPostData();
    const metaData = await loadMetaData();
    await fs.mkdir(DOCS_ROOT, {recursive: true});
    await handleBlogPosts(postData);
    await handlePagePosts(postData);
    await handleCategories(postData, metaData);
    await handleTags(postData, metaData);
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

const getBlogListPath = (page) => {
    return page === 1 ? '/' : `/page/${page}/`;
};

const handlePagePosts = async ({ pagePosts }) => {
    pagePosts.forEach(post => writePost(post));
};

const handleCategories = async ({ posts, categories: postCategories }, { categories }) => {
    Object.entries(postCategories).forEach(([slug, paths]) => {
        const category = categories[slug];
        const rootPath = `/category/${slug}`;
        const categoryPosts = [];
        paths.forEach(path => {
            categoryPosts.push(posts[path]);
        });
        writeArchivePages(
            rootPath,
            `カテゴリ: ${category.label}`,
            category.description,
            categoryPosts
        );
    });
};

const handleTags = async ({ posts, tags: postTags }, { tags }) => {
    Object.entries(postTags).forEach(([slug, paths]) => {
        const tag = tags[slug];
        const rootPath = `/tag/${slug}`;
        const tagPosts = [];
        paths.forEach(path => {
            tagPosts.push(posts[path]);
        });
        writeArchivePages(
            rootPath,
            `タグ: ${tag.label}`,
            null,
            tagPosts
        );
    });
};

const writePost = async (post, prev, next) => {
    const html = template.page({...post, prev, next});
    const htmlDir = `${DOCS_ROOT}${post.path}`;
    await fs.mkdir(htmlDir, {recursive: true});
    const htmlPath = `${htmlDir}/index.html`;
    await fs.writeFile(htmlPath, html);
};

const writeArchivePages = async (rootPath, title, description, posts) => {
    for (let offset = 0; offset * 5 < posts.length; offset++) {
        const page = offset + 1;
        const articles = [];
        for (let i = 0; i < 5; i++) {
            const index = offset * 5 + i;
            const post = posts[index];
            if (!post) {
                break;
            }
            const article = template.article(post);
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
        const htmlDir = `${DOCS_ROOT}${getArchivePagePath(rootPath, page)}`;
        const html = template.page({
            body: articles.join('\n'),
            title,
            description,
            prev,
            next
        });
        await fs.mkdir(htmlDir, {recursive: true});
        const htmlPath = `${htmlDir}/index.html`;
        await fs.writeFile(htmlPath, html);
    }
};

const getArchivePagePath = (rootPath, page) => {
    return page === 1 ? rootPath : `${rootPath}/page/${page}`;
};

main().catch(err => {
    console.error(err);
});
