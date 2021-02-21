// ==UserScript==
// @name           GoogleFloatingForm
// @namespace      https://www.otchy.net/
// @include        http://www.google.*/search*
// @version        1.1.0
// ==/UserScript==

(function() {
	var d = document;
	var style = d.createElement('style');
	d.getElementsByTagName('head')[0].appendChild(style);
	var ss = d.styleSheets[d.styleSheets.length - 1];
	var ssIndex = 0;
	ss.insertRule('#gbz, #gbg, #gbx3, #gbx4, #searchform, #resultStats, .ksfccl, #leftnav {' +
		'position: fixed !important;' +
		'opacity: 1 !important;' +
	'}', ssIndex++);
	ss.insertRule('.ksfccl {' +
		'right: 0;' +
	'}', ssIndex++);
	ss.insertRule('#leftnav {' +
		'margin-top: 120px !important;' +
	'}', ssIndex++);
	var query = d.querySelector('#lst-ib');
	d.body.addEventListener('dblclick', function (event) {
		query.select();
	}, false);
})();
