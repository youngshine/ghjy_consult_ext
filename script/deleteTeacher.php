<?php
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
require_once 'lib/response.php';
require_once 'lib/request.php';
require_once('lib/database_connection.php');

$request = new Request(array());
$res = new Response();

if(isset($request->params))
{
    $arr = $request->params;
	$query = "delete from teacher where teacher_id = $arr->teacher_id";
	$result = mysql_query($query)or die("Invalid query: deleteTeaher" . mysql_error());
	$res->success = true;
    $res->message = "删除教师成功";
}
else
{
    $res->success = false;
    $res->message = "参数错误";
}
$res->data = array();
echo $_GET['callback']."(".$res->to_json().")";
?>
