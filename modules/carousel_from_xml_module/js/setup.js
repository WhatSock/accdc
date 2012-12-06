
(function(){
	// $A.fn.debug = true;

	$A.bind(window, 'load', function(){

		// Set the Rotating Carousel and set the default position to group 1 slide 1
		$A.setCarousel($A.getEl('carouselId'), 'files/carousel.xml', '0,0');

		// Set the Static Slideshow and set the default slide to 1
		$A.setCarousel($A.getEl('slideshowId'), 'files/movies.xml', 0);

		// Now set up the wizard functionality
		$A(
						[

						// Wizard AccDC Object
						{
						id: 'wiz',
						role: 'Wizard',
						trigger: '#wizardId',
						bind: 'click',
						className: 'wizardCls',
						sraStart: '',
						sraEnd: '',
						cssObj:
										{
										position: 'fixed',
										zIndex: 2
										},
						autoFix: 6,
						runJSOnceAfter: ['js/answers.js'],
						runBefore: function(dc){
							var s = $A.reg.status;
							s.triggerObj = dc.triggerObj;
							s.open();
						},
						runDuring: function(dc){
							$A.setAttr(dc.containerDiv,
											{
											role: 'dialog',
											'aria-label': dc.role
											});
						},
						runAfter: function(dc){
							var form = init = null, track = {};

							$A.setCarousel(dc.containerDiv, 'files/wizard.xml', 0,
											{

											// Run after a new slide finishes loading
											complete: function(cdc){
												if (!init){
													dc.cdc = cdc.parent;
													$A.reg.status.close();
												}

												else
													init = true;
												// Get the current form object
												form = $A.query('form', cdc.containerDiv)[0];

												// Disable or enable the Prev button
												if (parseInt(form.step.value) === 1)
													$A.setAttr(cdc.parent.btn.P, 'disabled', 'disabled');

												else
													$A.remAttr(cdc.parent.btn.P, 'disabled');
												// Store and set focus to the first form field
												dc.fField = $A.query('input.question', form)[0];
												$A.bind(dc.fField, 'focus', function(){
													dc.lElement = this;
												});
												dc.fField.focus();
												// Set handlers to dynamically update the last question on step 4
												$A.bind('#q8-1, #q8-2', 'change', function(){
													$A.getEl('q9l').innerHTML = 'Why ' + this.value + '?';
												});
												$A.bind('#' + form.id, 'submit', function(ev){
													ev.preventDefault();
												});
												$A.bind('#' + form.id + ' input[type=text]', 'keypress', function(ev){
													var k = ev.which || ev.keyCode;

													if (k == 13){
														ev.preventDefault();
													}
												});

												// Load previously saved values
												for (var i = 0; i < form.elements.length; i++){
													var el = form.elements[i];

													if (!form[el.name].type && form[el.name].length){
														if (el.value == track[el.name])
															$A.setAttr(el, 'checked', 'checked');
													}

													else if (el.type == 'text' && track[el.name])
														el.value = track[el.name];
												}
											},

											// Run before the Next button is activated
											btnNext: function(ev, cdc){
												var vals = {};

												for (var i = 0; i < form.elements.length; i++){
													var el = form.elements[i];

													// Do some cursory data validation and store value if found
													if (((el.type == 'text' || el.type == 'hidden') && el.value) || (el.type == 'radio'
														&& $A.query('input[name="' + el.name + '"][value="' + el.value + '"]:checked', form).length))
														vals[el.name] = el.value;

													else if (!vals[el.name])
														vals[el.name] = null;
												}

												for (n in vals){
													if (vals[n] === null){
														alert('Woops! You forgot to answer the question: ' + $A.getEl(n + 'l').innerHTML);

														if (!form[n].type && form[n].length)
															form[n][0].focus();

														else
															form[n].focus();

														return false;
													}

													else
														track[n] = vals[n];
												}

												if (parseInt(form.step.value) === 4){
													dc.close();
													parseAnswers(track);
												}
											}
											});
						},
						tabOut: function(ev, dc){
							if (dc.cdc.btn.P.disabled)
								dc.fField.focus();

							else
								dc.cdc.btn.P.focus();
						},
						keyPress: function(ev, dc){
							var k = ev.which || ev.keyCode;

							if (k == 27)
								dc.close();
						},
						runBeforeClose: function(dc){
							dc.cdc.close();
						}
						},

						// Tooltip AccDC Object
						{
						id: 'status',
						role: 'Tooltip',
						showHiddenClose: false,
						cssObj:
										{
										position: 'absolute',
										zIndex: 1,
										backgroundColor: '#000',
										color: '#fff'
										},
						autoPosition: 3,
						source: 'Loading, please wait.',
						offsetLeft: 10,
						runAfter: function(dc){
							$A.announce(dc.source);
						}
						}
						],
						{
						allowMultiple: true
						});
	});
}
)();