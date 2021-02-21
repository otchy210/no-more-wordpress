/*
 * jQuery Button Style plugin
 * Copyright (c) 2013 Otchy
 * This source file is subject to the MIT license.
 * https://www.otchy.net
 */
(function($){
	var err = function(msg) {
		alert('jQuery Button Style: ' + msg);
	}
	$(document.head).append('<style>');
	var sheets = document.styleSheets;
	var sheet = sheets[sheets.length - 1];
	var addSt = function(cls, val) {
		if (typeof val === 'string') {
			sheet.insertRule('.' + cls + '{' + val + '}', sheet.cssRules.length);
		} else if (typeof val === 'object' && typeof val.join === 'function') {
			sheet.insertRule('.' + cls + '{' + val.join(';') + '}', sheet.cssRules.length);
		}
	}
	var themes = {
		normal: {
			styles: [
				'border-radius: 6px',
				'border: solid 1px rgba(0,0,0,0.2)',
				'box-shadow: 0 1px 0 rgba(255,255,255,0.8) inset',
				'background-image: -webkit-linear-gradient(top, rgba(255,255,255,0.5), rgba(0,0,0,0.2))',
				'text-shadow: 0 -1px 1px rgba(0,0,0,0.5)'
			]
		},
		metal: {
			styles: [
				'border: solid 2px rgba(0,0,0,0.4)',
				'border-radius: 4px',
				'box-shadow: 1px 1px 0 rgba(0,0,0,0.2) inset, -1px -1px 0 rgba(0,0,0,0.2) inset, 0 2px 0 rgba(255,255,255,0.8) inset, 0 -2px 0 rgba(255,255,255,0.3) inset',
				'background-image: -webkit-linear-gradient(top, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.3) 47%, rgba(0,0,0,0.1) 53%, rgba(0,0,0,0.4) 100%)',
				'text-shadow: 0 -1px 1px rgba(0,0,0,0.5), 0 1px 1px rgba(255,255,255,0.5)'
			]
		},
		candy: {
			styles: [
				'border: solid 1px rgba(0,0,0,0.3)',
				'box-shadow: 0 0 4px rgba(0,0,0,0.4)',
				'background-image: -webkit-linear-gradient(top, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.5) 10%, rgba(255,255,255,0.1) 40%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.2) 90%, rgba(0,0,0,0.4) 100%)',
				'text-shadow: 0 1px 1px rgba(255,255,255,0.5)'
			]
		},
		// candy http://medialoot.com/item/free-css3-button-styles-2/
		// block http://www.google.co.jp/imgres?um=1&hl=ja&safe=off&sa=N&tbo=d&biw=1258&bih=897&tbm=isch&tbnid=tUBERvVkpXOgEM:&imgrefurl=http://weboook.blog22.fc2.com/blog-entry-312.html&docid=SffEyPVtnXzkLM&imgurl=http://blog-imgs-11-origin.fc2.com/w/e/b/weboook/css3-pie-button.png&w=530&h=283&ei=rtHjUJvnEcjdkgWigYGwAQ&zoom=1&iact=rc&dur=512&sig=117312802495920981450&page=2&tbnh=150&tbnw=266&start=29&ndsp=35&ved=1t:429,r:31,s:0,i:183&tx=122&ty=65
		aqua: {
			styles: [
				'border: solid 1px rgba(0,0,0,0.4)',
				'box-shadow: 0 1px 0 rgba(255,255,255,0.8) inset, 0 -1px 4px rgba(0,0,0,0.4) inset, 0 2px 5px rgba(0,0,0,0.3)',
				'background-image: -webkit-linear-gradient(top, rgba(255,255,255,0.7), rgba(0,0,0,0.2), rgba(255,255,255,0.4))',
				'text-shadow: 0 -1px 1px rgba(0,0,0,0.5)'
			]
		}
	};
	$.fn.buttonstyle = function(theme) {
		if (theme === undefined) {
			theme = 'normal';
		}
		if (themes[theme] === undefined) {
			err('Unknown theme "' + theme + '"');
			return;
		}
		var cls = 'jqbs-' + theme;
		if (!themes[theme].added) {
			addSt(cls, themes[theme].styles)
			themes[theme].added = true;
		}
		return this.each(function(){
			var elem = $(this);
			elem.addClass(cls);
			switch (theme) {
			case 'aqua':
			case 'candy':
				var br = (elem.outerHeight() / 2) + 'px';
				elem.css('border-radius', br);
				break;
			}
		});
	}
})(jQuery);