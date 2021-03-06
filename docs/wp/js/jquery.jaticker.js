/*
 * jQuery jaTicker ver 1.0.0
 * Copyright (c) 2011 Otchy
 * This source file is subject to the MIT license.
 * https://www.otchy.net
 */
(function($){
	$.fn.jaticker = function(options) {
		return this.each(function(){
			var romanMapSingle = {
				'か': 'ｋ', 'き': 'ｋ', 'く': 'ｋ', 'け': 'ｋ', 'こ': 'ｋ',
				'さ': 'ｓ', 'し': 'ｓ', 'す': 'ｓ', 'せ': 'ｓ', 'そ': 'ｓ',
				'た': 'ｔ', 'ち': 'ｔ', 'つ': 'ｔ', 'て': 'ｔ', 'と': 'ｔ',
				'な': 'ｎ', 'に': 'ｎ', 'ぬ': 'ｎ', 'ね': 'ｎ', 'の': 'ｎ',
				'は': 'ｈ', 'ひ': 'ｈ', 'ふ': 'ｆ', 'へ': 'ｈ', 'ほ': 'ｈ',
				'ま': 'ｍ', 'み': 'ｍ', 'む': 'ｍ', 'め': 'ｍ', 'も': 'ｍ',
				'や': 'ｙ', 'ゆ': 'ｙ', 'よ': 'ｙ',
				'ら': 'ｒ', 'り': 'ｒ', 'る': 'ｒ', 'れ': 'ｒ', 'ろ': 'ｒ',
				'わ': 'ｗ', 'を': 'ｗ', 'ん': 'ｎ',
				'が': 'ｇ', 'ぎ': 'ｇ', 'ぐ': 'ｇ', 'げ': 'ｇ', 'ご': 'ｇ',
				'ざ': 'ｚ', 'じ': 'ｊ', 'ず': 'ｚ', 'ぜ': 'ｚ', 'ぞ': 'ｚ',
				'だ': 'ｄ', 'ぢ': 'ｄ', 'づ': 'ｄ', 'で': 'ｄ', 'ど': 'ｄ',
				'ば': 'ｂ', 'び': 'ｂ', 'ぶ': 'ｂ', 'べ': 'ｂ', 'ぼ': 'ｂ',
				'ぱ': 'ｐ', 'ぴ': 'ｐ', 'ぷ': 'ｐ', 'ぺ': 'ｐ', 'ぽ': 'ｐ',
				'ぁ': 'ｘ', 'ぃ': 'ｘ', 'ぅ': 'ｘ', 'ぇ': 'ｘ', 'ぉ': 'ｘ',
				'っ': 'ｘｔ',
				'ゃ': 'ｘｙ', 'ゅ': 'ｘｙ', 'ょ': 'ｘｙ',
				'ゎ': 'ｘｗ',
			};
			var romanMapDouble = {
				'きゃ': 'ｋｙ', 'きゅ': 'ｋｙ', 'きぇ': 'ｋｙ', 'きょ': 'ｋｙ',
				'くぁ': 'ｋｗ',
				'しゃ': 'ｓｙ', 'しゅ': 'ｓｙ', 'しぇ': 'ｓｙ', 'しょ': 'ｓｙ',
				'ちゃ': 'ｔｙ', 'ちゅ': 'ｔｙ', 'ちぇ': 'ｔｙ', 'ちょ': 'ｔｙ',
				'てゃ': 'ｔｈ', 'てぃ': 'ｔｈ', 'てゅ': 'ｔｈ', 'てぇ': 'ｔｈ', 'てょ': 'ｔｈ',
				'にゃ': 'ｎｙ', 'にゅ': 'ｎｙ', 'にぇ': 'ｎｙ', 'にょ': 'ｎｙ',
				'ひゃ': 'ｈｙ', 'ひゅ': 'ｈｙ', 'ひぇ': 'ｈｙ', 'ひょ': 'ｈｙ',
				'みゃ': 'ｍｙ', 'みゅ': 'ｍｙ', 'みぇ': 'ｍｙ', 'みょ': 'ｍｙ',
				'りゃ': 'ｒｙ', 'りゅ': 'ｒｙ', 'りぇ': 'ｒｙ', 'りょ': 'ｒｙ',
				'うぃ': 'ｗ', 'うぇ': 'ｗ',
				'ぎゃ': 'ｇｙ', 'ぎゅ': 'ｇｙ', 'ぎぇ': 'ｇｙ', 'ぎょ': 'ｇｙ',
				'じゃ': 'ｊ', 'じゅ': 'ｊ', 'じぇ': 'ｊ', 'じょ': 'ｊ',
				'ぢゃ': 'ｄｙ', 'ぢゅ': 'ｄｙ', 'ぢぇ': 'ｄｙ', 'ぢょ': 'ｄｙ',
				'びゃ': 'ｂｙ', 'びゅ': 'ｂｙ', 'びぇ': 'ｂｙ', 'びょ': 'ｂｙ',
				'ぴゃ': 'ｐｙ', 'ぴゅ': 'ｐｙ', 'ぴぇ': 'ｐｙ', 'ぴょ': 'ｐｙ',
			};
			var kanaMap = {
				'ア': 'あ', 'イ': 'い', 'ウ': 'う', 'エ': 'え', 'オ': 'お',
				'カ': 'か', 'キ': 'き', 'ク': 'く', 'ケ': 'け', 'コ': 'こ',
				'サ': 'さ', 'シ': 'し', 'ス': 'す', 'セ': 'せ', 'ソ': 'そ',
				'タ': 'た', 'チ': 'ち', 'ツ': 'つ', 'テ': 'て', 'ト': 'と',
				'ナ': 'な', 'ニ': 'に', 'ヌ': 'ぬ', 'ネ': 'ね', 'ノ': 'の',
				'ハ': 'は', 'ヒ': 'ひ', 'フ': 'ふ', 'ヘ': 'へ', 'ホ': 'ほ',
				'マ': 'ま', 'ミ': 'み', 'ム': 'む', 'メ': 'め', 'モ': 'も',
				'ヤ': 'や', 'ユ': 'ゆ', 'ヨ': 'よ',
				'ラ': 'ら', 'リ': 'り', 'ル': 'る', 'レ': 'れ', 'ロ': 'ろ',
				'ワ': 'わ', 'ヲ': 'を', 'ン': 'ん',
				'ガ': 'が', 'ギ': 'ぎ', 'グ': 'ぐ', 'ゲ': 'げ', 'ゴ': 'ご',
				'ザ': 'ざ', 'ジ': 'じ', 'ズ': 'ず', 'ゼ': 'ぜ', 'ゾ': 'ぞ',
				'ダ': 'だ', 'ヂ': 'ぢ', 'ヅ': 'づ', 'デ': 'で', 'ド': 'ど',
				'バ': 'ば', 'ビ': 'び', 'ブ': 'ぶ', 'ベ': 'べ', 'ボ': 'ぼ',
				'パ': 'ぱ', 'ピ': 'ぴ', 'プ': 'ぷ', 'ペ': 'ぺ', 'ポ': 'ぽ',
				'ァ': 'ぁ', 'ィ': 'ぃ', 'ゥ': 'ぅ', 'ェ': 'ぇ', 'ォ': 'ぉ',
				'ッ': 'っ',
				'ャ': 'ゃ', 'ュ': 'ゅ', 'ョ': 'ょ',
				'ヮ': 'ゎ',
			}
			var hiraMap = {};
			for (var k in kanaMap) {
				hiraMap[kanaMap[k]] = k;
			}
			// '　！”＃＄％＆’（）＊＋，－．／０１２３４５６７８９：；＜＝＞？＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ［＼］＾＿｀ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ｛｜｝￣'
			var zenMap = {
			}
			var asciiMap = {};
			for (var z in zenMap) {
				asciiMap[zenMap[z]] = z;
			}
			var throughChars = '０１２３４５６７８９，';
			var triggerChars = '、。」　';
		}
	}
})(jQuery);
