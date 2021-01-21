var HIRAGANA_ALL = 'ぁあぃいぅうぇえぉおかがきぎくぐけげこごさざしじすずせぜそぞただちぢっつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもゃやゅゆょよらりるれろゎわゐゑをん゛゜ー';
var KATAKANA_ALL = 'ァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵヶ゛゜ー';
var HIRAGANA = 1;
var KATAKANA = 2;
var OTHER = 3;
Array.prototype.shuffle = function() {
    var i = this.length;
    while(i){
        var j = Math.floor(Math.random()*i);
        var t = this[--i];
        this[i] = this[j];
        this[j] = t;
    }
    return this;
}
function convert(from, to) {
	var text = from.value;
	var len = text.length;
	var preType = OTHER;
	var result = '';
	var word = '';
	for (var i=0; i<len; i++) {
		var c = text.charAt(i);
		var type = getType(c);
		if (type != preType) {
			result += shuffle(word);
			word = '';
		}
		if (type == OTHER) {
			result += c;
		} else {
			word += c;
			if (i == len-1) {
				result += shuffle(word);
				word = '';
			}
		}
		preType = type;
	}
	to.value = result;
}
function getType(c) {
	if (HIRAGANA_ALL.indexOf(c) >= 0) {
		return HIRAGANA;
	}
	if (KATAKANA_ALL.indexOf(c) >= 0) {
		return KATAKANA;
	}
	return OTHER;
}
function shuffle(word) {
	var len = word.length;
	if (len < 4) {
		return word;
	}
	var result = word;
	while (result == word) {
		result = '';
		var chars = [];
		for (var i=0; i<len; i++) {
			var c = word.charAt(i);
			if (i == 0 || i == len-1) {
				result += c;
			} else {
				chars.push(c);
			}
			if (i == len-2) {
				chars.shuffle();
				result += chars.join('');
			}
		}
	}
	return result;
}