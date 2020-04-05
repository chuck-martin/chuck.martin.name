<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<title>Quote Entry</title>
</head>

<body>

<?php
If ( !($database=mysql_connect("localhost", "chuck_admin", "ncc1701a")))
  die ('I cannot connect to the database because: ' . mysql_error());
  
If ( !(mysql_select_db("chuck_Quotes", $database)))
  die ('I cannot select the database table because: ' . mysql_error());

function iq(x, y) {
  $insertquery = mysql_query("INSERT INTO test (FirstName, LastName) VALUES (x,y)");
}

?>
<form name="TitleList" id="TitleList" method="post" action="">
<?php
$titlequery = mysql_query("SELECT TitleText FROM Titles");
if (!$titlequery) {
   print('Could not run query: ' . mysql_error());
   exit;
}

  print("<label>Titles <select name=\"select\">");
  for ($counter = 0; $row = mysql_fetch_row($titlequery); $counter++) {
    print("<option value=\"$counter\">$row[0]</option>");
  }
  print("</select></label>");
  
mysql_close($database);
?>

<label>Test
<select name="select">
  <option value="One">1</option>
  <option value="Two">2</option>
  <option value="Three">3</option>
</select>
</label>
</form>

<form name="quote" id="quote" method="post" action="">
  <p>
    <label>TitleID
    <input name="titleid" type="text" id="titleid" size="4" />
  Title
  <input name="titletext" type="text" id="titletext" size="50" />
</label>
  </p>
  <p>
    <label>Quote Text
    <textarea name="quotetext" cols="60" rows="10" id="quotetext"></textarea>
</label>
  </p>
</form>
<form name="test" id="test" method="post" action="iq(firstname, lastname)">
  <label>First name
  <input name="firstname" type="text" id="firstname" />
  </label>
  <label>Last Name
  <input name="lastname" type="text" id="lastname" />
Send
<input name="Send" type="submit" id="Send" value="Send" />
</label>
</form>
</body>
</html>
