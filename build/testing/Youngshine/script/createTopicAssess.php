<?php
// 当前学生的学科测评知识点列表3个，每个知识点一个题目
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Origin: *'); // 跨域问题
//header('Access-Control-Allow-Headers: X-Requested-With');
	
// 内部系统数据
require_once('db/database_connection.php');

	$zsdID_list = $_REQUEST['zsdID_list'];
	$arrZsd = explode(',',$zsdID_list);
	$subjectID = $_REQUEST['subjectID'];
	$level = $_REQUEST['level'];
	
	if($subjectID==1){
		$table = 'sx_xiaochu_exam_question';
	}elseif($subjectID==2){
		$table = 'wl_chu_exam_question';
	}else{
		$table = 'hx_chu_exam_question';
	} 

	// 该学生的该知识点的已经练习题目不能再出现 not in
	$query = "SELECT * from `$table` 
		Where level=$level And 
			(zsdID_list=$arrZsd[0] Or zsdID_list=$arrZsd[1] Or zsdID_list=$arrZsd[2]) 
		LIMIT 3";
    
    $result = mysql_query($query) 
		or die("Invalid query: readTopicList" . mysql_error());

	// 删除旧的delete, 插入insert 数据表topic-assess?? 
	// 还是前端，保存？
	
	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result)) {
	    //$topicID = $row["topicID"];
		$gid = $row["gid"];
		$query2 = "INSERT INTO `ghjy_student-assess-topic`
			(subjectID,zsdID,gid) 
			VALUES( $subjectID,$zsdID,'$gid' )";
	    $result2 = mysql_query($query2) 
			or die("Invalid query: createTopicAssess" . mysql_error());		
		array_push($query_array,$row);
		$i++;
	}
	
	echo json_encode($query_array);
?>