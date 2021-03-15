import path from 'path';
import fs from 'fs/promises';
import config from './config.mjs';
import CLI from "./CLI.mjs";
import { useMetaData } from "./MetaData.mjs";

const DRAFT_ROOT = path.join(path.resolve(config.dirs.data), '_draft');

const isValidSlug = (slug) => {
    if (slug.trim().length === 0) {
        console.error('slug cannot be empty.');
        return false;
    }
    if (!/[a-z][a-z0-9\-]*/.test(slug)) {
        console.error('slug is invalid.');
        return false;
    }
    return true;
}

const main = async () => {
    const cli = new CLI();

    let slug;
    do {
        slug = await cli.ask('slug?> ');
    } while (!isValidSlug(slug));

    const postDir = path.join(DRAFT_ROOT, slug);
    const lstat = await fs.lstat(postDir).catch(() => {
        // expected, ignoring.
    });
    if (lstat && (lstat.isFile() || lstat.isDirectory())) {
        console.error(`${postDir} already exists.`);
        process.exit();
    }

    const metadata = await useMetaData();
    const allCategories = Object.values(metadata.categories).sort((left, right) => {
        return left.slug < right.slug ? -1 : 1;
    });
    console.log(allCategories.map((category, i) => {
        return `${i + 1}. ${category.slug} (${category.label})`;
    }).join('\n'));

    const categoryNum = await cli.askPosInt('category?> ', 1, allCategories.length);
    const category = allCategories[categoryNum - 1];

    const allTags = Object.values(metadata.tags).sort((left, right) => {
        return left.slug < right.slug ? -1 : 1;
    });
    const tagPrompt = allTags.map((tag, i) => {
        return `${i + 1}. ${tag.slug} (${tag.label})`;
    }).join('\n');

    const tags = [];
    while(await cli.askYN('tag [y/n]?> ')) {
        console.log(tagPrompt);
        const tagNum = await cli.askPosInt('tag?> ', 1, allTags.length);
        const tag = allTags[tagNum - 1];
        tags.push(tag);
    }

    let format;
    do {
        format = await cli.ask('format [html/md]?> ');
    } while (format !== 'html' && format !== 'md');


    await fs.mkdir(postDir, {recursive: true});

    const metaPath = path.join(postDir, 'meta.json');
    const postMeta = {cover: ''};
    postMeta.categories = [category.slug];
    if (tags.length > 0) {
        postMeta.tags = tags.map(tag => tag.slug).sort();
    }
    postMeta.type = 'post';
    await fs.writeFile(metaPath, JSON.stringify(postMeta, null, 2));

    const contentPath = path.join(postDir, `content.${format}`);
    await fs.writeFile(contentPath, format === 'html' ?
        'TITLE\n----------------\nbody\n' :
        '# TITLE\n\nbody\n'
    );

    cli.close();
};

main();
