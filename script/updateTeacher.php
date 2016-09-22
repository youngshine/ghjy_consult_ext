

<?php
/*log
*13-04-15 修改定期拼车发布日期判定bug
*13-04-16 增加mode字段判断发布日期
endlog */
require_once 'lib/response.php';
require_once 'lib/request.php';
require_once('lib/database_connection.php');

class Teacher
{		
	public $teacher_id;
	public $teacher_name;
	public $subject;
	public $gender;
	public $note;
}

$request = new Request(array());
$res = new Response();

if(isset($request->params))
{
    $arr = $request->params;
	//print_r($arr);
	$teacher = new Teacher();
	$teacher->teacher_id = ($arr->teacher_id);
	$teacher->teacher_name = ($arr->teacher_name);
	$teacher->subject = ($arr->subject);
	$teacher->gender = ($arr->gender);
	$teacher->note = ($arr->note);

	// 字符串用 但引号，数字不许引号	
	$query = "update teacher set teacher_name = '$teacher->teacher_name', subject = '$teacher->subject',
		gender = '$teacher->gender', note = '$teacher->note' where teacher_id = $teacher->teacher_id";
	//echo $query;
	$result = mysql_query($query)or die("Invalid query: updateTeacher" . mysql_error());
	$res->success = true;
	$res->message = "修改教师teacher成功";

}
else
{
    $res->success = false;
    $res->message = "参数错误";
}
$res->data = array();
echo $_GET['callback']."(".$res->to_json().")";
?>
