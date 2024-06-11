<?php
$json = json_decode(file_get_contents("php://input"));

if (isset($json->slug))
    $slug = $json->slug;
if (isset($json->title))
    $title = $json->title;
if (isset($json->type))
    $type = $json->type;

if (isset($type) && isset($slug)) {
    if ($type == "FeatureCollection") {
        $filename = "../json/".$slug.".json";
        $encodedJSON = json_encode($json, JSON_PRETTY_PRINT);
        $fp = fopen($filename, "w") or die("Données non écrites");
        $write = fwrite($fp, $encodedJSON);

        $data = array('status' => 201, 'message' => '🐝 File written \o/ ('.$filename.')', 'title' => $title);

        fclose($fp);
        chmod($filename, 0777);
    } else {
        $data = array("status"=> '0', "message"=> '☹ File NOT written (wrong type) '.$slug);
    }
} else {
    $data = array("status"=> '0', "message"=> '☹ File NOT written :o( '.$slug);
}

echo json_encode($data);
?>
