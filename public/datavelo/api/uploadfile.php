<?php
$name = $_FILES['file']['name'];

if (substr($name, -4, 4) == ".gpx") {
   $newname = '../gpx/'.$name;

   if (move_uploaded_file( $_FILES['file']['tmp_name'], $newname)) {
//   send_OK();
     $data = array('status' => 201, 'message' => '🐝 File written \o/ ('.$name.')', 'name' => $name);
   } else {
     $data = array("status"=> '0', "message"=> '☹ File NOT saved :o( ');
   }
} else {
     $data = array("status"=> '0', "message"=> '☹ File NOT saved (not a gpx)');
}

echo json_encode($data);
?>
