/* !
ARIA Tree From XML Module R1.0
Copyright 2010-2012 Bryan Garaventa (WhatSock.com)
Part of AccDC, a Cross-Browser JavaScript accessibility API, distributed under the terms of the GNU LGPL
	*/

(function(window){

	$A.setTree = function(config){

		var config = config || {},

		// Set the screen reader accessible hidden text label for the tree
		treeTitle = config.title, insertionPoint = config.container,

		// Optionally assign custom event handlers for tree items using a bind type and a callback
		handlers =
						{
						// Event type
						bind: config.bind,
						def: config.callback
						}, tree = config.treeTag || 'ul', treeClass = config.treeClass || 'branch', treeitem = config.treeItemTag || 'li',
			treeitemClass = config.treeItemClass || 'leaf', cur = xmlDoc = null,

		// Function to create initial markup
		createTree = function(dc){
			dc.tree =
							{
							node: $A.createEl(tree),
							childNodes: []
							};

			for (var i = 0; i < dc.xmlNodes.length; i++){
				var n = dc.xmlNodes[i], c = $A.createEl(treeitem), d = $A.createEl('div');
				$A.setAttr(d, 'id', n.attributes.getNamedItem('id').nodeValue);

				if (n.childNodes.length)
					$A.addClass(d, treeClass);

				else
					$A.addClass(d, treeitemClass);
				d.innerHTML = n.attributes.getNamedItem('name').nodeValue;
				$A.setAttr(d, 'aria-label', $A.getText(d));
				c.appendChild(d);
				dc.tree.node.appendChild(c);
				dc.tree.childNodes.push(d);
			}
		},

		// Function to assign ARIA attributes and event handlers
		createARIATree = function(dc, folderClass){
			var folderClass = folderClass || 'folder', parent = dc.tree.node, children = dc.tree.childNodes;

			if (dc.ariaLevel === 1)
				$A.setAttr(parent,
								{
								role: 'tree',
								'aria-label': treeTitle
								});

			else{
				var tid = 'aria' + $A.genId();
				$A.setAttr(parent,
								{
								role: 'group',
								id: tid
								});

				$A.setAttr(cur, 'aria-owns', tid);
			}

			for (var i = 0; i < children.length; i++){
				var l = children[i];
				$A.setAttr(l, 'role', 'treeitem');
				$A.setAttr(l, 'aria-setsize', children.length);
				$A.setAttr(l, 'aria-posinset', i + 1);
				$A.setAttr(l, 'aria-level', dc.ariaLevel);

				if (dc.ariaLevel === 1){
					$A.setAttr(l, 'tabindex', '0');
				}

				else
					$A.setAttr(l, 'tabindex', '-1');

				if ($A.hasClass(l, folderClass))
					$A.setAttr(l, 'aria-expanded', 'false');
				$A.bind(l,
								{
								focus: function(ev){
									if (cur){
										$A.setAttr(cur, 'aria-selected', 'false');
										$A.setAttr(cur, 'tabindex', '-1');
										$A.remClass(cur, 'selected');
										dc.triggerObj = cur;
									}
									cur = this;
									$A.setAttr(cur, 'tabindex', '0');
									$A.setAttr(cur, 'aria-selected', 'true');
									$A.addClass(cur, 'selected');
								},
								click: function(ev){
									if (!$A.hasClass(this, 'selected'))
										$A.trigger(this, 'focus');

									else if ($A.hasClass(this, treeClass) && $A.getAttr(this, 'aria-expanded') == 'false'){
										$A.setAttr(this, 'aria-expanded', 'true');
										$A.reg[this.id].open();
									}

									else if ($A.hasClass(this, treeClass) && $A.getAttr(this, 'aria-expanded') == 'true'){
										$A.setAttr(this, 'aria-expanded', 'false');
										$A.reg[this.id].close();
									}
									ev.preventDefault();
								},
								keypress: function(ev){
									var k = ev.which || ev.keyCode;

									// 13 enter
									if (k == 13){
										$A.trigger(this, 'click');
										ev.preventDefault();
									}
								},
								keydown: function(ev){
									var k = ev.which || ev.keyCode;

									// 35 end, 36 home, 37 left, 38 up, 39 right, 40 down
									if (k >= 35 && k <= 40){
										if (k == 35){
											var pdc = dc;

											while (pdc.parent)
															pdc = pdc.parent;
											var cn = pdc.tree.childNodes;

											while ($A.hasClass(cn[cn.length - 1], treeClass) && $A.getAttr(cn[cn.length - 1], 'aria-expanded') == 'true')
															cn = $A.reg[cn[cn.length - 1].id].tree.childNodes;

											if (cn[cn.length - 1] != this)
												$A.trigger(cn[cn.length - 1], 'focus');
										}

										else if (k == 36){
											var pdc = dc;

											while (pdc.parent)
															pdc = pdc.parent;
											$A.trigger(pdc.tree.childNodes[0], 'focus');
										}

										else if (k == 37){
											if (dc.parent && (($A.hasClass(this, treeClass) && $A.getAttr(this, 'aria-expanded') == 'false')
												|| $A.hasClass(this, treeitemClass))){
												var cn = dc.parent.tree.childNodes, go = null;

												for (var y = 0; y < cn.length; y++){
													if (cn[y].id == dc.id){
														go = cn[y];
														break;
													}
												}

												if (go)
													$A.trigger(go, 'focus');
											}

											else if ($A.hasClass(this, treeClass) && $A.getAttr(this, 'aria-expanded') == 'true'){
												$A.setAttr(this, 'aria-expanded', 'false');
												$A.reg[this.id].close();
											}
										}

										else if (k == 39){
											if ($A.hasClass(this, treeClass) && $A.getAttr(this, 'aria-expanded') == 'true'){
												var n = $A.reg[this.id].tree.childNodes[0];
												$A.trigger(n, 'focus');
											}

											else
												$A.trigger(this, 'click');
										}

										else if (k == 38){
											if (dc.parent && this == children[0]){
												var cn = dc.parent.tree.childNodes, go = null;

												for (var y = 0; y < cn.length; y++){
													if (cn[y].id == dc.id){
														go = cn[y];
														break;
													}
												}

												if (go)
													$A.trigger(go, 'focus');
											}

											else if (this != children[0]){
												var i = $A.inArray(this, children), t = children[i - 1];

												while ($A.hasClass(t, treeClass) && $A.getAttr(t, 'aria-expanded') == 'true'){
													var cn = $A.reg[t.id].tree.childNodes;
													t = cn[cn.length - 1];
												}

												if (t)
													$A.trigger(t, 'focus');
											}
										}

										else if (k == 40){
											if ($A.hasClass(this, treeClass) && $A.getAttr(this, 'aria-expanded') == 'true'){
												var go = $A.reg[this.id].tree.childNodes[0];

												if (go)
													$A.trigger(go, 'focus');
											}

											else{
												var i = $A.inArray(this, children);

												if (i < (children.length - 1))
													$A.trigger(children[i + 1], 'focus');

												else{
													var id = dc.id, pdc = dc.parent, go = null;

													while (pdc){
														var cn = pdc.tree.childNodes;

														for (var g = 0; g < cn.length; g++){
															if (cn[g].id == id && g < (cn.length - 1)){
																go = cn[g + 1];
																break;
															}
														}

														if (go){
															$A.trigger(go, 'focus');
															break;
														}
														id = pdc.id;
														pdc = pdc.parent;
													}
												}
											}
										}
										ev.preventDefault();
									}
								}
								});
			}
		},

		// Function to recursively call after each AccDC Object opens
		runAfter = function(dc){
			createARIATree(dc, treeClass);
			var subTreeObjects = [];

			// Generate an array of AccDC Object declarations, one for every new subfolder node
			for (var i = 0; i < dc.tree.childNodes.length; i++){
				var e = dc.tree.childNodes[i];

				if ($A.hasClass(e, treeClass))
					subTreeObjects.push(
									{
									id: e.id,
									role: $A.getText(e),
									trigger: e,
									bind: 'custom',
									isStatic: e.parentNode,
									append: true,
									runBefore: function(dc){
										dc.xmlNodes = $A.query('*[id=' + dc.id + '] > *', xmlDoc);
										createTree(dc);
										dc.source = dc.tree.node;
									},
									runAfter: runAfter,
									ariaLevel: dc.ariaLevel + 1
									});
				// Add custom bindings using the "handlers" object
				$A.bind(e, handlers.bind, function(ev){
					if (handlers.def && typeof handlers.def === 'function')
						handlers.def.apply(this, [ev, dc]);
				});
			}

// Then register all newly formed AccDC Objects to set recursive functionality
// Parameters : dc = this as the parent AccDC Object, subTreeObjects = array, overrides = method and property overrides for all AccDC Objects being registered
			$A(dc, subTreeObjects, overrides);
		},

		// Property and / or method overrides for every newly registered AccDC Object
		overrides =
						{
						// Don't display beginning and ending boundaries using screen reader accessible hidden text
						showHiddenBounds: false,
						// Allow multiple AccDC Objects to be open at the same time
						allowMultiple: true,
						// Set the AccDC Object className
						className: config.topClass || 'TreeView'
						}, treeId = config.id || $A.genId();

		// Register the initial Tree AccDC Object
		$A(
						[
						{
						id: treeId,
						role: 'TreeView',
						autoStart: true,
						isStatic: insertionPoint,
						allowReopen: true,
						// Set the resource type to AJAX
						mode: 6,
						ajaxOptions:
										{
										url: config.path,
										dataType: 'text'
										},
						hSuccess: function(options, data, textStatus, xhRequest, dc){
							xmlDoc = str2xml(data);
							dc.xmlTop = xmlDoc.documentElement;
							dc.xmlNodes = $A.query(dc.xmlTop.nodeName + ' > *', xmlDoc);
							createTree(dc);
							dc.content = dc.tree.node;
						},
						runAfter: runAfter,
						// Execute script after the AccDC Object opens; only once
						runOnceAfter: function(dc){
							// Manually assign a triggering element
							dc.triggerObj = dc.tree.childNodes[0];
						},
						ariaLevel: 1
						}
						], overrides, true);

		return treeId;
	};

	var str2xml = function(data){
		if (!data)
			data = '';
		var doc;

		if (window.DOMParser){
			var parser = new DOMParser();
			doc = parser.parseFromString(data, "text/xml");
		}

		else{
			doc = new ActiveXObject("Microsoft.XMLDOM");
			doc.async = "false";
			doc.loadXML(data);
		}
		return doc;
	};
})(window);