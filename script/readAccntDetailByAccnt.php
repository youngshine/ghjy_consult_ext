<?php
/*
 * 8-1 某个缴费单的子表明细（报读内容）
*/
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

	$req = new Request(array());
	$res = new Response();

	$arr = $req->params;

	$accntID = $arr->accntID;
	// isClassed=0 为排课状态，没有排课才能修改？
	$sql = " SELECT a.kclistID,a.unitprice,a.hour,a.amount,b.title  
		From `ghjy_accnt_detail` a 
		Join `ghjy_kclist` b On a.kclistID=b.kclistID 
		WHERE a.accntID = $accntID "; 
	$result = mysql_query($sql) 
		or die("Invalid query: readAccntDetail By accnt " . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取缴费子表成功";
	$res->data = $query_array;

	echo $_GET['callback']."(".$res->to_json().")";
?>