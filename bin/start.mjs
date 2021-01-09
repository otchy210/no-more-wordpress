import path from 'path';
import express from 'express';
import config from './config.mjs';
import { isDevMode } from './common.mjs';

const DOCS_ROOT = path.resolve(isDevMode() ? config.dirs.devDocs : config.dirs.docs);
const PORT = 3000;

const app = express();
app.use('/', express.static(DOCS_ROOT));

app.listen(PORT, () => {
    console.log(`DOCS_ROOT: ${DOCS_ROOT}`);
    console.log(`Open http://localhost:${PORT}/`);
    console.log(`Ctrl+C to stop the server`);
});
