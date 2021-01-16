/*
 * jQuery Submittable plugin Ver.1.0.0
 * Copyright (c) 2012 Otchy
 * This source file is subject to the MIT license.
 * http://www.otchy.net
 */
(function($){
	$.fn.submittable = function(options){
		var defaults = {
			on: 'click',
			autoDisabled: false,
			disabledClass: 'disabled'
		}
		var opt = $.extend(defaults, options);
		return this.each(function(i){
			var e = $(this);
			var f = !!opt.form ? $(opt.form) : e.closest('form');
			e.on(opt.on, function() {
				if (e.hasClass(opt.disabledClass)) {
					return false;
				}
				if (!!opt.confirm) {
					if (!confirm(opt.confirm)) {
						return false;
					}
				}
				if (!!opt.onconfirm) {
					if (!opt.onconfirm(this)) {
						return false;
					}
				}
				var bak = {
					action: f.attr('action'),
					method: f.attr('method'),
					target: f.attr('target')
				}
				if (!!opt.action) {
					f.attr('action', opt.action);
				}
				if (!!opt.method) {
					f.attr('method', opt.method);
				}
				if (!!opt.target) {
					f.attr('target', opt.target);
				}
				if (!!opt.onbeforesubmit) {
					opt.onbeforesubmit(this);
				}
				f.get(0).submit();
				if (!!bak.action) {
					f.attr('action', bak.action)
				} else {
					f.removeAttr('action');
				}
				if (!!bak.method) {
					f.attr('method', bak.method)
				} else {
					f.removeAttr('method');
				}
				if (bak.target) {
					f.attr('target', bak.target)
				} else {
					f.removeAttr('target');
				}
				if (opt.autoDisabled) {
					e.addClass(opt.disabledClass);
					e.prop('disabled', true);
				}
				return false;
			});
		});
	};
})(jQuery);