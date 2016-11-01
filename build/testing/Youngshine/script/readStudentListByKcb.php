<?php
/*   
// 待分配教师排课表的学生
*/
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

$arr = $req->params;

$consultID = $arr->consultID; //所属咨询师

/*
//课程尚未排课表的学生，某个咨询师：报读课程student-study尚无排课表student-study-kcb
$query = "select * from `ghjy_student`  
	where consultID=$consultID and 
		Exists(select * from `ghjy_student-study`  
		where `ghjy_student`.studentID=`ghjy_student-study`.studentID and
		Not Exists(select * from `ghjy_student-study-kcb` 
		where `ghjy_student-study`.studentstudyID = `ghjy_student-study-kcb`.studentstudyID) ) ";
*/

//课程尚未排课表的学生，报读课程student-study尚无教师,teacherID=0默认
$query = "SELECT a.* from `ghjy_student` a  
	WHERE a.consultID=$consultID and 
		Exists(select b.* from `ghjy_student-study` b 
		WHERE b.studentID=a.studentID and b.teacherID=0 )";
$result = mysql_query($query) 
	or die("Invalid query: readStudentList By Kcb" . mysql_error());
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
	$res->message = "读取报名学习的知识点列表listByStudying成功";
}

echo $_GET['callback']."(".$res->to_json().")";
?>