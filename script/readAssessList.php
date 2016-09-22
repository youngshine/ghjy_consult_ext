<?php
// 学生测评主记录
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

	$arr = $req->params;
	$consultID = $arr->consultID;

	$query = " SELECT a.*,b.studentName,b.grade,b.level_list,c.subjectName      
		From `ghjy_student-assess` a 
		Join `ghjy_student` b On a.studentID=b.studentID  
		Join `ghjy_subject` c On a.subjectID=c.subjectID 
		where b.consultID=$consultID ";
    
    $result = mysql_query($query) 
		or die("Invalid query: readAssessList by all" . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取学生测评主记录assess-list成功";
	$res->data = $query_array;


echo $_GET['callback']."(".$res->to_json().")";
?>