// ==UserScript==
// @name           Gamemeter with Twitter
// @namespace      http://www.otchy.net
// @include        http://gamemeter.net/g/*
// ==/UserScript==

(function() {
	var d = document;
	var $ = function(id) { return d.getElementById(id); }
	var $x = function(xp) { return d.evaluate(xp, d, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue; }
	var $a = function(xp) { var r = d.evaluate(xp, d, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null); var a=[]; for(var i=0; i<r.snapshotLength; i++){ a.push(r.snapshotItem(i)); } return a; }
	var $e = function(e,t,f) { if (!e) return; e.addEventListener(t, f, false); }

	var postT = function(msgarea) {
		var msg = msgarea.value;
		if (!msg) return false;
		var title = $('title').innerHTML;
		var url = location.href;
		var status = '['+ encodeURIComponent(title) + ']' + encodeURIComponent(msg) + ' ' + url;
		GM_xmlhttpRequest({
			method : 'POST',
			url : 'http://twitter.com/statuses/update.json',
			data: 'status=' + status,
			headers: {
				'Content-Type':'application/x-www-form-urlencoded',
				'X-Twitter-Client': 'Gamemeter with Twitter',
				'X-Twitter-Client-Version': '1.0.1'
			}
		});
		return true;
	}

	// つぶやき
	var form = $x('//form[@action="/add"]');
	var msgarea = $('diary_title');
	var submit = $x('//form[@action="/add"]//input[@class="submit"]');

	submit.style.width = '40px';
	msgarea.style.width = '390px';

	var witht = submit.cloneNode(false);
	witht.value = 'withT';
	form.appendChild(witht);

	$e(witht, 'click', function() {
		postT(msgarea);
	});

	// クリアコメント
	var form = $x('//form[@action="/g"]');
	var comment = $x('//form[@action="/g"]//input[@name="comment"]');
	var submit = $x('//form[@action="/g"]//input[@class="submit"]');
	if (!form) return;

	comment.style.width = '280px';

	var witht = submit.cloneNode(false);
	witht.value = 'withT';
	form.appendChild(witht);

	$e(witht, 'click', function() {
		postT(comment);
	});

})();

