/*!
ARIA Calendar Module R1.0
Copyright 2010-2012 Bryan Garaventa (WhatSock.com)
Part of AccDC, a Cross-Browser JavaScript accessibility API, distributed under the terms of the GNU LGPL
*/

(function(){

	//   $A.fn.debug = true;

	$A.setCalendar = function(pId, trigger, targ, commentsEnabled, callback){

		// Control the behavior of date selection clicks
		var handleClick = callback && typeof callback === 'function' ? callback : function(ev, dc){
			targ.value = dc.range.wDays[dc.range.current.wDay].lng + ' ' + dc.range[dc.range.current.month].name + ' '
				+ dc.range.current.mDay + ', ' + dc.range.current.year;
			dc.close();
		}, key =
						{
						alt: true,
						ctrl: false,
						shift: false
						}, pressed = {}, changePressed = function(ev){
			pressed.alt = ev.altKey;
			pressed.ctrl = ev.ctrlKey;
			pressed.shift = ev.shiftKey;
		};

		// Calendar object declaration start
		$A(
						[
						{
						id: pId,
						role: 'Calendar',
						trigger: trigger,
						bind: 'click',
						allowReopen: true,
						showHiddenClose: commentsEnabled ? false : true,
						tooltipTxt: 'Press Escape to cancel',
						disabledTxt: 'Disabled',
						commentedTxt: 'Has Comment',
						prevTxt: 'Previous',
						nextTxt: 'Next',
						monthTxt: 'Month',
						yearTxt: 'Year',
						autoPosition: 9,
						cssObj:
										{
										position: 'absolute',
										zIndex: 1
										},
						className: 'calendar',
						range:
										{
										0:
														{
														name: 'January',
														max: 31,
														disabled: {},
														comments: {}
														},
										1:
														{
														name: 'February',
														max: 28,
														disabled: {},
														comments: {}
														},
										2:
														{
														name: 'March',
														max: 31,
														disabled: {},
														comments: {}
														},
										3:
														{
														name: 'April',
														max: 30,
														disabled: {},
														comments: {}
														},
										4:
														{
														name: 'May',
														max: 31,
														disabled: {},
														comments: {}
														},
										5:
														{
														name: 'June',
														max: 30,
														disabled: {},
														comments: {}
														},
										6:
														{
														name: 'July',
														max: 31,
														disabled: {},
														comments: {}
														},
										7:
														{
														name: 'August',
														max: 31,
														disabled: {},
														comments: {}
														},
										8:
														{
														name: 'September',
														max: 30,
														disabled: {},
														comments: {}
														},
										9:
														{
														name: 'October',
														max: 31,
														disabled: {},
														comments: {}
														},
										10:
														{
														name: 'November',
														max: 30,
														disabled: {},
														comments: {}
														},
										11:
														{
														name: 'December',
														max: 31,
														disabled: {},
														comments: {}
														},
										wDays:
														[
														{
														shrt: 'S',
														lng: 'Sunday'
														},
														{
														shrt: 'M',
														lng: 'Monday'
														},
														{
														shrt: 'T',
														lng: 'Tuesday'
														},
														{
														shrt: 'W',
														lng: 'Wednesday'
														},
														{
														shrt: 'T',
														lng: 'Thursday'
														},
														{
														shrt: 'F',
														lng: 'Friday'
														},
														{
														shrt: 'S',
														lng: 'Saturday'
														}
														],
										// Change the week day offset for the calendar display
										wdOffset: 0
										},
						getWDay: function(dc, d, r){
							var d = typeof d === 'number' ? d : dc.range.current.wDay, o = dc.range.wdOffset;

							if (o < 0)
								d = (d + o) < 0 ? 7 + o : d + o;

							else if (o > 0)
								d = (d + o) > 6 ? -1 + ((d + o) - 6) : d + o;

							if (r)
								d = 6 - d;
							return d;
						},
						setFocus: function(o, p, s){
							if (!o)
								return;
							this.current = o;
							$A.query('td.day.selected', this.containerDiv, function(i, p){
								$A.setAttr(p,
												{
												tabindex: '-1',
												'aria-selected': 'false'
												});

								$A.remClass(p, 'selected');
							});
							$A.addClass(o, 'selected');
							$A.setAttr(o,
											{
											tabindex: '0',
											'aria-selected': 'true'
											});

							if (!s)
								o.focus();
						},
						setCurrent: function(dc){
							dc.range.current =
											{
											mDay: dc.date.getDate(),
											month: dc.date.getMonth(),
											year: dc.date.getFullYear(),
											wDay: dc.date.getDay()
											};
						},
						runOnceBefore: function(dc){
							dc.date = new Date();
							dc.setCurrent(dc);
						},
						runBefore: function(dc){
							if (dc.range.current.month === 1)
								dc.range[1].max = (new Date(dc.range.current.year, 1, 29).getMonth() == 1) ? 29 : 28;
							dc.baseId = 'b' + $A.genId();
							dc.prevBtnId = dc.baseId + 'p';
							dc.nextBtnId = dc.baseId + 'n';
							dc.source = '<table role="dialog" class="calendar" aria-label="' + dc.role
								+ '"><tr role="presentation"><td class="nav" accesskey="1" title="' + dc.prevTxt.replace(/<|>|\"/g, '') + ' '
								+ dc.yearTxt.replace(/<|>|\"/g, '') + '" role="button" id="' + dc.prevBtnId
								+ 'Y" tabindex="0"><span>&#8656;</span></td><td title="' + dc.tooltipTxt.replace(/<|>|\"/g, '')
								+ '" colspan="5" class="year"><span>' + dc.range.current.year
								+ '</span></td><td class="nav" accesskey="2" title="' + dc.nextTxt.replace(/<|>|\"/g, '') + ' '
								+ dc.yearTxt.replace(/<|>|\"/g, '') + '" role="button" id="' + dc.nextBtnId
								+ 'Y" tabindex="0"><span>&#8658;</span></td></tr><tr role="presentation"><td class="nav" accesskey="3" title="'
								+ dc.prevTxt.replace(/<|>|\"/g, '') + ' ' + dc.monthTxt.replace(/<|>|\"/g, '') + '" role="button" id="'
								+ dc.prevBtnId + '" tabindex="0"><span>&#8592;</span></td><td colspan="5" class="month"><span>'
								+ dc.range[dc.range.current.month].name + '</span></td><td class="nav" accesskey="4" title="'
								+ dc.nextTxt.replace(/<|>|\"/g, '') + ' ' + dc.monthTxt.replace(/<|>|\"/g, '') + '" role="button" id="'
								+ dc.nextBtnId + '" tabindex="0"><span>&#8594;</span></td></tr><tr role="presentation">';
							var pMonth = dc.range.current.month > 0 ? dc.range.current.month - 1 : 11,
								nMonth = dc.range.current.month < 11 ? dc.range.current.month + 1 : 0;
							dc.iter = 0;

							for (var i = 0; i < 7; i++){
								var di = dc.getWDay(dc, i), d = dc.range.wDays[di];

								if (!i){
									dc.iter = dc.iterE = (di + 6) > 6 ? -1 + di : di + 6;
									dc.iterS = di;
								}
								dc.source += '<th class="week" title="' + d.lng + '"><span>' + d.shrt + '</span></th>';
							}
							dc.source += '</tr><tr role="presentation">';
							var m = new Date();
							m.setDate(1);
							m.setMonth(dc.range.current.month);
							m.setFullYear(dc.range.current.year);
							var f = m.getDay();
							m.setDate(dc.range[dc.range.current.month].max);
							var e = m.getDay(), w = dc.iterS;

							while (w != f){
								w = (w + 1) > 6 ? 0 : w + 1;
								dc.source += '<td class="empty"><span>&nbsp;</span></td>';
							}
							dc.range.track = {};
							var disabled = dc.range[dc.range.current.month].disabled[dc.range.current.year],
								disabledAll = dc.range[dc.range.current.month].disabled['*'],
								comments = dc.range[dc.range.current.month].comments[dc.range.current.year],
								commentsAll = dc.range[dc.range.current.month].comments['*'];

							for (var i = 1; i <= dc.range[dc.range.current.month].max; i++){
								dc.range.track[dc.baseId + i] = i;
								m.setDate(i);
								var dis = (disabled && $A.inArray(i, disabled) !== -1)
									|| (disabledAll && $A.inArray(i, disabledAll) !== -1) ? true : false, comm = '';

								if (comments && comments[i])
									comm = comments[i];

								else if (commentsAll && commentsAll[i])
									comm = commentsAll[i];
								dc.source += '<td aria-label="';

								if (dis)
									dc.source += dc.disabledTxt.replace(/<|>|\"/g, '') + ' ';

								if (comm)
									dc.source += dc.commentedTxt.replace(/<|>|\"/g, '') + ' ';
								dc.source += i + ', ' + dc.range.wDays[m.getDay()].lng + ' ' + dc.range[dc.range.current.month].name + ' '
									+ dc.range.current.year;

								if (comm)
									dc.source += comm.replace(/<|>|\n/g, ' ').replace(/\"/g, '\"');
								dc.source += '" role="link" tabindex="-1" aria-selected="false" class="day';

								if (dis)
									dc.source += ' disabled';

								if (comm)
									dc.source += ' comment';
								dc.source += '" title="';

								if (dis)
									dc.source += dc.disabledTxt.replace(/<|>|\"/g, '');

								if (comm)
									dc.source += ' ' + dc.commentedTxt.replace(/<|>|\"/g, '');
								dc.source += '" id="' + dc.baseId + i + '"><span>' + i + '</span></td>';
								m.setDate(i);
								var w = m.getDay();

								if (w == dc.iter && i < dc.range[dc.range.current.month].max)
									dc.source += '</tr><tr role="presentation">';
							}

							while (e != dc.iter){
								e = (e + 1) > 6 ? 0 : e + 1;
								dc.source += '<td class="empty"><span>&nbsp;</span></td>';
							}
							dc.source += '</tr></table>';
						},
						runAfter: function(dc){
							var nMonth = function(){
								var month = dc.range.current.month == 11 ? 0 : dc.range.current.month + 1,
									year = month > 0 ? dc.range.current.year : dc.range.current.year + 1,
									day = dc.range.current.mDay > dc.range[month].max ? dc.range[month].max : dc.range.current.mDay;
								dc.date.setDate(day);
								dc.date.setMonth(month);
								dc.date.setFullYear(year);
								dc.setCurrent(dc);
								dc.reopen = true;
								dc.open();
							}, pMonth = function(){
								var month = dc.range.current.month < 1 ? 11 : dc.range.current.month - 1,
									year = month < 11 ? dc.range.current.year : dc.range.current.year - 1,
									day = dc.range.current.mDay > dc.range[month].max ? dc.range[month].max : dc.range.current.mDay;
								dc.date.setDate(day);
								dc.date.setMonth(month);
								dc.date.setFullYear(year);
								dc.setCurrent(dc);
								dc.reopen = true;
								dc.open();
							}, gYear = function(forward){
								var month = dc.range.current.month, year = forward ? dc.range.current.year + 1 : dc.range.current.year - 1;

								if (month === 1)
									dc.range[1].max = 28;
								var day = dc.range.current.mDay > dc.range[month].max ? dc.range[month].max : dc.range.current.mDay;
								dc.date.setDate(day);
								dc.date.setMonth(month);
								dc.date.setFullYear(year);
								dc.setCurrent(dc);
								dc.reopen = true;
								dc.open();
							};
							$A.bind('td.day',
											{
											focus: function(ev){
												if ($A.hasClass(this, 'comment')){
													var tooltipDC = dc.children[0], year = dc.range[dc.range.current.month].comments[dc.range.current.year],
														all = dc.range[dc.range.current.month].comments['*'], comm = '';

													if (year && year[dc.range.current.mDay])
														comm = year[dc.range.current.mDay];

													else if (all && all[dc.range.current.mDay])
														comm = all[dc.range.current.mDay];
													comm = trim(comm.replace(/<|>/g, ''));

													if (comm){
														tooltipDC.source = comm;
														tooltipDC.open();
													}
												}

												else if (dc.children[0].loaded)
													dc.children[0].close();

												if (dc.children[1].openEditor){
													dc.children[1].openEditor = false;
													dc.children[1].reset();
												}
											},
											click: function(ev){
												dc.date.setDate(dc.range.track[this.id]);
												dc.setCurrent(dc);

												if ($A.hasClass(this, 'selected') || (!commentsEnabled && !$A.hasClass(this, 'comment'))){
													if ($A.inArray(dc.range.current.mDay, dc.range[dc.range.current.month].disabled[dc.range.current.year]
														|| dc.range[dc.range.current.month].disabled['*'] || []) === -1){
														handleClick.apply(this,
																		[
																		ev,
																		dc
																		]);
													}
												}

												else
													dc.setFocus(this, null, true);
												ev.preventDefault();
											},
											keypress: function(ev){
												var k = ev.which || ev.keyCode;

												if (k == 13){
													if ($A.inArray(dc.range.current.mDay, dc.range[dc.range.current.month].disabled[dc.range.current.year]
														|| dc.range[dc.range.current.month].disabled['*'] || []) === -1){
														handleClick.apply(this,
																		[
																		ev,
																		dc
																		]);
													}

													ev.preventDefault();
												}

												else if (k == 32 && commentsEnabled && !dc.children[1].openEditor){
													dc.children[1].openEditor = true;
													dc.children[1].reset();
													ev.preventDefault();
												}
											},
											keydown: function(ev){
												changePressed(ev);
												var k = ev.which || ev.keyCode;

												if ((k >= 37 && k <= 40) || k == 27 || (k >= 33 && k <= 36)){
													var wd = dc.range.current.wDay;

													if (k == 37){
														if (wd != dc.iterS && dc.range.current.mDay > 1){
															dc.range.current.mDay--;
															dc.range.current.wDay = (wd - 1) < 0 ? 6 : wd - 1;
															dc.setFocus(dc.range.index[dc.range.current.mDay - 1], this);
														}
													}

													else if (k == 39){
														if (wd != dc.iterE && dc.range.current.mDay < dc.range[dc.range.current.month].max){
															dc.range.current.mDay++;
															dc.range.current.wDay = (wd + 1) > 6 ? 0 : wd + 1;
															dc.setFocus(dc.range.index[dc.range.current.mDay - 1], this);
														}
													}

													else if (k == 38){
														if ((dc.range.current.mDay - 7) > 0){
															dc.range.current.mDay -= 7;
															dc.setFocus(dc.range.index[dc.range.current.mDay - 1], this);
														}
													}

													else if (k == 40){
														if ((dc.range.current.mDay + 7) <= dc.range[dc.range.current.month].max){
															dc.range.current.mDay += 7;
															dc.setFocus(dc.range.index[dc.range.current.mDay - 1], this);
														}
													}

													else if (k == 27){
														dc.close();
													}

													else if (k == 33){
														if (pressed.alt)
															gYear(true);

														else
															nMonth();
													}

													else if (k == 34){
														if (pressed.alt)
															gYear();

														else
															pMonth();
													}

													else if (k == 36){
														if (wd != dc.iterS && dc.range.current.mDay > 1){
															while (dc.range.current.wDay != dc.iterS && $A.getEl(dc.baseId + (dc.range.current.mDay - 1))){
																dc.range.current.wDay = (dc.range.current.wDay - 1) < 0 ? 6 : dc.range.current.wDay - 1;
																dc.range.current.mDay--;
															}
															dc.setFocus(dc.range.index[dc.range.current.mDay - 1], this);
														}
													}

													else if (k == 35){
														if (wd != dc.iterE && dc.range.current.mDay < dc.range[dc.range.current.month].max){
															while (dc.range.current.wDay != dc.iterE && $A.getEl(dc.baseId + (dc.range.current.mDay + 1))){
																dc.range.current.wDay = (dc.range.current.wDay + 1) > 6 ? 0 : dc.range.current.wDay + 1;
																dc.range.current.mDay++;
															}
															dc.setFocus(dc.range.index[dc.range.current.mDay - 1], this);
														}
													}
													ev.preventDefault();
												}
											},
											keyup: function(ev){
												changePressed(ev);
											}
											});

							$A.bind('#' + dc.prevBtnId,
											{
											click: function(ev){
												pMonth();
												ev.preventDefault();
											},
											keypress: function(ev){
												var k = ev.which || ev.keyCode;

												if (k == 13 || k == 32){
													pMonth();
													ev.preventDefault();
												}
											},
											keydown: function(ev){
												changePressed(ev);
												var k = ev.which || ev.keyCode;

												if (k == 27){
													dc.close();
													ev.preventDefault();
												}
											},
											keyup: function(ev){
												changePressed(ev);
											}
											});
							$A.bind('#' + dc.nextBtnId,
											{
											click: function(ev){
												nMonth();
												ev.preventDefault();
											},
											keypress: function(ev){
												var k = ev.which || ev.keyCode;

												if (k == 13 || k == 32){
													nMonth();
													ev.preventDefault();
												}
											},
											keydown: function(ev){
												changePressed(ev);
												var k = ev.which || ev.keyCode;

												if (k == 27){
													dc.close();
													ev.preventDefault();
												}
											},
											keyup: function(ev){
												changePressed(ev);
											}
											});

							$A.bind('#' + dc.prevBtnId + 'Y',
											{
											click: function(ev){
												gYear();
												ev.preventDefault();
											},
											keypress: function(ev){
												var k = ev.which || ev.keyCode;

												if (k == 13 || k == 32){
													gYear();
													ev.preventDefault();
												}
											},
											keydown: function(ev){
												changePressed(ev);
												var k = ev.which || ev.keyCode;

												if (k == 27){
													dc.close();
													ev.preventDefault();
												}
											},
											keyup: function(ev){
												changePressed(ev);
											}
											});
							$A.bind('#' + dc.nextBtnId + 'Y',
											{
											click: function(ev){
												gYear(true);
												ev.preventDefault();
											},
											keypress: function(ev){
												var k = ev.which || ev.keyCode;

												if (k == 13 || k == 32){
													gYear(true);
													ev.preventDefault();
												}
											},
											keydown: function(ev){
												changePressed(ev);
												var k = ev.which || ev.keyCode;

												if (k == 27){
													dc.close();
													ev.preventDefault();
												}
											},
											keyup: function(ev){
												changePressed(ev);
											}
											});

							dc.range.index = $A.query('td.day', dc.containerDiv);
							dc.setFocus(dc.range.index[dc.range.current.mDay - 1]);

							if (commentsEnabled)
								dc.children[1].open();
						},
						tabOut: function(ev, dc){
							dc.close();
						},
						runAfterClose: function(dc){
							if (!dc.reopen){
								dc.children[0].close();
								dc.children[1].lock = false;
								dc.children[1].close();
							}

							else
								dc.reopen = false;

						// Add an AJAX query to save comments if desired for later retrieval using a database and user authentication

						}
						}
						]);
		// Calendar object declaration end

		// Comment object declaration start
		$A($A.reg[pId],
						[
						{
						id: pId + 'commentTooltip',
						role: 'Comment',
						returnFocus: false,
						showHiddenClose: false,
						allowReopen: true,
						autoPosition: 1,
						cssObj:
										{
										position: 'absolute',
										zIndex: $A.reg[pId].cssObj.zIndex
										},
						className: 'commentTooltip',
						runBefore: function(dc){
							dc.triggerObj = dc.parent.accDCObj;
						}
						}
						]);
		// Comment object declaration end

		// Form object declaration start
		$A($A.reg[pId],
						[
						{
						id: pId + 'commentAdd',
						role: 'Edit Comment',
						returnFocus: false,
						allowReopen: true,
						autoPosition: 6,
						cssObj:
										{
										position: 'absolute',
										zIndex: $A.reg[pId].cssObj.zIndex
										},
						className: 'commentAdd',
						openEditor: false,
						source:
							'<textarea style="visibility: hidden; display: none;" class="commentTa" title="Comment"></textarea><button title="Edit Comment" class="commentBtn">Edit</button>',
						runBefore: function(dc){
							dc.triggerObj = dc.parent.accDCObj;
						},
						runDuring: function(dc){
							$A.setAttr(dc.accDCObj,
											{
											role: 'dialog',
											'aria-label': dc.role
											});

							$A.setAttr(dc.containerDiv, 'role', 'presentation');
						},
						add: function(dc){
							var comm = trim(dc.textarea.value.replace(/<|>|\n/g, ' '));

							if (!dc.comments[dc.parent.range.current.year])
								dc.comments[dc.parent.range.current.year] = {};
							dc.comments[dc.parent.range.current.year][dc.parent.range.current.mDay] = comm;
							var lbl = dc.parent.range.current.mDay + ', ' + dc.parent.range.wDays[dc.parent.range.current.wDay].lng + ' '
								+ dc.parent.range[dc.parent.range.current.month].name + ' ' + dc.parent.range.current.year, pre = '';

							if ((dc.parent.range[dc.parent.range.current.month].disabled[dc.parent.range.current.year]
								&& $A.inArray(dc.parent.range.current.mDay,
									dc.parent.range[dc.parent.range.current.month].disabled[dc.parent.range.current.year]) !== -1)
								|| (dc.parent.range[dc.parent.range.current.month].disabled['*'] && $A.inArray(dc.parent.range.current.mDay,
									dc.parent.range[dc.parent.range.current.month].disabled['*']) !== -1))
								pre += dc.parent.disabledTxt.replace(/<|>|\"/g, '') + ' ';

							if (!comm)
								$A.remClass(dc.parent.current, 'comment');

							else{
								$A.addClass(dc.parent.current, 'comment');
								pre += dc.parent.commentedTxt.replace(/<|>|\"/g, '') + ' ';
							}
							lbl = pre + lbl;
							$A.setAttr(dc.parent.current,
											{
											title: trim(pre),
											'aria-label': lbl + ' ' + comm.replace(/\"/g, '\"')
											});
						},
						reset: function(){
							var dc = this;

							if (dc.openEditor){
								dc.comments = dc.parent.range[dc.parent.range.current.month].comments;

								if (!dc.textarea)
									dc.textarea = $A.query('textarea', dc.containerDiv, function(){
										$A.css(this,
														{
														visibility: '',
														display: ''
														});

										dc.css('left', dc.parent.accDCObj.offsetLeft);
										$A.bind(this,
														{
														focus: function(ev){
															if (dc.parent.children[0].loaded)
																dc.parent.children[0].close();
														},
														keypress: function(ev){
															var k = ev.which || ev.keyCode;

															if (this.value.length > 800)
																this.value = this.value.substring(0, 799);

															if (k == 13){
																dc.add.apply(this, [dc]);
																dc.parent.current.focus();
																dc.openEditor = false;
																dc.reset();
																ev.preventDefault();
															}

															else if (k == 27){
																dc.parent.current.focus();
																dc.openEditor = false;
																dc.reset();
																ev.preventDefault();
															}
														}
														});
									})[0];

								else{
									$A.css(dc.textarea,
													{
													visibility: '',
													display: ''
													});

									dc.css('left', dc.parent.accDCObj.offsetLeft);
								}
								$A.setAttr(dc.textarea,
												{
												title: 'Comment for ' + dc.parent.range.current.mDay + ', '
													+ dc.parent.range.wDays[dc.parent.range.current.wDay].lng + ' '
													+ dc.parent.range[dc.parent.range.current.month].name + ' ' + dc.parent.range.current.year
												}).focus();

								if (dc.comments[dc.parent.range.current.year]
									&& dc.comments[dc.parent.range.current.year][dc.parent.range.current.mDay])
									dc.textarea.value = dc.comments[dc.parent.range.current.year][dc.parent.range.current.mDay];
								$A.setAttr(dc.commentBtn,
												{
												title: 'Save Comment'
												}).innerHTML = 'Save';
							}

							else{
								if (dc.textarea){
									dc.textarea.value = '';
									$A.css(dc.textarea,
													{
													visibility: 'hidden',
													display: 'none'
													});
								}

								dc.css('left', dc.parent.accDCObj.offsetLeft + dc.parent.accDCObj.offsetWidth - dc.accDCObj.offsetWidth);
								$A.setAttr(dc.commentBtn,
												{
												title: 'Edit Comment'
												}).innerHTML = 'Edit';
							}
						},
						runAfter: function(dc){
							$A.query('button', dc.containerDiv, function(){
								dc.commentBtn = this;
								$A.bind(this,
												{
												focus: function(ev){
													if (dc.parent.children[0].loaded)
														dc.parent.children[0].close();
												},
												click: function(ev){
													if (dc.openEditor){
														dc.add.apply(this, [dc]);
														dc.parent.current.focus();
														dc.openEditor = false;
														dc.reset();
													}

													else{
														dc.openEditor = true;
														dc.reset();
													}
													ev.preventDefault();
												},
												keypress: function(ev){
													var k = ev.which || ev.keyCode;

													if (k == 27){
														if (dc.openEditor){
															dc.parent.current.focus();
															dc.openEditor = false;
															dc.reset();
														}

														else
															dc.parent.close();
														ev.preventDefault();
													}
												}
												});
							});
							dc.reset();
							dc.lock = true;
						},
						tabOut: function(ev, dc){
							dc.parent.close();
						},
						runBeforeClose: function(dc){
							dc.openEditor = false;
							dc.textarea = null;
						}
						}
						]);
	// Form object declaration end

	};

	var trim = function(str){
		return str.replace(/^\s+|\s+$/g, '');
	};
})();