The Auto Suggest demo uses server side scripting to provide a callback that AccDC uses to render content.

Though the demo contacts the WhatSock.com server for this purpose, the PHP script is provided within the folder "search", and the JavaScript can easily be modified to point to the PHP script in this local folder instead. A web server supporting PHP is required for this functionality.

The search script is a simple PHP script that demonstrates how to reference AccDC using a dynamic callback function to render content.