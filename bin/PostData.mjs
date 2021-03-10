import path from 'path';
import fs from 'fs/promises';
import config from './config.mjs';
import { isDevMode } from './common.mjs';
import marked from 'marked';

const DATA_ROOT = path.resolve(config.dirs.data);

class PostData {
    async load() {
        const posts = [];
        await handleDir([], posts);

        this.posts = {};
        posts.forEach(post => {
            this.posts[post.path] = post;
        });
        this.blogPosts = posts
            .filter(post => post.type === 'post')
            .sort((left, right) => right.time - left.time);
        this.pagePosts = posts
            .filter(post => post.type === 'page');

        this.monthlyArchives = {};
        this.categories = {};
        this.tags = {};
        this.blogPosts.forEach(post => {
            const { time, path } = post;
            const monthlyPath = getMonthlyPath(time);
            if (!this.monthlyArchives[monthlyPath]) {
                this.monthlyArchives[monthlyPath] = [];
            }
            this.monthlyArchives[monthlyPath].push(path);
            post?.categories?.forEach(category => {
                if (!this.categories[category]) {
                    this.categories[category] = [];
                }
                this.categories[category].push(path);
            });
            post?.tags?.forEach(tag => {
                if (!this.tags[tag]) {
                    this.tags[tag] = [];
                }
                this.tags[tag].push(path);
            });
        });
    }
}

const handleDir = async (dirPaths, posts) => {
    const post = await handlePost(dirPaths);
    if (post) {
        posts.push(post);
    }
    const currDir = `${DATA_ROOT}/${dirPaths.join('/')}`;
    const paths = await fs.readdir(currDir);
    for (const path of paths) {
        if (!isDevMode() && path === '_draft') {
            continue;
        }
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
    const contentName = (await fs.readdir(dataDir)).filter(file => file.startsWith('content.'))[0];
    if (!contentName) {
        return false;
    }
    const contentPath = `${dataDir}${contentName}`;
    const stat = await fs.lstat(contentPath).catch(() => {/* ignore */});
    if (!stat || !stat.isFile()) {
        return false;
    }
    const meta = await getPostMeta(dataDir);
    const time = new Date(meta.time);
    const [title, body] = await readContent(contentPath);
    return {
        ...meta,
        time,
        path,
        title,
        body,
        truncatedBody: truncate(body)
    };
};

const readContent = async (contentPath) => {
    const content = await fs.readFile(contentPath, 'utf-8');
    if (contentPath.endsWith('.html')) {
        return content.split('\n----------------\n');
    } else if (contentPath.endsWith('.md')) {
        const lines = content.split('\n');
        const title = lines.shift().replace(/^#+\s*/, '');
        const mdBody = lines.join('\n').trim();
        const body = marked(mdBody);
        return [title, body];
    }
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

export const truncate = (content) => {
    const noTagContent = content
        .split(/<[^>]+>/).join(' ')
        .split(/\s+/).join(' ')
        .replace(/['"]/g, (c) => {
            switch(c) {
                case '\'':
                    return '&#x27;';
                case '"':
                    return '&quot;';
            }
        });
    if (noTagContent.length < 120) {
        return noTagContent;
    }
    const hasHtmlEntitiesInLast6Chars = noTagContent.substr(114, 6).includes('&');
    const truncateLength = hasHtmlEntitiesInLast6Chars ? noTagContent.indexOf('&', 114) : 120;
    return `${noTagContent.substr(0, truncateLength)}…`;
};

const getMonthlyPath = (date) => {
    const yyyy = date.getFullYear();
    const mm = new String(date.getMonth() + 1).padStart(2, '0');
    return `/${yyyy}/${mm}/`;
};

const loadPostData = async () => {
    const postData = new PostData();
    await postData.load();
    return postData;
}

let postData;
export const usePostData = async () => {
    if (postData) {
        return postData;
    }
    postData = await loadPostData();
    return postData;
};