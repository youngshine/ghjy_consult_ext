<?php
/*
 * 8-1 某个学生的购买课程历史订单（大小班 或 一对一），退费包括？？？
*/
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

$arr = $req->params;

$studentID = $arr->studentID;
// consultID录入或业绩归属consultID_owe???
$sql = " SELECT a.*,b.consultName AS consultName_owe,
	(SELECT sum(d.amount) From `ghjy_accnt_fee` d 
		WHERE d.accntID=a.accntID ) AS amount_done  
	From `ghjy_accnt` a 
	Join `ghjy_consult` b On b.consultID=a.consultID 
	WHERE a.studentID = $studentID ";   
$result = mysql_query($sql) 
	or die("Invalid query: readAccntList by student" . mysql_error());

$query_array = array();
$i = 0;
//Iterate all Select
while($row = mysql_fetch_array($result))
{
	array_push($query_array,$row);
	$i++;
}
	
$res->success = true;
$res->message = "读取学生缴费成功";
$res->data = $query_array;

echo $_GET['callback']."(".$res->to_json().")";

?>