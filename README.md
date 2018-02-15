AccDC API - 3.4 Standalone (12/11/2017)
=====

AccDC is a scalable, cross-browser and cross-platform compatible Dynamic Content Management System that automates the rendering of dynamic content to ensure accessibility for screen reader and keyboard only users.

Supported by the Royal Society of Arts, AccDC was awarded the "Above and Beyond Accessibility Award" from the United States Department of Labor, and was presented at the Developing with Accessibility Event, hosted by the Federal Communications Commission in Washington DC in 2012.

How it works
-----

AccDC generates independent JavaScript objects, called AccDC Objects, that include customizable properties and methods which are used to control the functionality, content, and behavior of each AccDC Object at runtime. 

This makes it possible to render any type of user interface component, including wizards, carousels, dialogs, toolbars, tooltips, popups, lightboxes, menus, banners, tab controls, drag and drop controls, toggles, sliders, calendar pickers, or any other type of fully functional accessible user interface component.

AccDC includes integrated ARIA support to enhance intuitive page structuring for screen reader users, as well as a recursive Announce method that can be used to send textual messages to be dynamically announced for screen reader users. Additional ARIA attributes may be dynamically added to enhance advanced controls using AccDC's in-built Flow Control methods. 

AccDC renders HTML/XHTML valid markup, HTML5, DOM nodes, JavaScript output, XML node content, JSON object data, and content from remote API callbacks. 

AccDC automates accessibility by managing the processes associated with dynamic content rendering, so that the majority of common accessibility issues are automatically addressed when DOM manipulation occurs. 

For specific coding guidance, visit: http://whatsock.com/tsg

Distributed under the terms of the Open Source Initiative OSI - MIT License.

Developed and maintained by: Bryan Garaventa https://www.linkedin.com/in/bgaraventa
Or on Twitter at https://twitter.com/bryanegaraventa

Note: All visual design by Angela Ricci (web designer and web front-end developer). You can check her work at her personal site http://gericci.me/
Or you can follow her on Twitter at https://twitter.com/gericci

Project home:
-----

http://whatsock.com

Related projects:
-----

* WhatSock Organization: https://github.com/whatsock
* Visual ARIA: https://github.com/accdc/visual-aria

Understanding AccDC: A Quick Start Guide
-----

It helps to understand precisely what AccDC is and how it works at the most basic level.

The AccDC API is designed to process and normalize code across the three most widely used JavaScript libraries and frameworks, jQuery, Dojo, and MooTools.

To be specific, the AccDC API is an extension for jQuery, Dojo, and MooTools.

The AccDC API module interfaces with each of these libraries and frameworks in order to utilize all of the available rendering, AJAX, event handling, and associated processes, and extends them, so that any relevant command that is processed using the $A namespace, is automatically powered by the core processes within jQuery, Dojo, or MooTools.

An example showing the value of this, is described in the LinkedIn article at
http://lnkd.in/b9VGQxf

This means that, any widget that uses the following AccDC API methods, will automatically normalize equally across jQuery, Dojo, and MooTools, without requiring any coding changes to work correctly.

* $A.getEl // Get the element with the specified ID
* $A.createEl // Create a new element node, plus optional attributes, styling, and content
* $A.getAttr // Get the value of a specified attribute
* $A.setAttr // Set the value of one or more attributes
* $A.remAttr // Remove one or more attributes
* $A.getText // Get the textual content of a container element
(Coding documentation: WhatSock.com > Core API > Misc)

* $A.css // Get or Set the styling properties of one or more elements
* $A.hasClass // Check if an element includes one or more class names
* $A.addClass // Add one or more class names to an element
* $A.remClass // Remove one or more class names from an element
(Coding documentation: WhatSock.com > Core API > CSS)

* $A.bind // Add event handlers for one or more elements
* $A.unbind // Remove event handlers for one or more elements
* $A.trigger // Fire the specified event on an element
(Coding documentation: WhatSock.com > Core API > Events)

* $A.load // Pull markup code from an external resource and load into a container element
* $A.get // Pull code from an external resource and process it
* $A.getJSON // Pull JSON code from an external resource and process it
* $A.getScript // Execute an external JavaScript file
* $A.post // Submit data to a server side script using a POST request
* $A.ajax // Manually configure custom AJAX GET or POST requests
(Coding documentation: WhatSock.com > Core API > AJAX)

* $A.announce // Announce a string or the content of a container element to screen reader users
(Coding documentation: WhatSock.com > Core API > Accessibility)

There are many more AccDC API commands and customizable rendering functionalities documented on the Core API tab at WhatSock.com, but these cover all of the most commonly used public methods.

In order to test and verify this functionality, there are three dedicated TSG GitHub projects, all of which use the same component code for each widget type shared between them, which tie into the AccDC API for automatic normalization.

* Powered by jQuery: https://github.com/whatsock/tsg
* Powered by Dojo: https://github.com/whatsock/tsg-dojo
* Powered by MooTools: https://github.com/whatsock/tsg-mootools

In order to ensure the highest level of accessibility possible for all user types, including non-sighted screen reader users, mobility impaired keyboard only users, voice navigation software users, and low vision screen magnification software users, all of the scalable widgets provided within the TSG archives are programmed specifically to be as accessible as possible using all current standards, with specific adherence to the principles and guidelines documented at:

http://whatsock.com/training

Also available for download at:
https://github.com/whatsock/training

For community support, please address any questions to the Accessibility Innovators LinkedIn group, at:
https://www.linkedin.com/groups/Accessibility-Innovators-4512178

Future updates and announcements will be posted on Twitter, at
https://twitter.com/bryanegaraventa