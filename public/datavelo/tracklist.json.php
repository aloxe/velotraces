<?php
$velotracks = "json";
$year = $_REQUEST['y'];
/* make sure country is iso 3166 */
if ($_REQUEST['c']) $country = ".".$_REQUEST['c'];

// An array of the json file names
$tracks = array();

//Open images directory
$dir = opendir($velotracks);

//List files in tracks directory
while (($file = readdir($dir)) !== false) {
    if (substr($file, -4, 4)=="json") {
        // if no selection we display all tracks
        if (!$year && !$country) {
            $tracks[] = $file;
        }
        else if (substr($file, 0, 4)==$year || !$year) { // year in file or no year choice
            if (strpos($file, $country) != FALSE || !$country) { // country in file or no country choice
                $tracks[] = $file;
            }
        }
    }
}
closedir($dir);
sort($tracks);
$trackliste = [];
$i = 0;
foreach ($tracks as $key => $val) {
    $date = substr($val, 0, 10);
    if ($date != "2010-01-01") {
        $i++;
        $countries = explode(".", $val);
        $name = preg_replace("/[-_]/", " ", substr($countries[0], 10));
        array_shift($countries);
        array_pop($countries);
        $cc = implode(" ", $countries);
        $flag = "";
        foreach($countries as $k => $v)
        {
            // convert iso 3166 letter to flag
            $lettred = mb_convert_encoding('&#' . (ord(substr($v, 0, 1)) + 127462 - 97) . ';', 'UTF-8', 'HTML-ENTITIES');
            $lettref = mb_convert_encoding('&#' . (ord(substr($v, 1, 2)) + 127462 - 97) . ';', 'UTF-8', 'HTML-ENTITIES');
            $flag = $flag." ".$lettred.$lettref;
        }
        $trackobject = (object) ['id' => $i, 'date' => $date, 'name' => $name, 'url' => $val, 'cc' => $cc, 'flag' => $flag];
        array_push($trackliste, $trackobject);
    }
}
echo json_encode($trackliste);
?>
