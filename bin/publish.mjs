import path from 'path';
import fs from 'fs/promises';
import config from './config.mjs';
import CLI from "./CLI.mjs";

const DATA_ROOT = path.resolve(config.dirs.data);
const DRAFT_ROOT = path.join(DATA_ROOT, '_draft');

const formatYYYYMMDD = (date) => {
    const yyyy = date.getFullYear();
    const mm = new String(date.getMonth() + 1).padStart(2, '0');
    const dd = new String(date.getDate()).padStart(2, '0');
    return `${yyyy}${mm}${dd}`;
}

const main = async () => {
    const cli = new CLI();

    const slugs = (await fs.readdir(DRAFT_ROOT)).sort();
    console.log(slugs.map((slug, i) => {
        return `${i + 1}. ${slug}`;
    }).join('\n'));

    const slugNum = await cli.askPosInt('draft?> ', 1, slugs.length);
    const slug = slugs[slugNum - 1];
    const draftDir = path.join(DRAFT_ROOT, slug);

    const draftMetaPath = path.join(draftDir, 'meta.json');
    const metaJson = (await fs.readFile(draftMetaPath, {encoding: 'utf-8'})).toString();
    const meta = JSON.parse(metaJson);

    const post = (await fs.readdir(draftDir)).filter(file => file.startsWith('content.'))[0];
    const draftPostPath = path.join(draftDir, post);

    const now = new Date();
    const publishDirPath = path.join(DATA_ROOT, formatYYYYMMDD(now), slug);
    await fs.mkdir(publishDirPath, {recursive: true});
    meta.time = now.getTime();
    const publishMetaPath = path.join(publishDirPath, 'meta.json');
    await fs.writeFile(publishMetaPath, JSON.stringify(meta, null, 2));
    
    const publishPostPath = path.join(publishDirPath, post);
    await fs.copyFile(draftPostPath, publishPostPath);

    fs.rmdir(draftDir, {recursive: true});

    cli.close();
}

main();