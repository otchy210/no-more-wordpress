// ==UserScript==
// @name           GoogleFloatingForm
// @namespace      https://www.otchy.net/
// @include        http://www.google.*/search*
// ==/UserScript==

(function() {
	// for google SERPs
	var queryDivSelector = 'div#sfcnt';
	var ctrlDivSelector = 'div#subform_ctrl';
	var menuDivSelector = 'div#leftnav';
	var queryInputSelector = 'input.lst';
	
	var pageHeaderHeight = 32;
	var queryDivHeight = 55;
	var queryAndMenuDistance = queryDivHeight - 23;

	// for customize
	var movingUp = 2;
	var nomalShadow = 
		'box-shadow: 3px 3px 3px #999;' +
		'-moz-box-shadow: 3px 3px 3px #999;' +
		'-webkit-box-shadow: 3px 3px 3px #999;'
	;
	var movingShadow = 
		'box-shadow: 4px 4px 6px #aaa;' +
		'-moz-box-shadow: 4px 4px 6px #aaa;' +
		'-webkit-box-shadow: 4px 4px 6px #aaa;'
	;

	// main
	var d = document;
	var style = d.createElement('style');
	d.getElementsByTagName('head')[0].appendChild(style);
	var ss = d.styleSheets[d.styleSheets.length - 1];
	var ssIndex = 0;
	ss.insertRule(queryDivSelector + ' {' +
		'position: absolute;' +
		'top: 0;' +
		'margin-top: ' + pageHeaderHeight + 'px;' +
		'padding: 5px 0;' +
		'z-index: 80;' +
		'background-color: #fff;' +
		'border: solid #999;' +
		'border-width: 1px 1px 0 1px;' +
		'border-radius: 5px 5px 5px 0;' +
		'-moz-border-radius: 5px 5px 5px 0;' +
		nomalShadow +
	'}', ssIndex++);
	ss.insertRule(queryDivSelector + '.moving {' +
		'margin-top: ' + (pageHeaderHeight - movingUp) + 'px;' +
		'margin-left: -' + movingUp + 'px;' +
		movingShadow +
	'}', ssIndex++);
	ss.insertRule(ctrlDivSelector + ' {' +
		'margin-top: ' + queryDivHeight + 'px;' +
	'}', ssIndex++);
	ss.insertRule(menuDivSelector + ' {' +
		'position: absolute;' +
		'top: 0;' +
		'margin-top: -' + queryAndMenuDistance + 'px;' +
		'z-index: 90;' +
		'border: solid #999;' +
		'border-width: 0 1px 1px 1px;' +
		'border-radius: 0 0 5px 5px;' +
		'-moz-border-radius: 0 0 5px 5px;' +
		nomalShadow +
	'}', ssIndex++);
	ss.insertRule(menuDivSelector + '.moving {' +
		'margin-top: -' + (queryAndMenuDistance + movingUp) + 'px;' +
		'margin-left: -' + movingUp + 'px;' +
		movingShadow +
	'}', ssIndex++);

	var queryDiv = d.querySelector(queryDivSelector);
	var menuDiv = d.querySelector(menuDivSelector);
	var queryInput = d.querySelector(queryInputSelector);

	setInterval(function() {
		var scroll = window.scrollY;
		var offset = queryDiv.offsetTop - pageHeaderHeight + (queryDiv.className == 'moving' ? movingUp : 0);
		if (Math.abs(scroll - offset) <= 2) {
			queryDiv.className = '';
			menuDiv.className = '';
			return;
		}
		var from = scroll > offset ? scroll : offset;
		var to = scroll > offset ? offset : scroll;
		var adjust = scroll > offset ? 0.5 : -0.5;
		var newOffset = Math.floor((from - to)*0.7 + adjust + to);
		queryDiv.className = 'moving';
		menuDiv.className = 'moving';
		queryDiv.style.top = newOffset + 'px';
		menuDiv.style.top = newOffset + 'px';
	}, 50);

	d.body.addEventListener('dblclick', function (event) {
		queryInput.select();
	}, false);
})();
