/*!
Tooltip Module R1.0
Copyright 2010-2012 Bryan Garaventa (WhatSock.com)
Part of AccDC, a Cross-Browser JavaScript accessibility API, distributed under the terms of the Open Source Initiative OSI - MIT License
*/

(function(){

	$A.setTooltip = function(overrides){
		if (overrides && !overrides.id)
			overrides.id = $A.genId();

		// Preload external content to prevent rendering delays
		// This can be overridden by setting mode to 0 or greater in the overrides argument
		if (typeof overrides.mode !== 'number')
			overrides.source = (function(){
				var d = $A.createEl('div');
				$A.load(d, overrides.source);
				return d;
			})();

		// Tooltip AccDC Object declaration
		$A([overrides],
						{
						role: 'Tooltip',
						bind: 'click mouseover',
						isToggle: true,
						accStart: 'Start',
						accEnd: 'End',
						accClose: 'Close',
						// Position the AccDC Object to the right of the triggering element
						autoPosition: 3,
						// Set a positive offset to move the AccDC Object 10px to the right
						offsetLeft: 10,
						cssObj:
										{
										position: 'absolute'
										},
						runDuring: function(dc){
							// Assign a mouseout handler for the triggering element
							$A.bind(dc.triggerObj, 'mouseout.tooltip', function(ev){
								dc.close();
							});
						},
						announce: true,
						// Set a mousout handler on the AccDC Object as well
						mouseOut: function(ev, dc){
							dc.close();
						},
						runBeforeClose: function(dc){
							$A.unbind(dc.triggerObj, 'mouseout.tooltip');
						},
						className: 'tooltip',
						closeClassName: 'tooltipClose'
						}, true);

		// Return the new tooltip AccDC Object ID
		return overrides.id;
	};
})();