// ==UserScript==
// @name        Htn To Original
// @namespace   http://www.otchy.net/
// @include     http://b.hatena.ne.jp/entry/*
// @version     1.0.0
// ==/UserScript==

var isWebkit = window.navigator.userAgent.toLowerCase().indexOf('webkit') >= 0;
window.addEventListener(isWebkit ? 'load' : 'DOMContentLoaded', function() {
	var d = document;
	var parent = d.querySelectorAll('#main > div.box-wrap:first-child')[0];
	if (!parent) return;
	parent.addEventListener('DOMNodeInserted', function(e) {
		if (!e.target.querySelectorAll) return;
		if (e.target.querySelectorAll('#highlighted-bookmark').length == 0) return;
		location.href = d.getElementById('head-entry-link').href;
	}, false);
}, false);
