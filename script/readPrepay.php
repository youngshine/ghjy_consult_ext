<?php
// 待预付款prepaid审核的报读课程知识点 prepaid=0,checked
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

	$arr = $req->params;

	//$studentID = $arr->studentID;
	//$checked = $arr->checked;
	$prepaid = $arr->prepaid;
	$consultID = $arr->consultID;

	$query = " select a.*,b.zsdName,c.subjectName,d.studentName,d.grade    
		from `ghjy_student-study` a 
		join `ghjy_zsd` b on a.zsdID=b.zsdID
		join `ghjy_subject` c on b.subjectID=c.subjectID  
		join `ghjy_student` d on a.studentID=d.studentID  
		where a.prepaid=$prepaid and d.consultID=$consultID ";
    
    $result = mysql_query($query) 
		or die("Invalid query: readStudyList by prepaid" . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取未付款课程student-study成功";
	$res->data = $query_array;


echo $_GET['callback']."(".$res->to_json().")";
?>