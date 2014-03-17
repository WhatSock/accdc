/* !
This is the setup script to register all demo related AccDC Object declarations.
This file is only parsed when the Live Demo tab is opened from the left navigation links.
*/

// Configure the AccDC Objects for all of the demos on the Live Demo tab

/* !
IMPORTANT : Note that the first argument for $A() is set to the 'mcDemo' AccDC Object.
mcDemo is the Live Demo AccDC tab control instance previously declared at
http : // whatsock.com / js / ready.js , which is now the top - level parent object for all of the AccDC Object declarations below.
Also within the mcDemo AccDC Object, this.children will now contain an array of all first level child objects declared herein.
With this hierarchy established, AccDC Objects can now traverse up and down the parent / children chain to reference / modify / invoke properties and methods.
E.G. this.parent.parent.parent.close(); will activate the close method three levels up the chain, and close the object.
Similarly, this.children[0].children[0].role = 'Wizard'; will change the role property for the object two levels down the chain.
*/

$A($A.reg.mcDemo,
				[

				// Dynamic Editor with XML Generated Menus
				{
				// Unique ID for the AccDC Object
				id: 'demoEditor',
				// Role for the Screen Reader Accessible Hidden Text
				role: 'Dynamic Editor',
				// Set heading level for screen reader users
				ariaLevel: 3,
				mode: 1,
				source: 'files/demo/editor.html #dynEdit',
				// Event binders
				bind: 'click',
				// CSS Selector to identify triggering elements
				trigger: 'a.editLink',
				// Class name for the AccDC Object
				className: 'demoDynamicEditor',
				// Class name for the Close link
				closeClassName: 'close',
				// Set the initial positioning relative to the triggering element
				autoPosition: 11,
				cssObj:
								{
								position: 'absolute'
								},
				// Move focus to the beginning of the AccDC Object when opened
				forceFocus: true,
				// Set shadowing
				shadow:
								{
								horizontal: '5px',
								vertical: '5px',
								blur: '5px',
								color: '#000000'
								},
				// Run script only once after the AccDC Object is first rendered
				runOnceAfter: function(dc){

					// Create the Tooltip AccDC Object that is displayed whenever a submenu link is activated
					$A(dc,
									[
									{
									id: 'tooltip',
									role: 'Tooltip',
									// Display plain text
									source: 'Disabled',
									// Configure behaviors
									allowReopen: true,
									returnFocus: false,
									showHiddenClose: false,
									className: 'announceMsg',
// Automatically position the tooltip AccDC Object to the right of the triggering element (allows for position : relative offset differences)
									autoPosition: 3,
									// Set inline styling
									cssObj:
													{
													position: 'relative'
													},
									// Add an additional px offset to increase padding between objects
									offsetLeft: 10,
									runBefore: function(dc){

										// Add a negative height offset to account for position : relative
										dc.offsetTop = -dc.triggerObj.offsetHeight;
									},
									runAfter: function(dc){

										// Announce the text within the containerDiv property for screen reader users
										$A.announce(dc.containerDiv);
									},
									// Automatically close when the timeout value in milliseconds is reached
									timeoutVal: 2000,
									timeout: function(dc){

										// Close the tooltip object after 2 seconds
										dc.close();
									}
									}
									]);
				},
				// Run script every time after the Editor AccDC Object is rendered
				runAfter: function(dc){

					var $textarea = $A.query('textarea.editor')[0], section = $A.query('div.dynContent')[0];
					// Populate content
					$textarea.value = section.innerText || section.textContent;

					// Add auto expand functionality to the textarea tag
					elastic($textarea, 300);

					// Create a nested AccDC Object to render horizontal Menu Bar menus
					$A(dc,
									[
									{
									id: 'demoMenuBar',
									role: 'Menu Bar',
									ariaLevel: 4,
									isStatic: 'div.dynEditorTop',
									autoStart: true,
									returnFocus: false,
									showHiddenClose: false,
									mode: 6,
									className: 'demoMenuBarDiv',
									// Configure AJAX options
									ajaxOptions:
													{
													url: 'files/demo/menubar.xml',
													// Set the dataType to text to allow local script execution
													dataType: 'text'
													},
									// Execute handler when the AJAX request fires the success callback
									hSuccess: function(options, data, textStatus, xhRequest, dc){

										// Convert the returned text to an XML document for local parsing
										dc.xmlDoc = str2xml(data);

										// set the start string for the content property
										dc.content = '<div class="demoMenuBar clearfix">';

										// Add Menu Bar menu links as parsed from the XML DOM and append them to the content property
										$A.query('menubar > *', dc.xmlDoc, function(){
											dc.content += '<div><a class="demoMenu-' + this.nodeName + '">'
												+ this.attributes.getNamedItem('text').value + '</a></div>';
										});
										dc.content += '</div>';
									},
									// Run script after the horizontal Menu Bar links have been rendered
									runAfter: function(dc){

										// Create an array to hold the AccDC Object declarations for each horizontal Menu Bar menu
										var menuObjects = [];
										$A.query('menubar > *', dc.xmlDoc, function(i){
											// Expand the object array for each submenu
											menuObjects.push(
															{
															id: 'demoMenu' + i,
															role: this.attributes.getNamedItem('text').value,
															source: this.childNodes[0].nodeValue,
															trigger: 'a.demoMenu-' + this.nodeName
															});
										});

										// Create a key / value map to be merged with all of the objects in the prior array
										var overrides =
														{
														ariaLevel: 5,
														// Enable tab functionality
														isTab: true,
														// Set screen reader role text
														tabRole: 'Menu',
														// Set screen reader state text
														tabState: 'Open',
														bind: 'click focus',
														// Automatically position the dropdown menu AccDC Object beneath the triggering element
														autoPosition: 5,
														// Add an additional px offset to increase padding between objects
														offsetTop: 5,
														// Set the offset type
														cssObj:
																		{
																		position: 'relative'
																		},
														className: 'demoSubMenus',
														// Run script before the dropdown menu AccDC Object is opened
														runBefore: function(dc){

// Dynamically subtract the top offset to account for the height of the triggering element, plus 5px for padding
															dc.offsetTop = -dc.triggerObj.offsetHeight + 5;
														},
														// Run script after the dropdown menu AccDC Object is opened
														runAfter: function(dc){

															// Add a click handler to every submenu link when rendered
															$A.bind('#' + dc.containerId + ' a', 'click', function(ev){
																// Configure and open the AccDC Object with id = "tooltip"
																var ndc = $A.reg.tooltip;
																// Set the triggerObj property
																ndc.triggerObj = this;
																// Open the AccDC Object
																ndc.open();
																ev.preventDefault();
															});

															// Change inline styling for the triggering element
															$A.css(dc.triggerObj,
																			{
																			color: '#ffffff',
																			backgroundColor: '#3A5FCD'
																			});
														},
														// Run script after the AccDC Object for a horizontal Menu Bar menu link is closed
														runAfterClose: function(dc){

															// Change inline styling for the triggering element
															$A.css(dc.triggerObj,
																			{
																			color: '#000000',
																			backgroundColor: '#ffffff'
																			});
														},
														mouseOut: function(ev, dc){

															// Close the currently open menu when the mouse moves out
															dc.close();
														}
														};

										// Invoke $A to register all AccDC Objects configured above
										$A(dc, menuObjects, overrides);

										// Change inline styling for the triggering element
										$A.css(dc.triggerObj,
														{
														color: '#ffffff',
														backgroundColor: '#3A5FCD'
														});
									},
									// Run script after the horizontal Menu Bar menu links are closed
									runAfterClose: function(dc){
										$A.css(dc.triggerObj,
														{
														color: '#000000',
														backgroundColor: '#ffffff'
														});
									}
									}
									// End of nested menus object array
									]);
				},
				// Run script before the AccDC Object is closed
				runBeforeClose: function(dc){

					// Add the modified text to the container object within the main page
					var container = $A.query('.dynContent')[0];
					container.innerHTML = '';
					container.appendChild(document.createTextNode($A.query('textarea.editor', dc.containerDiv)[0].value.replace(/<|>/g,
						'')));
				}
				}

				// End of AccDC Object array
				],
				{
				// Merge the following key / value with all objects declared in the prior array
				allowMultiple: true
				});

// Keyboard Accessible Drag and Drop
// Bind a click handler to the Convert button
$A.bind('input.morphBtn', 'click', function(ev){

	// Configure the Keyboard accessible drag and drop sample by morphing all planet images into draggable AccDC Objects
	$A.query('div.dndContainer ul li > img', function(i, obj){

		// Also, similar to the first $A declaration above, set the mcDemo AccDC Object as the parent
		$A.morph($A.reg.mcDemo, obj,
						{
						// Dynamically generate a unique ID
						id: 'list' + i,
						// Use the alt attribute value of the image to set the role (to be used later for keyboard accessibility)
						role: $A.getAttr(obj, 'alt'),
						// Prevent hidden boundary information from being displayed to screen reader users
						showHiddenBounds: false,
						// Prevent the object from being closable from the keyboard.
						showHiddenClose: false,
						// Set initial visual styling
						cssObj:
										{
										position: 'absolute',
										zIndex: 3
										},
						// Make the object draggable
						isDraggable: true,
						// Set temporary variables for tracking
						inUniverse: true,
						dropped: false,
						// Store object to prevent same - side drop triggering
						currentZone: null,
						// Run script after rendering completes
						runAfter: function(dc){

							// Set additional styling for the drag links to allow for color contrast differences
							dc.accDD.dragLinkStyle =
											{
											color: 'white',
											backgroundColor: 'black',
											border: 'solid thin white'
											};

							// CSS to reset positioning
							dc.clearCSS =
											{
											zIndex: 3,
											top: '',
											left: '',
											height: '',
											width: ''
											};

							// Save references to the relevant list objects to prevent unnecessary queries later
							var lists = $A.query('div.dndContainer ul, div.dndContainer ol');

							// Set initial drag and drop options
							dc.dropTarget = 'div.subDivR';
							// Limit dragging to the bounds of a specific container
							dc.drag.confineTo = 'div.dndContainer';
							// Enable keyboard accessibility for the drag and drop action
							dc.accDD.on = true;
							// Set the drop animation duration in milliseconds
							dc.accDD.duration = 3000;
							// Set a point to return keyboard focus to after dragging has begun to ensure keyboard accessibility
							dc.accDD.returnFocusTo = 'div.subDivL ul';

							// Configure the drag / drop event handlers

							dc.onDragStart = function(ev, dd, dc){
								dc.css('z-index', 4);
								dc.originalXY =
												{
												top: dd.originalY,
												left: dd.originalX
												};
							};

							dc.onDrop = function(ev, dd, dc){
								if (dc.currentZone != this){
									dc.currentZone = this;
									dc.dropped = true;
									var tmp = dc.dropTarget;
									// Remove old drag and drop bindings
									dc.unsetDrag();
									// Clear drag styling
									dc.css(dc.clearCSS);

									if (dc.inUniverse){
										dc.inUniverse = false;
										dc.dropTarget = 'div.subDivL';
										dc.accDD.returnFocusTo = 'div.subDivR ol';
										// Move the dragged element into the galaxy list
										lists[1].appendChild(dc.accDCObj.parentNode);
									}

									else{
										dc.inUniverse = true;
										dc.dropTarget = 'div.subDivR';
										dc.accDD.returnFocusTo = 'div.subDivL ul';
										// Move the dragged element into the Universe list
										lists[0].appendChild(dc.accDCObj.parentNode);
									}
									// Now set drag and drop bindings with the newly configured options
									dc.setDrag();
								}
							};

							dc.onDragEnd = function(ev, dd, dc){
								// Check if a valid drop has occurred, and move back to the starting point if not
								if (!dc.dropped)
									dropIntoTheSun(dc);

								dc.dropped = false;
							};

							// Now set initial event bindings
							dc.setDrag();

							// Expand parent li tag to account for position absolute
							$A.css(dc.accDCObj.parentNode,
											{
											height: dc.accDCObj.offsetHeight,
											width: dc.accDCObj.offsetWidth
											});

							dc.accDCObj.parentNode.appendChild($A.createEl('div', null,
											{
											clear: 'both'
											}, null, document.createTextNode(' ')));
						}
						});
	});

	// Make the sun a draggable AccDC Object as well
	var sunImg = $A.query('div.dndContainer img.sun')[0];
	$A.morph($A.reg.mcDemo, sunImg,
					{
					id: 'sun',
					role: 'Sun',
					showHiddenBounds: false,
					showHiddenClose: false,
					isDraggable: true,
					drag:
									{
									confineTo: 'div.dndContainer'
									},
					cssObj:
									{
									position: 'absolute',
									// Copy the current coordinates for the image
									left: xOffset(sunImg).left,
									top: xOffset(sunImg).top,
									// Set the depth
									zIndex: 2
									}
					});

	// Change the status message and announce it to screen reader users
	$A.announce($A.getEl('morphI').innerHTML = 'Converted all images into draggable AccDC Objects');

	ev.preventDefault();
});

function dropIntoTheSun(dc){
	var sun = firstChild($A.reg.sun.containerDiv, 'img'), planet = firstChild(dc.containerDiv, 'img'),
		additional = sun.offsetHeight / 2, sunOS = xOffset(sun);
	// Move planet to the sun
	transition(dc.accDCObj,
					{
					top: sunOS.top + additional,
					left: sunOS.left + additional
					},
					{
					duration: 3000,
					complete: function(cb){
						// Fall into the sun
						transition(dc.accDCObj,
										{
										height: 0,
										width: 0,
										transform: 360
										},
										{
										duration: 2000,
										step: function(cb){
											// cb contains cb.top and cb.left to match the wrapper, so sync the image to this at runtime
											$A.css(planet, cb);
										},
										complete: function(cb){
											// Stick the planet behind the sun and resize it, including both the wrapper and the image
											$A.css(
															[
															dc.accDCObj,
															planet
															],
															{
															zIndex: 1,
															height: '20px',
															width: '20px'
															});

											// Move the planet back to its original position
											transition(dc.accDCObj, dc.originalXY,
															{
															duration: 3000,
															complete: function(cb){
																// Bring the planet to the front once again
																$A.css(dc.accDCObj, 'z-index', 4);
																// Zoom the planet back into focus
																transition(dc.accDCObj,
																				{
																				height: 75,
																				width: 75,
																				transform: 0
																				},
																				{
																				duration: 2000,
																				step: function(cb){
																					$A.css(planet, cb);
																				},
																				complete: function(cb){
																					// Now clear css !
																					dc.css(dc.clearCSS);
																				}
																				});
															}
															});
										}
										});
					}
					});
}