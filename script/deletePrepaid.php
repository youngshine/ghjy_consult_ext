<?php
/* 
 * 删除购买课程，如果已经分配课程内容（知识点）student-study不能删除
 */
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

    $arr = $req->params;	
	$prepaidID = $arr->prepaidID;
	
	$sql = "SELECT 1 FROM `ghjy_student-study` where prepaidID = $prepaidID";
	$result = mysql_query($sql);
	if(mysql_num_rows($result) > 0){
		$res->success = false;
		$res->message = "已经安排课程内容，不能删除";
		$res->data = array();
	}else{	
		$sql = "DELETE from `ghjy_student-prepaid` where prepaidID = $prepaidID ";
		$result = mysql_query($sql) 
			or die("Invalid query: deleteStudentPrepaid" . mysql_error());
		$res->success = true;
	    $res->message = "删除购买课程prepaid成功";
		$res->data = array();
	}	
	
echo $_GET['callback']."(".$res->to_json().")";
?>
