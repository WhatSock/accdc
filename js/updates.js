$A(
				[
				{
				id: 'bannerObj',
				role: 'Banner',
				mode: 0,
				source:
					'<a style="width: 100%; font-size: 1.6em; text-align: center; font-weight: bold; font-family: verdana; background: url(img/chrome.jpg) #f5f5f5 repeat; padding: 6px; color: #b00020; display: block;"><span>Coming Soon: The AccDC Technical Style Guide!</span></a>',
				isStatic: 'body',
				prepend: true,
				returnFocus: false,
				autoStart: true,
				displayHiddenClose: false,
				autoFix: 5,
				cssObj:
								{
								position: 'fixed',
								zIndex: 1000,
								width: '80%'
								},
				runAfter: function(dc){
					$A.bind(window, 'resize.banner', function(){
						dc.applyFix();
					});
				},
				announce: true,
				focusOut: function(ev, dc){
					dc.close();
				},
				timeoutVal: 30000,
				timeout: function(dc){
					dc.close();
				},
				runBeforeClose: function(dc){
					$A.unbind(window, '.banner');
				},
				className: 'banner',
				closeClassName: 'bClose'
				}
				], null, true);