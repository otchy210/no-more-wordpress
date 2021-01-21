// ==UserScript==
// @name           WordPress with Twitter
// @namespace      http://www.otchy.net/
// @include        http://*/wp-admin/post-new.php*
// @include        http://*/wp-admin/post.php*
// @include        http://*/wp-admin/page-new.php*
// @include        http://*/wp-admin/page.php*
// ==/UserScript==

(function() {
	var d = document;
	var $ = function(id) { return d.getElementById(id); }
	var $x = function(xp) { return d.evaluate(xp, d, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue; }
	var $a = function(xp) { var r = d.evaluate(xp, d, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null); var a=[]; for(var i=0; i<r.snapshotLength; i++){ a.push(r.snapshotItem(i)); } return a; }
	var $e = function(e,t,f) { if (!e) return; e.addEventListener(t, f, false); }

	var chandePostDate = false;
	var postDateIds = ['aa', 'mm', 'jj'];
	for (var i=0; i<postDateIds.length; i++) {
		var e = $(postDateIds[i]);
		if (!e) continue;
		$e(e, 'change', function() {
			chandePostDate = true;
		});
	}
	var isDraft = $('original_post_status') && $('original_post_status').value == 'draft';
	var isPast = isDraft && (function(){
		var aa = $('aa');
		var mm = $('mm');
		var jj = $('jj');
		if (!aa || !mm || !jj) return false;
		var postDate =  '' + aa.value + mm.value + jj.value;
		var date = new Date();
		var y = date.getYear() + 1900;
		var m = date.getMonth() + 1;
		var d = date.getDate();
		var today = '' + y + (m<10?'0':'') + m + (d<10?'0':'') + d;
		return today != postDate;
	})();

	var f = $('post');
	$e(f, 'submit', function (e) {
		if (!this.elements['with_t'] || !this.elements['with_t'].checked) return true;

		var permalink = $('sample-permalink');
		var url = '';
		if (chandePostDate || isPast) {
			alert('公開日時を変更した場合や、過去に作成した投稿を公開する場合、\n未保存時に withT オプションは利用できません。\nいったん更新して URL を確定した後に withT オプションを利用して下さい。');
			return false;
		}
		if (permalink) {
			url = permalink.childNodes[0].textContent + $('editable-post-name-full').textContent;
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
				'X-Twitter-Client-Version': '1.0.3'
			}
		});
	});

	var div = d.createElement('div');
	div.style.cssFloat = 'right';
	div.style.padding = '2px';
	div.innerHTML = '<input type="checkbox" name="with_t" id="with_t" style="min-width: 12px;"><label for="with_t">withT</label>';
	var p = $('major-publishing-actions');
	var b = $('publishing-action');
	if (p) p.insertBefore(div, b);
})();
