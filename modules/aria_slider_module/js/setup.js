
$A.bind(window, 'load', function(){

	// Configure the Earth Window Slider

	$A.setSlider('handle',
					{
					role: 'Slider',
					min: 0,
					max: 100,
					now: 0,
					vertical: false,
					degradeLbl: 'Set window percentage',
					ariaLabel: function(dc){
						return 'Min 0, Max 100, Currently ';
					},
					onDrag: function(ev, dd, dc, v, m){
						if (!dc.tmp){
							dc.tmp =
											{
											img: $A.getEl('targ')
											};

							dc.tmp.view = dc.tmp.img.parentNode;
						}
						$A.css(dc.tmp.view,
										{
										width: dc.tmp.img.offsetWidth * (v / 100)
										});
					},
					valueText: function(dc, val){
						return val + '%';
					},
					className: 'nub'
					});

	// Set an array to indicate Time values, starting with Min and ending with Max

	var timeVals = ['12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM', '6:00 AM', '7:00 AM', '8:00 AM',
		'9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM',
		'7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'];

	// Now configure the Time Slider

	$A.setSlider('handle2',
					{
					role: 'Slider',
					min: 0,
					max: timeVals.length - 1,
					now: 11,
					vertical: true,
					degradeLbl: 'Set time value',
					ariaLabel: function(dc){
						return 'Choose Time';
					},
					onDrag: function(ev, dd, dc, v, m){
						if ($A.reg.ticker)
							$A.reg.ticker.setTicker.apply($A.reg.ticker);
					},
					valueText: function(dc, val){
						return timeVals[val];
					},
					className: 'nub2'
					});

	// Declare a hovering ticker AccDC Object to display the currently selected time
	// Also use the ID 'handle2' to specify the parent object

	$A($A.reg.handle2,
					[
					{
					id: 'ticker',
					role: 'Selected Time',
					showHiddenClose: false,
					targetObj: $A.reg.handle2.accDCObj.parentNode.parentNode,
					autoPosition: 7,
					cssObj:
									{
									position: 'absolute',
									zIndex: 1,
									backgroundColor: '#000',
									color: '#f5f5f5',
									padding: '10px'
									},
					runOnceBefore: function(dc){
						dc.triggerObj = dc.parent.accDCObj;
						dc.source = timeVals[dc.parent.config.now];
					},
					runOnceAfter: function(dc){
						$A.bind(window, 'resize.ticker', function(){
							dc.setTicker.apply(dc);
						});
					},
					setTicker: function(){
						var dc = this;
						dc.containerDiv.innerHTML = timeVals[dc.parent.config.now];
						dc.setPosition();
					},
					autoStart: true
					}
					]);
});