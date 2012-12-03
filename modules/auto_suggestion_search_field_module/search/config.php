<?
function cln($s){
$s = strip_tags($s);
$s = str_replace('\\', '', $s);
$s = str_replace('"', '', $s);
$s = str_replace('\'', '', $s);
$s = str_replace(';', '', $s);
$s = str_replace('%0d', '', $s);
$s = str_replace('%0D', '', $s);
$s = str_replace('%0a', '', $s);
$s = str_replace('%0A', '', $s);
return $s;
}
if ($max < 1) $max = 1;
$callback = cln($callback);
$q = cln($q);
$ret = array();
if ($q)
$ret = array_slice(preg_grep('/^' . preg_quote($q, '/') . '/i', file('list.txt')), 0, $max);
if (count($ret) && trim($ret[0]) != $q)
$n = '[\'' . implode('\',\'', $ret) . '\']';
else $n = '[]';
echo "$callback(" . str_replace("\n", '', $n) . ');';
?>