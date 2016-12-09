<?php
/* 
 * 添加教师的一对N上课时间（预设），jsonP in sencha store
 * 已经排课学生one2n_student timely_list_one2n（包含）不能删除
 */
require_once('db/request.php');
require_once('db/response.php');
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

$arr = $req->params;

//$timely = addslashes($arr->timely); // to delete
$timely_list = addslashes($arr->timely_list);// old value
$teacherID = $arr->teacherID;
//$timely_list_new = $timely_list . ',' . $timely;

$sql = "UPDATE `ghjy_teacher` Set timely_list_one2n = '$timely_list' 
	Where teacherID=$teacherID LIMIT 1 ";
$result = mysql_query($sql) Or die("Invalid query: createTeacherOne2nTimely" . mysql_error());

$res->success = true;
$res->message = '添加教师一对N时间段timely成功';
$res->data = array();

echo $_GET['callback']."(".$res->to_json().")";

?>
