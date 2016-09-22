<?php
/*log
*13-04-24 修改密码功能
endlog */
require_once 'lib/response.php';
require_once 'lib/request.php';
require_once 'lib/database_connection.php';
require_once 'lib/global_function.php';

$request = new Request(array());
$res = new Response();
if(isset($request->params))
{
    $arr=$request->params;
	$ret_arr = F_test_account_psd($arr->Account);
	if($ret_arr['valid']){
		$query="update member set Password = '$arr->Password' where $ret_arr[mode] = '$arr->Account'";
		$result = mysql_query($query)or die("Invalid query: updatePassword1" . mysql_error());
		$res->success = true;
		$res->message = "修改密码成功";
	}
	else{
		$res->success = false;
		$res->message = "账号有误";
	}
}
else
{
    $res->success = false;
    $res->message = "参数错误";
}
$res->data = array();
echo $_GET['callback']."(".$res->to_json().")";
?>
