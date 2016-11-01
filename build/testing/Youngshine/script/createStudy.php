<?php
/** 
 * 一对一排课子表student-study，添加报读知识点 study <- zsd
 * 同时，更改关联父表accntdetail该课程isClassed=1，不能删除、退费
*/
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

$arr = $req->params;

// 知识点3个表，所以subjectID+zsdID才是唯一
$zsdID = $arr->zsdID;
$subjectID = $arr->subjectID;
//$fee = $arr->fee;
$times = $arr->times;
$studentID = $arr->studentID;
$accntdetailID = $arr->accntdetailID; //缴费的子记录，追踪用
//$accntID = $arr->accntID;
//$consultID = $arr->consultID; //属于哪个咨询师？？还是按学生
	
$query = "INSERT INTO `ghjy_student-study` 
	(zsdID,subjectID,times,studentID,accntdetailID) 
	VALUES 
	($zsdID,$subjectID,$times,$studentID,$accntdetailID)";
$result = mysql_query($query) 
	or die("Invalid query: createStudentStudy" . mysql_error());

// 返回最新插入记录id
$id = mysql_insert_id(); 

// 2. 更改父表课程状态排课isClass=1，禁止删除、退费缴费单
$query = "UPDATE `ghjy_accnt_detail` 
	Set isClassed = 1 
	Where accntdetailID=$accntdetailID ";
$result2 = mysql_query($query) 
	or die("Invalid query: updateAccntDetail isLassed=1" . mysql_error());	

$res->success = true;
$res->message = "添加一对一报读学科＋知识点studentstudy成功";
$res->data = array("studentstudyID" => $id);

echo $_GET['callback']."(".$res->to_json().")";
	
?>