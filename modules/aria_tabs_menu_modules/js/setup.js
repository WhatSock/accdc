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

$A.bind(window, 'load', function(){

// Configure menu functionality

// Syntax: $A.setMenu( triggeringElementCSSSelector, filePathOrDOM-Id, topLvlMenuId, callbackFunction, boolUseDOM-Id, context, config)

// Using lazy loading of external HTML for the vertical dropdown menu
	$A.setMenu('button.menu', 'files/menus.html', 'menu-options', function(ev, dc){
		alert('Do something with this.href or id="' + this.id + '"');
	}, false, document,
					{

					// Assign a role name for screen reader users
					role: 'Menu',
					// Assign beginning and ending text to be appended to the role name for screen reader users
					accStart: 'Start',
					accEnd: 'End',
// Assign the state text, which will be appended to the triggering element when a menu is open for screen reader users
					openState: 'Open',
					// Set the starting menu level, (this is automatically incremented when submenus are opened)
					ariaLevel: 3,

					// Set the main container class, (which will surround the menu as a Div tag when rendered)
					containerClass: 'menu',

					// Specify the menu tag name in the markup
					menuTag: 'ol',
					// Specify the menu class name on the above tag in the markup
					menuClass: 'menu',

					// Specify the active element that will be used as each menu node
					// Important, if nesting A tags within LIs, only the A tag should be used for this purpose
					// Active elements should never be nested.
					// The following tag will receive keyboard focus within the menu structure when using the arrow keys to navigate
					// Event bindings are also tied to this tag
					itemTag: 'a',
					// Specify the class name that indicates when a menu item opens a submenu
					folderClass: 'submenu',
					// Specify the class name that indicates when a menu item is to be triggered directly
					// This should not be the same as the folderClass declaration
					linkClass: 'link',

					// Specify if the menu is a flyout menu
					// If true, the Left and Right arrow keys will scroll the open menu
					// If false, the Up and Down arrow keys will scroll the open menu instead
					horizontal: false,

					autoPosition: 0,
					// Set custom offset values to adjust the positioning calculation
					// May return a positive or negative number
					offsetLeft: function(dc){
						return 0;
					},
					offsetTop: function(dc){
						return 0;
					},
					overrides:
									{
									cssObj:
													{
													position: 'absolute',
													zIndex: 1
													}
									// Additional AccDC API properties and methods can be applied here.
									}
					});

	// Or using a hidden DOM node within the same page for the horizontal flyout menu
	$A.setMenu('a.menu2', 'hiddenDivId', 'menu-options2', function(ev, dc){
		alert('Do something with this.href or id="' + this.id + '"');
	}, true, document,
					{
					role: 'Menu',
					accStart: 'Start',
					accEnd: 'End',
					openState: 'Open',
					ariaLevel: 3,
					containerClass: 'foMenu',
					menuTag: 'ul',
					menuClass: 'menu2',
					itemTag: 'a',
					folderClass: 'submenu2',
					linkClass: 'link2',
					horizontal: true,

					// 0 = don't apply forced autoPositioning
					autoPosition: 0,
					offsetLeft: function(dc){
						return 0;
					},
					offsetTop: function(dc){
						return 0;
					},
					overrides:
									{
									cssObj:
													{
													// Change the default relative positioning of menus and submenus to absolute for the positioning calculation
													position: 'absolute',
													zIndex: 1
													}
									// Additional AccDC API properties and methods can be applied here.
									}
					});
});