<?php
/**
 * 学生的课程表（大小班、一对一）：某天某个时间段上什么课zsdName? pass !=1 结束的不算
 * 大小班class和一对一student-study合并 16-8-31
 * extjs 统一采用jsonP，否则有时ajax跨域出错？？
*/
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

$arr = $req->params;

$studentID = $arr->studentID;
//$teacherID = $_REQUEST['teacherID']; //userId

$sql = "SELECT studentID,timely_list,'一对一' As kcType 
	FROM `ghjy_student-study` 
	WHERE studentID=$studentID And pass=0 
Union All 
	SELECT a.studentID,b.timely_list,'大小班' As kcType 
	FROM `ghjy_class_student` a 
	Join `ghjy_class` b On a.classID = b.classID
	WHERE a.studentID=$studentID And b.current=1 ";
	
$result = mysql_query($sql) or 
    die("Invalid query: readKcb by student" . mysql_error());

$arr = array();
$i = 0;
//Iterate all Select
while($row = mysql_fetch_array($result))
{
	array_push($arr,$row);
	$i++;
}

$res->success = true;
$res->message = "读取学生排课表成功";
$res->data = $arr;

echo $_GET['callback']."(".$res->to_json().")";

/*echo json_encode($arr);
echo json_encode(array(
	"success" => true,
	"message" => "读取排课表",
	"data"	  => $arr
)); */

?>