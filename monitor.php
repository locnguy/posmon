<?php
require_once("db.php");
require_once("dblib.php");
?>

<?php
date_default_timezone_set('America/Los_Angeles');

$out = "";

$date_full = date("Y-m-d h:i:s A");
$out .= "<p>Current Time: $date_full</p>";

$date = date("Y-m-j");
//$date = "2015-01-31";

$orders = getOrderAndItemByDate($db, $date);

echo "<pre>";
//print_r($orders);
echo "</pre>";

$data_dir = "./data/$date/";

if (!file_exists($data_dir)) {
    mkdir($data_dir, 0777, true);
}

////already grouped
//$orderitems = unserialize(base64_decode(file_get_contents("orderitems.txt")));


foreach($orders as $order) {
	$order_number = $order['Number'];
	file_put_contents($data_dir .$order_number, json_encode($order));
}