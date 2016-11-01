<?php
/*
  * oop方式 class , + ajax json跨域（不用jsonp)
  * 读取报读订单的缴费记录, jsonp 对应 store
*/

require_once('db/database_connection.php');
require_once 'db/response.php';
require_once 'db/request.php';

$req = new Request(array());
$res = new Response();

$arr = $req->params;
$accntID = $arr->accntID;
// 不定参数，用数组？？
//$accntID = $_REQUEST['accntID'];

$accntfee = new AccntFee($accntID);
$data = $accntfee->getList();

$res->success = true;
$res->message = "读取缴费记录fee成功";
$res->data = $data;

echo $_GET['callback']."(".$res->to_json().")";


class AccntFee {
  //private $schoolsubID;
  private $accntID;
  
  //private $query_result; //查询结果集

  public function __construct($accntID) {
	  $this->accntID = $accntID;
	  //$this->accntID = 3;
  }
	
  public function getList() {	  
	  // require_once('db_cfg.php');
/*	  
	  $ip = '10.66.153.50:3306';
	  $user = 'root';
	  $psw = 'rootroot2@';
	  $conn = mysql_connect($ip,$user,$psw);
	  
	  if (!$conn) die('Could not connect: ' . mysql_error());

	  mysql_select_db("ghjy", $conn);	 
*/	  
	  //var_dump($this->accntID); 
	  $query = "SELECT * From `ghjy_accnt_fee` Where accntID=$this->accntID";  
	  $result = mysql_query($query);

	  mysql_close($conn); 
	  //$this->query_result = mysql_fetch_array($result); //单个记录
	  
		$query_array = array();
		$i = 0;
		//Iterate all Select
		while($row = mysql_fetch_array($result))
		{
			array_push($query_array,$row);
			$i++;
		}
		
		//$this->query_result = $query_array;  
	  return $query_array;
  }
}
	
?>