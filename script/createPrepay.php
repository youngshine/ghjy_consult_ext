<?php
/** 
* 生成缴费单：现金、刷卡、扫码
*
*/
//define('ROOT' , pathinfo(__FILE__, PATHINFO_DIRNAME));
//require_once(ROOT . '../../lib/some_class.php');
/*
function load_class($class_name)
{
    //path to the class file
    $path = ROOT . '/lib/' . $class_name . '.php');
    require_once( $path );
}
 
load_class('Database');
load_class('Mail');
*/
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

	$arr = $req->params;

	$studentID = $arr->studentID;	
	$study_list = addslashes($arr->study_list);
	$payment = addslashes($arr->payment);
	$subtotal = $arr->subtotal;
	$discount = $arr->discount;
	$amt = $arr->actualtotal; //实收
	$OrderID = addslashes($arr->OrderID); //刷卡交易单
	//$consultID = $arr->consultID; //属于哪个咨询师？？还是按学生
		
	$query = "INSERT INTO `ghjy_student-prepaid` 
		(studentID,study_list,payment,subtotal,discount,amt,OrderID) 
	 VALUES ($studentID,'$study_list','$payment',$subtotal,$discount,$amt,'$OrderID')";

	$result = mysql_query($query) 
		or die("Invalid query: createPrepay" . mysql_error());

	// 返回最新插入记录id
	$id = mysql_insert_id(); 
	
	// 2 更新student-study记录状态 prepaid,prepaidID
	//$study_list = explode(',',$study_list);
	$sql = "UPDATE `ghjy_student-study` SET prepaid=1,prepaidID=$id 
		WHERE studentstudyID IN ($study_list) ";
	$result = mysql_query($sql) 
		or die("Invalid query: update study by prepaid" . mysql_error());
		
	$res->success = true;
	$res->message = "生成缴费单prepay成功成功";
	$res->data = array("prepaidID" => $id);


echo $_GET['callback']."(".$res->to_json().")";
?>