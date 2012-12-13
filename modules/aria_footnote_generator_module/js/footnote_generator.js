/*!
ARIA Footnote Generator Module R1.0
Copyright 2010-2012 Bryan Garaventa (WhatSock.com)
Part of AccDC, a Cross-Browser JavaScript accessibility API, distributed under the terms of the Open Source Initiative OSI - MIT License
*/

(function(){

	$A.setFootnotes = function(path, mode, config){

		var config = config || {}, clsName = config.className || 'footnote', fnText = config.fnText || '_Footnote',
			targId = config.targId || 'fns', hMax = config.hMax || 1;

		$A.setFootnotes.generateFootnotes = function(footnotes){

			var targ = $A.getEl(targId), inc = 0, t = $A.createEl('table'), d = null;

			$A.query('span.footnote', function(i, f){
				$A.setAttr(f,
								{
								role: 'link',
								tabindex: '0'
								});

				f.appendChild($A.createEl('span', null, null, 'screenReading', document.createTextNode(fnText)));
				f.appendChild($A.createEl('sup', null, null, null, document.createTextNode(i + 1)));
				var td = $A.createEl('td'), p = $A.createEl('div'), n = $A.createEl('div',
								{
								role: 'link',
								tabindex: '0'
								}, null, 'footnote'), m = $A.createEl('div');

				n.innerHTML = '<span class="fnIndex">&#8224; [<span class="screenReading">' + fnText + '</span>' + (i + 1)
					+ '] </span>' + footnotes['-' + f.id];
				p.appendChild(n);
				p.appendChild(m);
				$A.query('a', n, function(){
					m.appendChild(this);
				});
				td.appendChild(p);

				if (inc == 0 || hMax === 1){
					d = $A.createEl('tr');
					t.appendChild(d);
					inc = 1;
				}

				else if (inc >= (hMax - 1))
					inc = 0;

				else
					inc += 1;
				d.appendChild(td);
				$A.bind(f,
								{
								keypress: function(ev){
									var k = ev.which || ev.keyCode;

									if (k == 13 || k == 32){
										n.focus();
										ev.preventDefault();
									}
								},
								click: function(ev){
									n.focus();
									ev.preventDefault();
								}
								});
				$A.bind(n,
								{
								keypress: function(ev){
									var k = ev.which || ev.keyCode;

									if (k == 13 || k == 32){
										f.focus();
										ev.preventDefault();
									}
								},
								click: function(ev){
									f.focus();
									ev.preventDefault();
								}
								});
			});

			targ.appendChild(t);
		};

		if (!mode)
			$A.getScript(path);

		else if (mode === 1){
			var fns = {}, tmp = $A.createEl('div'), q = $A.query('span.footnote'), inc1 = 0, inc2 = q.length;

			for (var i = 0; i < inc2; i++){
				var f = q[i];
				$A.load(tmp, path + ' #-' + f.id, function(v){
					fns['-' + f.id] = tmp.innerHTML;
					inc1 += 1;

					if (inc1 === inc2)
						$A.setFootnotes.generateFootnotes(fns);
				});
			}
		}
	};
})();