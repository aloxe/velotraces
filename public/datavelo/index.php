<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title><F0><9F><9A><B2>tracks</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <link rel="icon" type="image/png" href="/favicon.ico">
    <link rel="stylesheet" href="http://alix.guillard.fr/css/fonts.css" />
    <link rel="stylesheet" href="http://alix.guillard.fr/css/style.css" />
    <link rel="stylesheet" href="css/restyle.css" />
</head>
<body>

<?php
$velotracks = "gpx";
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
$known_countries = array();
$known_country_year = array();
echo "<table class=\"countries\"><tr>";
foreach ($tracks as $key => $val) {
    $y = substr($val, 0, 4);
    $countries = explode(".", $val);
    $trackname = preg_replace('/[-_]/', ' ', substr($countries[0], 10));
    array_shift($countries);
    array_pop($countries);
    foreach($countries as $k => $v) {
        if (!in_array($v, $known_countries)) {
            // convert iso 3166 letter to flag
            $lettred = mb_convert_encoding('&#' . (ord(substr($v, 0, 1)) + 127462 - 97) . ';', 'UTF-8', 'HTML-ENTITIES');
            $lettref = mb_convert_encoding('&#' . (ord(substr($v, 1, 2)) + 127462 - 97) . ';', 'UTF-8', 'HTML-ENTITIES');
            echo "<th> <a href=\"./$v\" class=\"flag\">$lettred$lettref</a><C2><A0></th>";
            array_push($known_countries, $v);
        }
        if (!in_array($v.$y, $known_country_year)) {
            array_push($known_country_year, $v.$y);
        }
    }
}
echo "</tr><tr>";
foreach($known_countries as $k => $v) {
    echo "<td valign=\"top\">";
    foreach($known_country_year as $k2 => $v2) {
        $v2y = substr($v2, 2,5);
        if (substr($v2, 0,2) == $v) {
            echo "<a href=\"./$v/$v2y\">$v2y</a><br/>";
        }

    }
    echo "</td>";
}
echo "</tr></table>";

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
        echo "<td><a href=\"./t/" .$val. "\">" .$trackname. "</a></td><td>";
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
<!-- Matomo -->
<script type="text/javascript">
  var _paq = window._paq = window._paq || [];
  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
  _paq.push(["setDocumentTitle", document.title]);
  _paq.push(["setDomains", ["*.alix.guillard.fr","*.alix.guillard.fr"]]);
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var u="//reunionweb.org/matomo/";
    _paq.push(['setTrackerUrl', u+'matomo.php']);
    _paq.push(['setSiteId', '3']);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.type='text/javascript'; g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
  })();
</script>
<noscript><p><img src="//alix.guillard.fr/matomo/matomo.php?idsite=3&amp;rec=1" style="border:0;" alt="" /></p></noscript>
<!-- End Matomo Code -->
    </body>
</html>
