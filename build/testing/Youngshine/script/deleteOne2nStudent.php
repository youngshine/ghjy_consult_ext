<?php
/* 
 * 学生从一对N移出（转班或退学）就是删除！！current=0，不真正删除???否则上过课程无法统计（看点名course）
 * 同时，放入待一对多排，accntdetail isClassed=0
 */
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Origin: *'); // 跨域问题
//header('Access-Control-Allow-Headers: X-Requested-With');

require_once('db/database_connection.php');

$one2nstudentID = $_REQUEST['one2nstudentID'];	//unique
$accntdetailID = $_REQUEST['accntdetailID']; //更改分班状态用

// 禁用，不是真正删除，
//$query = "UPDATE `ghjy_class_student` SET current=0 Where classstudentID = $classstudentID ";
$query = "DELETE FROM `ghjy_one2n_student` Where one2nstudentID = $one2nstudentID ";
$result = mysql_query($query) 
	or die("Invalid query: deleteOne2nStudent" . mysql_error());

// 同时放入待排一对多 update accntdetail set isClassed=0
$query = "UPDATE `ghjy_accnt_detail` SET isClassed=0 
	Where accntdetailID = $accntdetailID ";
$result = mysql_query($query) 
	or die("Invalid query: updateAccntDetail by isClassed" . mysql_error());

echo json_encode(array(
    "success" => true,
    "message" => "学生移出一对多成功"
));

/*
$sql = "SELECT 1 FROM `ghjy_class_course` Where classstudentID = $classstudentID";
$result = mysql_query($sql);
if(mysql_num_rows($result) > 0){
    echo json_encode(array(
        "success" => false,
        "message" => "已经开课，不能删除"
    ));
}else{	
	$query = "DELETE from `ghjy_class_student` Where classstudentID = $classstudentID ";
	$result = mysql_query($query) 
		or die("Invalid query: deleteClassAttendee" . mysql_error());

	echo json_encode(array(
        "success" => true,
        "message" => "删除班级学生成功"
    ));
}	*/

?>
