/* !
ARIA Radio Generator R1.0
Copyright 2010-2012 Bryan Garaventa (WhatSock.com)
Part of AccDC, a Cross-Browser JavaScript accessibility API, distributed under the terms of the Open Source Initiative OSI - MIT License
	*/

(function(){

// Send an ID or DOM node as the radioGroupObj parameter, set the default selection index value, specify the legend text, and define a callback function
	$A.RadioGroup = function(radioGroupObj, defaultRadioVal, legendText, callback){
		if (!legendText)
			alert('legentText is required as a shared group label.');

		var rgo = typeof radioGroupObj === 'string' ? document.getElementById(radioGroupObj) : radioGroupObj, track = {},
			that = this, select = function(index, force){
			for (var i = 0; i < that.childNodes.length - 1; i++)
							$A.setAttr(that.childNodes[i],
											{
											tabindex: '-1',
											'aria-selected': 'false',
											'aria-checked': 'false'
											});

			$A.setAttr(that.childNodes[index],
							{
							tabindex: '0',
							'aria-selected': 'true',
							'aria-checked': 'true'
							});

			if (force)
				that.childNodes[index].focus();
			that.selected = that.childNodes[index];
			that.index = index;

			if (callback && typeof callback === 'function')
				callback(that.childNodes[index], that.childNodes);
		};
		$A.setAttr(rgo, 'aria-label', legendText);
		that.childNodes = $A.query('#' + rgo.id + ' > *', rgo.parentNode, function(i, o){
			track[o.id] = i;
			track.max = i + 1;
			$A.setAttr(o,
							{
							tabindex: '-1',
							'aria-selected': 'false',
							'aria-checked': 'false',
							'aria-posinset': track.max
							});

			if (!(o.innerText || o.textContent) && !getAttr(o, 'title') && !getAttr(o, 'aria-label'))
				alert('The radio button tag with id=' + o.id
					+ ' is lacking inner text. Either offscreen text or visible text must be added between the opening and closing tags.');
		});

		for (var i = 0; i < that.childNodes.length - 1; i++)
						$A.setAttr(that.childNodes[i], 'aria-setsize', track.max);

		$A.bind(that.childNodes, 'click', function(ev){
			select(track[this.id]);
		});
		$A.bind(that.childNodes, 'keydown', function(ev){
			var k = ev.which || ev.keyCode;

			if (k == 37 || k == 38){
				if (that.index > 0)
					select(that.index - 1, true);

				else
					select(track.max - 1, true);
			}

			else if (k == 39 || k == 40){
				if (that.index < (track.max - 1))
					select(that.index + 1, true);

				else
					select(0, true);
			}
		});

		that.set = function(index){
			select(index);
		};
		select( typeof defaultRadioVal === 'number' ? defaultRadioVal : 0);
	};
})();