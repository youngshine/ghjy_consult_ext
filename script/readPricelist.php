<?php

// 各个校区课程价格表
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

	$req = new Request(array());
	$res = new Response();
	
	$arr = $req->params;
	$schoolID = $arr->schoolID;
	
	$query = "SELECT a.*,b.schoolName 
		FROM `ghjy_pricelist` a 
		JOIN `ghjy_school` b ON a.schoolID=b.schoolID 
		Where a.schoolID=$schoolID  ";
    
    $result = mysql_query($query) 
		or die("Invalid query: readPricelist by school" . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取课程价格表pricelist成功";
	$res->data = $query_array;


echo $_GET['callback']."(".$res->to_json().")";
?>