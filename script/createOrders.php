<?php
/*
 * 课程销售单（大小班、一对一课程）：
 * 1.保存订单accnt表＋2.缴款fee表payment,amt_now + 3.课程明细
 * 如果是退费，则子记录accntdetail isClassed=2（不能再排班排课一对一）
 * 先主表，然后循环插入子表记录
*/
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Origin: *'); // 跨域问题
//header('Access-Control-Allow-Headers: X-Requested-With');

require_once('db/database_connection.php');

$accntType = addslashes($_REQUEST['accntType']);
$accntDate = $_REQUEST['accntDate'];
$studentID = $_REQUEST['studentID'];
$amount_ys = $_REQUEST['amount_ys'];
$amount = $_REQUEST['amount'];
//$amount_owe = $_REQUEST['amount_owe'];
$note = addslashes($_REQUEST['note']);
// fee表，包括日期
$payment = addslashes($_REQUEST['payment']);
$amount_now = $_REQUEST['amount_now'];

$consultID_owe = $_REQUEST['consultID_owe']; //业绩归属咨询师

$consultID = $_REQUEST['consultID']; //哪个咨询师操作缴费
$schoolID = $_REQUEST['schoolID'];
$schoolsubID = $_REQUEST['schoolsubID']; //统计分校区，咨询师可能会换分校区

$arrList = $_REQUEST['arrList']; //报读的多个大小班
$arrList = json_decode($arrList); //json转换成数组 decode($a,true)
//$arrClasses = explode(',',$arrClasses);
//echo is_array($arrClasses);

// 1. 收费主记录（大小班，一对一）	
$sql = "INSERT INTO `ghjy_accnt` 
	(accntType,accntDate,amount_ys,amount,note,
		studentID,consultID_owe,consultID,schoolID,schoolsubID) 
	VALUES ('$accntType','$accntDate',$amount_ys,$amount,'$note',
		$studentID,$consultID_owe,$consultID,$schoolID,$schoolsubID)";
$result = mysql_query($sql) 
	or die("Invalid query: createAccnt" . mysql_error());

// 返回最新插入收费主记录id
$id = mysql_insert_id(); 

// 2. 缴款记录表fee
$sql2 = "INSERT INTO `ghjy_accnt_fee`(accntID,feeDate,amount,payment) 
	VALUES ($id,'$accntDate',$amount_now,'$payment')";
$result = mysql_query($sql2) 
	or die("Invalid query: createAccntFee" . mysql_error());

//$arrList = json_decode($arrList); //转换成数组 decode($a,true)
// 3.批量循环添加, not is_array
//if(is_object($arrList)){  
foreach($arrList as $rec){
	$title = $rec->title;
	$kclistID = $rec->kclistID;
	//$pricelistID = $rec->pricelistID;
	$unitprice = $rec->unitprice;
	$hour = $rec->hour;
	$amount = $rec->amount;
	$sql = "INSERT INTO `ghjy_accnt_detail`
		(accntID,title,kclistID,unitprice,hour,amount) 
		VALUES
		($id, '$title', $kclistID,$unitprice, $hour, $amount)";
	$result = mysql_query($sql) 
		or die("Invalid query: createAccntDetail" . mysql_error());

	// 退费的话，则必须更改原来购买课程的状态isClassed=0待分班，1分班，2退费
	if($accntType=='退费退班'){
		$accntdetailID = $rec->accntdetailID;
		$sql = "UPDATE `ghjy_accnt_detail` SET isClassed=2 
			Where accntdetailID = $accntdetailID ";
		$result = mysql_query($sql) 
			or die("Invalid query: updateAccntDetail isClassed=2" . mysql_error());
	} // 退费更改状态结束
}
//}

echo json_encode(array(
    "success" => true,
    "message" => "缴费3步成功",
	"data"    =>  array("accntID" => $id)
));

?>