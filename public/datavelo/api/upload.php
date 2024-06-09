<?php
$json = json_decode(file_get_contents("php://input"));

if (isset($json->slug))
    $slug = $json->slug;
if (isset($json->title))
    $title = $json->title;
if (isset($json->type))
    $type = $json->type;

if (isset($type) && $type == "FeatureCollection" && isset($slug)) {
    $filename = "../json/".$slug.".json";
} else {
    $filename = "../json/NOMDEFICHIER.json".$slug.$type;
}

$encodedJSON = json_encode($json, JSON_PRETTY_PRINT);
$fp = fopen($filename, "w") or die("Données non écrites");
$write = fwrite($fp, $encodedJSON);

if (isset($write))
    $data = array('status' => 201, 'message' => 'File written \o/ ('.$filename.')', 'title' => $title);
else
    $data = array("status"=> '0', "message"=> 'File NOT written :o( ');
echo json_encode($data);

fclose($fp);
chmod($filename, 0777);
?>
