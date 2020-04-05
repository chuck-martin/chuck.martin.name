/* 
Chuck Martin
CS177 HW #1
January 28, 2011

This program generates 20,000 random IP addresses, sorts them numerically,
and then prints out the first and last 20.
*/

// Array to store the IP addresses
var IPAddresses = new Array(20000);

// Generates a single random number between 0 and 255
function generateIPSection() 
{
	return Math.floor(Math.random() * 256);
}

// Produces a valid IP address om 4 random numbers and stores it in an array
function generateIPAddress()
{
	var IPAddress = new Array(4);
	for (var i=0;i<IPAddress.length;i++)
	{
		IPAddress[i] = generateIPSection();
	}
	return IPAddress;
}

// The function used by JavaScript's sort method. Compares each part of an
// IP address in turn, returns -1 if the first one is smaller, 1 if the
//first one is larger, and 0 of both are equal
function IPCompare(IP1, IP2)
{
	if (IP1[0] < IP2[0])
	{
		return -1;
	}
	else if (IP1[0] > IP2[0])
	{
		return 1;
	}
	//The first numbers in the IP addresses are equal
	else if (IP1[1] < IP2[1])
	    {
			return -1;
		}
		else if (IP1[1] > IP2[1])
		{
			return 1;
		}
		//The first two numbers in the IP addresse are equal
		else if (IP1[2] < IP2[2])
		    {
				return -1;
			}
			else if (IP1[2] > IP2[2])
			{
				return 1;
			}
			//The first three numbers of the IP addresses are equal
			else if (IP1[3] < IP2[3])
			    {
					return -1;
				}
				else if (IP1[3] > IP2[3])
				{
					return 1;
				}
				else
				{
					return 0;
				}
}

// Populates the array of 20,000 addreesses
for (var j = 0; j<IPAddresses.length; j++)
{
	IPAddresses[j] = generateIPAddress();
}

IPAddresses.sort(IPCompare);

// Output section
document.write("<p>This page shows the output of a JavaScript program that ");
document.write("generates 20,000 random IP addresses, sorts them numerically,");
document.write(" and then prints the first and last 20.</p>");

document.write("<p>The first 20:</p><p>");
for (var x=0; x<20; x++)
{
	for (var y=0; y<4; y++)
	{
		document.write(IPAddresses[x][y].toString());
	    if (y<3)
	    {
		    document.write(".");
	    }
	    else
	    {
		    document.write("<br />");
	    }
	}
}
document.write("</p><p>The last 20:</p>");
for (var x=IPAddresses.length-20; x<IPAddresses.length; x++)
{
	for (var y=0; y<4; y++)
	{
		document.write(IPAddresses[x][y].toString());
	    if (y<3)
	    {
		    document.write(".");
	    }
	    else
	    {
		    document.write("<br />");
	    }
	}
}
document.write("</p>");
