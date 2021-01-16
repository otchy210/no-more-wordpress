// ==UserScript==
// @name           FB Filter
// @namespace      http://www.otchy.net/
// @include        https://www.facebook.com/*
// @version        0.0.1
// ==/UserScript==

(function (d, func) {
	var h = d.getElementsByTagName('head')[0];
	var s1 = d.createElement("script");
	s1.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js");
	s1.addEventListener('load', function() {
		var s2 = d.createElement("script");
		s2.textContent = "jQuery.noConflict();(" + func.toString() + ")(jQuery);";
		h.appendChild(s2);
	}, false);
	h.appendChild(s1);
})(document, function($) {
	// CSS
	$('head').append($('<style>').text(
		'#fbFilterSettingPanel {position: absolute; top: 0; left: 0; display: none;}\n' +
		'.sidebarMode #fbFilterSettingPanel {left: -90px;}\n' +
		'#fbFilterSettingPanelInner {position: fixed; background-color: #fff; border: solid #ddd; border-width: 0 1px 1px 1px; margin-left: 180px; padding: 20px; width: 759px; box-shadow: 0 2px 5px rgba(0,0,128,0.2); max-height: 80%; overflow: auto; z-index: 9;}\n' +
		'#fbFilterSettingPanelInner h2 {margin-top: 3px;float: left;}\n' +
		'#fbFilterTopButton {float: right;}\n' +
		'.fbFilterViewButton {border: solid 1px #ddd; padding: 4px; background-color: #fff; line-height: 22px; color: #aaa; font-size: 10px; font-weight: bold; text-decoration: none; box-shadow: 0 1px 1px #eee;}\n' +
		'.fbFilterViewButtonHover {border-color: #a4b6cc; color: #a4b6cc; text-decoration: none !important;}\n' +
		'.fbFilterPanelHide {overflow: hidden; height: 20px;}\n' +
		'.fbFilterList {width: 100%; border-collapse:collapse; clear: both;}\n' +
		'.fbFilterList thead tr th {padding: 0 3px; background-color:#6d84b4; color: #fff; border: solid rgba(0, 39, 121, .76); border-width: 1px 1px 0 1px; line-height: 24px;}\n' +
		'.fbFilterList tbody tr td {padding: 3px; border: solid rgba(0, 0, 0, .3); border-width: 1px 0;}\n' +
		'.fbFilterList tbody tr td label {color: #333; font-weight: normal;}\n' +
		'.fbFilterList tbody tr:nth-child(2n) td {background-color: #eceff5;}\n' +
		'.fbFilterList tbody tr:last-child td {border-bottom: none;}\n' +
		'.fbFilterList tfoot tr td {border-top: 1px solid rgba(0, 0, 0, .3); line-height: 24px;}\n' +
		'.fbFilterList .word {width: 400px; padding: 0 3px; border: 1px solid #bdc7d8; font-size: 11px; margin:0; padding:3px;}\n' +
		''
	));
	
	// HTML
	var settingPanel = $('<div id="fbFilterSettingPanel" class="uiHeader">');
	var settingPanelInner = $('<div id="fbFilterSettingPanelInner" class="uiHeaderPage">').append(
		$('<h2 class="uiHeaderTitle">').text('Filter Setting')
	);
	settingPanelInner.append(
		$('<div id="fbFilterTopButton">').append(
			$('<label class="uiButton">').append(
				$('<input type="button" id="fbFilterExport" value="Export">')
			)
		).append(
			$('<label class="uiButton">').append(
				$('<input type="button" id="fbFilterImport" value="Import">')
			)
		)
	);
	var blockingTable = $('<table class="fbFilterList">').append(
		$('<thead>').append(
			$('<tr>').append(
				$('<th colspan="4">').text('Blocking word list')
			)
		)
	).append(
		$('<tbody>')
	).append(
		$('<tfoot>').append(
			$('<tr>').append(
				$('<td colspan="4">').append(
					$('<a>').text('add blocking word')
				)
			)
		)
	).data('type', 'blocking');

	settingPanelInner.append(blockingTable);
	settingPanelInner.append(
		$('<div id="fbFilterBottomButton">').append(
			$('<label class="uiButton uiButtonConfirm">').append(
				$('<input type="button" id="fbFilterSave" value="Save">')
			)
		).append(
			$('<label class="uiButton">').append(
				$('<input type="button" id="fbFilterCancel" value="Cancel">')
			)
		)
	);
	settingPanel.append(settingPanelInner);
	$('#mainContainer').append(settingPanel);

	var navAccount = $('#navAccount');
	var nav = navAccount.find('.navigation');
	nav.append($('<li class="menuDivider">'));
	var setting = $('<a class="navSubmenu">').text('Filter Setting');
	nav.append($('<li>').append(setting));
	
	// savedFilters
	var savedFilters = {};
	function loadSavedFilters() {
		$.each(['blocking'], function(i) {
			var type = this;
			var filters = localStorage.getItem('net.otchy.fb-filter.' + type);
			filters = !!filters ? filters : '[]';
			savedFilters[type] = JSON.parse(filters);
		});
	}
	loadSavedFilters();

	// Inner jQuery Plugin
	$.fn.hidable = function() {
		return this.each(function() {
			// initialize
			var panel = $(this);
			if (panel.data('hidable')) return;
			var wrap = panel.find('.highlightSelector .wrap');
			var button = $('<a class="fbFilterViewButton">hide</a>').on('click', function() {
				if (button.data('hide')) {
					panel.removeClass('fbFilterPanelHide');
					button.text('hide');
					button.data('hide', false);
				} else {
					panel.addClass('fbFilterPanelHide');
					button.text('show');
					button.data('hide', true);
				}
			}).on('mouseover', function() {
				button.addClass('fbFilterViewButtonHover');
			}).on('mouseout', function() {
				button.removeClass('fbFilterViewButtonHover');
			}).hide();
			wrap.append(button);
			panel.on('mouseover', function() {
				button.show();
			}).on('mouseout', function() {
				button.hide();
			});
			
			// apply filters
			var messageBody = panel.find('.messageBody').text();
			var commentList = panel.find('.commentList .commentBody').text();
			var attachment = panel.find('.fbMainStreamAttachment').text();
			$.each(savedFilters['blocking'], function() {
				var filter = this;
				var w = filter.w;
				if (
					(messageBody.indexOf(w) >= 0) ||
					(filter.c && commentList.indexOf(w) >= 0) ||
					(filter.a && attachment.indexOf(w) >= 0)
				) {
					button.click();
					return;
				}
			})
			
			panel.data('hidable', true);
		});
	};
	$.fn.addFilter = function(word, comment, attachment) {
		return this.each(function() {
			var table = $(this);
			var tr = $('<tr>').append(
				$('<td>').append(
					$('<input class="word">')
				)
			).append(
				$('<td>').append(
					$('<label>').text('filter with comments').prepend(
						$('<input type="checkbox" class="comment">')
					)
				)
			).append(
				$('<td>').append(
					$('<label>').text('filter with attachments').prepend(
						$('<input type="checkbox" class="attachment">')
					)
				)
			).append(
				$('<td>').append(
					$('<label class="uiCloseButton">').prepend( // uiCloseButtonSmall
						$('<input type="button" value="delete" class="delete">')
					)
				)
			);
			if (!!word && word.length > 0) {
				tr.find('.word').val(word);
			}
			if (!!comment) {
				tr.find('.comment').prop('checked', true);
			}
			if (!!attachment) {
				tr.find('.attachment').prop('checked', true);
			}
			table.find('tbody').append(tr);
		});
	}
	$.fn.setFilters = function(filters) {
		var table = $(this);
		var tbody = table.find('tbody').empty();
		if (!filters) return;
		console.log(filters);
		for (var i=0; i<filters.length; i++) {
			var filter = filters[i];
			table.addFilter(filter.w, filter.c, filter.a);
		}
		return this;
	}
	$.fn.exportFilters = function() {
		var list = {};
		this.each(function() {
			var table = $(this);
			var filters = [];
			table.find('tbody tr').each(function() {
				var tr = $(this);
				var word = tr.find('.word').val().trim();
				if (word.length == 0) return;
				filters.push({
					'w': word,
					'c': tr.find('.comment').prop('checked'),
					'a': tr.find('.attachment').prop('checked')
				});
			});
			list[table.data('type')] = filters;
		});
		return list;
	};
	$.fn.importFilters = function(list) {
		return this.each(function() {
			var table = $(this);
			var filters = list[table.data('type')];
			table.setFilters(filters);
		});
	};
	$.fn.loadFilters = function() {
		return this.each(function() {
			var table = $(this);
			var filters = localStorage.getItem('net.otchy.fb-filter.' + table.data('type'));
			filters = !!filters ? filters : '[]';
			table.setFilters(JSON.parse(filters));
		});
	};
	$.fn.saveFilters = function() {
		var filters = this.exportFilters();
		for (var type in filters) {
			localStorage.setItem('net.otchy.fb-filter.' + type, JSON.stringify(filters[type]));
		}
		loadSavedFilters();
		return this;
	};
	
	// Initialize
	$('.uiStreamStory').hidable();
	setInterval(function() {
		$('.uiStreamStory').hidable();
	}, 1000);

	var filterList = $('.fbFilterList');
	filterList.find('tfoot a').on('click', function() {
		$(this).parents('table.fbFilterList').addFilter();
	}).end().on('click', '.delete', function() {
		$(this).parents('tr').remove();
	});

	setting.on('click', function() {
		navAccount.removeClass('openToggler').find('.hideToggler').remove();
		filterList.loadFilters();
		settingPanel.show();
	});
	
	$('#fbFilterExport').on('click', function() {
		var list = filterList.exportFilters();
		var json = JSON.stringify(list);
		prompt('exported json string', json);
		// TODO data-schema download;
	});
	$('#fbFilterImport').on('click', function() {
		var json = prompt('import json string');
		if (!json) return;
		try {
			list = JSON.parse(json);
			filterList.importFilters(list);
		} catch (e) {
			alert('unknown format');
		}
		// TODO d&d file upload;
	});
	$('#fbFilterSave').on('click', function() {
		filterList.saveFilters();
		settingPanel.hide();
	});
	$('#fbFilterCancel').on('click', function() {
		settingPanel.hide();
	});
});