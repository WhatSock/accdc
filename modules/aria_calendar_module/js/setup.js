
$A.bind(window, 'load', function(){

	// Syntax : setCalendar( ID , TriggeringElement , TargetEditField , EnableComments )

	// Basic calendar with comment editing disabled
	$A.setCalendar('BasicCalendar', $A.getEl('dateLnk'), $A.getEl('date'));

	// Advanced calendar with comment editing enabled
	$A.setCalendar('AdvancedCalendar', $A.getEl('partyLnk'), $A.getEl('party'), true);

// Programmatically disable an array of dates in the month of December (remove below slashes to enable)
// $A.reg.AdvancedCalendar.range[11].disabled['*'] = [
// 25
// ];

// Programmatically set a global comment for December 25 of every year (remove below slashes to enable)
// $A.reg.AdvancedCalendar.range[11].comments['*'] = {
// 25 : 'Merry Christmas!'
// };

// Programmatically set a comment for December 24 and 25 of 2011 only (remove below slashes to enable)
// $A.reg.AdvancedCalendar.range[11].comments[2011] = {
// 24 : 'Happy Christmas Eve!',
// 25 : 'Merry Christmas!'
// };

});