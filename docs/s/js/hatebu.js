(() => {
    const widgetLoader = document.getElementById('hatebu-widget-loader');
    let liCount = 0;
    const observer = new MutationObserver(records => {
        records.forEach(record => {
            Array.from(record.addedNodes).forEach(node => {
                if (node.tagName === 'LI') {
                    liCount++;
                }
                if (liCount === 12) {
                    const widget = document.getElementById('hatena-bookmark-widget0');
                    const list = widget.querySelector('.hatena-bookmark-widget-body');
                    document.querySelector('.popular-hatebu').appendChild(list);
                    document.body.removeChild(widgetLoader);
                }
            })
        });
    });
    observer.observe(widgetLoader, {
        childList: true,
        subtree: true
    });

    Object.entries({
        url: 'https://www.otchy.net/',
        sort: 'count',
        num: 12,
        'theme': 'notheme'
    }).forEach(([k,v]) => {
        Hatena.BookmarkWidget[k] = v;
    });
    Hatena.BookmarkWidget.load();
})();
