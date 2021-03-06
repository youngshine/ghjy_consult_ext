<?php

// 某个学校一对N教师列表（有事先设定一对N上课时间 timely_list_one2n != ''）
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

$arr = $req->params;
$schoolID = $arr->schoolID;

// 有一对一上课时间
$query = "SELECT a.*,b.subjectName,c.schoolName 
	FROM `ghjy_teacher` a 
	JOIN `ghjy_subject` b ON a.subjectID=b.subjectID
	JOIN `ghjy_school` c ON a.schoolID=c.schoolID 
	Where a.schoolID=$schoolID And a.timely_list_one2n != ''
	Order by a.created Desc ";

$result = mysql_query($query) 
	or die("Invalid query: readTeacher by school" . mysql_error());

$query_array = array();
$i = 0;
//Iterate all Select
while($row = mysql_fetch_array($result))
{
	array_push($query_array,$row);
	$i++;
}
	
$res->success = true;
$res->message = "读取教师列表teacher成功";
$res->data = $query_array;


echo $_GET['callback']."(".$res->to_json().")";
?>