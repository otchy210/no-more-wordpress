import { minify } from 'html-minifier';
import { isDevMode } from './common.mjs';
import { usePostData } from './PostData.mjs';
import { useMetaData } from './MetaData.mjs';
import importStatic from './importStatic.mjs';
import Sitemap from './Sitemap.mjs';

const ROOT = 'https://www.otchy.net';
const DEFAULT_COVER = '/s/img/cover/default.jpg';
const SITE_NAME = 'OTCHY.NET';
const DEFAULT_DESCRIPTION = 'Otchy の雑記ブログ。技術ネタは Qiita と併用。JavaScript 率高め、古くは Twitter/PHP/Java/Perl など。共通点は Web。';
const FBID = 1716785578265;

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
    removeComments: false, // default
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
const page = async (post, sitemapEntry = {}) => {
    const { title, path, cover, truncatedBody, time } = post;
    const url = `${ROOT}${path ?? ''}`;
    Sitemap.addEntry({
        url,
        time,
        ...sitemapEntry
    });
    totalPages++;
    return minifyIfNeeded(`
<html lang="ja">
<head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# article: http://ogp.me/ns/article#">
    <title>${title ? `${title} - ` : ''}${SITE_NAME}</title>
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-5762897-3"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','UA-5762897-3');</script>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${await importStatic.css('/s/css/mini-otchy.min.css')}
    ${await importStatic.css('/s/css/style.css')}
    <link rel="icon" type="image/png" href="${await importStatic.imageSrc('/s/img/icon-16.png')}" sizes="16x16">
    <link rel="icon" type="image/png" href="${await importStatic.imageSrc('/s/img/icon-32.png')}" sizes="32x32">
    <meta property="og:title" content="${title ?? SITE_NAME}" />
    <meta property="og:type" content="${path ? 'article' : 'website'}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${ROOT}${cover ?? DEFAULT_COVER}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:description" content="${truncatedBody ?? DEFAULT_DESCRIPTION}" />
    <meta property="fb:admins" content="${FBID}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@otchy" />
    <meta name="twitter:player" content="@otchy" />
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
    ${await importStatic.js('/s/js/hatebu.js', {syncLoad: true})}
</div>
${await importStatic.js('/s/js/link-target.js')}
</body>
</html>
`);
};

const main = async ({title, description, body, categories, time, tags, prev, next, cover}) => {
    const metaData = await useMetaData();
    return `
<main class="container">
    <div class="row">
        <div class="col-sm-12">
            ${await coverImage(cover)}
        </div>
    </div>
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
        <div class="col-sm-12 body">
            ${body}
        </div>
    </div>
    <div class="row">
        <div class="col-sm-12">
            <p class="social-buttons">${socialButtons()}</p>
        </div>
    </div>
    ${showCategoriesOrTags(categories, tags, metaData) ? `
    <div class="row">
        <div class="col-sm-12">
            <hr>
            <p>
                ${getCategories(categories, metaData)}
                ${getTags(tags, metaData)}
            </p>
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
                <li><a href="https://www.webcomicranking.com/" target="_blank">(旧) Web Comic Ranking</a></li>
                <li><a href="http://viewer.webcomicranking.com/" target="_blank">WCR Comic Viewer</a></li>
                <li><a href="http://fukidashi-talk.otchy.net/" target="_blank">フキダシトーク</a></li>
                <li><a href="http://cronbuilder.otchy.net/" target="_blank">Cron Builder</a></li>
                <li><a href="http://nut.otchy.net/" target="_blank">数値単位変換</a></li>
                <li><a href="http://tacj2011.otchy.net/" target="_blank">Tech Advent Calendar Japan 2011</a></li>
                <li><a href="http://selectart.otchy.net/" target="_blank">Select Art</a></li>
                <li><a href="https://scalable-dots.otchy.net/" target="_blank">ScalableDots</a></li>
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
};

const coverImage = async (cover) => {
    if (!cover) {
        return await importStatic.image(DEFAULT_COVER, 'cover');
    } else if (cover.startsWith('http')) {
        return `<img src="${cover}" class="cover">`;
    } else {
        return await importStatic.image(cover, 'cover');
    }
};

const socialButtons = () => {
    return `${hatebu()}${twitter()}${facebook()}`;
};

const hatebu = () => {
    return `<script>document.write('<a href="https://b.hatena.ne.jp/entry/' + location.href + '" class="hatena-bookmark-button" data-hatena-bookmark-title="' + document.title + '" data-hatena-bookmark-layout="standard-balloon" data-hatena-bookmark-lang="ja" title="このエントリーをはてなブックマークに追加"><img src="https://b.st-hatena.com/images/entry-button/button-only@2x.png" alt="このエントリーをはてなブックマークに追加" width="20" height="20" style="border: none;" /></a>');</script><script src="https://b.st-hatena.com/js/bookmark_button.js" charset="utf-8" async></script>`;
};

const twitter = () => {
    return `<a href="https://twitter.com/share" class="twitter-share-button" data-via="otchy">Tweet</a> <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script>`
};

const facebook = () => {
    return `<script>document.write('<iframe src="https://www.facebook.com/plugins/like.php?href=' + location.href + '&width=112&height=20&layout=button_count&action=like" class="facebook-share-button"></iframe>');</script>`
};

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