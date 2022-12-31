Array.from(document.getElementsByTagName('a')).forEach(a => {
    const href = a.getAttribute('href');
    if (!href) {
        return;
    }
    if (!href.startsWith('http')) {
        return;
    }
    const target = a.getAttribute('target');
    if (target) {
        return;
    }
    a.setAttribute('target', '_blank');
});