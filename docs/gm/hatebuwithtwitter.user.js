// ==UserScript==
// @name           Hatebu with Twitter
// @namespace      http://www.otchy.com
// @include        http://b.hatena.ne.jp/bookmarklet*
// @include        http://b.hatena.ne.jp/add?*
// ==/UserScript==

(function() {
	var d = document;
	function getElement(xpath) {
		var result = d.evaluate(xpath, d, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
		return result.singleNodeValue;
	}
	var s = getElement('//form[@id="bookmarklet-form" or @id="add-form"]//input[@type="submit"]');
	var b = s.cloneNode(false);
	b.value += "(withT)";
	b.addEventListener('click', function (e) {
		var comment = d.getElementById('comment').value;
		// remove tag
		// comment = comment.replace(/^([[^]]+])+/, '');
		var url = getElement('//input[@name="url"]').value;
		var title = getElement('//span[@class="title"]').innerHTML;
		var msg = '[B!]' + comment + ' ' + url + ' "' + title + '"';
		var status = encodeURIComponent(msg);
		var url = 'http://twitter.com/statuses/update.json';
		GM_xmlhttpRequest({
			method : 'POST',
			url : url,
			data: 'status=' + status,
			headers: {
				'Content-Type':'application/x-www-form-urlencoded',
				'X-Twitter-Client': 'Hatebu with Twitter',
				'X-Twitter-Client-Version': '1.0.2'
			}
		});
	}, false);
	var p = s.parentNode;
	var l = d.getElementById("redirect_entry_label");
	if (l) {
		p.insertBefore(b, l);
	} else {
		p.appendChild(b);
	}
})();