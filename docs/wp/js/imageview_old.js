(function() {
	var d = document;
	var h = d.getElementsByTagName('head')[0];
	var l = d.createElement("link");
	l.setAttribute('rel', 'stylesheet');
	l.setAttribute('href', 'https://www.otchy.net/wp/js/fancybox/jquery.fancybox-1.3.4.css');
	h.appendChild(l);
	var s1 = d.createElement("script");
	s1.setAttribute("src", "http://ajax.googleapis.com/ajax/libs/jquery/1.6/jquery.min.js");
	s1.addEventListener('load', function() {
		var s2 = d.createElement("script");
		s2.setAttribute("src", "https://www.otchy.net/wp/js/fancybox/jquery.fancybox-1.3.4.pack.js");
		s2.addEventListener('load', function() {
			var $ = jQuery.noConflict(true);
			$('a[href$=jpg] > img[src$=jpg]').each(function() {
				$(this).parent().addClass('images').attr('rel', 'images').css({'border': 'solid 1px #0ff'});
			});
			$('a.images').fancybox({
				'padding': 2,
				'margin': 2
			});
		}, false);
		h.appendChild(s2);
	}, false);
	h.appendChild(s1);
})();