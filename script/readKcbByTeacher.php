<?php
/**
 * 教师的课程表（大小班、一对一）：某天某个时间段上什么课zsdName? pass !=1 结束的不算
 * 大小班class和一对一student-study合并 16-8-31
 * extjs 统一采用jsonP，否则有时ajax跨域出错？？
*/
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

$arr = $req->params;

$teacherID = $arr->teacherID;
//$teacherID = $_REQUEST['teacherID']; //userId

$sql = "SELECT teacherID,timely_list,'一对一' As kcType 
	FROM `ghjy_student-study` 
	WHERE teacherID=$teacherID And pass=0 
Union All 
	SELECT teacherID,timely_list,'大小班' As kcType 
	FROM `ghjy_class` 
	WHERE teacherID=$teacherID And current=1 ";
	
$result = mysql_query($sql) or 
    die("Invalid query: readKcbByTeacher" . mysql_error());

$arr = array();
$i = 0;
//Iterate all Select
while($row = mysql_fetch_array($result))
{
	array_push($arr,$row);
	$i++;
}

$res->success = true;
$res->message = "读取教师排课表成功";
$res->data = $arr;

echo $_GET['callback']."(".$res->to_json().")";

/*echo json_encode($arr);
echo json_encode(array(
	"success" => true,
	"message" => "读取排课表",
	"data"	  => $arr
)); */

?>