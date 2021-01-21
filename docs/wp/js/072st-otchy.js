$(function() {
	$('#gallery').find('.panel img').wrap('<a class="gallery-image" />')
	.end().find('.gallery-image').each(function() {
		var a = $(this);
		var img = a.find('img');
		a.attr('href', img.attr('src')).fancybox();
	});
});