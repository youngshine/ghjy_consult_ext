<?php
/*log
*13-05-07 ∞¥∑¢≤º ±º‰Ωµ–Ú≈≈–Ú
*13-05-10 ∂‘∑¢≤º¬∑œﬂΩ¯–– ±º‰π˝¬À
endlog */
require_once 'lib/response.php';
require_once 'lib/request.php';
require_once('lib/database_connection.php');

class Dataobj
{		
	public $ksf_id;
	public $grade;
	public $subject;
	public $unitprice;
}

$request = new Request(array());
$res = new Response();

$query = "select * from ksf";

//echo $query;
$result = mysql_query($query)or die("Invalid query: readTeacherList" . mysql_error());
$res->total = mysql_num_rows($result);


$query_array = array();
$i = 0;
//Iterate all Select
while($row = mysql_fetch_array($result))
{
	$dataobj = new Dataobj();
	
	$dataobj->ksf_id = $row['ksf_id'];
	$dataobj->grade = $row['grade'];
	$dataobj->subject = $row['subject'];
	$dataobj->unitprice = $row['unitprice'];
	
	$query_array[$i] = $dataobj;
	$i++;
}
$res->success = true;
//$res->total = $i;
$res->data = $query_array;
if($i==0){
	$res->message = "获取课时单价数据成功";
}
else{
	$res->message = "参数错误";
}

echo $_GET['callback']."(".$res->to_json().")";
?>