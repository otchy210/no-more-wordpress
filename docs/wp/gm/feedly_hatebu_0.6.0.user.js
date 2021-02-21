// ==UserScript==
// @name           Feedly with Hatena bookmark
// @version        0.6.0
// @namespace      https://www.otchy.net
// @include        http://www.feedly.com/*
// @include        http://cloud.feedly.com/*
// @include        https://www.feedly.com/*
// @include        https://cloud.feedly.com/*
// ==/UserScript==

window.addEventListener('load', function() {

(function (d, func) {
    var h = d.getElementsByTagName('head')[0];
    var s1 = d.createElement("script");
    s1.setAttribute("src", "http://code.jquery.com/jquery-2.0.1.min.js");
    s1.addEventListener('load', function() {
        var s2 = d.createElement("script");
        s2.textContent = "(" + func.toString() + ")(jQuery.noConflict(true));";
        h.appendChild(s2);
    }, false);
    h.appendChild(s1);
})(unsafeWindow.document, function($) {
    var count=0;
    setTimeout(function() {
        $('#mainBar').on('DOMNodeInserted', function(e) {
            var t = e.target;
            if (!t.id || !t.id.match(/_main$/)) return;
            console.log('Feedly with Hatena bookmark:' + count++);  // Don't erase. If no log, this script doesn't work well. (I don't know why)
            var $main = $(t);
            if ($main.data('feedly-w-hatebu') === 'done') return;
            var url = $main.find('.u100Entry').data('alternate-link');
            var $hatebu = $('<a>').attr('href', 'http://b.hatena.ne.jp/entry/' + url).attr('target', '_blank').append(
                $('<img>').attr('src', 'http://b.st-hatena.com/entry/image/' + url)
            );
            $main.find('.wikiWidgetSave').after($hatebu);
            $main.data('feedly-w-hatebu', 'done');
        });
    }, 1000);  // Wait loading for Feedly
});

}, false);