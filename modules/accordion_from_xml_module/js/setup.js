
$A.bind(window, 'load', function(){

	$A.generateAccordion($A.getEl('container'), 'files/accordion.xml', 0,
					{
					role: 'Drawer',
					tabRole: 'Drawer',
					tabState: 'Open',
					className: 'panel',
					openClassName: 'open'
					});
});