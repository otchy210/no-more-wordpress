import path from 'path';
import fs from 'fs/promises';
import config from './config.mjs';
import template from './template.mjs';

const DATA_ROOT = path.resolve(config.dirs.data);
const DOCS_ROOT = path.resolve(config.dirs.docs);

const main = async () => {
    await fs.mkdir(DOCS_ROOT, {recursive: true});
    await handleDir([]);
};

const handleDir = async (dirPaths) => {
    handlePost(dirPaths);
    const currDir = `${DATA_ROOT}/${dirPaths.join('/')}`;
    const paths = await fs.readdir(currDir);
    for (const path of paths) {
        const nextPath = `${currDir}/${path}`;
        const stat = await fs.lstat(nextPath);
        if (stat.isDirectory()) {
            handleDir([...dirPaths, path]);
        }
    }
};

const handlePost = async (dirPaths) => {
    const dataDir = `${DATA_ROOT}/${dirPaths.join('/')}`;
    const contentPath = `${dataDir}/content.html`;
    const stat = await fs.lstat(contentPath).catch(() => {/* ignore */});
    if (!stat || !stat.isFile()) {
        return;
    }
    const meta = await getPostMeta(dataDir);
    const content = await fs.readFile(contentPath, 'utf-8');
    const [title, body] = content.split('\n----------------\n');
    const post = {
        ...meta,
        title,
        body
    };
    const html = template(post);

    const htmlDir = `${DOCS_ROOT}/${dirPaths.join('/')}`;
    await fs.mkdir(htmlDir, {recursive: true});
    const htmlPath = `${htmlDir}/index.html`;
    fs.writeFile(htmlPath, html);
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

main().catch(err => {
    console.error(err);
});
