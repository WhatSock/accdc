
// Enable AccDC debugging mode to ensure that morphed AccDC Objects are rendered properly
// $A.fn.debug = true;

$A.bind(window, 'load', function(ev){

	// Track whether drag and drop is enabled
	var dndSet = false,

	// Store an array of DOM nodes as drop zones
	divs = $A.query('div.dragTarget, div.dropTarget'),
	// Store an array of DOM nodes to interact with directly when dragging and dropping
	lists = $A.query('div.viewport ul, div.viewport ol'),

	// Object literal declaration to configure functionality
	config =
					{
					// Specify draggable objects
					setDrag: 'div.dragTarget ul li > img',
					// Specify the initial drop zone
					setDrop: 'div.dropTarget',
					// Return the Alt attribute string for every IMG node to use as the drag and drop link text
					setName: function(obj){
						return $A.getAttr(obj, 'alt');
					},
					// Set the initial styles for the morphed AccDC Object
					cssObj:
									{
									position: 'absolute',
									zIndex: 1
									},
					// Prevent block formatting when surrounding divs are added
					displayInline: true,
					// Run script before the AccDC Object opens
					runBefore: function(dc){
						// Create a tmp namespace to store temporary variables
						dc.tmp =
										{
										// Drop status
										dropped: false,
										// CSS to reset inline style changes when dragging and dropping
										clearCSS:
														{
														zIndex: 1,
														top: '',
														left: '',
														height: '',
														width: ''
														}
										};

						// Set the current zone
						dc.tmp.zone = divs[0];
						// Set a custom target zone where drop links will appear
						dc.accDD.dropAnchor = 'div.dropTarget ol';
					},
					// Run script after the AccDC Object opens
					runAfter: function(dc){
						// Create a placeholder element to ensure proper sizing
						dc.accDCObj.parentNode.appendChild($A.createEl('div', null,
										{
										height: firstChild(dc.containerDiv, 'img').offsetHeight,
										clear: 'both'
										}, null, document.createTextNode(' ')));

						// Relocate  the image Alt text to prevent redundant text for screen reader users
						var img = firstChild(dc.containerDiv, 'img');
						$A.setAttr(dc.containerDiv, 'title', dc.role);
						$A.remAttr(img, 'title');
						$A.setAttr(img, 'alt', '');
					},
					// Configure drag and drop event handlers
					on:
									{
									dragStart: function(ev, dd, dc){
										dc.css('zIndex', 2);
									},
									drop: function(ev, dd, dc){
										// Prevent same - side dropping
										if (dc.tmp.zone != this){
											dc.tmp.zone = this;
											dc.tmp.dropped = true;
											// Remove AccDC Object drag and drop event bindings
											dc.unsetDrag();
											// Reset styling for the AccDC Object
											dc.css(dc.tmp.clearCSS);

											if (this == divs[1]){
												// Specify a new drop zone
												dc.dropTarget = 'div.dragTarget';
												// Specify a new drop anchor for inserting drag and drop links
												dc.accDD.dropAnchor = 'div.dragTarget ul';
												// Move the dropped node accordingly
												lists[1].appendChild(dc.accDCObj.parentNode);
											}

											else{
												dc.dropTarget = 'div.dropTarget';
												dc.accDD.dropAnchor = 'div.dropTarget ol';
												lists[0].appendChild(dc.accDCObj.parentNode);
											}
											// Reassign drag and drop event bindings using the newly configured settings
											dc.setDrag();
										}
									},
									dragEnd: function(ev, dd, dc){
										if (!dc.tmp.dropped)
											// Return to the original position if the drop zone was not valid
											dc.css(dc.tmp.clearCSS);
										dc.tmp.dropped = false;
									}
									},
					// Restrict draggability
					confineTo: 'div.viewport',
					// Set the drop animation time length for keyboard users
					duration: 2000,
					// Set additional styling for the hidden drag and drop links
					ddCSS:
									{
									color: 'white',
									backgroundColor: 'black',
									border: 'solid thin white'
									}
					};

	// Add clearfix to each list node to properly adjust sizing
	$A.addClass(lists, 'clearfix');

	$A.bind('#def', 'click', function(ev){
		if (!dndSet){
			dndSet = true;
			$A.setAttr(this, 'disabled', 'disabled');
			// Morph all specified DOM nodes into draggable AccDC Objects
			$A.setDragAndDrop(config);
		}
		ev.preventDefault();
	});
});

// Helper function
var firstChild = function(e, t){
	var e = e ? e.firstChild : null;

	while (e){
		if (e.nodeType === 1 && (!t || t.toLowerCase() === e.nodeName.toLowerCase()))
			break;

		e = e.nextSibling;
	}
	return e;
};