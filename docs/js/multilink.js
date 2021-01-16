/*
 * Copyright (c) 2011 Otchy
 * This source file is subject to the MIT license.
 * http://www.otchy.net
 * multilink.js Ver 1.0.3
 */
(function(){
	var styleText = ''+
	'div.multi-link-div {'+
		'position: absolute;'+
		'left: 0;'+
		'top: 0;'+
		'background: #fff;'+
		'padding: 5px 10px;'+
		'border: solid 1px #999;'+
		'border-radius: 5px;'+
		'-webkit-border-radius: 5px;'+
		'-moz-border-radius: 5px;'+
		'-o-border-radius: 5px;'+
		'box-shadow: 0 0 5px rgba(0,0,0,0.5);'+
		'-webkit-box-shadow: 0 0 5px rgba(0,0,0,0.5);'+
		'-moz-box-shadow: 0 0 5px rgba(0,0,0,0.5);'+
		'-o-box-shadow: 0 0 5px rgba(0,0,0,0.5);'+
	'}'+
	'div.multi-link-div a {'+
		'display: block;'+
		'line-height: 1.5em;'+
	'}';
	var w = window;
	var d = document;
	var bind = function(e, t, f) {
		if (e.attachEvent) {
			e.attachEvent('on' + t, f);
		} else if(e.addEventListener) {
			e.addEventListener(t, f, false);
		}
	}
	var has = function(elem, className) {
		if (!elem.className) return false;
		var classNames = elem.className.split(/[ \t\n]+/);
		for (var i=0; i<classNames.length; i++) {
			var cn = classNames[i];
			if (cn == className) return true;
		}
		return false;
	}
	var get_ = function(elem, className, arr) {
		if (has(elem, className)) {
			arr.push(elem);
			return arr;
		}
		var children = elem.childNodes;
		for (var i=0; i<children.length; i++) {
			var child = children[i];
			arr = get_(child, className, arr);
		}
		return arr;
	}
	var get = function(className) {
		if (d.getElementsByClassName) {
			return d.getElementsByClassName(className);
		}
		var arr = new Array();
		return get_(d.body, className, arr);
	}
	var clearTimer = function(div) {
		if (div.tid) {
			clearTimeout(div.tid);
		}
	}
	var setTimer = function(div) {
		clearTimer(div);
		div.tid = setTimeout(function() {
			div.style.display = 'none';
		}, 300);
	}
	var divover = function() {
		clearTimer(this);
	}
	var divout = function() {
		setTimer(this);
	}
	var linkover = function() {
		clearTimer(this.parentNode);
	}
	var linkout = function() {
		setTimer(this.parentNode);
	}
	var over = function(event) {
		if (!this.div) {
			this.div = d.createElement('div');
			this.div.className = 'multi-link-div';
			for (var i=0; i<this.links.length; i++) {
				this.div.appendChild(this.links[i]);
			}
			d.body.appendChild(this.div);
			this.div.onmouseover = divover;
			this.div.onmouseout = divout;
		}
		var e = event ? event : w.event;
		var x, y;
	        if (/*@cc_on!@*/false) {
			if (!document.documentMode || document.documentMode < 8) { // for IE7-
		        	if (d.compatMode == 'CSS1Compat') {
			        	x = e.x + d.documentElement.scrollLeft;
			        	y = e.y + d.documentElement.scrollTop;
		        	} else {
			        	x = e.x + d.body.scrollLeft;
			        	y = e.y + d.body.scrollTop;
		        	}
			} else {	// for IE8+
				x = e.x;
				y = e.y;
			}
	        } else {
			x = e.pageX;
			y = e.pageY;
	        }
		this.div.style.left = (x + 16) + 'px';
		this.div.style.top = y + 'px';
		this.div.style.display = 'block';
		clearTimer(this.div);
	}
	var out = function() {
		setTimer(this.div);
	}
	var init = function(elem) {
		var links = new Array();
		var children = elem.childNodes;
		for (var i=0; i<children.length; i++) {
			var child = children[i];
			if (child.tagName && child.tagName.toUpperCase() == 'A' && child.href) {
				links.push(child.cloneNode(true));
				child.onmouseover = linkover;
				child.onmouseout = linkout;
			}
		}
		if (links.length == 0) return;
		elem.innerHTML = '';
		var a = d.createElement('a');
		a.innerHTML = elem.title;
		a.href = 'javascript:void(0);'
		a.links = links;
		a.onmouseover = over;
		a.onmouseout = out;
		elem.appendChild(a);
	}
        bind(w,'load', function(){
	        var style = d.createElement('style');
	        style.type = 'text/css';
	        if (/*@cc_on!@*/false) {
		        style.styleSheet.cssText = styleText;
	        } else {
			style.appendChild(d.createTextNode(styleText));
	        }
	        d.getElementsByTagName('head')[0].appendChild(style);
		var elements = get('multi-link');
		for (var i=0; i<elements.length; i++) {
			var elem = elements[i];
			init(elem);
		}
	});
})();