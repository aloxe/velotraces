<?php
$login = $_POST["login"];
$line = fgets(fopen('../../../../homes/psswd', 'r'));

if ($login == $line) {
    $data = array('status' => 201, 'message' => '🐝 login ok');
  } else {
    $data = array("status"=> '0', "message"=> '🕸️ not logged');
  }

echo json_encode($data);
?>