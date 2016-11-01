<?php
/*log 学生网上注册web 以及 现场报名，以电话Phone唯一，要判断
*13-11-6 去掉默认头像
endlog */
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');


$req = new Request(array());
$res = new Response();

$arr = $req->params;

$studentName = $is_magic_gpc ? $arr->studentName : addslashes($arr->studentName);
$gender = $arr->gender;
$born = $arr->born;
$grade = $arr->grade;
$phone = addslashes($arr->phone);
$addr = $is_magic_gpc ? $arr->addr : addslashes($arr->addr);
$note = addslashes($arr->note);
$schoolsubID = $arr->schoolsubID;
$schoolID = $arr->schoolID;
	
	//$level_list = addslashes($arr->level_list); //数组字符
	//$student->email = ''; //addslashes($arr->email);
	//$student->qq = addslashes($arr->qq);
	//$student->enrolled = 1; //$arr->enrolled;; //网上注册 enrolled=0，现场报名=1
	
$consultID = isset($arr->consultID) ? $arr->consultID : 0 ; //当前咨询师，网上注册默认 0
	//isset($array_r->Sex) ? $user->Sex = $array_r->Sex : $user->Sex = 0;
	/*if($user->Sex)
		$user->HeadPhoto = '/carpool/image/male.jpg';
	else
		$user->HeadPhoto = '/carpool/image/female.jpg';
	$user->CarPhoto = '/carpool/image/default.jpg';*/
	//$student->HeadPhoto = '';
	
	//update
	//$create_time = time(); //now()
	//$birthday = date('Y-m-d H:i:s',strtotime($user->Birthday));
	//echo $birthday;
	$query = "INSERT INTO `ghjy_student`
		(studentName,gender,born,phone,addr,grade,note,schoolsubID,schoolID,consultID) 
	 VALUES ('$studentName', '$gender', '$born','$phone', 
		 '$addr','$grade', '$note',$schoolsubID,$schoolID, $consultID)";

//$result = mysql_query($query) or die("Invalid query: createStudent" . mysql_error());
	$result = mysql_query($query);
	if($result){
		$id = mysql_insert_id(); 	
		$res->success = true;
		$res->message = "创建学生资料student成功";
		$res->data = array("studentID" => $id);
	}else{
		$res->success = false;
		$res->message = "出错！电话号码重复";
	}

echo $_GET['callback']."(".$res->to_json().")";

?>
