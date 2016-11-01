<?php
/*log 
* 缴费，更新每条记录打折discount及付款方式、prepaid flag
* 1.先新增一条收费记录 student-fee，内容包括合并付费课程数组list列表studentsudyID
* 2.合并课程列表list数组循环，更新student-study表的相应记录，付费状态和折扣
endlog */
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

    $arr = $req->params;
	
	$studentstudyID = $arr->studentstudyID;
	$discount = $arr->discount;
	$payment = addslashes($arr->payment);
	$prepaid = $arr->prepaid;
		
	// 消除 字符串内容带 符号 addslash
	$query = "update `ghjy_student-study` set 
		payment = '$payment',
		discount = $discount,
		prepaid = $prepaid 
		where studentstudyID = $studentstudyID ";

	$result = mysql_query($query) 
		or die("Invalid query: updateStudy by prepay" . mysql_error());
	$res->success = true;
	$res->message = "课程缴费study by prepay成功";
	$res->data = array();

echo $_GET['callback']."(".$res->to_json().")";
?>
