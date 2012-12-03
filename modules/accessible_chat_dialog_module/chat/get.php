<?
include('conf.php');
if ($t == $tm){
echo '$A.reg.chat.tmp.load([]);';
exit;
}
echo '$A.reg.chat.tmp.hash = \'' . $tm . '\';';
$msgs = file('msgs.txt');
echo '$A.reg.chat.tmp.load([';
$i = 0;
foreach ($msgs as $msg){
$msg = trim($msg);
if ($msg){
$i++;
$nw = explode('|', $msg);
echo '["' . str_replace('"', "\\\"", $nw[0]) . '", "' . str_replace('"', "\\\"", $nw[1]) . '"]';
if ($i < count($msgs)) echo ', ';
}
}
echo ']);';
?>