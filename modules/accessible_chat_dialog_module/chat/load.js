<?
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Cache-Control: post-check=0, pre-check=0', FALSE);
header('Pragma: no-cache');
header("Content-type: text/javascript");
ob_start();
if ($a == 'g') include('get.php');
elseif ($a == 's') include('sub.php');
elseif ($a == 'l') include('dialog.php');
?>