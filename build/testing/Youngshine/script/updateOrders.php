<?php
/* 
 * 修改课程销售单，只更改：业绩归属咨询师、备注
 */

header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Origin: *'); // 跨域问题
//header('Access-Control-Allow-Headers: X-Requested-With');

require_once('db/database_connection.php');

$accntID = $_REQUEST['accntID']; //unique
$note = addslashes($_REQUEST['note']);
//$amount = $_REQUEST['amount'];
//$amount_owe = $_REQUEST['amount_owe'];
$consultID_owe = $_REQUEST['consultID_owe'];

$sql = "UPDATE `ghjy_accnt` 
	SET note = '$note',consultID_owe = $consultID_owe  
	Where accntID = $accntID ";
$result = mysql_query($sql) 
    or die("Invalid query: updateAccnt no detail" . mysql_error());

echo json_encode(array(
    "success" => true,
    "message" => "修改缴费成功"
));
  
?>
