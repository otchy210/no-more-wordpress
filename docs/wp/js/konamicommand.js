function konamicommand(func, cmd) {
	if (!(func instanceof Function)) return;
	var kc = {};
	kc.func = func;
	kc.cmd = (typeof(cmd) == "string" || cmd instanceof String) ? cmd : '|38|38|40|40|37|39|37|39|66|65|';
	kc.count = 0;
	kc.input = '|';
	kc.up = function(event) {
		event = event ? event : window.event;
		if (kc.cmd.indexOf('|' + event.keyCode + '|') == -1) {
			kc.input = '|';
			return;
		}
		kc.input += event.keyCode + '|';
		if (kc.input.indexOf(kc.cmd) != -1) {
			kc.func(kc.count);
			kc.count++;
			kc.input = '|';
		}
	}
	if (document.attachEvent) {
		document.attachEvent('onkeyup', kc.up);
	} else if (document.addEventListener) {
		document.addEventListener('keyup', kc.up , false);
	}
}
