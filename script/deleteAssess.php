<?php
/* 
 * 删除学生测评学科的主记录
 */
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

    $arr = $req->params;	
	$assessID = $arr->assessID;
	
	$sql = "SELECT 1 FROM `ghjy_student-student-topic` where assessID = $assessID";
	$result = mysql_query($sql);
	if(mysql_num_rows($result) > 0){
		$res->success = false;
		$res->message = "已经有测试内容，不能删除";
		$res->data = array();
	}else{	
		$query = "DELETE from `ghjy_student-assess` where assessID = $assessID ";
		$result = mysql_query($query) 
			or die("Invalid query: deleteStudentAssess" . mysql_error());
		$res->success = true;
	    $res->message = "删除测评学科主记录studentassess成功";
		$res->data = array();
	}	
	
echo $_GET['callback']."(".$res->to_json().")";
?>
