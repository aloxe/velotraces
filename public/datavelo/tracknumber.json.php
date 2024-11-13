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
            if (substr($val, 0, 10) != "2010-01-01") $tracks[] = $file;
        }
        else if (substr($file, 0, 4)==$year || !$year) { // year in file or no year choice
            if (strpos($file, $country) != FALSE || !$country) { // country in file or no country choice
                if (substr($val, 0, 10) != "2010-01-01") $tracks[] = $file;
            }
        }
    }
}
closedir($dir);

$trackobject = (object) ['number' => sizeof($tracks)];
echo json_encode($trackobject);
?>
