var prefectures = [
	{code:'JP-01',name:'北海道'},
	{code:'JP-02',name:'青森県'},
	{code:'JP-03',name:'岩手県'},
	{code:'JP-04',name:'宮城県'},
	{code:'JP-05',name:'秋田県'},
	{code:'JP-06',name:'山形県'},
	{code:'JP-07',name:'福島県'},
	{code:'JP-08',name:'茨城県'},
	{code:'JP-09',name:'栃木県'},
	{code:'JP-10',name:'群馬県'},
	{code:'JP-11',name:'埼玉県'},
	{code:'JP-12',name:'千葉県'},
	{code:'JP-13',name:'東京都'},
	{code:'JP-14',name:'神奈川県'},
	{code:'JP-15',name:'新潟県'},
	{code:'JP-16',name:'富山県'},
	{code:'JP-17',name:'石川県'},
	{code:'JP-18',name:'福井県'},
	{code:'JP-19',name:'山梨県'},
	{code:'JP-20',name:'長野県'},
	{code:'JP-21',name:'岐阜県'},
	{code:'JP-22',name:'静岡県'},
	{code:'JP-23',name:'愛知県'},
	{code:'JP-24',name:'三重県'},
	{code:'JP-25',name:'滋賀県'},
	{code:'JP-26',name:'京都府'},
	{code:'JP-27',name:'大阪府'},
	{code:'JP-28',name:'兵庫県'},
	{code:'JP-29',name:'奈良県'},
	{code:'JP-30',name:'和歌山県'},
	{code:'JP-31',name:'鳥取県'},
	{code:'JP-32',name:'島根県'},
	{code:'JP-33',name:'岡山県'},
	{code:'JP-34',name:'広島県'},
	{code:'JP-35',name:'山口県'},
	{code:'JP-36',name:'徳島県'},
	{code:'JP-37',name:'香川県'},
	{code:'JP-38',name:'愛媛県'},
	{code:'JP-39',name:'高知県'},
	{code:'JP-40',name:'福岡県'},
	{code:'JP-41',name:'佐賀県'},
	{code:'JP-42',name:'長崎県'},
	{code:'JP-43',name:'熊本県'},
	{code:'JP-44',name:'大分県'},
	{code:'JP-45',name:'宮崎県'},
	{code:'JP-46',name:'鹿児島県'},
	{code:'JP-47',name:'沖縄県'}
];
$(function() {
	var sizeDiv = $('<div></div>');
	var widthInput = $('<input id="mapWidth" style="width:80px;" value="400" />');
	var heightInput = $('<input id="mapHeight" style="width:80px;" value="300" />');
	sizeDiv.append('サイズ(横×縦)：').append(widthInput).append('×').append(heightInput);

	var titleDiv = $('<div></div>');
	var titleInput = $('<input id="mapTitle" />');
	titleInput.css({'width': '400px'});
	titleDiv.append('タイトル：').append(titleInput);

	var table = $('<table></table>');
	table.append('<tr><th>都道府県名</th><th>色</th><th>ラベル<button id="copyName">都道府県名をコピー</button></th></tr>');
	for (var i=0; i<prefectures.length; i++) {
		var pref = prefectures[i];
		var prefTr = $('<tr></tr>');
		var nameTd = $('<td></td>');
		nameTd.text(pref.name);
		var colorTd = $('<td></td>');
		var colorInput = $('<input class="color" style="width:80px;" />');
		colorInput.attr('id', 'color_' + pref.code);
		colorTd.append(colorInput);
		var labelTd = $('<td></td>');
		var labelInput = $('<input class="label" style="width:250px;" />');
		labelInput.attr('id', 'label_' + pref.code);
		labelTd.append(labelInput);
		prefTr.append(nameTd);
		prefTr.append(colorTd);
		prefTr.append(labelTd);
		table.append(prefTr);
	}
	var otherTr = $('<tr><td>未指定色</td><td><input id="otherColor" class="color" style="width:80px;" /></td></tr>');
	table.append(otherTr);
	
	var viewButton = $('<button />');
	viewButton.text('地図を表示！');
	viewButton.click(function() {
		var url = 'https://chart.googleapis.com/chart?cht=map';
		var width = widthInput.val();
		var height = heightInput.val();
		if (width.length == 0 || height.length == 0) {
			alert('サイズは必須入力です！');
			return;
		}
		url += '&chs=' + width + 'x' + height;
		var chld = [];
		var chdl = [];
		var chco = [];
		var useLabel = false;
		for (var i=0; i<prefectures.length; i++) {
			var code = prefectures[i].code;
			var color = $('#color_' + code).val();
			if (color.length == 0) continue;
			var label = $('#label_' + code).val();
			if (label.length > 0) {
				useLabel = true;
			}
			chld.push(code);
			chdl.push(encodeURI(label));
			chco.push(color);
		}
		if (chco.length == 0) {
			alert('1つは色を指定して下さい！');
			return;
		}
		var otherColor = $('#otherColor').val();
		if (otherColor.length == 0) {
			otherColor = '999999';
		}
		chco.unshift(otherColor);
		url += '&chld=' + chld.join('|');
		if (useLabel) {
			url += '&chdl=' + chdl.join('|');
		}
		url += '&chco=' + chco.join('|');
		var title = titleInput.val();
		if (title.length > 0) {
			url += '&chtt=' + encodeURI(title);
		}
		window.open(url);
	});

	var div = $('#prefectures');
	div.hide();
	div.append(sizeDiv);
	div.append(titleDiv);
	div.append(table);
	div.append(viewButton);
	div.show();
	
	$('#copyName').click(function() {
		for (var i=0; i<prefectures.length; i++) {
			var pref = prefectures[i];
			$('#label_' + pref.code).val(pref.name);
		}
	});

	table.find('.color').ColorPicker({
	onSubmit: function(hsb, hex, rgb, el) {
		$(el).val(hex);
		$(el).ColorPickerHide();
	}, onBeforeShow: function () {
		$(this).ColorPickerSetColor(this.value);
	}
	}).bind('keyup', function(){
		$(this).ColorPickerSetColor(this.value);
	});
});