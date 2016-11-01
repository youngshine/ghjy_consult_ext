<?php
/*log 题库列表，例题
*13-05-07 ∞¥∑¢≤º ±º‰Ωµ–Ú≈≈–Ú
*13-05-10 ∂‘∑¢≤º¬∑œﬂΩ¯–– ±º‰π˝¬À
endlog */
require_once 'lib/response.php';
require_once 'lib/request.php';
require_once('lib/database_connection.php');

class Topic
{		
	public $topic_id;
	public $difficulty;
	public $source; //题目来源
		
	//public $topic_name;
	public $pic_topic;
	public $pic_answer; // 选择问答内容
	public $pic_topic_exam; // 例题对应的考题
	public $pic_answer_exam;

	public $studypt_id;
	public $studypt_name; //关联表字段名称
	public $subject;
	public $grade;
	public $semester;
	public $chapter;
}

$request = new Request(array());
$res = new Response();

if(isset($request->params)){ //有带参数，如 年段
	$arr = $request->params;
	//if(isset($arr->grade)) //如果带 年段 参数
	//	$condition1 = "grade = $arr->grade";
	//else
	//	$condition1 = true;	
	//$query = "select * from studypt where $condition1 and current=1 order by studypt_id DESC";
	// 数字，不需要引号 ''
	// 参数是知识点
	$query = "select a.*, b.studypt_name,b.subject,b.grade,b.semester,b.chapter 
		from topic as a,studypt as b 
		where a.studypt_id = b.studypt_id and a.studypt_id = $arr->studypt_id order by a.topic_id DESC ";

}else{
	$query = "select a.*, b.studypt_name,b.subject,b.grade,b.semester,b.chapter 
		from topic as a,studypt as b where a.studypt_id = b.studypt_id order by a.topic_id DESC ";
	//echo 'all';
}	


//echo $query;
$result = mysql_query($query)or die("Invalid query: readTopicList" . mysql_error());
$res->total = mysql_num_rows($result);


$query_array = array();
$i = 0;
//Iterate all Select
while($row = mysql_fetch_array($result))
{
	$topic = new Topic();
	
	$topic->topic_id = $row['topic_id'];
	//$topic->topic_name = $row['topic_name'];
	$topic->difficulty = $row['difficulty'];
	$topic->source = $row['source'];
	
	$topic->pic_topic = $row['pic_topic'];
	$topic->pic_answer = $row['pic_answer'];
	$topic->pic_topic_exam = $row['pic_topic_exam']; //对应的考题
	$topic->pic_answer_exam = $row['pic_answer_exam'];
	
	$topic->studypt_id = $row['studypt_id'];
	
	$topic->studypt_name = $row['studypt_name'];	
	$topic->subject = $row['subject'];
	$topic->grade = $row['grade'];
	$topic->semester = $row['semester'];
	$topic->chapter = $row['chapter'];
	
	$query_array[$i] = $topic;
	$i++;
}
$res->success = true;
//$res->total = $i;
$res->data = $query_array;
if($i==0){
	$res->message = "获取题目列表List数据成功";
}
else{
	$res->message = "参数错误";
}

echo $_GET['callback']."(".$res->to_json().")";
?>