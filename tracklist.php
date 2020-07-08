<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>🚲tracks</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <link rel="icon" type="image/png" href="/favicon.ico">
    <link rel="stylesheet" href="/css/fonts.css" />
    <link rel="stylesheet" href="/css/style.css" />
    <link rel="stylesheet" href="restyle.css" />
</head>
<body>

<?php
$velotracks = "allvelotracks";
$year = $_REQUEST['y'];
/* make sure country is iso 3166 */
if ($_REQUEST['c']) $country = ".".$_REQUEST['c'];

// An array of the gpx file names
$tracks = array();

//Open images directory
$dir = opendir($velotracks);

//List files in tracks directory
while (($file = readdir($dir)) !== false) {
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

asort($tracks);
echo "<table>";
$i = 0;
foreach ($tracks as $key => $val) {
    $date = substr($val, 0, 10);
    if ($date != "2010-01-01") {
        $i++;
        $countries = explode(".", $val);
        $trackname = preg_replace('/[-_]/', ' ', substr($countries[0], 10));
        array_shift($countries);
        array_pop($countries);
        echo "<tr><td>";
        echo $date;
        echo "</td><td><small>";
        echo $i."</small></td>";
        echo "<td><a href=\"http://alix.guillard.fr/cartes/velo/#?f=" .$val. "\">" .$trackname. "</a></td><td>";
        foreach($countries as $k => $v)
        {
            // convert iso 3166 letter to flag
            $lettred = mb_convert_encoding('&#' . (ord(substr($v, 0, 1)) + 127462 - 97) . ';', 'UTF-8', 'HTML-ENTITIES');
            $lettref = mb_convert_encoding('&#' . (ord(substr($v, 1, 2)) + 127462 - 97) . ';', 'UTF-8', 'HTML-ENTITIES');
            echo("$lettred$lettref ");
        }
        echo "</td></tr>";
    }
}
echo "</table>";
?>
    </body>
</html>
