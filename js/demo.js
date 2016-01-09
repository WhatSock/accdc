/* !
This is the setup script to register all demo related AccDC Object declarations.
This file is only parsed when the Live Demo tab is opened from the left navigation links.
*/

// Configure the AccDC Objects for the demo on the Live Demo tab

// Keyboard Accessible Drag and Drop
// Bind a click handler to the Convert button
$A.bind('input.morphBtn', 'click', function(ev){

	// Configure the Keyboard accessible drag and drop sample by morphing all planet images into draggable AccDC Objects
	$A.query('div.dndContainer ul li > img', function(i, obj){

		// Set the mcDemo AccDC Object as the parent
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