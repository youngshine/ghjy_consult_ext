<?php

// 读取某个咨询师的报名学生
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

	$req = new Request(array());
	$res = new Response();
	
	$arr = $req->params;

	$consultID = $arr->consultID;
	//group by student+zsd?，一个学生可以报读同样知识点？？
	$query = " SELECT * from `ghjy_student`  
		Where consultID=$consultID Order by created Desc ";
    
    $result = mysql_query($query) 
		or die("Invalid query: readStudentListByConsult" . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取报名学生student成功";
	$res->data = $query_array;


echo $_GET['callback']."(".$res->to_json().")";
?>