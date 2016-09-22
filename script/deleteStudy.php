<?php
/* 
 * 删除学生报读课程
 */
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

    $arr = $req->params;	
	$studentstudyID = $arr->studentstudyID;
	
	$sql = "SELECT 1 FROM `ghjy_topic-teach` where studentstudyID = $studentstudyID";
	$result = mysql_query($sql);
	if(mysql_num_rows($result) > 0){
		$res->success = false;
		$res->message = "已经开始教学，不能删除";
		$res->data = array();
	}else{
	
		$query = "DELETE from `ghjy_student-study` where studentstudyID = $studentstudyID ";
		$result = mysql_query($query) 
			or die("Invalid query: deleteStudentStudy" . mysql_error());
		$res->success = true;
	    $res->message = "删除报读课程studentstudy成功";
		$res->data = array();
	}
echo $_GET['callback']."(".$res->to_json().")";
?>
