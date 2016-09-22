<?php
/*log
*13-04-15 增加拼车发布日期判定
*13-04-16 根据mode判断拼车日期
endlog */
require_once 'lib/response.php';
require_once 'lib/request.php';
require_once('lib/database_connection.php');

class Teacher
{		
	public $teacher_name;
	public $subject;
	public $gender;
	public $note;
}

$request = new Request(array());
//print_r($_REQUEST['data']);
$res = new Response();

if(isset($request->params))
{
    $arr = $request->params;
	//print_r($arr);
	$teacher = new Teacher();
	//$office->name=($arr->office_name);
	$teacher->teacher_name = $is_magic_gpc ? $name : addslashes($arr->teacher_name);
	$teacher->subject = ($arr->subject);
	$teacher->gender = ($arr->gender);
	$teacher->note=$is_magic_gpc ? $arr->note : addslashes($arr->note);
	//$route->StartLatitude=($arr->StartLatitude);

	$query="INSERT INTO teacher(teacher_name,subject,gender,note)
		VALUES('$teacher->teacher_name','$teacher->subject','$teacher->gender','$teacher->note')";
	//echo $query;
	$result = mysql_query($query)or die("Invalid query: createTeacher" . mysql_error());
	$res->success = true;
	$res->message = "添加教师数据成功";

}else{
    $res->success = false;
    $res->message = "参数错误";
}
$res->data = array();
echo $_GET['callback']."(".$res->to_json().")";
?>
