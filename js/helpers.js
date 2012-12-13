/*!
Helper functions for the WhatSock.com website
Copyright 2010-2012 Bryan Garaventa (WhatSock.com)
Part of AccDC, a Cross-Browser JavaScript accessibility API, distributed under the terms of the Open Source Initiative OSI - MIT License
*/

var firstChild = function(e, t){
	var e = e ? e.firstChild : null;

	while (e){
		if (e.nodeType === 1 && (!t || t.toLowerCase() === e.nodeName.toLowerCase()))
			break;

		e = e.nextSibling;
	}
	return e;
}, getClosest = function(start, targ){
	while (start){
		start = start.parentNode;

		if (typeof targ === 'string'){
			if (start.nodeName.toLowerCase() === targ.toLowerCase())
				return start;
		}

		else if (targ.nodeType === 1){
			if (start == targ)
				return start;
		}
	}

	return null;
}, insertBefore = function(f, s){
	if (!f)
		return s;
	f.parentNode.insertBefore(s, f);
	return s;
}, serialize = function(form){
	if (!form || !form.elements)
		return '';
	var pairs = [], fields = form.elements;

	for (var i = 0; i < fields.length; i++){
		if (fields[i].name && fields[i].value)
			pairs.push(fields[i].name + '=' + encodeURIComponent(fields[i].value));
	}
	return pairs.join('&');
}, hds = {}, createHeaderNav = function(){
	var ph = $A.getEl('ph'), hs = $A.query('div.hd > h2');
	hds = {};

	for (var i = 0; i < hs.length; i++){
		var h = hs[i];

		if (ph && !$A.hasClass(h, 'skip')){
			h.id = 'H' + $A.genId();
			var a = $A.createEl('a',
							{
							href: '#'
							}, null, h.id, document.createTextNode(h.innerText || h.textContent));

			ph.appendChild(a);
			$A.setAttr(h, 'tabindex', -1);
			hds[h.id] = h;
			$A.bind(a, 'click', function(ev){
				hds[this.className].focus();
				ev.preventDefault();
			});

			if (i < (hs.length - 1))
				ph.appendChild($A.createEl('span', null, null, null, document.createTextNode(' | ')));
		}
	}
}, elastic = function(obj, maxheight){
	if (!obj || obj.nodeName.toLowerCase() !== 'textarea')
		return obj;
	var mimics =
					[
					'paddingTop',
					'paddingRight',
					'paddingBottom',
					'paddingLeft',
					'fontSize',
					'lineHeight',
					'fontFamily',
					'fontWeight',
					'border-top-width',
					'border-right-width',
					'border-bottom-width',
					'border-left-width',
					'borderTopStyle',
					'borderTopColor',
					'borderRightStyle',
					'borderRightColor',
					'borderBottomStyle',
					'borderBottomColor',
					'borderLeftStyle',
					'borderLeftColor'
					], $textarea = obj, $twin = $A.createEl('div', null,
					{
					position: 'absolute',
					zIndex: -1000,
					visibility: 'hidden'
					});

	$textarea.parentNode.appendChild($twin);

	for (var i = mimics.length - 1; i >= 0; i--)
					$A.css($twin, mimics[i], $A.css($textarea, mimics[i]));
	$A.bind($textarea, 'keyup change cut paste resize input', function(){
		if (!updating){
			updating = true;
			setTimeout(update, 200);
		}
	});
	$A.bind(window, 'resize', update);
	var lineHeight = parseInt($A.css($textarea, 'line-height'), 10) || parseInt($A.css($textarea, 'font-size'), 10),
		minheight = 30, maxheight = maxheight || parseInt($A.css($textarea, 'max-height'), 10) || Number.MAX_VALUE,
		exceeded = false, updating = false;

	function update(){
		var txw = $textarea.offsetWidth, tww = $twin.offsetWidth;

		if (txw != tww)
			$A.css($twin, 'width', $A.css($textarea, 'width'));
		var text = $textarea.value.replace(/&/g, '&amp;').replace(/ {2}/g, '&nbsp;').replace(/<|>/g, '&gt;').replace(
			/\n/g, '<br />'), html = $twin.innerHTML.replace(/<br>/ig, '<br />');

		if (text + '&nbsp;' !== html){
			$twin.innerHTML = text + '&nbsp;';
			var twh = $twin.offsetHeight;

			if (twh <= maxheight){
				if (twh >= minheight)
					$A.css($textarea, 'height', twh + (lineHeight / 2));

				else
					$A.css($textarea, 'height', minheight);

				if (exceeded){
					$A.css($textarea, 'overflow', 'hidden');
					exceeded = false;
				}
			}

			else if (twh > maxheight){
				exceeded = true;
				$A.css($textarea, 'overflow', 'auto');
			}
		}
		updating = false;
	}
	exceeded = true;
	update();
	return obj;
}, str2xml = function(data){
	if (!data)
		data = '';
	var doc;

	if (window.DOMParser){
		var parser = new DOMParser();
		doc = parser.parseFromString(data, "text/xml");
	}

	else{
		doc = new ActiveXObject("Microsoft.XMLDOM");
		doc.async = "false";
		doc.loadXML(data);
	}
	return doc;
}, transition = function(ele, targ, config){
	if (!ele)
		return;
	var start = {}, disp = {}, uTotalTime = config.duration || 0;

	for (t in targ){
		if (t == 'transform')
			start[t] = 0;

		else
			start[t] = parseInt($A.css(ele, t));

		disp[t] = targ[t] - start[t];
	}
	freq = Math.PI / (2 * uTotalTime), startTime = new Date().getTime(), tmr = setInterval(function(){
		var elapsedTime = new Date().getTime() - startTime;

		if (elapsedTime < uTotalTime){
			var f = Math.abs(Math.sin(elapsedTime * freq)), nw = {};

			for (s in start){
				nw[s] = Math.round(f * disp[s] + start[s]);

				if (s == 'transform')
					$A.css(ele,
									{
									'-ms-transform': 'rotate(' + nw[s] + 'deg)',
									'-moz-transform': 'rotate(' + nw[s] + 'deg)',
									'-webkit-transform': 'rotate(' + nw[s] + 'deg)',
									'-o-transform': 'rotate(' + nw[s] + 'deg)'
									});

				else
					$A.css(ele, s, nw[s]);
			}

			if (config.step)
				config.step.apply(ele, [nw]);
		}

		else{
			clearInterval(tmr);

			for (t in targ){
				if (t == 'transform')
					$A.css(ele,
									{
									'-ms-transform': 'rotate(' + targ[t] + 'deg)',
									'-moz-transform': 'rotate(' + targ[t] + 'deg)',
									'-webkit-transform': 'rotate(' + targ[t] + 'deg)',
									'-o-transform': 'rotate(' + targ[t] + 'deg)'
									});

				else
					$A.css(ele, t, targ[t]);
			}

			if (config.complete)
				config.complete.apply(ele, [targ]);
		}
	}, 10);
}, xOffset = function(c, p){
	var o =
					{
					left: 0,
					top: 0
					}, p = p || document.body;

	while (c && c != p){
		o.left += c.offsetLeft;
		o.top += c.offsetTop;
		c = c.offsetParent;
	}
	return o;
}, isCSSEnabled = function(){
	var testcss = $A.createEl('div'), body = document.getElementsByTagName('body')[0];
	testcss.style.position = 'absolute';
	body.appendChild(testcss);

	if (testcss.currentStyle)
		var currstyle = testcss.currentStyle['position'];

	else if (window.getComputedStyle)
		var currstyle = document.defaultView.getComputedStyle(testcss, null).getPropertyValue('position');
	body.removeChild(testcss);
	return(currstyle == 'static') ? false : true;
};

if (top != window)
	top.location.href = 'http://whatsock.com';