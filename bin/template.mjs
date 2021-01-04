export default ({title, body, category, time, tags}) => {
    return `
<html>
<head>
    <title>${title}</title>
</head>
<body>
${body}
</body>
</html>
`;
};
