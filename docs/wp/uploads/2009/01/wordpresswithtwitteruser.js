// ==UserScript==
// @name           WordPress with Twitter
// @namespace      https://www.otchy.net/
// @include        http://*/wp-admin/post-new.php*
// @include        http://*/wp-admin/post.php*
// @include        http://*/wp-admin/page-new.php*
// @include        http://*/wp-admin/page.php*
// ==/UserScript==

(function() {
	var $ = function(id) {return document.getElementById(id);}
	var $x = function(xpath) {
		var result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
		return result.singleNodeValue;
	}

	var f = $('post');
	f.addEventListener('submit', function (e) {
		if (!this.elements['with_t'] || !this.elements['with_t'].checked) return true;

		var permalink = $('sample-permalink');
		var url = '';
		if (permalink) {
			url = permalink.childNodes[0].textContent + $('editable-post-name').textContent;
		} else {
			url = location.href;
			var index = url.indexOf('/wp-admin/');
			url = url.substr(0, index) + '/?p=';
			var postId = parseInt($('post_ID').value);
			if (postId <= 0) {
				alert('パーマリンクが設定されていない場合、未保存時に withT オプションは利用できません。\nいったん下書きとして保存した後に withT オプションを利用して下さい。');
				return false;
			}
			url += postId;
		}

		var title = $('title').value;
		var site = $x('//div[@id="wphead"]/h1/a').childNodes[0].textContent.replace(/[ \t\r\n]+$/g, "");
		var msg = '[' + site + ']' + title + ' - ' + url;
		var status = encodeURIComponent(msg);
		var url = 'http://twitter.com/statuses/update.json';
		GM_xmlhttpRequest({
			method : 'POST',
			url : url,
			data: 'status=' + status,
			headers: {
				'Content-Type':'application/x-www-form-urlencoded',
				'X-Twitter-Client': 'WordPress with Twitter',
				'X-Twitter-Client-Version': '1.0.2'
			}
		});
	}, false);

	var d = document.createElement('div');
	d.style.cssFloat = 'right';
	d.style.padding = '2px';
	d.innerHTML = '<input type="checkbox" name="with_t" id="with_t" style="min-width: 12px;"><label for="with_t">withT</label>';
	var p = $('major-publishing-actions');
	var b = $('publishing-action');
	p.insertBefore(d, b);
})();
