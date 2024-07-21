<?php

$year = $_REQUEST['y'];
/* make sure country is iso 3166 */
if ($_REQUEST['c']) $country = ".".$_REQUEST['c'];

// An array of the image file names
$tracks = array();

$velotracks = "../data/velo/gpx";

//Open images directory
if (is_dir($velotracks)) {
   $dir = opendir($velotracks);

   //List files in images directory
    while (($file = readdir($dir)) !== false)
    {
      if (substr($file, -3, 3)=="gpx") {
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

    echo json_encode($tracks); //, JSON_PRETTY_PRINT);
} else {
  echo('nope');
}



?>
