<?php
/*log 选择知识点的教学教师
* 课程（学习知识点）排课
endlog */
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

    $arr = $req->params;
	
	$studentstudyID = $arr->studentstudyID;
	$teacherID = $arr->teacherID;
	$teach_weekday = addslashes($arr->teach_weekday);
	$teach_timespan = addslashes($arr->teach_timespan);
	$note = addslashes($arr->note);
		
	// 消除 字符串内容带 符号 addslash
	$query = "update `ghjy_student-study` set 
		teach_weekday = '$teach_weekday',
		teach_timespan = '$teach_timespan',
		note = '$note',
		teacherID = $teacherID 
		where studentstudyID = $studentstudyID ";

	$result = mysql_query($query) 
		or die("Invalid query: updateStudy by Kcb" . mysql_error());
	$res->success = true;
	$res->message = "课程排课study by kcb成功";
	$res->data = array();

echo $_GET['callback']."(".$res->to_json().")";
?>
