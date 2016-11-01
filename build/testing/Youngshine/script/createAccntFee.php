<?php
/*
 * 咨询师新增缴费记录）
*/
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Origin: *'); // 跨域问题
//header('Access-Control-Allow-Headers: X-Requested-With');

require_once('db/database_connection.php');

$feeDate = $_REQUEST['feeDate'];
$payment = addslashes($_REQUEST['payment']);
$amount = $_REQUEST['amount'];
$accntID = $_REQUEST['accntID'];  // associate父表

$query = "INSERT INTO `ghjy_accnt_fee` (feeDate,payment,amount,accntID) 
	VALUES('$feeDate','$payment',$amount,$accntID)";
$result = mysql_query($query) 
	or die("Invalid query: createAccntFee" . mysql_error());

// 返回最新插入记录id
$id = mysql_insert_id(); 

echo json_encode(array(
    "success" => true,
    "message" => "添加缴费记录成功",
	"data"    =>  array("accntfeeID" => $id)
));

?>
