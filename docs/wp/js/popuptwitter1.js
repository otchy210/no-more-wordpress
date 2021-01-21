/*
javascript:(function(){var%20d=document;var%20s=d.createElement('script');s.src='http://www.otchy.net/js/popuptwitter.js';s.charset='UTF-8';
d.body.appendChild(s);})();
*/
(function() {
	var t = prompt('Twit now!', location.href);
	if (!t) return;
	var d = document;
	var f = d.getElementById('PopupTwiterForm');
	if (!f) {
		f = d.createElement('form');
		f.id = 'PopupTwiterForm';
		f.method = 'POST';
		f.action = 'http://twitter.com/statuses/update.xml';
		f.target = 'PopupTwiterFrame';
		f.style.display = 'none';
		var h = d.createElement('input');
		h.type = 'hidden';
		h.name = 'status';
		h.value = '';
		f.appendChild(h);
		var i = d.createElement('iframe');
		i.name = 'PopupTwiterFrame';
		f.appendChild(i);
		d.body.appendChild(f);
		i.contentWindow.name = i.name;
	}
	f.childNodes[0].value = t;
	f.submit();
})();
