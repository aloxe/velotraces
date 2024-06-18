<?php
$json = json_decode(file_get_contents("php://input"));
if (isset($json->name))
    $name = $json->name;
if (isset($json->slug))
    $slug = $json->slug;

    $path = '../gpx/'.$name;
    $newpath = '../gpx/'.$slug.'.gpx';

   if (rename($path, $newpath)) {
     $data = array('status' => 201, 'message' => '🐝 File renamed « '.$newpath.' »');
   } else {
     $data = array("status"=> '0', "message"=> '🐛 File NOT renamed '.$path.' → '.$newpath);
   }

echo json_encode($data);
?>
