/* !
Google Map AccDC Object Declaration
	*/

// Pass an array of AccDC Object declarations
$A(
				[
				{

				// Unique ID for the AccDC Object
				id: 'map',
				// Role for screen reader accessible hidden text
				role: 'Google Map',
				// Set the insertion point
				isStatic: '#map',
				// Parse external script files after executing internal scripts
				reverseJSOrder: true,
				// Don't allow screen reader users to close the AccDC Object
				showHiddenClose: false,
				// Open the AccDC Object immediately
				autoStart: true,
				// Declare inline styles
				cssObj:
								{
								width: '100%',
								height: '400px'
								},

				// Add an object for supporting properties and methods
				google:
								{
								LatLng:
												{
												lat: 37.77493,
												lng: -122.41942
												},
								options:
												{
												zoom: 0
												},
								init: function(dc){
									dc.google.LatLng.loc = new google.maps.LatLng(dc.google.LatLng.lat, dc.google.LatLng.lng);
									dc.google.loc = dc.google.LatLng.loc;
									dc.google.options.center = dc.google.loc;
									dc.google.options.mapTypeId = google.maps.MapTypeId.SATELLITE;
									dc.google.map = new google.maps.Map(dc.google.container, dc.google.options);
								},
								set: function(lat, lng, zoom){
									// Get a reference to the Google Map AccDC Object
									var dc = $A.reg.map;

									if (lat)
										dc.google.LatLng.lat = lat;

									if (lng)
										dc.google.LatLng.lng = lng;

									if (zoom)
										dc.google.options.zoom = parseInt(zoom);
									dc.google.LatLng.loc = new google.maps.LatLng(dc.google.LatLng.lat, dc.google.LatLng.lng);
									dc.google.loc = dc.google.LatLng.loc;
									dc.google.map.setCenter(dc.google.loc);
									dc.google.map.panTo(dc.google.loc);
									dc.google.map.setZoom(dc.google.options.zoom);
								}
								},

				// Run script before the AccDC Object opens
				runBefore: function(dc){
					// Generate a unique ID
					dc.sourceId = 'gmp' + $A.genId();
					dc.source = $A.createEl('div');
					dc.source.appendChild($A.createEl('div',
									{
									id: dc.sourceId
									}));
				},

				// Run script after the AccDC Object opens
				runAfter: function(dc){
					dc.google.container = $A.getEl(dc.sourceId);
					// Sync inline style height and width values with the AccDC Object
					$A.bind(window, 'resize', function(ev){
						$A.css(dc.google.container,
										{
										width: dc.accDCObj.offsetWidth,
										height: dc.accDCObj.offsetHeight
										});
					});

					$A.trigger(window, 'resize');
					// Create a callback function
					window.setupMap = function(){
						dc.google.init(dc);
					};


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
				},

				// Run external API script after the AccDC Object opens
				runJSAfter: ['http://maps.google.com/maps/api/js?sensor=false&callback=setupMap']
				}

				// Delay processing until the DOM finishes loading
				], null, true);