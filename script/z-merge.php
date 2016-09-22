<?php
/**
  * 读取某个时间段，学科教师上课情况（知识点＋学生人数）
  * 学科教师某个时间段（周六08-10),只上课一个知识点 group by weekday+timespan
*/
//require_once 'db/response.php';
//require_once 'db/request.php';
require_once('db/database_connection.php');

//$req = new Request(array());
//$res = new Response();

	//$arr = $req->params;

			
	$sql = "SELECT gid,zsdID_list,difficulty,score,objective_flag  
		from `hx_chu_exam_question_index` limit 17000,10000 ";
	$result = mysql_query($sql);
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		//array_push($query_array,$row);
		$gid = $row['gid'];
		$zsdID_list = $row['zsdID_list'];
		$difficulty = $row['difficulty'];
		$score = $row['score'];
		$objective_flag = $row['objective_flag'];
		$sql2 = "UPDATE `hx_chu_exam_question` set 
			zsdID_list = '$zsdID_list',difficulty=$difficulty,
			score = $score, objective_flag=$objective_flag, gid_temp='$gid'  
		where gid= '$gid' ";
		$result2 = mysql_query($sql2);	
		$i++;
	}

?>