<?php
/*log
*13-04-15 增加拼车发布日期判定
*13-04-16 根据mode判断拼车日期
endlog */
require_once 'lib/response.php';
require_once 'lib/request.php';
require_once('lib/database_connection.php');

// 先上传图片d


class Dataobj
{		
	public $pic_topic;  // 新增，只是一个例题图片
	//public $pic_answer; //题目、答案图片文件名
	//public $options;
	public $difficulty;
	
	public $source;
	public $studypt_id; //所属知识点
}

$request = new Request(array());
//print_r($_REQUEST['data']);
$res = new Response();

if(isset($request->params))
{
    $arr = $request->params;
	//print_r($arr);
	$topic = new Dataobj();
	$topic->pic_topic = ($arr->pic_topic);
	//$topic->pic_answer = ($arr->pic_answer);
	//$topic->topic_name = $is_magic_gpc ? $arr->topic_name : addslashes($arr->topic_name);
	//$topic->options = $is_magic_gpc ? $arr->options : addslashes($arr->options);
	$topic->difficulty = ($arr->difficulty); //下拉选择的，没有特殊符号
	//$topic->answer = $is_magic_gpc ? $arr->answer : addslashes($arr->answer);
	$topic->source=$is_magic_gpc ? $arr->source : addslashes($arr->source);
	$topic->studypt_id = ($arr->studypt_id);

	$query = "INSERT INTO topic(pic_topic,difficulty,source,studypt_id)
		VALUES('$topic->pic_topic','$topic->difficulty','$topic->source',$topic->studypt_id)";
	//echo $query;
	$result = mysql_query($query)or die("Invalid query: createTopic" . mysql_error());
	
	$res->success = true;
	$res->message = "添加例题topic成功";
	
	// 返回最新添加数据记录的id order by 时间字段 desc limit 1
	$query = "SELECT LAST_INSERT_ID() limit 1"; 
	$result = mysql_query($query)or die("Invalid query: createTopic select last_id" . mysql_error());
	$row = mysql_fetch_row($result); 
	$res->data = array("topic_id" => $row[0]);

}else{
    $res->success = false;
    $res->message = "参数错误";
	$res->data = array();
}

echo $_GET['callback']."(".$res->to_json().")";
?>
