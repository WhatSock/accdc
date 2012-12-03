/* !
This is the setup script to register all demo related AccDC Object declarations.
This file is only parsed when the Live Demo tab is opened from the left navigation links.
View http : // whatsock.com / js / ready.js to see how external scripts are dynamically parsed at runtime.
Copyright 2010-2012 Bryan Garaventa (WhatSock.com)
Part of AccDC, a Cross-Browser JavaScript accessibility API, distributed under the terms of the GNU LGPL
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
												+ this.attributes.getNamedItem('text').nodeValue + '</a></div>';
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
															role: this.attributes.getNamedItem('text').nodeValue,
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
				},

				// Keyboard Accessible Google Maps
				{
				id: 'demoGoogleMap',
				role: 'Map',
				// Set heading level for screen reader users
				ariaLevel: 3,
				// CSS Selector to designate a container object as the target zone
				isStatic: 'div.demoGoogleMap',
				autoStart: true,
				// Switch the execution order so that the external API callback will be called after the configuration process
				reverseJSOrder: true,
				// Do not include a hidden Close link for screen reader users
				showHiddenClose: false,
				cssObj:
								{
								width: '100%',
								height: '460px'
								},
				// Create a custom namespace to handle all map related functionality
				google:
								{
								LatLng:
												{
												us_sf:
																{
																lat: 37.7793,
																lng: -122.4192
																},
												us_ny:
																{
																lat: 43,
																lng: -75
																},
												uk_lo:
																{
																lat: 51.50806,
																lng: -0.12472
																},
												pt_li:
																{
																lat: 38.7138111,
																lng: -9.1393861
																},
												it_ro:
																{
																lat: 41.9,
																lng: 12.5
																}
												},
								options:
												{
												zoom: 10
												},
								getMapTypeId: function(id){
									switch (id){
										case google.maps.MapTypeId.ROADMAP: return 'ROADMAP';

										case google.maps.MapTypeId.SATELLITE: return 'SATELLITE';

										case google.maps.MapTypeId.HYBRID: return 'HYBRID';

										case google.maps.MapTypeId.TERRAIN: return 'TERRAIN';
									}
								},
								init: function(dc){
									dc.google.loc = dc.google.LatLng.us_sf.loc;
									dc.google.options.center = dc.google.loc;
									dc.google.options.mapTypeId = google.maps.MapTypeId.HYBRID;
									dc.google.map = new google.maps.Map(dc.google.container, dc.google.options);

									google.maps.event.addListener(dc.google.map, 'zoom_changed', function(){
									// Map to GEOCoding API
									});
									google.maps.event.addListener(dc.google.map, 'maptypeid_changed', function(){
									// Map to GEOCoding API
									});
								}
								},
				// Run script before the AccDC Object is rendered
				runBefore: function(dc){

					// Create and save a dynamic ID attribute value
					dc.sourceId = 'gmp' + $A.genId();
					dc.source = $A.createEl('div');
					dc.source.appendChild($A.createEl('div',
									{
									id: dc.sourceId
									}));
				},
				runAfter: function(dc){
					dc.google.container = $A.getEl(dc.sourceId);
					$A.css(dc.google.container,
									{
									width: dc.accDCObj.offsetWidth,
									height: dc.accDCObj.offsetHeight
									});

					// Set locale LatLng and click handlers
					window.setupMap = function(){
						$A.query('ul.demoGMT a', function(){
							var id = this.id;
							dc.google.LatLng[id].loc = new google.maps.LatLng(dc.google.LatLng[id].lat, dc.google.LatLng[id].lng);
							$A.bind(this, 'click', function(ev){
								dc.google.loc = dc.google.LatLng[this.id].loc;
								dc.google.map.setCenter(dc.google.loc);
								dc.google.map.panTo(dc.google.loc);
								dc.google.map.setZoom(dc.google.options.zoom);
								ev.preventDefault();
							});
						});
						dc.google.init(dc);
						$A.trigger('#us_sf', 'click');

						// Enable keyboard accessibility for map controls
						setTimeout(function(){
							$A.query(
								'div[title="Show street map"], div[title="Show street map with terrain"], div[title="Show satellite imagery"], div[title="Zoom in to show 45 degree view"], div[title="Show imagery with street names"], div[title="Pan up"], div[title="Pan down"], div[title="Pan left"], div[title="Pan right"], div[title="Return to the last result"], div[title="Zoom in"], div[title="Zoom out"], img[title="Rotate map 90 degrees"]',
								dc.containerDiv, function(i, o){
								$A.setAttr(o,
												{
												role: 'button',
												tabindex: '0',
												'aria-label': o.title
												});

								$A.bind(o, 'keydown', function(ev){
									if (ev.which == 13){
										ev.preventDefault();
										$A.trigger(o, 'click');
									}
								});
							});
						}, 3000);
					};
				},
				runJSAfter: [

				// Now that all functions have been previously configured, load the Google Maps API using the specified callback
				'http://maps.google.com/maps/api/js?sensor=false&callback=setupMap']
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

							// Set initial drag and drop options
							dc.dropTarget = 'div.subDivR';
							// Limit dragging to the bounds of a specific container
							dc.drag.confineTo = 'div.dndContainer';

							// Enable keyboard accessibility for the drag and drop action
							dc.accDD.on = true;
							// Optionally set the element where keyboard accessible drop links will appear in the DOM
							dc.accDD.dropAnchor = 'div.dndContainer ol';

							// Set the drop animation duration in milliseconds
							dc.accDD.duration = 3000;
							// Now set initial event bindings
							dc.setDrag();
							// Set additional styling for the drag / drop links to allow for color contrast differences
							dc.accDD.dragLinkStyle = dc.accDD.dropLinkStyle =
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
										dc.dropTarget = 'div.subDivL';
										dc.inUniverse = false;
										dc.accDD.dropAnchor = 'div.dndContainer ul';
										// Move the dragged element into the galaxy list
										lists[1].appendChild(dc.accDCObj.parentNode);
									}

									else{
										dc.dropTarget = 'div.subDivR';
										dc.inUniverse = true;
										dc.accDD.dropAnchor = 'div.dndContainer ol';
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
											$A.css([dc.accDCObj, planet],
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