<?php
/* 
 * 删除教师的一对N上课时间（预设），jsonP in sencha store
 * 已经排课学生one2n_student timely_list_one2n（包含）不能删除
 */
require_once('db/request.php');
require_once('db/response.php');
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

$arr = $req->params;

$timely = addslashes($arr->timely); // to delete
$timely_list_one2n = addslashes($arr->timely_list_one2n);// old value
$teacherID = $arr->teacherID;

$sql = "SELECT 1 FROM `ghjy_one2n_student` 
	Where teacherID = $teacherID And timely_list Like '%$timely%' ";
$result = mysql_query($sql) Or die("Invalid query: updatekclist" . mysql_error());

if(mysql_num_rows($result) > 0){
	$res->success = false;
	$res->message = "该时间段已经排课学生，不能删除";
	$res->data = array();
}else{	
	$timely_list = explode(',',$timely_list_one2n);
	$key = array_search($timely ,$timely_list);
	//$timely_list_new = unset($timely_list_old[$key]);
	array_splice($timely_list,$key,1);
	//$timely_list_new = array_splice($timely_list_old,$key,1);
	$timely_list = implode(',',$timely_list);
	
	$sql2 = "UPDATE `ghjy_teacher` Set timely_list_one2n = '$timely_list' 
		Where teacherID=$teacherID LIMIT 1 ";
	$result2 = mysql_query($sql2);

	$res->success = true;
	$res->message = '删除时间段timely成功';
	//$res->total = 1;
	$res->data = array("timely_list_one2n"=>$timely_list);
}	

echo $_GET['callback']."(".$res->to_json().")";

?>
