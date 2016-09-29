<?php
/* 
 * 删除购买课程（一对一、大小班）缴费主记录 ajax instead of jsonp
 */
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Origin: *'); // 跨域问题
//header('Access-Control-Allow-Headers: X-Requested-With');

require_once('db/database_connection.php');

$accntID = ;

$sql = "SELECT accntID FROM `ghjy_accnt` Where schoolsubID=$accntID";
$result = mysql_query($sql);
//var_dump($result);
$i=0;

while($row = mysql_fetch_array($result))
{
	$accntID = $row['accntID'];
	echo $accntID;
	$query = "DELETE from `ghjy_accnt_detail` Where accntID = $accntID ";
	$result2 = mysql_query($query) or die("Invalid query: deleteAccnt" . mysql_error());
	
	$query3 = "DELETE from `ghjy_accnt` Where accntID = $accntID ";
	$result3 = mysql_query($query) or die("Invalid query: deleteAccnt" . mysql_error());
}



?>
