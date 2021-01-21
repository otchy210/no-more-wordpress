/*
 * jQuery Button Style plugin
 * Copyright (c) 2013 Otchy
 * This source file is subject to the MIT license.
 * http://www.otchy.net
 */
(function($){
	var err = function(msg) {
		alert('jQuery Button Style: ' + msg);
	}
	$(document.head).append('<style>');
	var sheets = document.styleSheets;
	var sheet = sheets[sheets.length - 1];
	var addSt = function(cls, val) {
		sheet.insertRule('.' + cls + '{' + val + '}', sheet.cssRules.length);
	}
	addSt('jqbs-br-normal', 'border-radius: 6px;');
	addSt('jqbs-bc-light-dark', 'border: solid 1px rgba(0,0,0,0.2);');
	addSt('jqbs-bc-dark', 'border: solid 1px rgba(0,0,0,0.4);');
	addSt('jqbs-bs-highlight', 'box-shadow: 0 1px 0 rgba(255,255,255,0.8) inset;');
	addSt('jqbs-bs-aqua', 'box-shadow: 0 1px 0 rgba(255,255,255,0.8) inset, 0 -1px 4px rgba(0,0,0,0.4) inset, 0 2px 5px rgba(0,0,0,0.3);');
	addSt('jqbs-bi-linear', 'background-image: -webkit-linear-gradient(top, rgba(255,255,255,0.5), rgba(0,0,0,0.2));');
	addSt('jqbs-bi-aqua', 'background-image: -webkit-linear-gradient(top, rgba(255,255,255,0.7), rgba(0,0,0,0.2), rgba(255,255,255,0.4));');
	addSt('jqbs-ts-dimple', 'text-shadow: 0 -1px 1px rgba(0,0,0,0.5)');
	var themes = {
		'default': {'br': 'normal', 'bc': 'light-dark', 'bs': 'highlight', 'bi': 'linear', 'ts': 'dimple'},
		'aqua': {'br': 'half', 'bc': 'dark', 'bs': 'aqua', 'bi': 'aqua', 'ts': 'dimple'}
	};
	$.fn.buttonstyle = function(opt) {
		if (opt === undefined) {
			opt = {theme: 'default'};
		} else if (typeof opt === 'string') {
			opt = {theme: opt};
		} else if (opt.theme === undefined) {
			opt.theme = 'default';
		}
		if (themes[opt.theme] === undefined) {
			err('Unknown theme "' + theme + '"');
			return;
		}
		var options = $.extend(themes[opt.theme], opt);
		return this.each(function(){
			var elem = $(this);
			$.each(['br', 'bc', 'bs', 'bi', 'ts'], function() {
				var cls = 'jqbs-' + this + '-' + options[this];
				switch (cls) {
				case 'jqbs-br-half' :
					var br = (elem.outerHeight() / 2) + 'px';
					elem.css('border-radius', br);
					break;
				default :
					elem.addClass(cls);
				}
			});
		});
	}
})(jQuery);