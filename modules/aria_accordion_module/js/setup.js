$A.bind(window, 'load', function(){

	$A.generateAccordion('.accAccordion',
					{
					accordionRole: 'Accordion',
					accordionState: 'Expanded',
					toggleClass: 'open'
					}, $A.getEl('accordionGroup'), function(dc){});
});