<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

<!-- Chuck Martin
     CS177
     Homework 3: Source file information
     February 28, 2011
-->

<title>CS177 Homework 3: Source File Information</title>
<link href="hw1.css" rel="stylesheet" type="text/css" />
</head>

<body>
<p>This PHP program shows who has logged in and out of the server.</p>

<?php
// This first section establishes a baseline.
// Get the last 15 logins.
// exec("last -15 -i", $output);
exec("who -u", $output);
// The last item is garbage. Trim it.
// $output = array_slice($output, 0, count($output) -1);
// Pull out the pieces of the login string, put in associative array.
foreach($output as $loginLine)
{
	print("<p>$loginLine</p>");
}
foreach($output as $item)
{
	print("$item<br />");
	// Split one login string, space delimiter, put into array
	$login = split(" ", $item);
	
	foreach($login as $x)
	{
		// Find the item in the array that matched IP address pattern
		if(preg_match('/^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:[.](?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/', $x) == 1)
		{
			// Put first token, IP address token, into associative array
			$loginsBase[$login[0]] = $x;
		}
	}
}
foreach($loginsBase as $key => $value)
{
	print("<p>Login: $key, IP address: $value</p>");
}
// Now we start getting the latest, comparing to the base.
// Will run until you navigate away from the page or close the browser.
while(true)
{
	sleep(5);
	// Get the last 15 logins.
	// exec("last -15 -i", $output);
	exec("who -u", $output);
	// The last item is garbage. Trim it.
	$output = array_slice($output, 0, count($output) -1);
	// Pull out the pieces of the login string, put in associative array.
	foreach($output as $item)
	{
		// print("<p>$item</p>");
		// Split one login string, space delimiter, put into array
		$login = split(" ", $item);
		
		foreach($login as $x)
		{
			// Find the item in the array that matched IP address pattern
			if(preg_match('/^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:[.](?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/', $x) == 1)
			{
				// Put first token, IP address token, into associative array
				$loginsNewest[$login[0]] = $x;
			}
		}
	}
	$latestLogins = array_diff_assoc($loginsNewest, $loginsBase);
	if(count($latestLogins) == 0)
	{
		print(".");
	}
	else
	{
		foreach($latestLogins as $key => $value)
		{
			print("<br />$key logged in from $value");
		}
	}
	$loginsBase = $loginsNewest;
}




/*
$fileName = "hw3_source_file_information.php";
// Get and print the file's size.
$fileSizeBytes = filesize($fileName);
print("<p>The size of this file is $fileSizeBytes bytes.</p>");
// Gets the file into an array, with each element in the array a line in the file
$fileLinesArray = file($fileName);
$fileLines = count($fileLinesArray);
print("<p>This file has $fileLines lines.<p>");
// I had two loops through the array of lines. Combining them for efficiency
// first initialize the variables I will use.
$fileWords = 0;
$fileChars = array();
$numChars = 0;
// Loops through each element in the array, assigns it to $line as a string
foreach($fileLinesArray as $line)
{
// Gets the number of wrods in the file
	$numWords = str_word_count($line);
	$fileWords += $numWords;
// Now to count the number of unique characters (This part was in a separate loop.)
// This line splits a string into an array.
	$lineArray = str_split($line);
	foreach($lineArray as $c)
	{
		// Handle select non-printing characters with switch statement
		switch ($c)
		{
			// space
			case "\040":
			    $fileChars["space"]++;
				break;
			// tab
			case "\011":
			    $fileChars["tab"]++;
				break;
			// newline
			case "\n":
			    $fileChars["newline"]++;
				break;
			// anything else
			default:
			    $fileChars[$c]++;
				break;
		}
		$numChars++;
	}
}
// Sorts the array
asort($fileChars);
print("<p>This file has $fileWords words.</p>");
print("<p>This file has the following characters:</p>");
print("<table><thead><tr><td>Character</td><td>Number</td></tr></thead>");
foreach($fileChars as $key => $value)
{
	print("<tr><td>$key</td><td>$value</td></tr>");
}
print("</table>");
print("<p>This file has $numChars characters.</p>");
*/
?>
</body>
</html>