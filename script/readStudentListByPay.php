<?php
/*   
// 待课程付款审核的学生列表 checked=0
*/
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

$arr = $req->params;

$consultID = $arr->consultID; //所属咨询师

// 只获取 已经报名学习的 知识点列表
$query = "select * from `ghjy_student`  
	where consultID=$consultID and 
		Exists(select * from `ghjy_student-study`  
		where `ghjy_student`.studentID=`ghjy_student-study`.studentID and `ghjy_student-study`.checked=0 ) ";

$result = mysql_query($query) 
	or die("Invalid query: readStudentList By Pay" . mysql_error());
$res->total = mysql_num_rows($result);

$query_array = array();
$i = 0;
//Iterate all Select
while($row = mysql_fetch_array($result))
{
	array_push($query_array,$row);
	$i++;
}
$res->success = true;
//$res->total = $i;
$res->data = $query_array;
if($i == 0){
	$res->message = "查无相关数据";
}
else{
	$res->message = "有待付款课程的学生列表student pay读取成功";
}

echo $_GET['callback']."(".$res->to_json().")";
?>