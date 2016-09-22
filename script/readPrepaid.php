<?php
// 学生缴费记录
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

	$arr = $req->params;

	$studentID = $arr->studentID;

	$query = " select a.*,b.studentName       
		from `ghjy_student-prepaid` a 
		join `ghjy_student` b on a.studentID=b.studentID 
		where a.studentID = $studentID ";
    
    $result = mysql_query($query) 
		or die("Invalid query: readPrepaid " . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取学生缴费记录student-prepaid成功";
	$res->data = $query_array;


echo $_GET['callback']."(".$res->to_json().")";
?>