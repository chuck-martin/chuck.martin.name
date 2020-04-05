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
<p>This PHP program calculates and displays characteristics of this file. It:</p>
<ul>
    <li>Displays its own size (the total # of bytes in the source file)</li>
    <li>Displays how many lines are in the source file</li>
    <li>Displays the # of words (any # of characters separated by whitespace) in the source file</li>
    <li>Counts and displays the number of unique characters used in the source file</li>
    <li>Lists the number of characters used for all characters &gt; 0 from least to most</li>
    <li>Displays the number of characters in the file, totalling the characters in the count, which should match the number of bytes.</li>
</ul>
<?php
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
?>
</body>
</html>