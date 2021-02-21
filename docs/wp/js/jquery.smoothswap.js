/*
 * jQuery smoothSwap plugin
 * Copyright (c) 2011 Otchy
 * This source file is subject to the MIT license.
 * https://www.otchy.net
 */
(function($){
	$.fn.smoothswap = function(userOptions) {
		var options = $.extend({'panel':'.smoothswap-panel','up':'.smoothswap-up','down':'.smoothswap-down','opacity':'0.6','duration':'normal'}, userOptions);
		return this.each(function(baseIndex){
			var base = $(this).css('position', 'relative');
			var swap = function(panelIndex, type) {
				var swaps;
				var targetPanelClass = 'smoothswap-panel-' + panelIndex;
				var panels = base.find(options.panel);
				panels.each(function(i){
					var panel = $(this);
					if (panel.hasClass(targetPanelClass)) {
						switch (type) {
						case 'up':
							if (i!=0) {
								swaps = [panels.get(i-1), this];
							}
							break;
						case 'down':
							if (i<panels.length-1) {
								swaps = [this, panels.get(i+1)];
							}
							break;
						}
						return false;
					}
				});
				if (!swaps) return;
				var first = $(swaps[0]);
				var second = $(swaps[1]);
				var firstHeight = first.outerHeight();
				var secondHeight = second.outerHeight();
				var marginHeight = options.marginHeight;
				if (!marginHeight) {
					var firstMarginHeight = first.outerHeight({margin:true});
					marginHeight = (firstMarginHeight - firstHeight) / 2;
				}
				var finishedCount = 0;
				var onswapped = function() {
					finishedCount++;
					if (finishedCount < 2) return;
					first.css({'opacity': '1', 'top': '0'});
					second.css({'opacity': '1', 'top': '0'});
					first.before(second);
					if (!!options.onswapped) {
						options.onswapped(base, first, second);
					}
				}
				first
					.css('opacity', options.opacity)
					.animate(
						{'top': (secondHeight + marginHeight) + 'px'},
						{'complete': onswapped, 'duration': options.duration}
					)
				;
				second
					.css('opacity', options.opacity)
					.animate(
						{'top': '-' + (firstHeight + marginHeight) + 'px'},
						{'complete': onswapped, 'duration': options.duration}
					)
				;
			}
			base.find(options.panel).each(function(panelIndex){
				var panel = $(this);
				panel.addClass('smoothswap-panel-' + panelIndex).css('position', 'relative');
				panel.find(options.up).each(function() {
					$(this).addClass('smoothswap-up-' + panelIndex);
				}).click(function() {
					swap(panelIndex, 'up');
					return false;
				});
				panel.find(options.down).each(function() {
					$(this).addClass('smoothswap-down-' + panelIndex);
				}).click(function() {
					swap(panelIndex, 'down');
					return false;
				});
			});
		});
	}
})(jQuery);
