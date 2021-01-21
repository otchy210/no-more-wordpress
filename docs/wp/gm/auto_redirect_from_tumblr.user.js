// ==UserScript==
// @name           Auto redirect from Tumblr
// @namespace      http://www.otchy.net/
// @include        http://*.tumblr.com/post/*
// ==/UserScript==
(function(e){
	if (!e) return;
	location.href = e.href;
})(document.querySelector && document.querySelector('.source a'));
