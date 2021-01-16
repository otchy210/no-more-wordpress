// ==UserScript==
// @name           Gsmall
// @namespace      http://www.otchy.net/
// @include        https://mail.google.com/mail/*
// @version        1.0.0
// ==/UserScript==

(function (d, func) {
	var h = d.getElementsByTagName('head')[0];
	var s = d.createElement("script");
	s.textContent = '(' + func.toString() + ')(document);';
	h.appendChild(s);
})(document, function(d) {
	var d = d.getElementById('canvas_frame').contentWindow.document;
	var s = d.createElement('link');
	s.rel = 'stylesheet';
	s.type = 'text/css';
	s.href = 'data:text/css;base64,LnB3e2ZvbnQtc2l6ZTo5MCV9LnhZe2ZvbnQtc2l6ZTo4MCV9Lm5Ne2ZvbnQtc2l6ZTo4MCV9LnZCe2ZvbnQtc2l6ZTo4MCV9Lldye2ZvbnQtc2l6ZToxMnB4fS5ULUl7Zm9udC1zaXplOjEycHh9LkotTXtmb250LXNpemU6MTJweH0uYWtoe2ZvbnQtc2l6ZToxMnB4fQ==';
	d.getElementsByTagName('head')[0].appendChild(s);
});
