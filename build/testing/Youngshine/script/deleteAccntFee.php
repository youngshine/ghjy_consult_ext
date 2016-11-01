<?php
/* 
 * 删除缴费记录
 */
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Origin: *'); // 跨域问题
//header('Access-Control-Allow-Headers: X-Requested-With');

require_once('db/database_connection.php');

$accntfeeID = $_REQUEST['accntfeeID'];	

$query = "DELETE FROM `ghjy_accnt_fee` Where accntfeeID = $accntfeeID ";
$result = mysql_query($query) or die("Invalid query: deleteAccntFee" . mysql_error());

echo json_encode(array(
    "success" => true,
    "message" => "删除缴费记录成功"
));

?>
