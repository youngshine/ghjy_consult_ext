<?php
// 读取学生所有报读知识点（课程）
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

	$arr = $req->params;

	$studentID = $arr->studentID;
	//$prepaidID = $arr->prepaidID;
	//$prepaid = $arr->prepaid; //0缴费前，1缴费后成历史记录，不能修改

	/* 创建临时表（自动清除？），合并知识点（表中zsdID+subjectID才唯一）ghjy_zsd
	$sql = "CREATE TEMPORARY TABLE temp_zsd   
		SELECT * FROM `ghjy_zsd-sx` Union 
		SELECT * FROM `ghjy_zsd-wl` Union
		SELECT * FROM `ghjy_zsd-hx`";   
	$result = mysql_query($sql); 
	*/
	// 可能还没有排课教师，left join teacher
	$sql = " SELECT a.*,
		b.zsdName,c.subjectName,d.gradeName,e.teacherName,f.OrderID     
		FROM `ghjy_student-study` a 
		JOIN `ghjy_zsd` b on (a.zsdID=b.zsdID and a.subjectID=b.subjectID) 
		JOIN `ghjy_subject` c on a.subjectID=c.subjectID 
		JOIN `ghjy_grade` d on b.gradeID=d.gradeID 
		LEFT JOIN `ghjy_teacher` e ON a.teacherID=e.teacherID 
		JOIN `ghjy_student-prepaid` f on b.prepaidID=f.prepaidID  
		WHERE a.studentID = $studentID 
		Order by a.created Desc";   
    $result = mysql_query($sql) 
		or die("Invalid query: readStudyList by hist" . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取学生报读知识点（所有）student-study成功";
	$res->data = $query_array;


echo $_GET['callback']."(".$res->to_json().")";
?>