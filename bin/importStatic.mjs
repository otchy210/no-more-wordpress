import path from 'path';
import fs from 'fs/promises';
import csso from 'csso';
import config from './config.mjs';
import { isDevMode } from './common.mjs';

const DOCS_ROOT = path.resolve(isDevMode() ? config.dirs.devDocs : config.dirs.docs);

const inlineThreshold = 1024;

const cache = {
    css: {}
};

const css = async (path) => {
    if (!cache.css[path]) {
        cache.css[path] = await handleCss(path);
    }
    const css = cache.css[path];
    if (css.minified.length < inlineThreshold) {
        return `<style>${css.minified}</style>`;
    } else {
        return `<link rel="stylesheet" href="${css.path}">`;
    }
}

const handleCss = async (path) => {
    if (!path.endsWith('.css')) {
        throw new Error(`${path} is not css`);
    }
    const css = await fs.readFile(`${DOCS_ROOT}${path}`, 'utf-8');
    if (path.endsWith('.min.css')) {
        return {
            path,
            minified: css
        };
    }
    const minified = csso.minify(css).css;
    const minifiedPath = `${path.substr(0, path.lastIndexOf('.'))}.min.css`;
    await fs.writeFile(`${DOCS_ROOT}${minifiedPath}`, minified, 'utf-8');
    return {
        path: minifiedPath,
        minified
    };
}

export default {
    css
};