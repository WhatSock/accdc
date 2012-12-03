$A.bind(window, 'load', function(){

	$A(
					[
					{
					id: 'render',
					role: 'List',
					isStatic: '#list',
					showHiddenBounds: false,
					allowReopen: true,
					runDuring: function(dc){
						grabbed = '';

						// Set parentNode to role = application so that Escape can be used to cancel grabbing
						if (sort)
							$A.setAttr(dc.containerDiv, 'role', 'application');
					}
					}
					]);

	var lb = null, sort = false, grabbed = '', setBindings = function(o){
		$A.bind(o || lb.options,
						{
						click: function(ev){
							lb.activate.apply(this);
						},
						keydown: function(ev){
							var k = ev.which || ev.keyCode;

							if (k == 13 || k == 27){
								if (k == 13 || !grabbed)
									setTimeout(function(){
										// Revert to standard list when Enter or Escape is pressed
										toggle($A.getEl('f4'));
									}, 1);

								else
									grabbed = '';
							}
						}
						});
	}, enableSort = function(s){
		var list = $A.getEl('things');
		$A.setAttr(list, 'role', 'listbox');
		$A.query('#' + list.id + ' > *', function(i, o){
			$A.setAttr(o,
							{
							id: list.id + '-' + i,
							role: 'option'
							});
		});

		var render = $A.reg.render;
		render.source = list.outerHTML;
		sort = true;
		render.open();

		// Instantiate an ARIA Listbox object
		lb = new $A.Listbox('things', 'Sort', 0, function(sNode, cNodes){
			if (lb.grabbed)
				grabbed = lb.grabbed;

			if (lb.grabbed && !$A.hasClass($A.getEl(lb.grabbed), 'grabbed'))
				$A.addClass($A.getEl(lb.grabbed), 'grabbed');

			else
				$A.query('.grabbed', lb.container, function(i, o){
					$A.remClass(o, 'grabbed');
				});
		}, true, false, true);

		// Set additional handlers on all listbox option elements (li tags)
		setBindings();

		// Set focus to the first listbox option
		if (!s)
			lb.options[0].focus();
	}, disableSort = function(s){
		var id = 'things', list = $A.getEl(id), x = [];

		for (var n in list.attributes)
						x.push(list.attributes[n].name);
		$A.remAttr(list, x);
		list.id = id;
		$A.query('#' + list.id + ' > *', function(i, o){
			var a = [];

			for (n in o.attributes)
							a.push(o.attributes[n].name);
			$A.remAttr(o, a);
		});
		var render = $A.reg.render;
		render.source = list.outerHTML;
		sort = lb = false;
		render.open();

		if (!s)
			$A.getEl('f4').focus();
	}, toggle = function(o, s){
		if (!sort && !$A.query('#things > *').length)
			return;
		$A.setAttr(o, 'aria-pressed', sort ? 'false' : 'true');

		if (!sort)
			enableSort(s);

		else
			disableSort(s);

		if (sort)
			$A.addClass(o, 'pressed');

		else
			$A.remClass(o, 'pressed');
	}, add = function(){
		var f1 = $A.getEl('f1'), f1str = f1.value.replace(/<|>/g, ''), li = $A.createEl('li');

		if (!f1str)
			return;

		li.appendChild($A.createEl('span', null, null, null, document.createTextNode(f1str)));

		if (sort){
			li.id = lb.container.id + '-' + lb.options.length;
			lb.add(li);
			lb.val(lb.options.length - 1);
			// Set additional handlers on the new LI tag
			setBindings(li);
		}

		else{
			$A.getEl('things').appendChild(li);
			li.scrollIntoView();
		}
		f1.value = '';
		f1.focus();
		$A.announce(f1str + ' has been added');
	};

	// Form element binding
	$A.bind('form', 'submit', function(ev){
		add();
		ev.preventDefault();
	});

	// Textarea field binding
	$A.bind('#f1', 'keypress', function(ev){
		var k = ev.which || ev.keyCode;

		if (k == 13){
			add();
			ev.preventDefault();
		}
	});

	// Add btn binding
	$A.bind('#f2', 'click', function(ev){
		add();
		ev.preventDefault();
	});

	// Clear btn binding
	$A.bind('#f3', 'click', function(ev){
		if (sort)
			toggle($A.getEl('f4'), true);

		$A.query('#things > *', function(i, o){
			if (o.nodeType === 1)
				o.parentNode.removeChild(o);
		});
		$A.announce('List cleared');
		ev.preventDefault();
	});

	// Sort btn binding
	$A.bind('#f4', 'click', function(ev){
		toggle(this);
		ev.preventDefault();
	});
});