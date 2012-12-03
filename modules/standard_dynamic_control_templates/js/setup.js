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

					// Track the first and last form field to handle circular tabbing
					dc.firstField = $A.getEl('uname');
					dc.lastField = $A.getEl('lbCancel');

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
				}
				});

// Setup the Banner AccDC Object and store it
var bannerId = $A.setBanner(
				{
				// Specify the content to be loaded,
				source: 'files/overlays.html #bannerContent',
				// Configure a mouse event handler for the AccDC Object
				mouseOut: function(ev, dc){
					dc.close();
				}
				});

$A.bind(window, 'load', function(){
	// Now configure the Banner Reopen button to reopen the Banner AccDC Object programmatically
	$A.bind('button.banner', 'click', function(){
		$A.reg[bannerId].open();
	});
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