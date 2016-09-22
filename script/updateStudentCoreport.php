

<?php
/*log
* 学管与学生家长联络记录 textareafield
*13-04-15 修改定期拼车发布日期判定bug
*13-04-16 增加mode字段判断发布日期
endlog */
require_once 'lib/response.php';
require_once 'lib/request.php';
require_once('lib/database_connection.php');

class Student
{		
	public $student_id;
	public $coreport;
}

$request = new Request(array());
$res = new Response();

if(isset($request->params))
{
    $arr = $request->params;
	//print_r($arr);
	$student = new Student();
	$student->student_id = $arr->student_id;
	$student->coreport = addslashes($arr->coreport);
	
	$query = "update student set coreport = '$student->coreport' where student_id = $student->student_id";
	//echo $query;
	$result = mysql_query($query)or die("Invalid query: updateStudent coreport" . mysql_error());
	$res->success = true;
	$res->message = "保存学生家长联络记录成功";

}
else
{
    $res->success = false;
    $res->message = "参数错误";
}
$res->data = array();
echo $_GET['callback']."(".$res->to_json().")";
?>
