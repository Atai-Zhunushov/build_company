<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = $_POST['data'];

  $filename = 'data.csv';
  $file = fopen($filename, 'a');
  fwrite($file, $data);
  fclose($file);
}