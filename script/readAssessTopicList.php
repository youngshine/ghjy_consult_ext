<?php
// 读取学生测评知识点，所有？
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

	$arr = $req->params;

	$studentID = $arr->studentID;
	//$prepaid = $arr->prepaid; //0缴费前，1缴费后成历史记录，不能修改

	$query = " SELECT a.*,b.zsdName,b.grade,c.subjectName,c.subjectID      
		FROM `ghjy_student-assess` a 
		JOIN `ghjy_zsd` b on a.zsdID=b.zsdID 
		JOIN `ghjy_subject` c on b.subjectID=c.subjectID 
		WHERE a.studentID = $studentID ";
    
    $result = mysql_query($query) 
		or die("Invalid query: readAssessList by student" . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取学生测评知识点student-assess成功";
	$res->data = $query_array;


echo $_GET['callback']."(".$res->to_json().")";
?>