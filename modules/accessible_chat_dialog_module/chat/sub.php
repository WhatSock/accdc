<?
function cln($s){
$s = strip_tags($s);
$s = str_replace("\n", ' ', $s);
$s = str_replace('|', '-', $s);
$s = trim($s);
return $s;
}
$n = cln($n);
$m = cln($m);
if (strlen($n) > 100) $n = substr($n, 0, 99);
if (strlen($m) > 420) $m = substr($m, 0, 419);
if ($n && $m){
include('sync.php');
$msgs = file('msgs.txt');
if (count($msgs) < 1) $msgs = array();
array_push($msgs, $n . '|' . $m . "\n");
if (count($msgs) > 10) array_shift($msgs);
$nw = implode('', $msgs);
$f = cfopen('msgs.txt', 'w');
cfwrite($f, $nw);
cfclose($f);
$fw = cfopen('conf.php', 'w');
cfwrite($fw, '<? $tm = \'' . md5($nw) . '\'; ?>');
cfclose($fw);
echo '$A.reg.chat.tmp.success();';
}
?>