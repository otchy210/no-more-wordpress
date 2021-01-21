// javascript:(function(){var%20d=document;var%20s=d.createElement('script');s.src='http://www.otchy.net/js/popuptwitter.js';s.charset='UTF-8';d.body.appendChild(s);})();
(function() {
	var t = prompt('Twit now!', location.href);
	if (!t) return;
	t = t.replace(new RegExp('&', 'g'), '&amp;');
	t = t.replace(new RegExp('"', 'g'), '&quot;');
	t = t.replace(new RegExp('<', 'g'), '&lt;');
	t = t.replace(new RegExp('>', 'g'), '&gt;');
	var d = document;
	var i = d.createElement('iframe');
	i.style.display = 'none';
	d.body.appendChild(i);
	var iDoc = i.contentWindow.document;
	iDoc.open();
	iDoc.write('<form method="POST" action="http://twitter.com/statuses/update.xml">');
	iDoc.write('<input type="hidden" name="status" value="' + t + '" />');
	iDoc.write('</form>');
	iDoc.write('<script>window.onload = function(){document.forms[0].submit();}</script>');
	iDoc.close();
	setTimeout(function() {
		d.body.removeChild(i);
	}, 5000);
})();
