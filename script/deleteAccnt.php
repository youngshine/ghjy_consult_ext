<?php
/* 
 * 删除购买课程（一对一、大小班）缴费主记录 ajax instead of jsonp
 * 只是作废，不能真正删除，因为有子表，而且发送过模版消息
 */
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Origin: *'); // 跨域问题
//header('Access-Control-Allow-Headers: X-Requested-With');

require_once('db/database_connection.php');

$accntID = $_REQUEST['accntID'];	
/*  作废缴费单，不需要考虑关联
$query = "UPDATE `ghjy_accnt` SET current=0 Where accntID = $accntID ";
$result = mysql_query($query) 
	or die("Invalid query: deleteAccnt disable" . mysql_error());
*/

// 1、先判断子表记录是否已经分班，如果是，不能删除
$sql = "SELECT isClassed FROM `ghjy_accnt_detail` Where accntID=$accntID";
$result = mysql_query($sql);
while($row = mysql_fetch_array($result))
{
	$isClassed = $row['isClassed'];
	echo $$isClassed;
	if($isClassed==1){
		echo json_encode(array(
		    "success" => false,
		    "message" => "已经排课，不能删除"
		));
		exit(); // 作废成功
	}
}

// 2、先删除子表detail，再删除主表accnt
$query = "DELETE FROM `ghjy_accnt_detail` Where accntID = $accntID ";
$result2 = mysql_query($query) or die("Invalid query: deleteAccntDetail" . mysql_error());

// 3、再删除主表accnt
$query3 = "DELETE FROM `ghjy_accnt` Where accntID = $accntID ";
$result3 = mysql_query($query3) or die("Invalid query: deleteAccnt" . mysql_error());


echo json_encode(array(
    "success" => true,
    "message" => "删除作废缴费单成功"
));
exit(); // 作废成功

$sql = "SELECT 1 FROM `ghjy_accnt_detail` Where accntID = $accntID";
$result = mysql_query($sql);

if(mysql_num_rows($result) > 0){
    echo json_encode(array(
        "success" => false,
        "message" => "已经开班，不能删除"
    ));
}else{	
	/*
	$sql = "SELECT 1 FROM `ghjy_student-study` Where accntID = $accntID";
	$result = mysql_query($sql);
	
	if(mysql_num_rows($result) > 0){
	    echo json_encode(array(
	        "success" => false,
	        "message" => "已经排课，不能删除"
	    ));
	}else{ */
		$query = "DELETE from `ghjy_accnt` Where accntID = $accntID ";
		$result = mysql_query($query) 
			or die("Invalid query: deleteAccnt" . mysql_error());

		echo json_encode(array(
	        "success" => true,
	        "message" => "缴费删除成功"
	    ));
	//}
}	

?>
