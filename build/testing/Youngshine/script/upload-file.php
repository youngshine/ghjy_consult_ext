<?php
require_once 'lib/response.php';
require_once 'lib/request.php';
require_once('lib/database_connection.php');

    $returnResponse = $_REQUEST['returnResponse'];
    sleep(1);
    if ($returnResponse != "") {
        header('HTTP/1.0 '.$returnResponse.' Server status', true, $returnResponse);
        echo '{success:false, message:"Faked error from server", errors:{"photo-path":"The server returned this"}}';
    } else {
        $file = $_FILES['photo-path'];
        $fileName = $file['name'];
        $fileSize = $file['size'];
        if (!$fileSize) {
            $fileSize = $_SERVER['CONTENT_LENGTH'];
        }

		//date_default_timezone_set(“prc”);  
		//$stringtime = date(“Y-m-d H:i:s”,time());  
		//$newName = strtotime($stringtime).”.jpg”;

		$newName = date('ymdhis') . ".jpg";
		$result = move_uploaded_file($_FILES['photo-path']['tmp_name'], "image/" . $newName );
		
		//$arr = $request->params;
		//$lcd_id = $_REQUEST['lcd_id'];
		//$query = "update lcd set jc_photo = '$newName'  where lcd_id = $lcd_id ";
		//$result = mysql_query($query)or die("Invalid query: updateLcdPhoto" . mysql_error());

        echo json_encode(array(
            "success" => true,
            "fileName" => $newName, //$fileName,
            "fileSize" => $fileSize
        ));
    }
?>