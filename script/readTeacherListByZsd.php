<?php

// 获得某个学校schoolID 当前学科的老师，学科来自知识点zsdID
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

	$req = new Request(array());
	$res = new Response();
	
	$arr = $req->params;

	$zsdID = $arr->zsdID;
	// 通过咨询师，获得校区?? 直接localStorage.schoolid
	$schoolID = $arr->schoolID; 
	
	$query = " SELECT a.* from `ghjy_teacher` a where 
		a.schoolID=$schoolID and 
		Exists (select * from `ghjy_zsd` b  
		where a.subjectID=b.subjectID and b.zsdID=$zsdID  )";
    
    $result = mysql_query($query) 
		or die("Invalid query: readTeacherList By zsd" . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取学科教师teacher by zsd成功";
	$res->data = $query_array;


echo $_GET['callback']."(".$res->to_json().")";
?>