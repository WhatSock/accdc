$A.bind(window, 'load', function(){

	$A.generateAccordion('.accAccordion',
					{
					accordionRole: 'Accordion',
					accordionState: 'Expanded',
					toggleClass: 'open',
								preload: true,
								preloadImages: true
					}, $A.getEl('accordionGroup'), function(dc){
// Optional callback
});
});