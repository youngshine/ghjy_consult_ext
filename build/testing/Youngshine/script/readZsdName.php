<?php
// 通过id读取知识点名称
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

	$arr = $req->params;
	// 学科数理化，都属于科学
	$study_list = addslashes($arr->study_list);

	$query = "SELECT b.zsdName FROM `ghjy_student-study` a 
		JOIN `ghjy_zsd` b ON a.zsdID=b.zsdID 
		WHERE a.studentstudyID IN ($study_list)";
    
    $result = mysql_query($query) 
		or die("Invalid query: readZsdName" . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取某个学科知识点zsd成功";
	$res->data = $query_array;


echo $_GET['callback']."(".$res->to_json().")";
?>