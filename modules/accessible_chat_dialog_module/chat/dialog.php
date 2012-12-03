<?
$d = '<div class="fbDock clearfix">
<div class="rNubContainer clearfix">
<div class="fbNubGroup clearfix">
<div class="fbNubGroup clearfix">
<div id="fbDockChatTabsWrapper" class="fbNubGroup clearfix">
<div id="fbDockChatTabs" class="fbNubGroup clearfix">
<div class="fbNub fbDockChatTab user openToggler">
<div class="fbNubFlyout fbDockChatTabFlyout uiToggleFlyout">
<div class="fbNubFlyoutOuter">
<div class="fbNubFlyoutInner">

<div class="clearfix fbNubFlyoutTitlebar titlebar">
<div class="mls rfloat">
<a accesskey="c" role="button" title="Close Chat" class="uiTooltip close button" href="#">
<span class="uiTooltipWrap top center centertop">
<span class="uiTooltipText uiTooltipNoWrap">
Press Esc to close
</span>
</span>
</a>
</div>
<div class="titlebarLabel clearfix">
<div class="titlebarTextWrapper">
<span class="titlebarText">
Everyone
</span>
</div>
</div>
</div>

<div class="fbNubFlyoutBody scrollable">
<div class="fbNubFlyoutBodyContent">
<table class="uiGrid conversationContainer" cellSpacing="0" cellPadding="0">
<tr>
<td class="vTop">
<div class="conversation" id="conversation">
<div class="fbChatConvDateBreak">
Whenever
</div>
</div>
</td>
</tr>
</table>
</div>
</div>

<div class="fbNubFlyoutFooter">
<div class="inputContainer">
<textarea accesskey="m" wrap="logical" title="Message to Everyone" id="msgInput" class="uiTextareaAutogrow input"></textarea>
</div>
</div>

</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>';
$d = str_replace("\n", '', $d);
echo '$A.reg.chat.source = \'' . $d . '\';
$A.reg.chat.open();';
?>