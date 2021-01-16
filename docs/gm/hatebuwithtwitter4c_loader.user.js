// ==UserScript==
// @name           Hatebu with Twitter For Chrome
// @namespace      http://www.otchy.net
// @include        http://b.hatena.ne.jp/bookmarklet*
// @include        http://b.hatena.ne.jp/add?*
// ==/UserScript==

(function() {
	var data = 'data:application/x-javascript;base64,'+
	    'KGZ1bmN0aW9uKCkgewoJdmFyIGQgPSBkb2N1bWVudDsKCWZ1bmN0aW9uIGdldEVsZW1lbnQoeHBh'+
	    'dGgpIHsKCQl2YXIgcmVzdWx0ID0gZC5ldmFsdWF0ZSh4cGF0aCwgZCwgbnVsbCwgWFBhdGhSZXN1'+
	    'bHQuRklSU1RfT1JERVJFRF9OT0RFX1RZUEUsIG51bGwpOwoJCXJldHVybiByZXN1bHQuc2luZ2xl'+
	    'Tm9kZVZhbHVlOwoJfQoJdmFyIHMgPSBnZXRFbGVtZW50KCcvL2Zvcm1bQGlkPSJib29rbWFya2xl'+
	    'dC1mb3JtIiBvciBAaWQ9ImFkZC1mb3JtIl0vL2lucHV0W0B0eXBlPSJzdWJtaXQiXScpOwoJdmFy'+
	    'IGYgPSBnZXRFbGVtZW50KCcvL2Zvcm1bQGlkPSJib29rbWFya2xldC1mb3JtIiBvciBAaWQ9ImFk'+
	    'ZC1mb3JtIl0nKTsKCXZhciBiID0gcy5jbG9uZU5vZGUoZmFsc2UpOwoJdmFyIHBvc3RlZCA9IGZh'+
	    'bHNlOwoJYi52YWx1ZSArPSAiKHdpdGhUKSI7CgkKCWIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2sn'+
	    'LCBmdW5jdGlvbiAoZSkgewoJCXZhciBjb21tZW50ID0gZC5nZXRFbGVtZW50QnlJZCgnY29tbWVu'+
	    'dCcpLnZhbHVlOwoJCS8vIHJlbW92ZSB0YWcKCQkvLyBjb21tZW50ID0gY29tbWVudC5yZXBsYWNl'+
	    'KC9eKFtbXl1dK10pKy8sICcnKTsKCQl2YXIgdXJsID0gZ2V0RWxlbWVudCgnLy9pbnB1dFtAbmFt'+
	    'ZT0idXJsIl0nKS52YWx1ZTsKCQl2YXIgdGl0bGUgPSBnZXRFbGVtZW50KCcvL3NwYW5bQGNsYXNz'+
	    'PSJ0aXRsZSJdJykuaW5uZXJIVE1MOwoJCXZhciBtc2cgPSAnW0IhXScgKyBjb21tZW50ICsgJyAn'+
	    'ICsgdXJsICsgJyAiJyArIHRpdGxlICsgJyInOwoJCW1zZyA9IG1zZy5yZXBsYWNlKG5ldyBSZWdF'+
	    'eHAoJyYnLCAnZycpLCAnJmFtcDsnKTsKCQltc2cgPSBtc2cucmVwbGFjZShuZXcgUmVnRXhwKCci'+
	    'JywgJ2cnKSwgJyZxdW90OycpOwoJCW1zZyA9IG1zZy5yZXBsYWNlKG5ldyBSZWdFeHAoJzwnLCAn'+
	    'ZycpLCAnJmx0OycpOwoJCW1zZyA9IG1zZy5yZXBsYWNlKG5ldyBSZWdFeHAoJz4nLCAnZycpLCAn'+
	    'Jmd0OycpOwoKCQkvLyBGb3IgR29vZ2xlIENocm9tZQoJCXZhciBpID0gZC5jcmVhdGVFbGVtZW50'+
	    'KCdpZnJhbWUnKTsKCQlpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7CgkJZC5ib2R5LmFwcGVuZENo'+
	    'aWxkKGkpOwoJCXZhciBpMiA9IGQuY3JlYXRlRWxlbWVudCgnaWZyYW1lJyk7CgkJaTIubmFtZSA9'+
	    'ICdwb3N0cmVzdWx0JzsKCQlpMi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnOwoJCWQuYm9keS5hcHBl'+
	    'bmRDaGlsZChpMik7CgkJaTIuY29udGVudFdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd1bmxvYWQn'+
	    'LCBmdW5jdGlvbihlKSB7CgkJCWlmIChwb3N0ZWQpIHsKCQkJCWYuc3VibWl0KCk7CgkJCX0KCQl9'+
	    'LCBmYWxzZSk7CgkJdmFyIGlEb2MgPSBpLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7CgkJaURvYy5v'+
	    'cGVuKCk7CgkJaURvYy53cml0ZSgnPGZvcm0gbWV0aG9kPSJQT1NUIiBhY3Rpb249Imh0dHBzOi8v'+
	    'dHdpdHRlci5jb20vc3RhdHVzZXMvdXBkYXRlLnhtbCIgdGFyZ2V0PSJwb3N0cmVzdWx0Ij4nKTsK'+
	    'CQlpRG9jLndyaXRlKCc8aW5wdXQgdHlwZT0iaGlkZGVuIiBuYW1lPSJzdGF0dXMiIHZhbHVlPSIn'+
	    'ICsgbXNnICsgJyIgLz4nKTsKCQlpRG9jLndyaXRlKCc8L2Zvcm0+Jyk7CgkJaURvYy53cml0ZSgn'+
	    'PHNjcmlwdD53aW5kb3cub25sb2FkID0gZnVuY3Rpb24oKXtkb2N1bWVudC5mb3Jtc1swXS5zdWJt'+
	    'aXQoKTt9PC9zY3JpcHQ+Jyk7CgkJaURvYy5jbG9zZSgpOwoJCXBvc3RlZCA9IHRydWU7CgoJCWUu'+
	    'cHJldmVudERlZmF1bHQoKTsKCX0sIGZhbHNlKTsKCXZhciBwID0gcy5wYXJlbnROb2RlOwoJdmFy'+
	    'IGwgPSBkLmdldEVsZW1lbnRCeUlkKCJyZWRpcmVjdF9lbnRyeV9sYWJlbCIpOwoJaWYgKGwpIHsK'+
	    'CQlwLmluc2VydEJlZm9yZShiLCBsKTsKCX0gZWxzZSB7CgkJcC5hcHBlbmRDaGlsZChiKTsKCX0K'+
	    'fSkoKTs=';
    	var d = document;
	var s = d.createElement('script');
	s.src = data;
	d.body.appendChild(s);
})();
