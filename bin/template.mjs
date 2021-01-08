const page = ({title, body, category, time, tags}) => {
    return `
<html>
<head>
    <title>${title ? `${title} - ` : ''}OTCHY.NET</title>
</head>
<body>
    <main>
        ${body}
    </main>
</body>
</html>
`;
};

const article = ({title, body, path}) => {
    return `
<article>
    <h1><a href="/${path}">${title}</a></h1>
    <p>
        ${body}
    </p>
</article>
`;
};

export default {
    page,
    article
};