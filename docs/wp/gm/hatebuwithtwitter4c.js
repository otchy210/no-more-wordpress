(function() {
	var d = document;
	function getElement(xpath) {
		var result = d.evaluate(xpath, d, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
		return result.singleNodeValue;
	}
	var s = getElement('//form[@id="bookmarklet-form" or @id="add-form"]//input[@type="submit"]');
	var f = getElement('//form[@id="bookmarklet-form" or @id="add-form"]');
	var b = s.cloneNode(false);
	var posted = false;
	b.value += "(withT)";
	
	b.addEventListener('click', function (e) {
		var comment = d.getElementById('comment').value;
		// remove tag
		// comment = comment.replace(/^([[^]]+])+/, '');
		var url = getElement('//input[@name="url"]').value;
		var title = getElement('//span[@class="title"]').innerHTML;
		var msg = '[B!]' + comment + ' ' + url + ' "' + title + '"';
		msg = msg.replace(new RegExp('&', 'g'), '&amp;');
		msg = msg.replace(new RegExp('"', 'g'), '&quot;');
		msg = msg.replace(new RegExp('<', 'g'), '&lt;');
		msg = msg.replace(new RegExp('>', 'g'), '&gt;');

		// For Google Chrome
		var i = d.createElement('iframe');
		i.style.display = 'none';
		d.body.appendChild(i);
		var i2 = d.createElement('iframe');
		i2.name = 'postresult';
		i2.style.display = 'none';
		d.body.appendChild(i2);
		i2.contentWindow.addEventListener('unload', function(e) {
			if (posted) {
				f.submit();
			}
		}, false);
		var iDoc = i.contentWindow.document;
		iDoc.open();
		iDoc.write('<form method="POST" action="https://twitter.com/statuses/update.xml" target="postresult">');
		iDoc.write('<input type="hidden" name="status" value="' + msg + '" />');
		iDoc.write('</form>');
		iDoc.write('<script>window.onload = function(){document.forms[0].submit();}</script>');
		iDoc.close();
		posted = true;

		e.preventDefault();
	}, false);
	var p = s.parentNode;
	var l = d.getElementById("redirect_entry_label");
	if (l) {
		p.insertBefore(b, l);
	} else {
		p.appendChild(b);
	}
})();