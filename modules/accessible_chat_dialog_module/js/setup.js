/* !
Accessible Chat Dialog Module
	*/

(function(){

	$A.fn.debug = true;

	var key =
					{
					val: 192,
					alt: false,
					ctrl: true,
					shift: false
					}, pressed = {}, changePressed = function(ev){
		pressed.alt = ev.altKey;
		pressed.ctrl = ev.ctrlKey;
		pressed.shift = ev.shiftKey;
	};

	$A(
					[
					{
					id: 'tooltip',
					role: 'Tooltip',
					trigger: '#mod',
					bind: 'click',
					showHiddenClose: false,
					returnFocus: false,
					source: 'Now press the hotkey combination that you want to use.',
					autoPosition: 3,
					offsetLeft: 10,
					cssObj:
									{
									position: 'absolute',
									zIndex: 1,
									backgroundColor: '#000000',
									color: '#ffffff'
									},
					runAfter: function(dc){
						$A.announce(dc.containerDiv);
						$A.bind(dc.triggerObj,
										{
										keydown: function(ev){
											changePressed(ev);
										},
										keyup: function(ev){
											var k = ev.which || ev.keyCode;

											if (k != 13 && !dc.lock){
												dc.lock = true;
												key.val = k;
												key.alt = pressed.alt;
												key.ctrl = pressed.ctrl;
												key.shift = pressed.shift;
												dc.containerDiv.innerHTML = 'Your hotkey has been changed.'.announce();
												setTimeout(function(){
													dc.lock = false;
													dc.close();
												}, 2000);
												ev.preventDefault();
											}
											changePressed(ev);
										}
										});
					},
					runBeforeClose: function(dc){
						$A.unbind(dc.triggerObj, 'keydown keyup');
					}
					}
					], null, true);

	$A(
					[
					{
					id: 'chat',
					role: 'Chat',
					ariaLevel: 3,
					className: 'fbDockWrapper fbDockWrapperRight bb',
					closeClassName: 'close',
					autoFix: 4,
					tmp:
									{
									first: true,
									inc: 0,
									hash: '',
									msgs: {},
									tags: [],
									check: null,
									url: 'http://whatsock.com/modules/accessible_chat_dialog_module/chat/load.js?',
									setTO: function(){
										var dc = $A.reg.chat;
										dc.tmp.check = setTimeout(function(){
											$A.getScript(dc.tmp.url + 'a=g&t=' + dc.tmp.hash + '&inc=' + (dc.tmp.inc += 1));
										}, 2000);
									},
									success: function(){
										var dc = $A.reg.chat;
										dc.tmp.msgI.value = '';
										clearTimeout(dc.tmp.check);
										$A.getScript(dc.tmp.url + 'a=g&t=' + dc.tmp.hash + '&inc=' + (dc.tmp.inc += 1));
									},
									load: function(msgs){
										var dc = $A.reg.chat;

										if (msgs.length){
											dc.tmp.tags = [];
											dc.tmp.conv.innerHTML = '<div class="fbChatConvDateBreak">Whenever</div>';

											for (var i = 0; i < msgs.length; i++){
												var msg = msgs[i];
												var d = $A.createEl('div', null, null, 'mhs mbs pts fbChatConvItem fbChatMessageGroup clearfix small');
												d.innerHTML = '<a class="profileLink">' + cln(msg[0])
													+ '</a><div class="messages"><div class="fbChatMessage fsm direction_ltr">' + cln(msg[1]) + '</div></div>';
												dc.tmp.conv.appendChild(d);
												dc.tmp.tags.push(d);
												var y = d.innerText || d.textContent;

												if (!dc.tmp.msgs[y]){
													dc.tmp.msgs[y] = true;

													if (!dc.tmp.first)
														$A.announce(d.innerText ? firstChild(d).innerText + ' ' + lastChild(d).innerText
															: firstChild(d).textContent + ' ' + lastChild(d).textContent);
												}
											}

											if (dc.tmp.tags.length)
												dc.tmp.tags[dc.tmp.tags.length - 1].scrollIntoView();
										}
										dc.tmp.setTO();

										if (dc.tmp.first){
											dc.tmp.first = false;
											dc.tmp.msgI.focus();
											var d = dc.tmp.tags[dc.tmp.tags.length - 1];
											$A.announce(d.innerText ? firstChild(d).innerText + ' ' + lastChild(d).innerText
												: firstChild(d).textContent + ' ' + lastChild(d).textContent);
										}
									}
									},
					runAfter: function(dc){
						dc.css('right', 240);
						dc.tmp.conv = $A.getEl('conversation');
						dc.tmp.msgI = $A.getEl('msgInput');
						elastic(dc.tmp.msgI, 80);
						$A.bind(dc.tmp.msgI,
										{
										keypress: function(ev){
											var k = ev.which || ev.keyCode;

											if (k == 13){
												$A.getScript(dc.tmp.url + 'a=s&n=' + encodeURIComponent(dc.tmp.name) + '&m='
													+ encodeURIComponent(this.value));
												ev.preventDefault();
											}

											else if (k == 27){
												dc.close();
												ev.preventDefault();
											}
										},
										keydown: function(ev){
											changePressed(ev);
										},
										keyup: function(ev){
											var k = ev.which || ev.keyCode;

											if (k == key.val && pressed.ctrl == key.ctrl && pressed.alt == key.alt && pressed.shift == key.shift){
												var r = dc.tmp.tags;
												r.reverse();

												for (var x = 4; x >= 0; x--){
													if (r[x])
														$A.announce(r[x].innerText ? firstChild(r[x]).innerText + ' ' + lastChild(r[x]).innerText
															: firstChild(r[x]).textContent + ' ' + lastChild(r[x]).textContent);
												}
												ev.preventDefault();
											}
											changePressed(ev);
										}
										});
						$A.bind('a.uiTooltip.close.button', 'click', function(ev){
							dc.close();
							ev.preventDefault();
						});
						$A.getScript(dc.tmp.url + 'a=g&inc=' + (dc.tmp.inc += 1));
						scrollableDiv($A.query('div.fbNubFlyoutBody.scrollable', dc.containerDiv)[0]);
					},
					runBeforeClose: function(dc){
						clearTimeout(dc.tmp.check);
					}
					}
					], null, true);

	$A.bind(window, 'load', function(){

		$A.bind('#f1', 'submit', function(ev){
			var n = $A.getEl('name');

			if (n.value.length >= 5){
				var dc = $A.reg.chat;
				dc.tmp.name = n.value.replace(/<|>/g, '');
				dc.triggerObj = this;
				$A.getScript(dc.tmp.url + 'a=l');
				$A.announce('Loading, please wait');
			}

			else
				alert('At least 5 characters are required to represent a valid name within the chat dialog.');
			ev.preventDefault();
		});
	});
}
)();