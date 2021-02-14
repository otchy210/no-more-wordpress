import path from 'path';
import fs from 'fs/promises';
import csso from 'csso';
import UglifyJS from 'uglify-js';
import datauri from 'datauri';
import config from './config.mjs';
import { isDevMode } from './common.mjs';

const DOCS_ROOT = path.resolve(isDevMode() ? config.dirs.devDocs : config.dirs.docs);

const inlineThreshold = 4096;
const imgInlinethreshold = 2048;

const cache = {
    css: {},
    js: {},
    image: {},
    inlineSvg: {}
};

const css = async (path) => {
    if (!cache.css[path]) {
        cache.css[path] = await handleCss(path);
    }
    const css = cache.css[path];
    if (css.minified) {
        return `<style>${css.minified}</style>`;
    } else {
        return `<link rel="stylesheet" href="${css.path}">`;
    }
};

const handleCss = async (path) => {
    if (!path.endsWith('.css')) {
        throw new Error(`${path} is not css`);
    }
    if (isDevMode()) {
        return {
            path
        };
    }
    const css = await fs.readFile(`${DOCS_ROOT}${path}`, 'utf-8');
    if (path.endsWith('.min.css')) {
        return {
            path,
            minified: css.length < inlineThreshold ? css : null
        };
    }
    const minified = csso.minify(css).css;
    const minifiedPath = `${path.substr(0, path.lastIndexOf('.'))}.min.css`;
    await fs.writeFile(`${DOCS_ROOT}${minifiedPath}`, minified, 'utf-8');
    return {
        path: minifiedPath,
        minified: minified.length < inlineThreshold ? minified : null
    };
};

const js = async (path, options) => {
    if (!cache.js[path]) {
        cache.js[path] = await handleJs(path);
    }
    const js = cache.js[path];
    if (js.minified) {
        return `<script>${js.minified}</script>`;
    } else if (options && options.syncLoad) {
        return `<script src="${js.path}"></script>`;
    } else {
        return `<script src="${js.path}" async></script>`;
    }
};

const handleJs = async (path) => {
    if (!path.endsWith('.js')) {
        throw new Error(`${path} is not js`);
    }
    if (isDevMode()) {
        return {
            path
        };
    }
    const js = await fs.readFile(`${DOCS_ROOT}${path}`, 'utf-8');
    if (path.endsWith('.min.js')) {
        return {
            path,
            minified: js.length < inlineThreshold ? js : null
        };
    }
    const minifiedResult = UglifyJS.minify(js);
    if (minifiedResult.error) {
        throw new Error(minifiedResult.error);
    }
    const minified = minifiedResult.code;
    const minifiedPath = `${path.substr(0, path.lastIndexOf('.'))}.min.js`;
    await fs.writeFile(`${DOCS_ROOT}${minifiedPath}`, minified, 'utf-8');
    return {
        path: minifiedPath,
        minified: minified.length < inlineThreshold ? minified : null
    };
};

const imageSrc = async (path) => {
    if (!cache.image[path]) {
        cache.image[path] = await handleImage(path);
    }
    const image = cache.image[path];
    return image.dataUri || image.path;
};

const image = async (path) => {
    if (!cache.image[path]) {
        cache.image[path] = await handleImage(path);
    }
    const image = cache.image[path];
    if (image.path2x) {
        return `<img
            src="${image.path}"
            srcset="${image.path} 1x, ${image.path2x} 2x"
        >`
    } else {
        return `<img src="${image.dataUri || image.path}">`;
    }
};

const handleImage = async (path) => {
    const extIndex = path.lastIndexOf('.');
    if (!['png', 'jpg', 'svg'].includes(path.substr(extIndex + 1))) {
        throw new Error(`${path} is not png, jpg or svg`);
    }
    const filePath = `${DOCS_ROOT}${path}`;
    const fileStat = await fs.lstat(filePath).catch(e => {
        throw new Error(`${filePath} is not found`);
    });
    if (!fileStat.isFile()) {
        throw new Error(`${filePath} is not a file`);
    }
    if (isDevMode()) {
        return {
            path
        };
    }
    const dataUri = await datauri(filePath);

    const path2x = await (async () => {
        const path2x = `${path.substr(0, extIndex)}@2x${path.substr(extIndex)}`;
        const filePath2x = `${DOCS_ROOT}${path2x}`;
        const fileStat2x = await fs.lstat(filePath2x).catch(e => {});
        if (fileStat2x?.isFile()) {
            return path2x;
        } else {
            return null;
        }
    })();

    return {
        path,
        dataUri: dataUri.length < imgInlinethreshold ? dataUri : null,
        path2x
    }
};

const inlineSvg = async (path) => {
    if (!cache.inlineSvg[path]) {
        cache.inlineSvg[path] = await handleInlineSvg(path);
    }
    return cache.inlineSvg[path];
};

const handleInlineSvg = async (path) => {
    if (!path.endsWith('.min.svg')) {
        throw new Error(`${path} is not minified svg`);
    }
    const svg = await fs.readFile(`${DOCS_ROOT}${path}`, 'utf-8');
    if (path.endsWith('.min.svg')) {
        return svg;
    }
    return null;
};

export default {
    css,
    js,
    image,
    imageSrc,
    inlineSvg
};