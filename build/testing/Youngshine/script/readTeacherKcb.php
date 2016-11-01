<?php
/**
  * 读取某个时间段，学科教师上课情况（知识点＋学生人数）
  * 学科教师某个时间段（周六08-10),只上课一个知识点 group by weekday+timespan
*/
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

	$arr = $req->params;

	$weekday = addslashes($arr->weekday);
	$timespan = addslashes($arr->timespan);
	// 方便取得某个校区的学科的所有教师
	$subjectID = $arr->subjectID;
	$schoolID = $arr->schoolID; 
	// 没课的教师？？
	/*
	$query = " select count(a.studentstudyID) as persons,
		b.zsdName,b.grade,c.teacherName       
		from `ghjy_student-study` a 
		join `ghjy_zsd` b on a.zsdID=b.zsdID 
		join `ghjy_teacher` c on a.teacherID=c.teacherID  
		where a.teach_weekday = '$weekday' and 
		a.teach_timespan = '$timespan' 
		Group by a.teacherID,a.teach_weekday,a.teach_timespan "; */
/*	$query0 = "create table _tmp (
		teacherID int(11),
		teacherName varchar(9),
		zsdName varchar(30),
		persons int(1)
	);";
	$result = mysql_query($query0);
*/  
	/* 创建临时表（自动清除？），合并知识点（表中zsdID+subjectID才唯一）ghjy_zsd
	$sql = "CREATE TEMPORARY TABLE temp_zsd   
		SELECT * FROM `ghjy_zsd-sx` Union 
		SELECT * FROM `ghjy_zsd-wl` Union
		SELECT * FROM `ghjy_zsd-hx`";   
	$result = mysql_query($sql); 
	*/
	// 创建临时表，自动清除？？某个时间段的有课的学科教师临时表（当前校区的、当前学科的、当前时间段）
	$query = "CREATE TEMPORARY TABLE _tmp  
		SELECT count(a.studentstudyID) as persons, a.teacherID, b.zsdName        
		FROM `ghjy_student-study` a 
		JOIN `ghjy_zsd` b ON (a.zsdID=b.zsdID and a.subjectID=b.subjectID) 
		Join `ghjy_teacher` c On a.teacherID=c.teacherID  
		WHERE a.teach_weekday = '$weekday' AND a.teach_timespan = '$timespan' AND 
			a.subjectID=$subjectID And c.schoolID=$schoolID And a.teacherID>0  
		GROUP BY a.teacherID ";   
	$result = mysql_query($query); 
	
	// 本学科的所有教师（某个校区）		
	$query = "SELECT a.teacherName,a.teacherID,b.zsdName,b.persons 
		FROM `ghjy_teacher` a 
		LEFT JOIN `_tmp` b ON a.teacherID=b.teacherID 
		WHERE a.subjectID=$subjectID AND a.schoolID=$schoolID ";
	
	//$query2 = 'select * from ghjy_teacher';
	$result = mysql_query($query) 
		or die("Invalid query: readTeacherKcb " . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "获得某个时间段教师课程表teacherkcb成功";
	$res->data = $query_array;


echo $_GET['callback']."(".$res->to_json().")";
?>