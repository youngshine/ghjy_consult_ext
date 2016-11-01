<?php
	if($_FILES){
		$newName = "test.jpg";//time();
		//$Name = $_FILES['file']['name'];
		//$Arr = explode(".", $Name);
		//$count = count($Arr);
		//$type = $Arr[$count];
		//$temp_name = $newName.'.'.$type;
		if(move_uploaded_file($_FILES['file']['tmp_name'], "../image/".$newName )){
		    //$filename="../image/test.jpg"; 
			//$img = imagecreatefromjpeg($filename); 
			//header("Content-Type: image/jpeg"); 
			//imagejpeg($img, $filename, 20); 
		}
		else{
		}
	}
?>
