import fs from 'fs/promises';

const entries = [];

const addEntry = (entry) => {
    const {url, time, priority} = entry;
    const lastmod = time ? time.toISOString() : null;
    entries.push({
        url,
        lastmod,
        priority
    });
};

const write = async (path) => {
    const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ].concat(
        entries.map(entry => {
            const {url, lastmod, priority} = entry;
            const items = [`<loc>${url}</loc>`];
            if (lastmod) {
                items.push(`<lastmod>${lastmod}</lastmod>`);
            }
            if (priority) {
                items.push(`<priority>${priority}</priority>`);
            }
            return `<url>${items.join('')}</url>`;
        })
    ).concat([
        '</urlset>'
    ]).join('\n');
    await fs.writeFile(path, xml);
};

export default {
    addEntry,
    write
};
