/* !
Setup script to register all top - level AccDC Object declarations.
Copyright 2010-2013 Bryan Garaventa (WhatSock.com)
Part of AccDC, a Cross-Browser JavaScript accessibility API, distributed under the terms of the Open Source Initiative OSI - MIT License
*/

// Enable AccDC API debugging mode.
// When set to true, an alert will appear when required properties are missing or when rendering issues break the shell structure of AccDC Objects.
// When set to false, no alerts will appear. (default)
$A.fn.debug = true;

// Add conditionally displayed AccDC Objects

/* !
IMPORTANT : Note that the first argument of $A is an array of AccDC Object declarations.
If an instance of an AccDC object is passed as the first argument instead (see other declarations below), the "children" and "parent" properties will be populated with relevant instances. E.G.
dc.children = An array of AccDC Objects
dc.parent = the parent AccDC Object instance
(Both are null by default if omitted)
As implemented below, "dc" refers to the current AccDC Object instance, and is synonymous with "this"
so that dc.parent is the same as this.parent.
If no parent AccDC Object is specified, such as $A( [ {id : 'AccDCObj'} ] ) where the first argument is an array of object declarations,
all such AccDC Objects will be registered as top - level objects with this.parent set to null.
*/

// Create AccDC Dynamic Content Object declarations for all AccDC Tab Controls
$A(
				[

				// Overview tab
				{
				id: 'mcOverview',
				role: 'Overview',
				trigger: '#tab1',
				source: 'files/left_tabs/mcOverview.html #mcOverview',
				autoStart: true,
				forceFocus: false,
				// Run script only once before the Overview tab is first opened
				runOnceBefore: function(dc){
					$A.bind('a[role=button]', 'click', function(ev){
						$A.query('a[aria-pressed=true]', function(){
							$A.setAttr(this, 'aria-pressed', 'false');
						});
						$A.setAttr(this, 'aria-pressed', 'true');
					});

					$A.setAttr(dc.triggerObj, 'aria-pressed', 'true');

					// Setup Back To Top link functionality
					$A.bind('div.topLink a', 'click', function(ev){
						$A.setFocus($A.query('h1')[0]);
						ev.preventDefault();
					});
				},
				runAfter: function(dc){

					createHeaderNav();

					// Use the query selector to assign additional events
					$A.query('a.subLnk', function(){
						// Enable keyboard functionality
						$A.setAttr(this, 'href', '#');
						$A.bind(this, 'click', function(ev){
							var txt = this.innerText || this.textContent;
							// Trigger the equivalent tab when clicked
							$A.trigger('ul.menuList a:contains(' + txt + ')', 'click');
							ev.preventDefault();
						});
					});

					// Start carousel if CSS is enabled
					if (isCSSEnabled())
						setCarousel($A.getEl('slideCanvas'), 'files/carousel.xml', 0);

					// Announce "Ready" to screen reader users
					"Ready".announce();

					if (!dc.forceFocus)
						dc.forceFocus = true;
				},
				runBeforeClose: function(dc){

					// Cancel the carousel
					if ($A.reg.slideCanvas)
						$A.reg.slideCanvas.close();
				}
				},

				// Automatic Accessibility Framework tab
				{
				id: 'mcAccessibility',
				role: 'Automatic Accessibility',
				trigger: '#tab2',
				source: 'files/left_tabs/mcAccessibility.html #mcAccessibility',
				runAfter: function(dc){

					createHeaderNav();
					"Ready".announce();
				}
				},

				// Live Demo tab
				{
				id: 'mcDemo',
				role: 'Live Demo',
				trigger: '#tab3',
				source: 'files/left_tabs/mcDemo.html #mcDemo',
				// Run external script after the object has been rendered
				runJSAfter: [
				// Import script to enable Live Demo functionality
				'js/demo.js'],
				// Run script after the object has been rendered
				runAfter: function(dc){
					createHeaderNav();

					// Asynchronously load the background image for the drag / drop section
					$A.css($A.query('div.dndContainer')[0], 'background', 'url("img/planets/stars.jpg") black repeat');

					"Ready".announce();
				}
				},

				// Core API tab
				{
				id: 'mcCore',
				role: 'Core API',
				trigger: '#tab4',
				// Set Mode to render literal HTML
				mode: 0,
				// Start with an empty container object
				source: '',
				// Run internal script after the object is rendered
				runAfter: function(dc){

					// Save a reference to the current dc object
					var dcp = dc;

					// Add an object to hold key / value pairs
					dc.core =
									{
									s1: 'coreS1',
									s2: 'coreS2',
									s3: 'coreS3',
									s4: 'coreS4',
									s5: 'coreS5',
									s6: 'coreS6',
									s7: 'coreS7',
									s8: 'coreS8',
									s9: 'coreS9'
									};

					// Create an array to hold a series of AccDC Objects
					var AccDC_Sections = [];

					// Loop through the "core" object and add section containers
					for (i in dc.core){
						var d = $A.createEl('div',
										{
										id: dc.core[i]
										});

						dc.containerDiv.appendChild(d);
						AccDC_Sections.push(
										{
										// Set the ID to match the ID attribute of the container object
										id: dc.core[i],
										// Set the Target Zone as the dynamically created container object
										isStatic: '#' + dc.core[i],
										// Set the source as content from the related external file
										source: 'files/core/' + i + '.htm div.apiDocumentationContentSection'
										});
					// End of the "core" object loop
					}

					// Add an internal runAfter function to the last AccDC Object declared in the "core" object loop
					AccDC_Sections[AccDC_Sections.length - 1].runAfter = function(dc){
						var links = {};

						$A.query('dt.heading a', function(){
							var a = this;
							a.id = 'subH' + $A.genId();
							links[a.id] = false;
							$A.bind(a, 'click', function(ev){
								if (links[this.id]){
									links[this.id] = false;
									$A.addClass($A.query('dd.detail', getClosest(this, 'dl'))[0], 'hidden');
									$A.query('small', this, function(){
										this.innerHTML = '&#9660;';
									});
									$A.setAttr(this, 'aria-pressed', 'false');
								}

								else{
									links[this.id] = true;
									$A.remClass($A.query('dd.detail', getClosest(this, 'dl'))[0], 'hidden');
									$A.query('small', this, function(){
										this.innerHTML = '&#9650;';
									});
									$A.setAttr(this, 'aria-pressed', 'true');
								}
								// For AT users, set focus back to the triggering element
								this.focus();
								ev.preventDefault();
							});
						});

						$A.bind('#ph2 > a.expand', 'click', function(ev){
							"Please wait".announce();
							$A.query('dd.detail', function(j, p){
								$A.remClass(p, 'hidden');
								$A.query('a.toggle', p.parentNode, function(){
									$A.setAttr(this, 'aria-pressed', 'true');
								});
							});
							// Refocus to the triggering element
							this.focus();

							for (link in links)
											links[link] = true;
							$A.query('dt.heading a small', function(){
								this.innerHTML = '&#9650;';
							});
							"Expanded".announce();
							ev.preventDefault();
						});

						$A.bind('#ph2 > a.collapse', 'click', function(ev){
							"Please wait".announce();
							$A.query('dd.detail', function(j, p){
								$A.addClass(p, 'hidden');
								$A.query('a.toggle', p.parentNode, function(){
									$A.setAttr(this, 'aria-pressed', 'false');
								});
							});
							// Refocus to the triggering element
							this.focus();

							for (link in links)
											links[link] = false;
							$A.query('dt.heading a small', function(){
								this.innerHTML = '&#9660;';
							});
							"Collapsed".announce();
							ev.preventDefault();
						});

						createHeaderNav();
						"Ready".announce();

					// End of internal runAfter function added to the last object declared in the "core" object loop
					};

					// Declare a key / value map to be merged with all AccDC Objects in the AccDC_Sections array
					var overrides =
									{
									autoStart: true,
									role: 'Core API Section',
									mode: 1,
									showHiddenClose: false,
									showHiddenBounds: false,
									allowMultiple: true,
									triggerObj: dc.triggerObj
									};

// Register all previously declared AccDC Objects, merge overrides, skip execution delay, and disable Async processing to preserve order
					$A(dc, AccDC_Sections, overrides, null, true);
				}
				},

				// Contact Us tab
				{
				id: 'mcContact',
				role: 'Contact Us',
				trigger: '#tab5',
				source: 'files/left_tabs/mcContact.html #mcContact',
				runOnceAfter: function(dc){

					$A(dc,
									[
									{
									id: 'cuStatus',
									role: 'Status',
									showHiddenClose: false,
									returnFocus: false,
									allowReopen: true,
									isStatic: '#contactUsFrm',
									prepend: true,
									autoFix: 9,
									cssObj:
													{
													width: '70%',
													zIndex: 100,
													position: 'fixed'
													},
									className: 'cuStatus',
									runAfter: function(dc){
										$A.getEl('okBtn').focus();
										$A.bind('#okBtn', 'click', function(ev){
											var lis = $A.query('#sMsg ol li');

											if (lis.length)
												$A.getEl('contactUsFrm')[lis[0].innerText || lis[0].textContent].focus();
											dc.close();
											ev.preventDefault();
										});
										$A.announce($A.getEl('sMsg'));
									}
									}
									]);
				},
				runJSAfter: ['js/country_select.js'],
				runAfter: function(dc){

					createHeaderNav();

					// Make the textarea automatically expandable
					elastic($A.getEl('cufm2'));

					$A.bind('#' + dc.containerId + ' form', 'submit', function(ev){
						ev.preventDefault();
						// Check for missing fields
						var errList = [];
						$A.query('.required', this, function(){
							if (!this.value)
								errList.push(escape(this.name));
						});

						if (errList.length){
							var status = $A.reg.cuStatus;
							status.source = '<div id="sMsg" class="cRed">Error: Missing Required Fields<br /><ol class="liFl"><li>'
								+ errList.join('</li><li>') + '</li></ol></div><div><button id="okBtn" class="fr">OK</button></div>';
							status.open();
						}

						else
							$A.getScript('http://whatsock.com/mail/submit.php?' + serialize(this));
					});

					"Ready".announce();
				}
				},

				// About tab
				{
				id: 'mcAbout',
				role: 'About Us',
				trigger: '#tab6',
				source: 'files/policy_tabs/mcAbout.html #mcAbout',
				runAfter: function(dc){
					createHeaderNav();
					"Ready".announce();
				}
				},

				// Legal tab
				{
				id: 'mcLegal',
				role: 'Legal-FTC Guides Disclosures',
				trigger: '#tab7',
				source: 'files/policy_tabs/mcLegal.html #mcLegal',
				runAfter: function(dc){

					createHeaderNav();
					"Ready".announce();
				}
				},

				// Terms tab
				{
				id: 'mcTerms',
				role: 'Terms of Use',
				trigger: '#tab8',
				source: 'files/policy_tabs/mcTerms.html #mcTerms',
				runAfter: function(dc){

					createHeaderNav();
					"Ready".announce();
				}
				},

				// Privacy tab
				{
				id: 'mcPrivacy',
				role: 'Privacy Policy',
				trigger: '#tab9',
				source: 'files/policy_tabs/mcPrivacy.html #mcPrivacy',
				runAfter: function(dc){

					createHeaderNav();
					"Ready".announce();
				}
				}
				],
				// Declare all key / value map overrides to be merged with each AccDC Tab Control in the prior array
				{
				bind: 'click',
				isStatic: '#mContent',
				isTab: true,
				// Clear default text for tab role and state properties in favor of ARIA button attributes
				tabRole: '',
				tabState: '',
				mode: 1,
				showHiddenClose: false,
				// showHiddenBounds : false,
				// Move focus to the beginning of the new content when rendered
				forceFocus: true,
				runBefore: function(dc){

					// Check if other tabs are loading and cancel current if so
					for (var i = 0; i < dc.siblings.length; i++){
						if (dc.siblings[i].loading)
							return dc.cancel = true;
					}

					"Please wait".announce();

					// Switch classes
					$A.remClass($A.query('li.active, li.policy.active'), 'active');
					$A.addClass(dc.triggerObj.parentNode, 'active');
				}
				}, true);

// Check for updates
$A.getScript('http://whatsock.com/js/updates.js');