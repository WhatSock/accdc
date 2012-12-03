
$A.bind(window, 'load', function(){

	// Using an external object literal with JS
	$A.setFootnotes('files/footnotes.js', 0,
					{
					className: 'footnote',
					fnText: '_Footnote',
					targId: 'fns',
					hMax: 1
					});

/*
// Or using an external HTML markup file
$A.setFootnotes('files/footnotes.html', 1, {
className: 'footnote',
fnText: '_Footnote',
targId: 'fns',
hMax: 1
});
*/

});