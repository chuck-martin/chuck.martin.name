<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

<!-- Chuck Martin
     CS177
     Homework 2: 20,000 Unique IP Addresses
     February 14, 2011
-->

<title>CS177 Homework 2: 20,000 Unique IP Addresses</title>
<link href="hw1.css" rel="stylesheet" type="text/css" />
</head>

<body>
<p>This page shows the output of a PHP program that generates 20,000 unique random IP addresses, sorts them numerically, and then prints the first and last 20. As a nice bonus, the time it took is calculated and displayed.</p>
<?php
$startTime = microtime(true);
// Create an empty array
$IPAddresses = array();

// Returns a random number between 0 and 255
function generateIPSection() 
{
	srand(microtime() * 1000000);
	return rand(0,255);
}

// Loop adds an element to the array until the size of the array reaches 20,000
while (count($IPAddresses) < 20000)
{
	$IPAddress = array(generateIPsection(), generateIPsection(), generateIPsection(), generateIPsection());
	$IPAddressIndex = $IPAddress[0] . "." . $IPAddress[1] . "." . $IPAddress[2] . "." . $IPAddress[3];
	$IPAddresses[$IPAddressIndex] = $IPAddress;
}

// Sorts the array numerically using the elements
asort($IPAddresses);

// Grabs the first and last 20 elements in the array and stores them in sub-arrays
$firstTwenty = array_slice($IPAddresses, 0, 20, true);
$lastTwenty = array_slice($IPAddresses, count($IPAddreses)-20, 20, true);

// Prints the sub-arrays to the web page
print("<p>");
foreach ($firstTwenty as $key => $value)
{
    print("$key<br />");
}
print("</p>");
print("<p>");
foreach ($lastTwenty as $key => $value)
{
    print("$key<br />");
}
print("</p>");

$endTime = microtime(true);
$totalTime = ($endTime - $startTime);
print("<p>Total time taken is $totalTime seconds.</p>");
?>
</body>
</html>