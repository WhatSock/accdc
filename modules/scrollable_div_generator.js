/*!
Scrollable Div Generator R1.3
Copyright 2010-2013 Bryan Garaventa (WhatSock.com)
Part of AccDC, a Cross-Browser JavaScript accessibility API, distributed under the terms of the Open Source Initiative OSI - MIT License
*/

(function(){

	$A.makeScrollable = function(o, isHorizontal, increment, pageIncrement){
		if (!o)
			return;

		var f = firstChild(o), track = {}, update = function(){
			if (!f)
				f = firstChild(o);

			if (!f)
				return;
			track.top = track.left = o.scrollTop = o.scrollLeft = 0;
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
				track.inc = parseInt(track.p.w * (increment || 0.3));
				track.pInc = parseInt(track.p.w * (pageIncrement || 0.9));
			}

			else{
				track.inc = parseInt(track.p.h * 0.3);
				track.pInc = parseInt(track.p.h * 0.9);
			}
		}, scroll = function(dir){
			// Left arrow
			if (isHorizontal && dir == 1)
				track.left -= track.inc;

			// Up arrow
			else if (!isHorizontal && dir == 2)
				track.top -= track.inc;

			// Right arrow
			else if (isHorizontal && dir == 3)
				track.left += track.inc;

			// Down arrow
			else if (!isHorizontal && dir == 4)
				track.top += track.inc;

			// PageUp
			else if (dir == 5){
				if (isHorizontal)
					track.left -= track.pInc;

				else
					track.top -= track.pInc;
			}

			// PageDown
			else if (dir == 6){
				if (isHorizontal)
					track.left += track.pInc;

				else
					track.top += track.pInc;
			}

			// Home
			else if (dir == 7){
				if (isHorizontal)
					track.left = 0;

				else
					track.top = 0;
			}

			// End
			else if (dir == 8){
				if (isHorizontal)
					track.left = track.n.w;

				else
					track.top = track.n.h;
			}

			o.scrollTop = parseInt(track.top);
			o.scrollLeft = parseInt(track.left);
			track.top = o.scrollTop;
			track.left = o.scrollLeft;
		};
		$A.setAttr(o, 'tabindex', '0');
		$A.bind(o, 'keydown.scrollable', function(ev){
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

		$A.bind(window, 'resize.scrollable', update);
		update();
	};

	var firstChild = function(e, t){
		var e = e ? e.firstChild : null;

		while (e){
			if (e.nodeType === 1 && (!t || t.toLowerCase() === e.nodeName.toLowerCase()))
				break;

			e = e.nextSibling;
		}
		return e;
	};
})();