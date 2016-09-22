<?php
/*log
*13-04-24 修改密码功能
endlog */
require_once 'db/response.php';
require_once 'db/request.php';
require_once 'db/database_connection.php';
//require_once 'lib/global_function.php';

$request = new Request(array());
$res = new Response();

if(isset($request->params))
{
    $arr = $request->params;
	$role = $arr->type;
	$id = $arr->id;
	$psw = $arr->psw;
	// 多带一个参数mode=admin,student,teacher，判断是：操作员、学生、教师？ 
	//$query = "update admin set psw = '$arr->psw'  where admin_id = $arr->id";	
	if ($role == 'admin')
		$query = "UPDATE admin set psw = '$psw'  where adminID = $id";	
	elseif ($role == 'teacher')
		$query = "UPDATE teacher set psw = '$psw'  where teacherID = $id";	
	elseif ($role == 'consult')//咨询
		$query = "UPDATE `ghjy_consult` set psw = '$psw'  where consultID = $id";	
	
	$result = mysql_query($query) or die("Invalid query: updatePassword1" . mysql_error());
	
	$res->success = true;
	$res->message = "修改密码成功";
}
else
{
    $res->success = false;
    $res->message = "参数错误";
}
$res->data = array();

echo $_GET['callback']."(".$res->to_json().")";
?>
