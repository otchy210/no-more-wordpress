import path from 'path';
import fs from 'fs/promises';
import config from './config.mjs';

class MetaData {
    async load() {
        const dataRoot = path.resolve(config.dirs.data);
        const jsonPath = `${dataRoot}/meta.json`;
        const jsonStr = await fs.readFile(jsonPath, 'utf-8');
        const json = JSON.parse(jsonStr);
        this.categories = json.categories;
        this.tags = json.tags;
    }
}

export const loadMetaData = async () => {
    const metaData = new MetaData();
    await metaData.load();
    return metaData;
};
