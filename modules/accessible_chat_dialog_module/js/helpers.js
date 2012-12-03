/*!
Helper functions for the Accessible Chat Dialog Module
*/

var firstChild = function(e, t){
	var e = e ? e.firstChild : null;

	while (e){
		if (e.nodeType === 1 && (!t || t.toLowerCase() === e.nodeName.toLowerCase()))
			break;

		e = e.nextSibling;
	}
	return e;
}, lastChild = function(e, t){
	var e = e ? e.lastChild : null;

	while (e){
		if (e.nodeType === 1 && (!t || t.toLowerCase() === e.nodeName.toLowerCase()))
			break;

		e = e.previousSibling;
	}
	return e;
}, elastic = function(obj, maxheight){
	if (!obj || obj.nodeName.toLowerCase() !== 'textarea')
		return obj;
	var mimics =
					[
					'paddingTop',
					'paddingRight',
					'paddingBottom',
					'paddingLeft',
					'fontSize',
					'lineHeight',
					'fontFamily',
					'fontWeight',
					'border-top-width',
					'border-right-width',
					'border-bottom-width',
					'border-left-width',
					'borderTopStyle',
					'borderTopColor',
					'borderRightStyle',
					'borderRightColor',
					'borderBottomStyle',
					'borderBottomColor',
					'borderLeftStyle',
					'borderLeftColor'
					], $textarea = obj, $twin = $A.createEl('div', null,
					{
					position: 'absolute',
					zIndex: -1000,
					visibility: 'hidden'
					});

	$textarea.parentNode.appendChild($twin);

	for (var i = mimics.length - 1; i >= 0; i--)
					$A.css($twin, mimics[i], $A.css($textarea, mimics[i]));
	$A.bind($textarea, 'keyup change cut paste resize input', function(){
		if (!updating){
			updating = true;
			setTimeout(update, 200);
		}
	});
	$A.bind(window, 'resize', update);
	var lineHeight = parseInt($A.css($textarea, 'line-height'), 10) || parseInt($A.css($textarea, 'font-size'), 10),
		minheight = 20, maxheight = maxheight || parseInt($A.css($textarea, 'max-height'), 10) || Number.MAX_VALUE,
		exceeded = false, updating = false;

	function update(){
	var txw = $textarea.offsetWidth, tww = $twin.offsetWidth;

	if (txw != tww)
		$A.css($twin, 'width', $A.css($textarea, 'width'));
	var text =
		$textarea.value.replace(/&/g, '&amp;').replace(/ {2}/g, '&nbsp;').replace(/<|>/g, '&gt;').replace(/\n/g, '<br />'),
		html = $twin.innerHTML.replace(/<br>/ig, '<br />');

	if (text + '&nbsp;' !== html){
		$twin.innerHTML = text + '&nbsp;';
		var twh = $twin.offsetHeight;

		if (twh <= maxheight){
			if (twh >= minheight)
				$A.css($textarea, 'height', twh + (lineHeight / 2));

			else
				$A.css($textarea, 'height', minheight);

			if (exceeded){
				$A.css($textarea, 'overflow-y', 'hidden');
				exceeded = false;
			}
		}

		else if (twh > maxheight){
			exceeded = true;
			$A.css($textarea, 'overflow-y', 'auto');
		}
	}
	updating = false;
}
	exceeded = true;
	update();
	return obj;
}, cln = function(str, q){
	str = str.replace(/<|>/g, '');

	if (q)
		return str.replace(/\"/g, ' ');

	var i = str.length, aRet = [];

	while (i--){
		var iC = str[i].charCodeAt();

		if (str[i] != "\n" && (iC < 65 || iC > 127 || (iC > 90 && iC < 97)))
			aRet[i] = '&#' + iC + ';';

		else
			aRet[i] = str[i];
	}

	return aRet.join('');
}, scrollableDiv = function(o, isHorizontal, increment, pageIncrement){
	if (!o)
		return;
	var f = firstChild(o), track = {}, update = function(){
		track.p =
						{
						h: o.clientHeight,
						w: o.clientWidth
						};

		track.n =
						{
						h: f.offsetHeight,
						w: f.offsetWidth
						};

		track.left = o.scrollLeft;
		track.top = o.scrollTop;

		if (isHorizontal){
			track.inc = track.p.w * (increment || 0.3);
			track.pInc = track.p.w * (pageIncrement || 0.9);
		}

		else{
			track.inc = track.p.h * 0.3;
			track.pInc = track.p.h * 0.9;
		}
		track.mh = track.n.h - track.p.h;
		track.mw = track.n.w - track.p.w;
	}, scroll = function(dir){
		// Left arrow
		if (dir == 1){
			if (track.left < track.inc)
				track.left = 0;

			else
				track.left -= track.inc;
		// Up arrow
		}

		else if (dir == 2){
			if (track.top < track.inc)
				track.top = 0;

			else
				track.top -= track.inc;
		// Right arrow
		}

		else if (dir == 3){
			if (track.left >= (track.n.w - track.p.w) || (track.left + track.inc) > track.mw)
				track.left = track.mw;

			else
				track.left += track.inc;
		// Down arrow
		}

		else if (dir == 4){
			if (track.top >= (track.n.h - track.p.h) || (track.top + track.inc) > track.mh)
				track.top = track.mh;

			else
				track.top += track.inc;
		// PageUp
		}

		else if (dir == 5){
			if (isHorizontal){
				if (track.left < track.pInc)
					track.left = 0;

				else
					track.left -= track.pInc;
			}

			else{
				if (track.top < track.pInc)
					track.top = 0;

				else
					track.top -= track.pInc;
			}
		// PageDown
		}

		else if (dir == 6){
			if (isHorizontal){
				if (track.left >= (track.n.w - track.p.w) || (track.left + track.pInc) > track.mw)
					track.left = track.mw;

				else
					track.left += track.pInc;
			}

			else{
				if (track.top >= (track.n.h - track.p.h) || (track.top + track.pInc) > track.mh)
					track.top = track.mh;

				else
					track.top += track.pInc;
			}
		// Home
		}

		else if (dir == 7){
			if (isHorizontal)
				track.left = 0;

			else
				track.top = 0;
		// End
		}

		else if (dir == 8){
			if (isHorizontal)
				track.left = track.mw;

			else
				track.top = track.mh;
		}
		o.scrollTop = track.top;
		o.scrollLeft = track.left;
		update();
	};
	$A.setAttr(o,
					{
					tabindex: '0'
					});

	$A.bind(o, 'keydown', function(ev){
		var k = ev.which || ev.keyCode;

		if (k >= 33 && k <= 40){
			if (k == 37)
				scroll(1);

			else if (k == 38)
				scroll(2);

			else if (k == 39)
				scroll(3);

			else if (k == 40)
				scroll(4);

			else if (k == 33)
				scroll(5);

			else if (k == 34)
				scroll(6);

			else if (k == 36)
				scroll(7);

			else if (k == 35)
				scroll(8);
		}
	});

	$A.bind(window, 'resize', update);
	update();
	track.top = track.left = o.scrollTop = o.scrollLeft = 0;
};