<?php
// 读取学科知识点
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

	$arr = $req->params;
	// 学科数理化，都属于科学
	$subject = addslashes($arr->subject);
	// 知识点分3个表
	if($subject=='数学'){
		$sql = "SELECT a.*,b.gradeName,$subject as subjectName 
			From `ghjy_zsd-sx` a 
			Join `ghjy_grade` b On a.gradeID=b.gradeID ";
	}elseif($subject=='物理'){
		$sql = "SELECT a.*,b.gradeName,$subject as subjectName  
			From `ghjy_zsd-wl` a 
			Join `ghjy_grade` b On a.gradeID=b.gradeID ";
	}elseif($subject=='化学'){
		$sql = "SELECT a.*,b.gradeName,$subject as subjectName  
			From `ghjy_zsd-hx` a 
			Join `ghjy_grade` b On a.gradeID=b.gradeID ";
	}
	/*
	$sql = " select a.*,b.subjectName  
		from `ghjy_zsd` a 
		 join `ghjy_subject` b 
		 on a.subjectID=b.subjectID
		where b.subjectName = '$subject' ";
    */
    $result = mysql_query($sql) 
		or die("Invalid query: readZsdList" . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取某个学科知识点zsd成功";
	$res->data = $query_array;


echo $_GET['callback']."(".$res->to_json().")";
?>