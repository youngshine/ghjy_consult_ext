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
	$query = "select a.*, b.studypt_name,b.subject,b.grade,b.semester,b.chapter from topic as a,studypt as b where a.studypt_id = b.studypt_id and topic_id = $arr->id limit 1";
    $result = mysql_query($query)or die("Invalid query: readTopic1" . mysql_error());
	$row = mysql_fetch_array($result) or die("Invalid query: readTopic2" . mysql_error());
	//print_r($row);
	$query_array = array();
	$query_array[0] = $row;
		
	$res->success = true;
	$res->message = "读取题目（例题、考题）详细信息成功";
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