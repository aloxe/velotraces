<?php

$name = $_FILES['file']['name'];

if (substr($name, -4, 4) == ".gpx") {
   // temporarly follow naming scheme on gpx
   if (substr($name, -7, 1) == ".") {
      $cc = substr($name, -7, 3);
      $root = substr($name, 0, -7);
   } else {
      $cc = ".xx";
      $root = substr($name, 0, -4);
   }
   $newname = $root.'-php'.$cc.'.gpx';
   $newpath = '../gpx/'.$newname;

   if (move_uploaded_file( $_FILES['file']['tmp_name'], $newpath)) {
     $data = array('status' => 201, 'message' => '🐝 File written \o/ ('.$name.')', 'name' => $newname);
   } else {
     $data = array("status"=> '0', "message"=> '☹ File NOT saved :o( ');
   }
} else {
   $data = array("status"=> '0', "message"=> '☹ File NOT saved (not a gpx)');
}

echo json_encode($data);
?>
