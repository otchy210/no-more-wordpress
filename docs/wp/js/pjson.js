var PJSON = {};
PJSON.escape = function(str) {
	var arr = [];
	if (!str) return arr;
	var codes = encodeURIComponent(str);
	for (var i=0; i<codes.length; i++) {
		var c = codes[i];
		if (c == '%') {
			arr.push(parseInt(codes[++i] + codes[++i], 16));
		} else {
			arr.push(codes[i].charCodeAt(0));
		}
	}
	return arr;
}
PJSON.unescape = function(arr) {
	var str = '';
	if (!arr || arr.length == 0) return str;
	for (var i=0; i<arr.length; i++) {
		str += '%' + (new Number(arr[i])).toString(16);
	}
	return decodeURIComponent(str);
}
PJSON.size = function(num) {
	var arr = [];
	if (!num || num < 0) return arr;
	while (num > 0) {
		arr.push(num & 0xff);
		num >>= 8;
	}
	return arr;
}
PJSON.unsize = function(arr) {
	var num = 0;
	for (var i=0; i<arr.length; i++) {
		num |= arr[i] << (i * 8);
	}
	return num;
}
PJSON.arr = function(data) {
	var arr = [];
	for (var i=0; i<data.length; i++) {
		if (i%4 == 3) continue;
		arr.push(data[i]);
	}
	return arr;
}
PJSON.parse = function(data) {
	if (!data || data.length < 8) return;
	var arr = PJSON.arr(data);
	if (arr[0] != 0x50 || arr[1] != 0x4a || arr[2] != 0x01) return;
	var head = arr.slice(0, arr[3]);
	var size = head.slice(4);
	size = PJSON.unsize(size);
	data = arr.slice(arr[3], arr[3] + size);
	var json = PJSON.unescape(data);
	var obj = JSON.parse(json);
	return obj;

}
PJSON.push = function(obj) {
	var json = JSON.stringify(obj);
	var data = PJSON.escape(json);
	var head = [0x50, 0x4a, 0x01];
	var size = PJSON.size(data.length);
	head.push(head.length + 1 + size.length);
	head = head.concat(size);
	data = head.concat(data);
	
	var len = data.length;
	var rem = len % 3;
	var px = (len - rem) / 3 + (rem > 0 ? 1 : 0);
	rem = px % 128;
	var w = 128;
	rem = px % w;
	var h = (px - rem) / w + (rem > 0 ? 1 : 0);
	
	var canvas = document.createElement('canvas');
	canvas.width = w;
	canvas.height = h;
	var context = canvas.getContext('2d');
	var img = context.getImageData(0, 0, w, h);
	for (var i=0; i<data.length/3; i++) {
		img.data[i*4] = data[i*3];
		img.data[i*4+1] = data[i*3+1];
		img.data[i*4+2] = data[i*3+2];
		img.data[i*4+3] = 0xff;
	}
	context.putImageData(img, 0, 0);
	var url = canvas.toDataURL('image/png').replace('image/png', 'application/octet-stream');
	location.href = url;
}
PJSON.addClass = function(el, clazz) {
	var className = el.className ? el.className : '';
	className += ' ' + clazz;
	el.className = className;
}
PJSON.removeClass = function(el, clazz) {
	var classes = el.className ? el.className.split(/[\s]/) : [];
	var className = '';
	for (var i=0; i<classes.length; i++) {
		if (classes[i] != clazz) {
			if (className.length > 0) {
				className += '0';
			}
		}
	}
	el.className = className;
}
PJSON.droppable = function(el, load) {
	el.addEventListener('dragover', function(event) {
		event.preventDefault();
	}, false);
	/*
	el.addEventListener('dragenter', function(event) {
		PJSON.addClass(el, 'pjson-hover');
	}, false);
	el.addEventListener('dragleave', function(event) {
		PJSON.removeClass(el, 'pjson-hover');
	}, false);
	*/
	el.addEventListener('drop', function(event) {
		event.preventDefault();
		var file = event.dataTransfer.files[0];
		
		var reader = new FileReader(); 
		reader.onload = function() {
			var img = document.createElement('img');
			img.onload = function() {
				var w = img.width;
				var h = img.height;
				var canvas = document.createElement('canvas');
				canvas.width = w;
				canvas.height = h;
				var context = canvas.getContext('2d');
				context.drawImage(img, 0, 0);
				var data = context.getImageData(0, 0, w, h).data;
				var obj = PJSON.parse(data);
				load(obj);
			}
			img.src = reader.result;
		};
		reader.readAsDataURL(file);
	}, false);
}
/*
== PJSON フォーマット ==
実体は png ファイル。png ファイルの画素領域に任意のバイナリデータを埋め込む。
横幅は 128 px 固定で、縦がデータサイズによって変動。
画素領域の (x,y)=(0,0) を原点として、右にシーケンシャルに読み込み、右端に着いたら 1 行下に降りて続きを読み込む。
RGB のみを使い A は 255 で固定。(透過値を適用すると不可逆の変換が行われる場合があるため)
RGB の順に 1 バイトずつのデータが格納されているものとして byte 列化する。

-- PJSON ヘッダ --
1～2 byte : 文字列 "PJ" の Ascii 値
3    byte : PJSON フォーマットのバージョン
4    byte : ヘッダのサイズ (byte)
5～  byte : データ領域のサイズ (byte)
*/