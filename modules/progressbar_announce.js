/* !
Progress Bar Announce Method R1.0
Instructions: http://lnkd.in/dHf3wf
Copyright 2010-2013 Bryan Garaventa (WhatSock.com)
Part of AccDC, a Cross-Browser JavaScript accessibility API, distributed under the terms of the Open Source Initiative OSI - MIT License
	*/

$A.ProgressAnnounce = function(initialMsg){
	var that = this, tmr = null;

	// Set initial defaults
	that.interval = 3000;
	that.value = 0;
	that.type = '%';

	that.start = function(){
		if (tmr)
			return;

		tmr = setInterval(function(){
			$A.announce(that.value + that.type);
		}, that.interval);
	};

	that.stop = function(endMsg){
		clearInterval(tmr);

		if (endMsg)
			$A.announce(endMsg);
	};

	if (initialMsg)
		$A.announce(initialMsg);
};