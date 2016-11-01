

<?php
/*log
*13-04-15 修改定期拼车发布日期判定bug
*13-04-16 增加mode字段判断发布日期
endlog */
require_once 'lib/response.php';
require_once 'lib/request.php';
require_once('lib/database_connection.php');

class Dataobj
{		
	public $topic_id;
	public $pic_topic; // 题目图片，有些公式的用图片描述，文字完不成
	public $pic_answer;
	public $difficulty;
	public $source;
	
	public $studypt_id; //所属知识点
	
	public $pic_topic_exam; //对应的考题图片
	public $pic_answer_exam;
}

$request = new Request(array());
$res = new Response();

if(isset($request->params))
{
    $arr = $request->params;
	//print_r($arr);
	$dabaobj = new Dataobj();
	$dabaobj->topic_id = ($arr->topic_id);
	//$dabaobj->pic_topic = ($arr->pic_topic); //addslashes($arr->name);
	//$dabaobj->pic_answer = ($arr->pic_answer); //addslashes($arr->options);
	$dabaobj->difficulty = ($arr->difficulty);
	$dabaobj->source = addslashes($arr->source);
	$dabaobj->studypt_id = ($arr->studypt_id);
	
	//$dabaobj->pic_topic_exam = ($arr->pic_topic_exam); 
	//$dabaobj->pic_answer_exam = ($arr->pic_answer_exam); 
	// $dataobj->pic = ???图片
	// 字符串用 但引号，数字不许引号	
	/*
	$query = "update topic set pic_topic = '$dabaobj->pic_topic', pic_answer = '$dabaobj->pic_answer',
		difficulty = '$dabaobj->difficulty', source = '$dabaobj->source',studypt_id = $dabaobj->studypt_id, pic_topic_exam = '$dabaobj->pic_topic_exam', pic_answer_exam = '$dabaobj->pic_answer_exam' where topic_id = $dabaobj->id"; */
	$query = "update topic set difficulty = '$dabaobj->difficulty', 
		source = '$dabaobj->source', studypt_id = $dabaobj->studypt_id 
		where topic_id = $dabaobj->topic_id ";
	//echo $query;
	$result = mysql_query($query)or die("Invalid query: updateTopic info" . mysql_error());
	$res->success = true;
	$res->message = "修改例题信息topic成功";
}
else
{
    $res->success = false;
    $res->message = "参数错误";
}
$res->data = array();
echo $_GET['callback']."(".$res->to_json().")";
?>
