<?php
/* 读取单一学生信息，与readList读取列表不同  
*/
require_once 'lib/response.php';
require_once 'lib/request.php';
require_once('lib/database_connection.php');

$request = new Request(array());
$res = new Response();

if(isset($request->params))
{
	$arr = $request->params;
	$query = "select * from student where student_id = $arr->id limit 1";
    $result = mysql_query($query)or die("Invalid query: readStudent1" . mysql_error());
	$row = mysql_fetch_array($result) or die("Invalid query: readStudent2" . mysql_error());
	//print_r($row);
	$query_array = array();
	$query_array[0] = $row;
		
	$res->success = true;
	$res->message = "读取学生个人信息成功";
	$res->data = $query_array;
}
else
{
    $res->success = false;
    $res->message = "参数错误";
    $res->data = array();
}
echo $_GET['callback']."(".$res->to_json().")";
?>