import path from 'path';
import fs from 'fs/promises';
import rcopy from 'recursive-copy';
import config from './config.mjs';
import template from './template.mjs';
import { isDevMode } from './common.mjs';
import { usePostData } from './PostData.mjs';
import { useMetaData } from './MetaData.mjs';

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
    await handleCategories();
    await handleTags();
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
    writeArchivePages(
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

const handleCategories = async () => {
    const { posts, categories: postCategories } = await usePostData();
    const { categories } = await useMetaData();
    Object.entries(postCategories).forEach(([slug, paths]) => {
        const category = categories[slug];
        const rootPath = `/category/${slug}/`;
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

const handleTags = async () => {
    const { posts, tags: postTags } = await usePostData();
    const { tags } = await useMetaData();
    Object.entries(postTags).forEach(([slug, paths]) => {
        const tag = tags[slug];
        const rootPath = `/tag/${slug}/`;
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
    const html = await template.page({...post, prev, next});
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
        const htmlDir = `${DOCS_ROOT}${getArchivePagePath(rootPath, page)}`;
        const html = await template.page({
            body: articles.join('\n'),
            title,
            description,
            prev,
            next
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
