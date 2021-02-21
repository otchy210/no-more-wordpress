// ==UserScript==
// @name          Hatebu Entry Page Downgrader
// @namespace     https://www.otchy.net/
// @version       1.0.0
// @include       http://b.hatena.ne.jp/entry*
// ==/UserScript==

(function (d, func) {
	var h = d.getElementsByTagName('head')[0];
	var s1 = d.createElement("script");
	s1.setAttribute("src", "http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js");
	s1.addEventListener('load', function() {
		var s2 = d.createElement("script");
		s2.textContent = "jQuery.noConflict();(" + func.toString() + ")(jQuery);";
		h.appendChild(s2);
	}, false);
	h.appendChild(s1);
})(document, function($) {
	var isMore = (location.href.indexOf('mode=more') >= 0);
	if (!isMore) {
		// iframe 追加
		var newBookmarks = $('#new-bookmarks');
		var iframe = $('<iframe id="hepd-iframe" name="hepd-iframe" />')
			.css({'overflow': 'hidden', 'border': '0'})
			.width(newBookmarks.width())
			.height(0)
		;
		newBookmarks.before(iframe);
		var href = $('#more-link a').attr('href');
		iframe.attr('src', href);
		newBookmarks.find('h4.entry-page-main-subtitle .inner').append($('<span>[全てのコメントを読み込んでいます...]</span>'));
		
		// アイコン 16x16
		$('ul.bookmark-list li').css({'padding': '5px 0px 5px 30px'}).find('img.profile-image').css({'width': '16px', 'height': '16px', 'margin-left': '-20px'});

		// 人気ブコメの開閉
		var scored = $('#scored-bookmarks');
		var sToggle = $('<span />').css({'cursor': 'pointer'}).toggle(function() {
			scored.find('.bookmark-list').hide();
			$(this).text('[開く]');
		}, function() {
			scored.find('.bookmark-list').show();
			$(this).text('[閉じる]');
		}).text('[閉じる]');
		scored.find('h4.entry-page-main-subtitle .inner').append(sToggle);
		sToggle.click();	// デフォルトで開いておく場合はコメントアウトする
	} else {
		if (window.name != 'hepd-iframe') return;

		// リンク先調整
		$('a[href]:not([target])').each(function() {
			this.target = '_top';
		});

		// グラフの移動
		var chart = $('#miniGraphCanvasContainer').css({'float': 'right', 'padding': '0 5px 0 10px', 'background-color': '#fff', 'z-index': '999'}).remove();
		var newBookmarks = $('#new-bookmarks');
		newBookmarks.find('h4.entry-page-main-subtitle').after(chart);

		// 不要エレメント削除
		var newBookmarks = $('#new-bookmarks');
		newBookmarks.css({'margin-bottom': '0'})
			.find('h4.entry-page-main-subtitle').css({'margin-top': '0'});
		(function(current) {
			var parent = current.parent();
			parent.empty();
			parent.append(current);
			if (parent.attr('id') == 'container') {
				parent.css({'margin': '0'});
			} else if (parent.hasClass('curvebox-body')) {
				parent.css({'padding-top': '0', 'padding-right': '0', 'padding-left': '0', 'border': '0'});
			} else if (parent.get(0) == document.body) {
				parent.css({'padding-top': '0'});
				return;
			}
			arguments.callee(parent);
		})(newBookmarks);

		// iframe 高さ調整・icon 16x16 化
		var pBody = $(parent.document.body);
		var iframe = pBody.find('#hepd-iframe');
		var nocomments = newBookmarks.find('li.nocomment');
		var heightChanged = false;
		var toggleChecked = false;
		var bookmarksHeight = 0;
		var B = Hatena.Bookmark;
		B.Entry.ToggleComment.prototype._toggle = B.Entry.ToggleComment.prototype.toggle;
		B.Entry.ToggleComment.prototype.toggle = function() {
			this._toggle();	// デフォルト動作
			Ten.DOM.removeClassName(this.container, 'nocomment-hide'); // アイコン 16x16 のため。img の !important が邪魔をして直接スタイルを書き換えられないのでこうしている。
			if (toggleChecked) {
				nocomments.hide();
			} else {
				nocomments.show();
			}
			if (heightChanged) {
				bookmarksHeight = newBookmarks.height();	// height の計算コストが高いので毎回実行しない。
				heightChanged = false;
			}
			iframe.height(bookmarksHeight);	// iframe 高さ合わせ
		};
		$('#bookmark-comment-toggle-check').change(function() {
			heightChanged = true;
			toggleChecked = this.checked;
		}).change();
		newBookmarks.find('a.expand-retweet-tree-trigger').click(function() {
			setTimeout(function() {
				heightChanged = true;
			}, 1500);
		});

		// 親の新着ブクマ削除
		pBody.find('#new-bookmarks').remove();
	}
});
