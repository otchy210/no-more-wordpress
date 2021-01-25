import { minify } from 'html-minifier';
import { isDevMode } from './common.mjs';
import { usePostData } from './PostData.mjs';
import { useMetaData } from './MetaData.mjs';
import importStatic from './importStatic.mjs';

const minifyOptions = {
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    continueOnParseError: true,
    decodeEntities: true,
    html5: true, // default
    includeAutoGeneratedTags: true, // default
    keepClosingSlash: false, // default
    minifyCSS: false, // default
    minifyJS: false, // default
    preserveLineBreaks: true,
    preventAttributesEscaping: false, // default
    removeAttributeQuotes: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeEmptyElements: false, // default
    removeOptionalTags: false, // default
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    removeTagWhitespace: false, // default
    sortAttributes: false, // default
    sortClassName: false, // default
    useShortDoctype: true, 
};

const minifyIfNeeded = (html) => {
    if (isDevMode()) {
        return html;
    }
    return minify(html, minifyOptions);
};

let totalPages = 0;
const page = async (post) => {
    const { title } = post;
    totalPages++;
    return minifyIfNeeded(`
<html>
<head>
    <title>${title ? `${title} - ` : ''}OTCHY.NET</title>
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/mini.css/3.0.1/mini-default.min.css">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${await importStatic.css('/s/css/style.css')}
</head>
<body>

<header class="sticky row">
    <div class="col-sm-12 col-md-10 col-md-offset-1">
        <a href="/" class="button">Home</a>
        <a href="/javascript/" class="button">JavaScript</a>
        <a href="/greasemonkey/" class="button">Greasemonkey</a>
        <a href="/php/" class="button">PHP</a>
    </div>
</header>

<div class="container">
    <div class="row">
        <div class="col-sm-12 col-md-10 col-lg-7 col-md-offset-1">
            ${await main(post)}
        </div>
        <div class="col-sm-12 col-md-10 col-lg-3 col-md-offset-1 col-lg-offset-0">
            ${await aside()}
        </div>
    </div>
</div>

<footer>
    <div class="col-sm-12 col-md-10 col-md-offset-1">
        Copyright © OTCHY.NET authored by <a href="https://twitter.com/otchy" target="_blank">@otchy</a>
    </div>
</footer>

<div id="hatebu-widget-loader" style="display: none">
    <script src="//b.hatena.ne.jp/js/widget.js"></script>
    ${await importStatic.js('/s/js/hatebu.js')}
</div>
</body>
</html>
`);
};

const main = async ({title, description, body, categories, time, tags, prev, next}) => {
    const metaData = await useMetaData();
    return `
<main class="container">
    ${title || description ? `<div class="row">
        <div class="col-sm-12">
            ${title ? `<h1>${title}</h1>` : ''}
            ${description ? `<p>
                ${description}
            </p>` : ''}
            <hr>
        </div>
    </div>` : '' }
    <div class="row">
        <div class="col-sm-12">
            ${body}
        </div>
    </div>
    ${showCategoriesOrTags(categories, tags, metaData) ? `
    <div class="row">
        <div class="col-sm-12">
            <hr>
            ${getCategories(categories, metaData)}
            ${getTags(tags, metaData)}
        </div>
    </div>` : ''}
    ${prev || next ? `
    <div class="row">
        <div class="col-sm-12">
            <hr>
        </div>
        <div class="col-sm-12 col-lg-6${prev ? ' prev' : ''}">
            ${prev ? `<a href="${prev.path}">${prev.title}</a>` : ''}
        </div>
        <div class="col-sm-12 col-lg-6${next ? ' next' : ''}">
            ${next ? `<a href="${next.path}">${next.title}</a>` : ''}
        </div>
    </div>` : ''}
    <div class="row">
        <div class="col-sm-12">
            <hr>
        </div>
    </div>
</main>`;
}

const aside = async () => {
    const { blogPosts } = await usePostData();
    return `
<aside class="container">
    <div class="row">
        <div class="col-sm-12">
            <h4>プロフィール</h4>
            <div class="profile">
                <p class="name">
                    ${await importStatic.image('/s/img/logo.jpg')}
                    落合 徹
                </p>
                <p class="bio">
                    Otchy / 1979 年 2 月 10 日生まれ / 仕事: Web システム開発 / 好きなもの: IT 全般、科学分野 / 座右の銘: 明日は明日の風が吹く / 好きな言葉: ハードルは高ければ高いほどくぐりやすい<br>
                </p>
                <p class="social">
                    <a target="_blank" href="https://twitter.com/otchy">
                        ${await importStatic.inlineSvg('/s/img/twitter.min.svg')}
                    </a>
                    <a target="_blank" href="https://github.com/otchy210">
                        ${await importStatic.inlineSvg('/s/img/github.min.svg')}
                    </a>
                    <a target="_blank" href="https://www.linkedin.com/in/otchy">
                        ${await importStatic.inlineSvg('/s/img/linkedin.min.svg')}
                    </a>
                </p>
            </div>
            <hr>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-12 col-md-6 col-lg-12">
            <h4>最近の投稿</h4>
            <ul>
                ${blogPosts.filter((_, i) => i < 10).map(post => `
                    <li><a href="${post.path}">${post.title}</a></li>
                `).join('\n')}
            </ul>
        </div>
        <div class="col-sm-12 col-md-6 col-lg-12">
            <h4>はてブ人気エントリ</h4>
            <div class="popular-hatebu"></div>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-12 col-md-6 col-lg-12">
            <h4>自サイト・ツール</h4>
            <ul>
                <li><a href="https://www.webcomicranking.com/" target="_blank">Web Comic Ranking</a></li>
                <li><a href="http://viewer.webcomicranking.com/" target="_blank">WCR Comic Viewer</a></li>
                <li><a href="http://fukidashi-talk.otchy.net/" target="_blank">フキダシトーク</a></li>
                <li><a href="http://cronbuilder.otchy.net/" target="_blank">Cron Builder</a></li>
                <li><a href="http://nut.otchy.net/" target="_blank">数値単位変換</a></li>
                <li><a href="http://tacj2011.otchy.net/" target="_blank">Tech Advent Calendar Japan 2011</a></li>
                <li><a href="http://selectart.otchy.net/" target="_blank">Select Art</a></li>
            </ul>
        </div>
        <div class="col-sm-12 col-md-6 col-lg-12">
            <h4>外部関連サイト</h4>
            <ul>
                <li><a href="https://qiita.com/otchy/" target="_blank">Qiita[キータ]</a></li>
                <li><a href="https://note.com/otchy/" target="_blank">note</a></li>
            </ul>
        </div>
    </div>
</aside>
    `
}

const getTotalPages = () => {
    return totalPages;
}

const showCategories = (categories, metaData) => {
    return categories && categories.length > 0 && metaData;
};

const showTags = (tags, metaData) => {
    return tags && tags.length > 0 && metaData;
}

const showCategoriesOrTags = (categories, tags, metaData) => {
    return showCategories(categories, metaData) || showTags(tags, metaData);
}

const getCategories = (categories, metaData) => {
    if (!showCategories(categories, metaData)) {
        return '';
    }
    return `
        カテゴリ: 
        ${categories.map(slug => {
            const category = metaData.categories[slug];
            return `<a href="/category/${slug}/">${category.label}</a>`;
        }).join('\n')}
    `;
};

const getTags = (tags, metaData) => {
    if (!showTags(tags, metaData)) {
        return '';
    }
    return `
        タグ: 
        ${tags.map(slug => {
            const tag = metaData.tags[slug];
            return `<a href="/tag/${slug}/">${tag.label}</a>`;
        }).join('\n')}
    `;
};

const article = ({title, truncatedBody, path}, isFirst) => {
    return `
<article>
    ${isFirst ? '' : '<hr>'}
    <h2><a href="${path}">${title}</a></h2>
    <p>
        ${truncatedBody}
    </p>
</article>
`;
};

export default {
    page,
    getTotalPages,
    article
};