/*
 * Copyright (c) 2011 Otchy
 * This source file is subject to the MIT license.
 * http://www.otchy.net
 */
(function(func) {
	if (document.readyState == 'complete') {
		func();
		return;
	}
	var wait = document.createElement('div');
	wait.style.margin = 0;
	wait.style.padding = '5px';
	wait.style.borderStyle = 'solid';
	wait.style.borderColor = '#fff';
	wait.style.borderWidth = '0 3px 3px 0';
	wait.style.position = 'fixed';
	wait.style.left = '0';
	wait.style.top = '0';
	wait.style.backgroundColor = '#933';
	wait.style.color = '#fff';
	wait.style.fontWeight = 'bold';
	wait.style.zIndex = 99999;
	wait.style.fontSize = '10pt';
	wait.innerHTML = 'imageview: wait for HTML loading...';
	document.body.appendChild(wait);
	window.addEventListener('load', function() {
		document.body.removeChild(wait);
		func();
	}, false);
})(function() {
	var d = document;
	var h = d.getElementsByTagName('head')[0];
	var l = d.createElement("link");
	l.setAttribute('rel', 'stylesheet');
	l.setAttribute('href', 'http://s.otchy.net/js/fancybox/jquery.fancybox-1.3.4.css');
	h.appendChild(l);
	var s1 = d.createElement("script");
	s1.setAttribute("src", "http://ajax.googleapis.com/ajax/libs/jquery/1.6/jquery.min.js");
	s1.addEventListener('load', function() {
		var s2 = d.createElement("script");
		s2.setAttribute("src", "http://s.otchy.net/js/fancybox/jquery.fancybox-1.3.4.pack.js");
		s2.addEventListener('load', function() {
			var $ = jQuery.noConflict(true);
			var w = $(window);
			var b = $(document.body);
			var bg = $('<div>').css({'margin': '0', 'padding': '0', 'border': '0', 'width': '100%', 'height': '100%', 'position': 'fixed', 'left': '0', 'top': '0', 'background-color': '#fff', 'opacity': '0', 'z-index': '10000', 'cursor': 'pointer'});
			var msg = $('<div class="msg">').text('Loading').css({'margin': '0', 'padding': '10px', 'border': '0', 'color': '#000', 'text-align': 'left', 'font-size': '16pt', 'font-weight': 'bold'});
			var loading = $('<span>').text('.');
			msg.append(loading);
			bg.append(msg);
			b.append(bg);
			bg.animate({'opacity': '1'});
			setInterval(function() {
				var len = loading.text().length % 5;
				var text = '.';
				for (var i=0; i<len; i++) {
					text += '.';
				}
				loading.text(text);
			}, 150);
			var bHeight = b.height();
			var wHeight = w.height();
			var slowMsec = bHeight > 10000 ? bHeight / 4 : 2500;
			var init = false;
			var done = false;
			$('html,body').animate({'scrollTop': 0}, 0);
			$('html,body').animate({'scrollTop': bHeight - w.height()}, slowMsec, 'linear', function() {
				if (init) return; init = true;
				setTimeout(function() {
					var v = $('<div>').css({'margin': '0', 'padding': '0', 'border': '0', 'position': 'absolute', 'left': '0', 'top': '0', 'z-index': '10001'});
					v.hide();
					var count = 0;
					$('a[href] > img[src]').each(function() {
						var img = $(this);
						var src = img.attr('src');
						if (!src.match(/(jpg|gif|png)$/i)) return;
						if (img.width() < 20) return;
						if (img.height() < 20) return;
						var a = img.parent();
						var href = a.attr('href');
						if (!href.match(/(jpg|gif|png)$/i)) return;
						var panel = a.clone();
						panel.removeAttr('id').removeAttr('class').addClass('imageviewlinks').attr('rel', 'imageviewlinks').css({
							'display': 'block',
							'float': 'left',
							'margin': '10px 5px',
							'height': '160px',
							'overflow': 'hidden',
							'background-color': '#ffe',
							'box-shadow': '0 0 10px #000',
							'-moz-box-shadow': '0 0 10px #000'
						});
						var w = 200;
						var h = Math.ceil(img.height() * (w / img.width()));
						panel.find('img').removeAttr('id').removeAttr('class').removeAttr('border').removeAttr('hspace').removeAttr('vspace').css({
							'border': '0',
							'width': w+'px',
							'height': h+'px'
						});
						v.append(panel);
						count++;
					});
					b.append(v);
					var exit = function() {
						v.fadeOut('slow', function() {
							v.remove();
							bg.remove();
						});
					}
					bg.click(exit);
					$('a.imageviewlinks').fancybox({
					//	'autoScale': false
					});
					$('html,body').animate({scrollTop: 0}, 1000, 'swing', function() {
						if (done) return; done = true;
						v.fadeIn('slow');
						if (count == 0) {
							msg.text('No linked images.');
						} else {
							msg.hide();
							var e = $('<div>')
							.css({'margin': '10px', 'padding': '5px', 'border': '1px solid #999', 'background-color': '#666', 'color': '#fff', 'text-align': 'center', 'font-weight': 'bold', 'font-size': '12pt', 'cursor': 'pointer', 'clear': 'both'})
							.text('close imageview').click(exit);
							v.append(e);
						}
						bg.animate({'opacity': '0.7'});
					});
				}, 500);
			});
		}, false);
		h.appendChild(s2);
	}, false);
	h.appendChild(s1);
});