<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"><head>
  <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
  <title>Home of Chuck Martin's personal site: chuck.martin.name</title>
<script src="quotes.js" type="text/javascript"></script>



  <script type="text/javascript">
<!-- 
function obfuscate(usr, addr){
	if(!addr)addr='martin.name'
	addr=(usr + '@' + addr)
	document.write('<A href="mailto:' + addr + '">' + addr + '</a>')
}
 //-->
  </script>
  <link href="main.css" rel="stylesheet" type="text/css" />
</head>

<body>
<!--<div id="main">-->

<?php
If ( !($database=mysql_connect("localhost", "chuck_admin", "ncc1701a")))
  die ('I cannot connect to the database because: ' . mysql_error());
  
If ( !(mysql_select_db("chuck_Quotes", $database)))
  die ('I cannot select the database table because: ' . mysql_error());

$count = mysql_query("SELECT count(*) FROM Quotes");
if (!$count) {
   print('Could not run query: ' . mysql_error());
   exit;
}
$numquotes = mysql_fetch_row($count);


$query = "SELECT QuoteText, Author, URL, TitleText FROM Quotes INNER JOIN Titles ON Quotes.TitleID = Titles.ID ORDER BY rand() LIMIT 1";

$result = mysql_query($query);

if (!$result) {
   print('Could not run query: ' . mysql_error());
   exit;
}

$row = mysql_fetch_row($result);

print("<p class=\"quote\"><i>$row[0]</i><br />");
print("  - $row[1], <a href=\"$row[2]\">$row[3]</a></p>");

print("<h1>This is Chuck Martin's personal site: chuck.martin.name</h1>");
print("<p>This is, among other things, my web programming \"sandbox.\" I've created a small random quote generator (right). There are $numquotes[0] quotes in the database.</p>");

mysql_close($database);

?>

<script>
<!--
/* writeQuote(quotes, authors, books, bookurls, titles, urls); */
/* writeQuote2(getQuote()); */
-->
</script>





<p>From here, you can view my <a href="portfolio/index.htm">professional portfolio page</a> and go directly to my <a href="https://www.linkedin.com/in/twriter/">LinkedIn page</a>.</p>
<p>Here's a <a href="my_new_place.htm">page that contains photos of where I used to live</a>, in the last place I lived in SF, before I moved to the peninsula. </p>
<p>Send email to  
  <script type="text/javascript"> obfuscate('chuck','')</script>
</p>
<!--</div>-->
</body>
</html>