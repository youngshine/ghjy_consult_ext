<?php
/* 
 * 删除学生报读知识点，一对一，上课了course不能删除
 * 同时判断，报读知识点是否为空（可以退费或删除）accntdetail - > accnt
 */
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Origin: *'); // 跨域问题
//header('Access-Control-Allow-Headers: X-Requested-With');

require_once('db/database_connection.php');

$studentstudyID = $_REQUEST['studentstudyID'];
// 多传一个参数，用于判断是否为空，2.状态isClass = 0
$accntdetailID = $_REQUEST['accntdetailID'];

// 开始教学，则不能删除
//$sql = "SELECT 1 FROM `ghjy_topic-teach` Where studentstudyID = $studentstudyID";
$sql = "SELECT 1 FROM `ghjy_teacher_course` Where studentstudyID = $studentstudyID";

$result = mysql_query($sql) or die("Invalid query: createOrders" . mysql_error());

if(mysql_num_rows($result) > 0){
    echo json_encode(array(
        "success" => false,
        "message" => "已经上课，不能删除"
    ));
}else{	
	$query = "DELETE FROM `ghjy_student-study` 
		WHERE studentstudyID = $studentstudyID ";
	$result = mysql_query($query) 
		or die("Invalid query: deleteStudentStudy" . mysql_error());

	// 2. 判断当前课程报读知识点student-study是否为空、
	// 如果是，更改父表课程状态排课isClass=0，作为后续判断是否可以删除、退费缴费单
	$query = "SELECT 1 FROM `ghjy_student-study` 
		Where accntdetailID = $accntdetailID ";
	$result2 = mysql_query($query);	
	
	if(mysql_num_rows($result) > 0){
		$query = "UPDATE `ghjy_accnt_detail` 
			Set isClassed = 0
			Where accntdetailID=$accntdetailID ";
		$result2 = mysql_query($query) 
			or die("Invalid query: updateAccntDetail isLassed = 0" . mysql_error());	
	}
	
    echo json_encode(array(
        "success" => true,
        "message" => "删除成功"
    ));
}

?>
