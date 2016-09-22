<?php
/*log 保存 题目 4个图片
* 2015 多个图片上传，分开一个一个处理
endlog */
require_once 'lib/response.php';
require_once 'lib/request.php';
require_once('lib/database_connection.php');

class Dataobj
{		
	public $topic_id;
	public $pic_topic; // 题目图片，有些公式的用图片描述，文字完不成
	public $pic_answer;
	public $pic_topic_exam; //对应的考题图片
	public $pic_answer_exam;
}

$request = new Request(array());
$res = new Response();

if(isset($request->params))
{
    $arr = $request->params;
	//print_r($arr);
	/*
	$dabaobj = new Dataobj();
	$dabaobj->topic_id = ($arr->topic_id);
	$dabaobj->pic_topic = ($arr->pic_topic); //addslashes($arr->name);
	$dabaobj->pic_answer = ($arr->pic_answer); //addslashes($arr->options);
	$dabaobj->pic_topic_exam = ($arr->pic_topic_exam); 
	$dabaobj->pic_answer_exam = ($arr->pic_answer_exam); 
	// $dataobj->pic = ???图片
	// 字符串用 但引号，数字不许引号	
	$query = "update topic set pic_topic = '$dabaobj->pic_topic', pic_answer = '$dabaobj->pic_answer',
		pic_topic_exam = '$dabaobj->pic_topic_exam', pic_answer_exam = '$dabaobj->pic_answer_exam' 
		where topic_id = $dabaobj->topic_id ";
	*/
	//echo $query;
	$cellIndex = $arr->cellIndex;
	switch ($cellIndex)
	{
		case '1':
			$img = addslashes($arr->pic_topic);
			$query = "update topic set pic_topic = '$img' where topic_id = $arr->topic_id ";
			break;
		case '2':
			$img = addslashes($arr->pic_answer);
			$query = "update topic set pic_answer = '$img' where topic_id = $arr->topic_id ";
			break;	
		case '3':
			$img = addslashes($arr->pic_topic_exam);
			$query = "update topic set pic_topic_exam = '$img' where topic_id = $arr->topic_id ";
			break;
		case '4':
			$img = addslashes($arr->pic_answer_exam);
			$query = "update topic set pic_answer_exam = '$img' where topic_id = $arr->topic_id ";
			break;	
	}
	
		
		
	$result = mysql_query($query)or die("Invalid query: updateTopicPic 1 not 4 pics" . mysql_error());
	$res->success = true;
	$res->message = "修改题目相片4个topicPic成功";
}
else
{
    $res->success = false;
    $res->message = "参数错误";
}
$res->data = array();
echo $_GET['callback']."(".$res->to_json().")";
?>
