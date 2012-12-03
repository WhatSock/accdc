
$A.bind(window, 'load', function(){

	// Configure ARIA Tabs
	$A.setTabs('div.ARIA div.tab',
					{
					preload: true,
					preloadImages: true,
					toggleClass: 'active'
					}, true, document, function(dc){
	// Optional callback that runs after a tab finishes loading
	// 'this' refers to the triggering element
	// E.G alert( this.id )
	});

	// Configure Non-ARIA Tabs
	$A.setTabs('div.nonARIA a.tab',
					{
					// Specify that content should be pulled from within the same document
					mode: 0,
					toggleClass: 'active'
					}, false, document, function(dc){
	// Optionally do something
	});
});

// Configure menu functionality

// Syntax: $A.setMenu( triggeringElementCSSSelector, filePathOrDOM-Id, topLvlMenuId, callbackFunction, boolUseDOM-Id)

// Using lazy loading of external HTML
$A.setMenu('button.menu', 'files/menus.html', 'menu-options', function(ev, domNode){
	alert(domNode.id);
});

// Or using a hidden DOM node within the same page
/*
$A.setMenu('button.menu', 'hiddenDivId', 'menu-options', function(ev, domNode){
alert(domNode.id);
}, true);
*/