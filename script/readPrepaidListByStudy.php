<?php
// 某个咨询师下的购买课程的学生列表，尚未添加课程内容（知识点）
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

	$arr = $req->params;
	$consultID = $arr->consultID;
	// 购买小时，已安排课程内容小时
	$query = " SELECT a.*,b.studentName,b.grade,b.gender,
		(SELECT sum(times) from `ghjy_student-study` where prepaidID=a.prepaidID) 
			as times_study     
		FROM `ghjy_student-prepaid` a 
		JOIN `ghjy_student` b on a.studentID=b.studentID 
		WHERE b.consultID=$consultID And a.prepaidID NOT IN 
			(Select Distinct prepaidID From `ghjy_student-study` Where consultID=$consultID) 
		";
    
    $result = mysql_query($query) 
		or die("Invalid query: readPrepaidList by nostudy" . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取尚未添加内容的购买课程列表prepaid成功";
	$res->data = $query_array;


echo $_GET['callback']."(".$res->to_json().")";
?>