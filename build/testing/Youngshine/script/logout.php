<?php
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
require_once 'lib/response.php';
require_once 'lib/request.php';
require_once('lib/database_connection.php');
$request = new Request(array());
$res = new Response();

if(isset($request->params))
{
    $array_r=$request->params;
	//$leave_time = time();
	$query="update member set IsOnline = 0,LastTime = now(),IP = '' where Member_ID = $array_r->Member_ID";
	$result = mysql_query($query)or die("Invalid query: logout1" . mysql_error());
	if($result){
		$res->success = true;
		$res->message = "注销成功";
	}
	else{
		$res->success = false;
		$res->message = "注销失败";
	}
}
else
{
    $res->success = false;
    $res->message = "参数错误";
}
$res->data = array();
echo $_GET['callback']."(".$res->to_json().")";
?>
