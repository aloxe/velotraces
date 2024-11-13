<?php
$velotracks = "json";

// An array of the json file names
$tracks = array();

//Open images directory
$dir = opendir($velotracks);

//List files in tracks directory
while (($file = readdir($dir)) !== false) {
  $geojson = json_decode(file_get_contents(__DIR__."/".$velotracks."/".$file));

  if (isset($geojson->slug)) {
    $date = $geojson->date;
    $title = $geojson->title;
    $slug = $geojson->slug;
    $countries = $geojson->countries;
    array_push($tracks,[
	'date' => $geojson->date,
	'title' => $geojson->title,
	'slug' => $geojson->slug,
	'countries' => $geojson->countries,
    ]);
  }
}
closedir($dir);
sort($tracks);
echo json_encode($tracks);
?>
