<?php
/*
 * 某个课程accntdetail一对一学生排课分配给教师
 * 拍客后后，待排课分班标志去除 accntdetail.isClassed，才能实现转班
*/
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

	$req = new Request(array());
	$res = new Response();

	$arr = $req->params;

	$studentID = $arr->studentID;
	$teacherID = $arr->teacherID;
	$timely_list = $arr->timely_list;
	$accntdetailID = $arr->accntdetailID;

	$query = "INSERT INTO `ghjy_one2n_student` 
		(studentID,teacherID,timely_list,accntdetailID) 
		VALUES ($studentID,$teacherID,'$timely_list',$accntdetailID)";
	$result = mysql_query($query) 
		or die("Invalid query: createOne2nStudent" . mysql_error());

	// 返回最新插入记录id
	//$id = mysql_insert_id(); 
	
	$query = "UPDATE `ghjy_accnt_detail` SET isClassed=1 
		Where accntdetailID=$accntdetailID ";
	$result = mysql_query($query) 
		or die("Invalid query: updateAccntDetail" . mysql_error());
	
	
	$res->success = true;
	$res->message = "一对一排课及消除待排标志isclass成功";
	//$res->data = array("classstudentID" => $id);

	echo $_GET['callback']."(".$res->to_json().")";
?>