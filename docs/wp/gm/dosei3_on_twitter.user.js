// ==UserScript==
// @name           dosei3_on_twitter
// @namespace      https://www.otchy.net
// @include        http://twitter.com/dosei3*
// ==/UserScript==

var d = document;
var s = d.createElement('style');
s.innerHTML = "li.status, ul.about span {font-family : 'どせいさん'}";
d.body.appendChild(s);
