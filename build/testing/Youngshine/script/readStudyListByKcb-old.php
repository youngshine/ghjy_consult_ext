<?php
// 读取尚未排课表的课程（知识点）
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

	$arr = $req->params;

	$studentID = $arr->studentID;

	$query = " select a.*,b.zsdName,b.grade,b.subject     
		from `ghjy_student-study` a 
		join `ghjy_zsd` b on a.zsdID=b.zsdID 
		where a.studentID = $studentID and 
		Not Exists(select * from `ghjy_student-study-kcb` c where 
			a.studentstudyID = c.studentstudyID )  ";
    
    $result = mysql_query($query) 
		or die("Invalid query: readStudyList by student" . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取学生报读知识点student-study成功";
	$res->data = $query_array;


echo $_GET['callback']."(".$res->to_json().")";
?>