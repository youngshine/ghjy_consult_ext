<?php
/*log
*16-05-09 测评做题评分：对1错0
endlog */
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

    $arr = $req->params;
	$done = $arr->done;
	$assesstopicID = $arr->assesstopicID;

	$query = "UPDATE `ghjy_student-assess-topic` set done = '$done' 
		where assesstopicID = $assesstopicID ";
	$result = mysql_query($query) 
		or die("Invalid query: updateTopicAssess " . mysql_error());
	$res->success = true;
	$res->message = "测评题目评分对错topic-teach成功";
	$res->data = array();
	
echo $_GET['callback']."(".$res->to_json().")";
?>
