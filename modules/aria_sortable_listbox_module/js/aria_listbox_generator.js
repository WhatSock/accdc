/*!
ARIA Listbox Generator Module R1.0
Copyright 2010-2012 Bryan Garaventa (WhatSock.com)
Part of AccDC, a Cross-Browser JavaScript accessibility API, distributed under the terms of the GNU LGPL
	*/

(function(window){

	var grabInstruct = 'Press Space to grab', dropInstruct = 'Press Space to drop', grabMsg = 'Grabbed', dropMsg = 'Moved',
		cancelDrop = 'Grab canceled';

	$A.Listbox = function(list, fieldLabel, defaultIndex, callback, isSortable, isMultiselect, allowDelete){
		var list = typeof list === 'string' ? $A.getEl(list) : list, that = this, track = {}, toggle = {}, max = 0,
			selected = isMultiselect ? [] : '', select = function(i, f){
			if (i != that.index || f)
				$A.query('#' + list.id + ' > *', function(j, o){
					$A.setAttr(o,
									{
									tabindex: '-1',
									// 'aria-hidden': 'true',
									'aria-selected': 'false'
									});
				});

			$A.setAttr(that.options[i],
							{
							tabindex: '0',
							// 'aria-hidden': 'false',
							'aria-selected': 'true'
							});

			that.options[i].scrollIntoView();
			that.index = i;
			that.grabbed = grabbed;

			if (f)
				that.options[i].focus();

			if (!isMultiselect)
				selected = that.options[i].id;

			if (callback && typeof callback === 'function')
				setTimeout(function(){
					callback.apply(that,
									[
									that.options[i],
									that.options
									]);
				}, 1);
		}, updateChecked = function(){
			selected = [];

			for (id in toggle){
				if (toggle[id])
					selected.push(id);
			}
		}, grabbed = '', grab = function(){
			$A.query('#' + list.id + ' > *', function(i, o){
				$A.remAttr(o, 'aria-grabbed');
				$A.setAttr(o, 'aria-dropeffect', 'move');
			});
			grabbed = this.id;
			$A.setAttr(this, 'aria-grabbed', 'true');
			$A.remAttr(this, 'aria-dropeffect');
			select(track[grabbed]);
			$A.announce(grabMsg);
		}, drop = function(c){
			$A.query('#' + list.id + ' > *', function(i, o){
				$A.remAttr(o, 'aria-dropeffect');
				$A.setAttr(o, 'aria-grabbed', 'false');
			});

			if (!c){
				list.insertBefore(that.options[track[grabbed]], that.options[that.index]);
				setOptions(true);
				$A.announce(dropMsg);
			}

			else
				$A.announce(cancelDrop);
			var g = grabbed;
			grabbed = '';
			select(c ? that.index : track[g], c ? false : true);
		}, add = function(o){
			if (!o || o.nodeType !== 1 || !o.id){
				alert('The new item must be a valid DOM node with a unique ID attribute value');
				return;
			}
			$A.setAttr(o,
							{
							role: 'option',
							tabindex: '-1',
							// 'aria-hidden': 'true',
							'aria-selected': 'false',
							'aria-label': getLabel(o)
							});

			if (isSortable || isMultiselect)
				$A.setAttr(o, isSortable ? 'aria-grabbed' : 'aria-checked', 'false');
			list.appendChild(o);
			setOptions(true);
			setBindings(o);
		}, rem = function(i, s){
			list.removeChild(that.options[i]);
			setOptions(true);

			if (that.index > max)
				that.index = max;

			if (that.options.length)
				select(that.index, s ? false : true);
		}, activate = function(){
			if (isSortable){
				if (grabbed)
					drop.apply(this);

				else
					grab.apply(this);
			}

			else if (isMultiselect){
				toggle[this.id] = toggle[this.id] ? false : true;
				$A.setAttr(this, 'aria-checked', toggle[this.id] ? 'true' : 'false');
				updateChecked();
				select(that.index);
			}
		}, setBindings = function(o){
			if (!o)
				$A.bind(list, 'focusin.arialistbox', function(){
					if (isSortable)
						$A.announce(grabbed ? dropInstruct : grabInstruct, true);
				});
			$A.bind(o || '#' + list.id + ' > *',
							{
							'click.arialistbox': function(ev){
								if (isMultiselect){
									toggle[this.id] = toggle[this.id] ? false : true;
									$A.setAttr(this, 'aria-checked', toggle[this.id] ? 'true' : 'false');
									updateChecked();
								}
								select(track[this.id]);
							},
							'keydown.arialistbox': function(ev){
								var k = ev.which || ev.keyCode;

								if (k == 38){
									if (that.index > 0)
										select(that.index - 1, true);
								}

								else if (k == 40){
									if (that.index < max)
										select(that.index + 1, true);
								}

								else if (k == 13)
									$A.trigger(this, 'click');

								else if (k == 27 && grabbed){
									drop.apply(this, [true]);
									ev.preventDefault();
								}

								else if (k == 32)
									activate.apply(this);

								else if (k == 35)
									select(max, true);

								else if (k == 36)
									select(0, true);

								else if (k == 46 && allowDelete){
									rem(track[this.id]);
								}
							}
							});
		}, getLabel = function(o){
			return(function(){
				var s = '';
				$A.query('img', o, function(j, p){
					if (p.alt)
						s += p.alt + ' ';
				});
				return s;
			})() + (o.innerText || o.textContent);
		}, setOptions = function(s){
			track = [];
			toggle = [];
			max = 0;
			that.options = $A.query('#' + list.id + ' > *', function(i, o){
				track[o.id] = i;

				if (isMultiselect)
					toggle[o.id] = false;
				max = i;

				if (!s)
					$A.setAttr(o,
									{
									tabindex: '-1',
									// 'aria-hidden': 'true',
									'aria-selected': 'false',
									'aria-label': getLabel(o)
									});

				$A.setAttr(o, 'aria-posinset', i + 1);

				if (!s && (isSortable || isMultiselect))
					$A.setAttr(o, isSortable ? 'aria-grabbed' : 'aria-checked', 'false');
			});
			$A.query('#' + list.id + ' > *', function(i, o){
				$A.setAttr(o, 'aria-setsize', max + 1);
			});
		};

		if (!fieldLabel && !$A.getAttr(list, 'aria-labelledby'))
			alert(
				'An explicit form field label is required via the fieldLabel argument, or using aria-labelledby on the element with role=listbox.');

		else if (fieldLabel)
			$A.setAttr(list, 'aria-label', fieldLabel);
		setOptions();
		setBindings();
		that.val = function(i){
			if (typeof i === 'number')
				select(i);

			else if (i && typeof i === 'string')
				select(track[i]);

			else
				return selected;
		};
		that.add = add;
		that.rem = function(i){
			rem(i && typeof i === 'string' ? track[i] : i, true);
		};
		that.activate = activate;
		that.grabbed = grabbed;
		that.container = list;
		that.val(defaultIndex);
	};
})(window);