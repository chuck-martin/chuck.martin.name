quotes = new Array(3);
authors = new Array(3);
books = new Array(3);
bookurls = new Array(3);
titles = new Array(3);
urls = new Array(3);

/* Quote template
quotes[###] = "";
authors[###] = "";
books[###] = "";
bookurls[###] = "";
titles[###] = "";
urls[###] = "";
*/

quotes[2] = "Many products that require users to interact with them to carry out their tasks have not necessarily been designed with the user in mind. Typically, they have been engineered as systems to perform set functions. While they may work effectively from an engineering perspective, it is often at the expense of how the system will be used by real people.";
authors[2] = "Jennifer Preece, Yvonne Rogers, Helen Sharp";
books[2] = "Interaction Design";
bookurls[2] = "http://rcm.amazon.com/e/cm?t=writeforyou0d-20&o=1&p=8&l=as1&asins=0471492787&fc1=000000&lc1=0000ff&bc1=&lt1=_blank&IS2=1&bg1=ffffff&f=ifr";
titles[2] = "";
urls[2] = "";
quotes[1] = "Designing an effective interface doesn't happen by chance. Good design happens only when designers understand people as well as technology.";
authors[1] = "JoAnn T. Hackos & Janice C. Redish";
books[1] = "User and Task Analysis for Interface Design";
bookurls[1] = "http://rcm.amazon.com/e/cm?t=writeforyou0d-20&o=1&p=8&l=as1&asins=0471178314&fc1=000000&IS2=1&lc1=0000ff&bg1=ffffff&bc1=&lt1=_blank&f=ifr";
titles[1] = "";
urls[1] = "";
quotes[0] = "Designing in the dark rarely (if ever) allows developers to meet the needs of users of a given site or application.";
authors[0] = " Gerry Gaffney";
books[0] = "";
bookurls[0] = "";
titles[0] = "Contextual Enquiry - A Primer";
urls[0] = "http://www.sitepoint.com/article/contextual-enquiry-primer";


function writeQuote (q, a, b, bu, t, u) {
  index = Math.floor(Math.random() * quotes.length);
 
  document.write("<p><i>" + q[index] + "</i><br />\n");
  if (b[index] != "")  
    document.write("-- " + a[index] + ", <a href=\"" + bu[index] + "\">" + b[index] + "</a></p>\n");
  else
    document.write("-- " + a[index] + ", <a href=\"" + u[index] + "\">" + t[index] + "</a></p>\n");

}
/*
function getQuote() {
	quotefile = new file("Quotes.txt");
	result = quotefile.open("r");
	lines = 0;
	if (quotefile.eof() == false) {
	  lines ++;
	}
	result = quotefile.close();
	index =  Math.floor(Math.random() * lines);
	result = quotefile.open("r");
	while (linenum < index) {
	  quoteline = qutoefile.readln();
	}
	quotefile.close();
	quote = quoteline.split("|");
	return quote;
}

function writeQuote2(q) {
  document.write("<p><i>" + q[0] + "</i><br />\n");
  if (b[index] != "")  
    document.write("-- " + q[1] + ", <a href=\"" + q[3] + "\">" + q[2] + "</a></p>\n");
  else
    document.write("-- " + q[1] + ", <a href=\"" + q[5] + "\">" + q[4] + "</a></p>\n");
}
*/