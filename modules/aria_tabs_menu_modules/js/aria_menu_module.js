/* !
ARIA Menu Module R1.0
Copyright 2010-2013 Bryan Garaventa (WhatSock.com)
Part of AccDC, a Cross-Browser JavaScript accessibility API, distributed under the terms of the Open Source Initiative OSI - MIT License
	*/

(function(window){

	$A.setMenu = function(trigger, path, topLvlId, callback, isInternal, context){
		$A.bind(window, 'load', function(){
			var track = {}, bfr = isInternal ? $A.getEl(path) : $A.createEl('div'), handler = callback || function(){},

			// Declare a recursive function for setting up submenus
			runAfter = function(dc){
				createMenu('ul.menu', 'ul.menu li', dc);
				var subMenuObjects = [];
				$A.query('li.submenu', dc.containerDiv, function(){
					subMenuObjects.push(
									{
									id: dc.id + this.id,
									role: 'SubMenu',
									bind: 'click',
									isTab: true,
									tabRole: '',
									tabState: 'Open',
									trigger: this,
									topLvlId: dc.topLvlId + this.id,
									source: track[dc.topLvlId + this.id],
									autoPosition: 3,
									runBefore: function(dc){
										// Configure relative spatial positioning
										if (dc.parent)
											dc.offsetLeft = -(dc.parent.accDCObj.offsetWidth / 2);
										dc.offsetTop = -dc.triggerObj.offsetHeight;
									},
									runAfter: runAfter,
									cssObj:
													{
													position: 'relative',
													zIndex: dc.cssObj.zIndex + 1
													},
									// Set a general className for each menu container
									className: 'menu',
									ariaLevel: dc.ariaLevel + 1,
									tabOut: dc.tabOut
									});
					$A.setAttr(this, 'aria-haspopup', 'true');
				});
				$A(dc, subMenuObjects);
				$A.query('li.link', dc.containerDiv, function(){
					$A.bind(this, 'click', function(ev){
						dc.top.close();

						if (handler && typeof handler === 'function')
							handler(ev, this);
						ev.preventDefault();
					});
				});
			}, postLoad = function(){
				$A.query('ul', bfr, function(){
					track[this.id] = this.parentNode.removeChild(this);
				});

				$A(
								[
								{
								id: topLvlId,
								role: 'Menu',
								bind: 'click',
								isToggle: true,
								toggleRole: '',
								toggleState: 'Open',
								trigger: trigger,
								topLvlId: topLvlId,
								source: track[topLvlId],
								autoPosition: 3,
								runOnceBefore: function(dc){
									$A.bind(dc.triggerObj, 'focus', function(ev){
										if (dc.loaded && !("ontouchstart" in window))
											dc.close();
									});
								},
								runAfter: runAfter,
								cssObj:
												{
												position: 'absolute',
												zIndex: 1
												},
								className: 'menu',
								ariaLevel: 3,
								tabOut: function(ev, dc){
									if (!("ontouchstart" in window)){
										dc.top.close();
									}
								}
								}
								], null, true);
			};

			// If isInternal is set, parse bfr instantly
			if (isInternal)
				postLoad();

			// Otherwise preload HTML markup using lazy loading
			else
				$A.load(bfr, path, postLoad);
			$A.setAttr($A.query(trigger, context)[0], 'aria-haspopup', 'true');
		});
	};

	var createMenu = function(parent, children, dc){
		var cur = null, index = 0;
		$A.query(parent, dc.containerDiv, function(){
			$A.setAttr(this, 'role', 'menu');
		});
		var items = $A.query(children, dc.containerDiv, function(){
			$A.setAttr(this, 'role', 'menuitem');
			$A.setAttr(this, 'tabindex', -1);
			$A.bind(this,
							{
							focus: function(ev){
								var i = $A.inArray(this, items);

								if (i !== -1)
									index = i;

								if (cur){
									$A.setAttr(cur, 'tabindex', -1);
									$A.setAttr(cur, 'aria-selected', 'false');
								}
								cur = this;
								$A.setAttr(cur, 'tabindex', 0);
								$A.setAttr(cur, 'aria-selected', 'true');
							},
							click: function(ev){
								$A.trigger(this, 'focus');
							},
							keypress: function(ev){
								var k = ev.which || ev.keyCode;

								// 13 enter, 27 escape
								if (k == 27 || k == 13){
									if (k == 27)
										dc.top.close();

									else if (k == 13)
										$A.trigger(this, 'click');
									ev.preventDefault();
								}
							},
							keydown: function(ev){
								var k = ev.which || ev.keyCode;

								// 37 left, 38 up, 39 right, 40 down
								if (k >= 37 && k <= 40){
									if (k == 37)
										dc.close();

									else if (k == 39)
										$A.trigger(this, 'click');

									else if (k == 38)
										index = index === 0 ? items.length - 1 : index - 1;

									else if (k == 40)
										index = index === items.length - 1 ? 0 : index + 1;

									if (k === 38 || k === 40)
										items[index].focus();
								}
							}
							});
		});
		$A.trigger(items[index], 'focus');
	};
})(window);