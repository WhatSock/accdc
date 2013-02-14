/*!
Scrollable Div Generator R1.0
Copyright 2010-2013 Bryan Garaventa (WhatSock.com)
Part of AccDC, a Cross-Browser JavaScript accessibility API, distributed under the terms of the Open Source Initiative OSI - MIT License
*/

(function(){

	$A.makeScrollable = function(o, isHorizontal, increment, pageIncrement){
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
		$A.setAttr(o, 'tabindex', '0');
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