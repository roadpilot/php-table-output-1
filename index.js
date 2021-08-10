<?php
ini_set('display_errors', 1);
error_reporting( error_reporting() & ~E_NOTICE );
error_reporting(E_ALL);
date_default_timezone_set('America/Denver');

if (count($_POST)>0){$_GET=$_POST;}
$i=0;
$qstr="";
foreach ($_GET as $var => $val){
	if ($i>0){$qstr.="&";}
	$qstr.=$var."=".$val;
	$i++;
}
//echo $qstr;

$servername = "localhost";
$username = "----------------";
$password = "----------------";

$q=$_GET['q1']." ".$_GET['q2'];
if ($_GET['q']!=""){$q=$_GET['q'];}
$db=$_GET['db'];
if ($db==""){$db="scores";}
$dbname = "achterma_".$db;
//$q="select serial,awayrot,watch from table1 order by serial desc limit 5";

// Create connection
$dbcon = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($dbcon->connect_error) {
     die("Connection failed: " . $dbcon->connect_error);
} 
?>
<html>

<head>
<META http-equiv=content-language content=en>
<META http-equiv=Content-Type content="text/html; charset=UTF-8">
<META content=True name=HandheldFriendly>
<META content=user-scalable=no,width=device-width name=viewport>
<META http-equiv=expires content=0>
<META http-equiv=cache-control content=no-cache>
<META http-equiv=pragma content=no-cache>

<title>SQL: <?php echo $q;?></title>
<style>
TD,BODY,INPUT,SELECT,TEXTAREA { font-family: Tahoma,MS Sans Serif,Verdana,Arial,Helvetica,sans-serif; font-size:10pt;}

.double {
  zoom:2;
  transform:scale(2);
  -ms-transform:scale(2);
  -webkit-transform:scale(2);
  -o-transform:scale(2);
  -moz-transform:scale(2);
  transform-origin:0 0;
  -ms-transform-origin:0 0;
  -webkit-transform-origin:0 0;
  -o-transform-origin:0 0;
  -moz-transform-origin:0 0;
  -webkit-transform-origin:0 0;
}

</style>
<style>
input[type=_checkbox]{
  zoom:2;
  transform:scale(2);
  -ms-transform:scale(2);
  -webkit-transform:scale(2);
  -o-transform:scale(2);
  -moz-transform:scale(2);
  transform-origin:0 0;
  -ms-transform-origin:0 0;
  -webkit-transform-origin:0 0;
  -o-transform-origin:0 0;
  -moz-transform-origin:0 0;
  -webkit-transform-origin:0 0;
}
td {
	//font-size:14pt;
}
</style>
</head>

<script>
function keyPressHandler(e) {
      var kC  = (window.event) ?    // MSIE or Firefox?
                 event.keyCode : e.keyCode;
      if(kC==13 && !e.shiftKey){formParse(document.forms[0])}
}

function formParse(frm){
q=frm.q.value;
q1=frm.q1.value=q.substr(0,q.indexOf(" "));
q2=frm.q2.value=q.substr(q.indexOf(" ")+1);
frm.q.value="";
//location.href="?db="+frm.db.value+"&q1="+q1+"&q2="+q2;
frm.action="?db="+frm.db.value+"&q1="+q1+"&q2="+q2;
frm.submit();
return false;
}
</script>
<body bgcolor="#C0C0C0">
<?php 
$db_arr=["scores","bookmarks","charges"];
array_push($db_arr,$_GET['db']);
//var_dump($db_arr);
?>
<basefont face="verdana" size="4">
<form method="get" action="" onsubmit="formParse(this);return false">
<select name="db">
<?php 
foreach ($db_arr as $i){
?>
<option <?php if ($i==$_GET['db']){echo "selected";} ?> ><?php echo $i; ?></option>
<?php
}
?>
</select><br>
<!--<input type="hidden" name="db" value="<?php echo $db;?>">
-->
<input type="hidden" name="as" value="print">
<textarea spellcheck="false" name="q" onfocus_="this.select()" onkeydown="keyPressHandler(event)" style="font-family:courier new;font-size:10pt;height:100px;width:700px;wordwrap:break-word" value="" rows="1" cols="20">
<?php echo $q;?>
</textarea><br>
<input type="hidden" name="q1">
<input type="hidden" name="q2">
<input type="submit" value="Run Query...">
<input type="button" value="New Query..." onclick="window.open('?db=<?php echo $db?>')">
<input type="button" value="Show Printable" onclick="forms[0].as.value='print';forms[0].target='_blank';forms[0].submit();forms[0].as.value='';forms[0].target='';">
<input type="button" value="Export" onclick="forms[0].as.value='xls';forms[0].target='_blank';forms[0].submit();forms[0].as.value='';forms[0].target='';">
</form>
<textarea name="report" onfocus="this.select()" style="font-family:courier new;font-size:10pt;height:20px;width:350px;wordwrap:break-word" value="" rows="1" cols="20">
<?php
$a=0;
foreach (explode(chr(10),$q) as $line){
	echo "\$sql";
	if ($a>0){
	  echo ".=\"";
	}
	else{
		echo "=\"";
	}
	//if a>0 then 
	//	response.write """ "
	echo str_replace(chr(13),"",$line)."\";";
	echo chr(13).chr(10);
	$a++;
}
?>
echo htmlentities($sql)."<HR>";exit;

if (!$fetch=$dbcon->query($sql)) {
     die("Query error: " . $dbcon->error);
} 
$rs = $fetch;include '../data/table_out.php';exit;

foreach ($fetch as $rs){
	//do something here with $rs['field name']
}
</TEXTAREA>
<?php
$q=str_replace('CRLF'," ",$q);
#$q=str_replace("'","`",$q);
#echo $q;exit;

$table_ar=explode(" ",$q);
$table="";
for ($a=0;$a<count($table_ar);$a++){
	if ($table==""){
		if (strtoupper($table_ar[$a])=="FROM"){$table=strtolower($table_ar[$a+1]);}
	}
}
$table=str_replace(chr(13).chr(10),"",$table);
//echo $table;

if (!$q==""){
if (!$rs=$dbcon->query($q)) {
     die("Query error: " . $dbcon->error);
} 
//echo $rs->num_rows;
$row = $rs->fetch_assoc();
if ($_GET['as']=="print"){
?>
<style>
table, th, td {
    border: 1px solid black;
}
.unselectable {
    -webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	-o-user-select:none;
	user-select: none;
}
.selectable {
    -webkit-touch-callout: all;
	-webkit-user-select: all;
	-khtml-user-select: all;
	-moz-user-select: all;
	-ms-user-select: all;
	-o-user-select:all;
	user-select: all;
}
</style>
	<script>
	const toggled = {}
	const toggleSelectable = (el,className) => {
		const toggled[className] = !toggled[className]
		console.log(classname.":".toggled[className])
	} 
	</script>
	<table cellpadding_=0 cellspacing_=0 border="1">
	<?php
	echo "<tr>";
	foreach ($row as $key => $value) {
		echo "<td class='unselectable' onclick='toggleSelectable(this,\"" . urlencode($key). "\")' valign=top style='border: 1 solid #C0C0C0'><span style='width:100%'><b>";
		echo $key;
		echo "</b>";
		echo "</span><input type=checkbox style='position:relative;top:0;right:0'>";
		echo "</td>";
	}
	foreach ($rs as $row){
		echo "<tr>";
		foreach ($row as $key => $value) {
			echo "<td class='" . urlencode($key). "'>".str_replace("'","''",$value)."</td>";
		}
	}

	?>
	</table>
</body>
<?php
	exit;
	}
}
?>
