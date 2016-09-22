<?php
/* 
 * 删除学生，检验是否可以删除：缴费或者其它？
 */
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

$arr = $req->params;	
$studentID = $arr->studentID;

$query = "SELECT 1 FROM `ghjy_accnt` WHERE studentID = $studentID limit 1";

$result = mysql_query($query) 
	or die("Invalid query: deleteStudent y/n" . mysql_error());
if(mysql_num_rows($result) > 0){
	$res->success = false;
	$res->message = "当前有报读缴费，不能删除";
	$res->data = array();
}else{	
	$query = "DELETE FROM `ghjy_student` WHERE studentID = $studentID ";
	$result = mysql_query($query) 
		or die("Invalid query: deleteEnrollstudent" . mysql_error());
	$res->success = true;
    $res->message = "删除报名学生student成功";
	$res->data = array();
}
	
echo $_GET['callback']."(".$res->to_json().")";

?>
