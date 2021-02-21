// ==UserScript==
// @name          Hatebu Entry Page Chart
// @namespace     https://www.otchy.net/
// @version       1.0.0
// @include       http://b.hatena.ne.jp/entry*
// ==/UserScript==

(function (d, func) {
	var h = d.getElementsByTagName('head')[0];
	var s1 = d.createElement("script");
	s1.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js");
	s1.addEventListener('load', function() {
		var s2 = d.createElement("script");
		s2.textContent = "jQuery.noConflict();(" + func.toString() + ")(jQuery);";
		h.appendChild(s2);
	}, false);
	h.appendChild(s1);
})(document, function($) {
	var entry = function() {
		var holder = $('<div>').css({
			'float': 'right',
			'margin': '0',
			'padding': '1px',
			'border': '0',
			'background-color': '#ccc'
		});
		var chart = $('<iframe>').css({
			'width': '90px',
			'height': '80px',
			'border': '0',
			'opacity': '0'
		});
		holder.append(chart);
		$('.entrytitle').append(holder);
		chart.attr('src', $('#more-link a').attr('href'));
	}
	var more = function() {
		var w = window;
		if (!w.parent) return;
		var p = w.parent;
		if (w.location.href == p.location.href) return;
		var $w = $(w.document.body);
		$w.css({'overflow': 'hidden'});
		$w.find('#miniGraphCanvasContainer').css({
			'position': 'fixed',
			'top': '0',
			'left': '0',
			'z-index': '9999',
			'width': '90px',
			'background-color': '#fff'
		});
		$(p.document.body).find('.entrytitle iframe').animate({'opacity': '1'});
	}
	if (location.search.indexOf('mode=more') >= 0) {
		more();
	} else {
		entry();
	}
});