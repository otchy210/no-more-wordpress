import path from 'path';
import fs from 'fs/promises';
import config from './config.mjs';

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
    const time = new Date(meta.time);
    const content = await fs.readFile(contentPath, 'utf-8');
    const [title, body] = content.split('\n----------------\n');
    return {
        ...meta,
        time,
        path,
        title,
        body,
        truncatedBody: truncate(body)
    };
};

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
    const noTagContent = content.split(/<[^>]+>/).join(' ').split(/\s+/).join(' ');
    if (noTagContent.length < 120) {
        return noTagContent;
    }
    return `${noTagContent.substr(0, 120)}…`;
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