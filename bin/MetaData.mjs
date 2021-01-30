import path from 'path';
import fs from 'fs/promises';
import config from './config.mjs';
import { usePostData } from './PostData.mjs';

class MetaData {
    async load() {
        const dataRoot = path.resolve(config.dirs.data);
        const jsonPath = `${dataRoot}/meta.json`;
        const jsonStr = await fs.readFile(jsonPath, 'utf-8');
        const json = JSON.parse(jsonStr);

        const postData = await usePostData();
        this.categories = Object.entries(json.categories).map(([slug, values]) => {
            return {
                slug,
                ...values,
                count: postData.categories[slug].length
            }
        }).sort((left, right) => {
            return left.label < right.label ? -1 : 1;
        }).reduce((map, category) => {
            map[category.slug] = category;
            return map;
        }, {});
        this.tags = Object.entries(json.tags).map(([slug, values]) => {
            return {
                slug,
                ...values,
                count: postData.tags[slug].length
            };
        }).sort((left, right) => {
            const countDiff = right.count - left.count;
            if (countDiff !== 0) {
                return countDiff;
            }
            return left.label < right.label ? -1 : 1;
        }).reduce((map, tag) => {
            map[tag.slug] = tag;
            return map;
        }, {});
    }
}

let metaData;
export const useMetaData = async () => {
    if (metaData) {
        return metaData;
    }
    metaData = new MetaData();
    await metaData.load();
    return metaData;
};