/*!
Accordion From XML Module R1.0
Copyright 2010-2012 Bryan Garaventa (WhatSock.com)
Part of AccDC, a Cross-Browser JavaScript accessibility API, distributed under the terms of the GNU LGPL
*/

(function(){

	$A.generateAccordion = function(container, path, autoOpen, config){
		var config = config || {}, role = config.role || 'Accordion', tabRole = config.tabRole || 'Accordion',
			tabState = config.tabState || 'Open', className = config.className || 'panel',
			openClassName = config.openClassName || 'open', xml = null, track = {}, links = [], bId = 'l' + $A.genId(),
			tmp = $A.createEl('div');
		$A.load(tmp, path, function(data){
			xml = str2xml(data);
			$A.query(xml.documentElement.nodeName + ' > *', xml, function(i, n){
				links.push($A.createEl('a',
								{
								id: bId + i
								}, null, n.attributes.getNamedItem('class').nodeValue,
					document.createTextNode(n.attributes.getNamedItem('name').nodeValue)));

				track[bId + i] = n.childNodes[0].nodeValue;
			});
			var objs = [], list = $A.createEl('ul');

			for (var i = 0; i < links.length; i++){
				var li = $A.createEl('li');
				list.appendChild(li);
				li.appendChild(links[i]);
				objs.push(
								{
								id: bId + i,
								trigger: links[i],
								source: track[bId + i],
								autoStart: autoOpen === i ? true : false
								});
			}

			container.appendChild(list);
			$A(objs,
							{
							role: role,
							bind: 'click',
							isTab: true,
							tabRole: tabRole,
							tabState: tabState,
							isToggle: true,
							showHiddenClose: false,
							className: className,
							ariaLevel: 3,
							runAfter: function(dc){
								$A.query('a.' + openClassName + '.' + dc.triggerObj.className, container, function(){
									$A.remClass(this, openClassName);
								});
								$A.addClass(dc.triggerObj, openClassName);
							}
							});

			for (var n in track)
							$A.reg[n].forceFocus = true;
		});
	};

	var str2xml = function(data){
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
	};
})();