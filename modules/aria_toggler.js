/* !
ARIA Toggle Generator R1.0
Instructions: http://lnkd.in/JsPZf6
Copyright 2010-2013 Bryan Garaventa (WhatSock.com)
Part of AccDC, a Cross-Browser JavaScript accessibility API, distributed under the terms of the Open Source Initiative OSI - MIT License
	*/

(function(){

	$A.Toggle = function(trigger, state, callback, isCheckbox){
		var t = typeof trigger === 'string' ? $A.getEl(trigger) : trigger, that = this,
			isCheckbox = $A.getAttr(t, 'role') == 'checkbox' ? true : false, toggle = function(state){
			$A.setAttr(t, isCheckbox ? 'aria-checked' : 'aria-pressed', state ? 'true' : 'false');
			that.state = state;

			if (callback && typeof callback === 'function')
				return callback(t, state);
		};
		var nn = t.nodeName.toLowerCase();

		if (!((nn == 'input' && (t.getAttribute('type') == 'button' || t.getAttribute('type') == 'image'))
			|| (nn == 'a' && t.hasAttribute('href')) || (nn == 'button')))
			$A.setAttr(t, 'tabindex', '0');
		/*
		Button Label Rules :
		img tag, aria - label only
		input tag, both title and aria - label must be set
		button tag and all other tags that support innerHTML, inner text only
		A tag containing an IMG tag, only innerHTML content should be used for iOS support
		*/
		if (nn == 'input' && !(t.getAttribute('title') && t.getAttribute('aria-label')))
			alert('The element with id=' + t.id
				+ ' must include both an informative title attribute, and a matching aria-label attribute as the button label text.');

		else if (!t.innerHTML && nn != 'input' && !t.getAttribute('aria-label'))
			alert('The element with id=' + t.id + ' must include an informative aria-label attribute as the button label text.');

		else if ((nn == 'button' || t.innerHTML) && !(t.innerText || t.textContent) && !t.getAttribute('aria-label'))
			alert('The element with id=' + t.id
				+ ' must include informative text between the opening and closing tags as a button label, or include an aria-label attribute for WebKit browser support.');
		$A.bind(t, 'keydown', function(ev){
			var ev = ev || window.event, k = ev.which || ev.keyCode;

			if (k == 13 || k == 32){
				var r = toggle(that.state ? false : true) ? true : false;
				ev.returnValue = r;

				if (!r && ev.preventDefault)
					ev.preventDefault();
			}
		});
		$A.bind(t, 'click', function(ev){
			var ev = ev || window.event;
			var r = toggle(that.state ? false : true) ? true : false;
			ev.returnValue = r;

			if (!r && ev.preventDefault)
				ev.preventDefault();
		});
		that.set = function(state){
			return toggle(state);
		};
		toggle(state);
	};
})();