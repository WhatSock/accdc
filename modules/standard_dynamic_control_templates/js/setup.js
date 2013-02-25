$A.bind(window, 'load', function(){

	// Modal AccDC Object

	var modalId = $A.setModal(
					{
					// Set a role for screen reader users
					role: 'Login',
					// Set a triggering element
					trigger: 'button.lightbox',
					source: 'files/overlays.html #lightbox1',
					// Run configuration script after the AccDC Object finishes loading
					runAfter: function(dc){

						// Configure form functionality

						$A.bind('#lbForm', 'submit', function(ev){
							if (!this.uname.value){
								alert('Woops! You forgot your username...');
								this.uname.focus();
							}

							else if (!this.pass.value){
								alert('Woops! You forgot your password...');
								this.pass.focus();
							}

							else{
								alert('WOW!');
								dc.close();
							}
							ev.preventDefault();
						});

						// Add a background div for the filtered opasity
						dc.backdrop = $A.createEl('div', null, null, 'modalBackdrop', document.createTextNode(' '));
						dc.accDCObj.parentNode.insertBefore(dc.backdrop, dc.accDCObj);
					},
					runAfterClose: function(dc){
						if (dc.backdrop)
							dc.backdrop.parentNode.removeChild(dc.backdrop);
					}
					});

	// Set a banner to be loaded, and save a public reference to the ID

	window.bannerId = $A.setBanner(
					{

					// Specify the path and ID of the banner content to be loaded
					source: 'files/overlays.html #ad-1',

					// Disable automatic positioning
					autoFix: 0,

					// Specify that the banner should open as soon as the page loads
					autoStart: true,

					// Set a class name for the banner top level container element
					className: 'banner',

// Specify that the textual content of the banner should automatically be announced to screen reader users when opened
					announce: true,

					// Choose the container element where the banner will be inserted
					isStatic: 'body',
					// Choose to prepend the banner instead of replacing the content within the container element
					prepend: true,

					// Set a hidden close link to appear for screen reader users
					showHiddenClose: true,
					// Remove the hidden close link from the tab order so it doesn't appear when tabbing
					displayHiddenClose: false,

					// Run a script after the banner finishes loading
					runAfter: function(dc){

						// Set a submit handler on the form within the banner
						$A.bind('div.banner form', 'submit', function(ev){

							// Prevent the page from refreshing
							ev.preventDefault();

							// Get a reference to the email edit field, and check for an entry
							var email = $A.getEl('email').value;

							if (email)
								alert('Do something with ' + email);

							// Get a reference to the Banner AccDC Object using its ID
							var dc = $A.reg[bannerId];
							// Then close the banner
							dc.close();
						});
					}

					// Other AccDC API properties and methods can go here as well.

					});

	// Tooltip AccDC Object
	var tooltipId = $A.setTooltip(
					{
					trigger: 'a.helpIcon',
					source: 'files/overlays.html #tooltip1'
					});

	// Popup AccDC Object
	var popupId = $A.setPopup(
					{
					role: 'Excerpt',
					trigger: 'a.excerpt',
					source: 'files/overlays.html #popup1',
					// Move the AccDC Object 10px to the right, and 20px up when opened
					offsetLeft: 10,
					offsetTop: -20
					});
});