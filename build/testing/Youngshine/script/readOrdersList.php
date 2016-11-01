<?php
/*
 * 8-1 某个咨询师的销售订单（包括缴费记录fee汇总）
*/
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

	$req = new Request(array());
	$res = new Response();

	$arr = $req->params;

	$consultID = $arr->consultID;
	/* 不都是一对一，所以left join pricelist
	$sql = " SELECT a.*,b.studentName,c.title,c.hour  
		From `ghjy_accnt` a 
		Join `ghjy_student` b On a.studentId=b.studentID 
		Left Join `ghjy_pricelist` c On a.pricelistID=c.pricelistID 
		WHERE a.consultID = $consultID ";  */
	$sql = " SELECT a.*,b.studentName,c.consultName As consultName_owe,
		(SELECT sum(d.amount) From `ghjy_accnt_fee` d 
			WHERE d.accntID=a.accntID ) AS amount_done      
		From `ghjy_accnt` a 
		Join `ghjy_student` b On a.studentId=b.studentID 
		Left Join `ghjy_consult` c On a.consultID_owe=c.consultID 
		WHERE a.consultID = $consultID 
		Order By a.created Desc";	 
    $result = mysql_query($sql) 
		or die("Invalid query: readOrdersList " . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取咨询师缴费成功";
	$res->data = $query_array;

	echo $_GET['callback']."(".$res->to_json().")";
?>