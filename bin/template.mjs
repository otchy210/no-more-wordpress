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
    <link rel="icon" type="image/png" href="${await importStatic.imageSrc('/s/img/icon-16.png')}" sizes="16x16">
    <link rel="icon" type="image/png" href="${await importStatic.imageSrc('/s/img/icon-32.png')}" sizes="32x32">
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

${await footer()}

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
            ${title ? `<h1>${title}${time ? `<small>${formatTime(time)}</small>` : ''}</h1>` : ''}
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
        ${prev ? `
            <div class="col-sm-12 col-lg-6 prev" style="background-image:url(${await importStatic.imageSrc('/s/img/left.min.svg')})">
                <a href="${prev.path}">${prev.title}</a>
            </div>
        ` : '<div class="col-sm-12 col-lg-6"></div>'}
        ${next ? `
            <div class="col-sm-12 col-lg-6 next" style="background-image:url(${await importStatic.imageSrc('/s/img/right.min.svg')})">
                <a href="${next.path}">${next.title}</a>
            </div>
        ` : '<div class="col-sm-12 col-lg-6"></div>'}
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
                    <a class="no-icon" target="_blank" href="https://twitter.com/otchy">
                        ${await importStatic.inlineSvg('/s/img/twitter.min.svg')}
                    </a>
                    <a class="no-icon" target="_blank" href="https://github.com/otchy210">
                        ${await importStatic.inlineSvg('/s/img/github.min.svg')}
                    </a>
                    <a class="no-icon" target="_blank" href="https://www.linkedin.com/in/otchy">
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
</aside>`
}

const footer = async () => {
    const metaData = await useMetaData();
    return `
<footer class="container">
    <div class="row">
        <div class="col-sm-12 col-md-3 col-md-offset-1">
            <h5>アーカイブ</h5>
            <ul>
                ${metaData.monthlyArchives.map(archive => {
                    return `<li><a href="${archive.path}">${archive.label}</a></li>`
                }).join('\n')}
            </ul>
        </div>
        <div class="col-sm-12 col-md-3">
            <h5>カテゴリ</h5>
            <ul>
                ${Object.values(metaData.categories).map(category => {
                    return `<li><a href="/category/${category.slug}/">${category.label}</a></li>`
                }).join('\n')}
            </ul>
        </div>
        <div class="col-sm-12 col-md-4">
            <h5>タグ</h5>
            <p>${Object.values(metaData.tags).map(tag => {
                return `<a href="/tag/${tag.slug}/">${tag.label}</a>`
            }).join('\n')}</p>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-12">
            <hr>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-12 col-md-10 col-md-offset-1">
            <p class="copyright">
                Copyright © OTCHY.NET authored by <a class="no-icon" href="https://twitter.com/otchy" target="_blank">@otchy</a>
            </p>
        </div>
    </div>
</footer>`
}

const getTotalPages = () => {
    return totalPages;
};

const formatTime = (time) => {
    const yyyy = time.getFullYear();
    const mm = new String(time.getMonth() + 1).padStart(2, '0');
    const dd = new String(time.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
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

const article = ({title, truncatedBody, path, time}, isFirst) => {
    return `
<article>
    ${isFirst ? '' : '<hr>'}
    <h2><a href="${path}">${title}</a>${time ? `<small>${formatTime(time)}</small>` : ''}</h2>
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