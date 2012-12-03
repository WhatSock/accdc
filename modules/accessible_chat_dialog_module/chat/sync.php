<?php
$dir_fileopen = "./sync_check";

if (file_exists($dir_fileopen) == false) {
mkdir($dir_fileopen, 0777);
}

function randomid() {
    return time().substr(md5(microtime()), 0, rand(5, 12));
}

function cfopen($filename, $mode, $overwriteanyway = false) {
    global $dir_fileopen;
    clearstatcache();
    do {
        $id = md5(randomid(rand(), TRUE));
        $tempfilename = $dir_fileopen."/".$id.md5($filename);
    } while(file_exists($tempfilename));
    if (file_exists($filename)) {
        $newfile = false;
        copy($filename, $tempfilename);
    }else{
        $newfile = true;
    }
    $fp = fopen($tempfilename, $mode);
    return $fp ? array($fp, $filename, $id, @filemtime($filename), $newfile, $overwriteanyway) : false;
}

function cfwrite($fp,$string) { return fwrite($fp[0], $string); }

function cfclose($fp, $debug = "off") {
    global $dir_fileopen;
    $success = fclose($fp[0]);
    clearstatcache();
    $tempfilename = $dir_fileopen."/".$fp[2].md5($fp[1]);
    if ((@filemtime($fp[1]) == $fp[3]) or ($fp[4]==true and !file_exists($fp[1])) or $fp[5]==true) {
        rename($tempfilename, $fp[1]);
    }else{
        unlink($tempfilename);
        if ($debug != "off") echo "While writing, another process accessed $fp[1]. To ensure file-integrity, your changes were rejected.";
        $success = false;
    }
    return $success;
}
?>