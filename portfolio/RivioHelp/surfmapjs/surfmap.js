// ----------------------------------------------------------------------------
// Private section.
//
// The variables and functions in this section are used internally by the script
// and shouldn't be accessed directly from outside.
// ----------------------------------------------------------------------------

// Global variables
var items               = new Array();        // array of all items in the sitemap
var topItems            = new Array();        // top level items only
var browser             = "OTHER";            // browser version (IE, NS, NS6 or OTHER)
var selectedItem        = null;               // current selected item
var style               = null;               // site map style
var scriptURL           = null;               // URL to the script folder
var expandTopItems      = null;               // true to expand top level items
var mouseOverColor      = null;               // mouse over color
var selectedColor       = null;               // selected color
var selectedBackground  = null;               // selected background color

// pre-load static images
var blankImg = new Image();
var simpleImg = new Image();
var simplelImg = new Image();
var minusImg = new Image();
var colapseImg = new Image();
var colapselImg = new Image();
var plusImg = new Image();
var expandlImg = new Image();
var expandImg = new Image();
var spaceImg = new Image();
var treeLineImg = new Image();

// ----------------------------------------------------------------------------
// Calculates the Y coordinates of all visible sitemap items.
// ----------------------------------------------------------------------------
function adjustY()
  {
	
    //if ( browser == "NS6" ) {
    //  siteMapObj = document.getElementById('sitemap');
    //  siteMapObj.style.display = "none";
    //  siteMapObj.style.display = "";
    //}
    
    // This was reported necessary by Mozilla, but it works better without it.
	
    if ( browser != "NS" )
      return;

    var y = 0;
    var minWidth = 0;
    var minHeight = 0;
    for ( var i=0; i<items.length; i++ )
      {
        getSiteItemObj(items[i]).top = y;
        getSiteItemObj(items[i]).left = 0;
        if ( browser == "NS" ) {
			if ( getSiteItemObj(items[i]).visibility == "show" )
			  {
			    y += getSiteItemObj(items[i]).clip.height;
			    if ( getSiteItemObj(items[i]).clip.width > minWidth )
			      minWidth = getSiteItemObj(items[i]).clip.width;
			    minHeight += getSiteItemObj(items[i]).clip.height;
			  }
		}
      }
    document.sitemap.clip.right = minWidth;
    document.sitemap.clip.bottom = minHeight;
  }

// ----------------------------------------------------------------------------
// Return the site item DOM object for the given siteItem
// ----------------------------------------------------------------------------
function getSiteItemObj( siteItem )
  {
	if ( browser == "NS6" )
	  return document.getElementById("item"+siteItem.id);
	else
	  return siteItem.obj;
  }

// ----------------------------------------------------------------------------
// Return the icon DOM object for the given siteItem
// ----------------------------------------------------------------------------
function getIconObj( siteItem )
  {
	if ( browser == "NS6" )
	  return eval("document.icon"+siteItem.id);
	else
	  return siteItem.icon;
  }
  
// ----------------------------------------------------------------------------
// Return the tree icon DOM object for the given siteItem
// ----------------------------------------------------------------------------
function getTreeIconObj( siteItem )
  {
	if ( browser == "NS6" )
	  return eval("document.treeIcon"+siteItem.id);
	else
	  return siteItem.treeIcon;
  }

// ----------------------------------------------------------------------------
// Assign the tree icon DOM object for the given siteItem
// ----------------------------------------------------------------------------
function setTreeIconObj( siteItem, imgObj )
  {
	if ( browser == "NS6" )
	  eval("document.treeIcon"+siteItem.id).src = imgObj.src;
	else
	  siteItem.treeIcon.src = imgObj.src;
  }

// ----------------------------------------------------------------------------
// Return the style DOM object for the given siteItem
// ----------------------------------------------------------------------------
function getStyleObj( siteItem )
  {
	if ( siteItem.text != null ) {
		if ( browser == "NS6" )
		  return document.getElementById("style"+siteItem.id).style;
		else
		  return siteItem.style;
	} else {
		return null;
	}
  }

// ----------------------------------------------------------------------------
// Colapses a given item, hiding its entire subtree.
// ----------------------------------------------------------------------------
function colapse( siteItem )
  {
    if ( selectedItem == siteItem )
      selectItem( null );
    for ( var i=0; i<siteItem.children.length; i++ )
      {
        if ( browser == "IE" )
          getSiteItemObj(siteItem.children[i]).style.display = "none";
        else if ( browser == "NS" )
          getSiteItemObj(siteItem.children[i]).visibility = "hide";
        else if ( browser == "NS6" )
          getSiteItemObj(siteItem.children[i]).style.display = "none";
        
       colapse( siteItem.children[i] );
      }
  }



// ----------------------------------------------------------------------------
// Displays the sitemap
// ----------------------------------------------------------------------------
function display()
  {
	if ( browser == "IE" )
      _writeln( "<table border='0' cellspacing='0' cellpadding='0' style='position:relative'><tr><td valign=top align=left>" );
    if ( browser == "NS6" )
      _writeln( "<div id='sitemap'>" );
      
    for ( var i=0; i<topItems.length; i++ )
      renderItem( topItems[i], "" );

    if ( browser == "IE" )
      _writeln( "</td></tr></table>" );
    else if ( browser == "NS6" )
      _writeln( "</div>" );
    else if ( browser == "NS" )
      window.onResize = restoreIcons;
    else
      return;
 
    for ( var i=0; i<topItems.length; i++ )
      {
        var siteItem = topItems[i];
        if ( browser == "IE" )
          getSiteItemObj(siteItem).style.display = "block";
        else if ( browser == "NS" )
          getSiteItemObj(siteItem).visibility = "show";
        // do nothing for NS6
          
        if ( (expandTopItems) && (siteItem.children.length != 0) )
          {
            expand( siteItem );
            siteItem.opened = true;
            updateIcons( siteItem );
          }
       }
       
    if ( browser != "NS6" )
      adjustY();
  }



// ----------------------------------------------------------------------------
// Expands a given item, restoring its entire subtree.
// ----------------------------------------------------------------------------
function expand( siteItem )
  {
    for ( var i=0; i<siteItem.children.length; i++ )
      {
        if ( browser == "IE" )
          getSiteItemObj(siteItem.children[i]).style.display = "block";
        else if ( browser == "NS" )
          getSiteItemObj(siteItem.children[i]).visibility = "show";
        else if ( browser == "NS6" )
          getSiteItemObj(siteItem.children[i]).style.display = "block";
        
        if ( siteItem.children[i].opened )
          expand( siteItem.children[i] );
      }
  }



// ----------------------------------------------------------------------------
// Expands a given item and colapses every other at the same level.
// ----------------------------------------------------------------------------
function expandColapse( siteItem )
{
  var children;
  if ( siteItem.parent == null )
    if ( expandTopItems )
      {
        expand( siteItem );
        return;
      }
    else
      children = topItems;
  else
    children = siteItem.parent.children;
  for ( var i=0; i<children.length; i++ )
    if ( (children[i].opened) && (children[i] != siteItem) )
    
      {
        children[i].opened = false;
        colapse( children[i] );
        updateIcons( children[i] );
      }
  expand( siteItem );
}

// ----------------------------------------------------------------------------
// Returns the tree icon for a given item.
// ----------------------------------------------------------------------------
function getTreeIcon( siteItem )
  {
    var icon;
    if ( siteItem.children.length == 0 )
      if ( style == "OUTLINE" )
        icon = blankImg;//"blank.gif";
      else if ( siteItem.last )
        icon = simplelImg;//"simplel.gif";
      else
        icon = simpleImg;//"simple.gif";
    else if ( siteItem.opened )
      if ( style == "OUTLINE" )
        icon = minusImg;//"minus.gif";
      else if ( siteItem.last )
        icon = colapselImg;//"colapsel.gif";
      else
        icon = colapseImg;//"colapse.gif";
    else if ( style == "OUTLINE" )
      icon = plusImg;//"plus.gif";
    else if ( siteItem.last )
      icon = expandlImg;//"expandl.gif";
    else
      icon = expandImg;//"expand.gif";
    return icon;
  }


  
// ----------------------------------------------------------------------------
// Called when an item is clicked. Expands/collapses the item and selects
// the item.
// ----------------------------------------------------------------------------
function itemClicked( siteItem )
  {
    if ( (siteItem.children.length != 0) && (browser != "OTHER") )
      {
        siteItem.opened = !siteItem.opened;
        if ( siteItem.opened )
          expand( siteItem );
        else
          colapse( siteItem );
      }
    selectItem( siteItem );
    adjustY();
  }


  
// ----------------------------------------------------------------------------
// Called when the mouse moves out of an item.
// ----------------------------------------------------------------------------
function itemMouseOut( siteItem )
  {
    siteItem.mouseOver = false;
    if ( (getStyleObj(siteItem) != null) && (!siteItem.selected) )
      getStyleObj(siteItem).color = "";
    updateIcons( siteItem );
    adjustY();
  }


  
// ----------------------------------------------------------------------------
// Called when the mouse moves over an item from outside.
// ----------------------------------------------------------------------------
function itemMouseOver( siteItem )
  {
    siteItem.mouseOver = true;
    if ( (getStyleObj(siteItem) != null) && (!siteItem.selected) )
      getStyleObj(siteItem).color = mouseOverColor;
    updateIcons( siteItem );
    adjustY();
    var message = "";
    if ( siteItem.message != null )
      message = siteItem.message;
    else if ( siteItem.url != null )
      message = siteItem.url;
    return message;
  }



// ----------------------------------------------------------------------------
// Outputs an anchor (<A>) tag for one item.
//
// Parameters:
//   siteItem     item for which to output the link
//   element      HTML code to write inside the anchor tag
// ----------------------------------------------------------------------------
function outputItemAnchor( siteItem, element )
  {
    var itemAnchStr = "";
    itemAnchStr += "<td nowrap>";
    if ( siteItem.url == null )
      itemAnchStr += "<a href='javascript:itemClicked(items["+siteItem.id+"])'";
    else
      {
        itemAnchStr += "<a href='"+siteItem.url+"'";
        if ( siteItem.target != null )
          itemAnchStr += " target='"+siteItem.target+"'";
        itemAnchStr += " onClick='itemClicked(items["+siteItem.id+"])'";
      }
    itemAnchStr += " onMouseOver='window.status=itemMouseOver(items["+siteItem.id+"]); return true'";
    itemAnchStr += " onMouseOut='itemMouseOut(items["+siteItem.id+"]); window.status=\"\"; return true'";
    itemAnchStr += ">";
    itemAnchStr += element;
    itemAnchStr += "</a>";
    itemAnchStr += "</td>";
    _write( itemAnchStr );
  }


  
// ----------------------------------------------------------------------------
// Generates the HTML code for a given item.
//
// Parameters:
//   siteItem   item for which to generate the HTML
//   left       piece of HTML to "ident" the item
// ----------------------------------------------------------------------------
function renderItem( siteItem, left )
  {
    if ( browser == "IE" )
      {
        _write( "<table border='0' cellspacing='0' cellpadding='0' id='item"+siteItem.id+"' style='position:relative;display:none' width='100%'>" );
      }
    else if ( browser == "NS" )
      {
        _write( "<layer id='item"+siteItem.id+"' position='relative' visibility='hide'>" );
        _write( "<table border='0' cellspacing='0' cellpadding='0' width='100%'>" );
      }
    else if ( browser == "NS6" )
      {
		displayType = "";
		if (siteItem.parent == null || (siteItem.parent.parent == null && expandTopItems))
		  displayType = "block";
		else
		  displayType = "none";
		  
        _write( "<span id='item"+siteItem.id+"' style='position: relative; display: "+displayType+";'>" );
        _write( "<table border='0' cellspacing='0' cellpadding='0' width='100%'>" );
      }
    else
      {
        _write( "<table border='0' cellspacing='0' cellpadding='0' width='100%'>" );
      }
    _write( "<tr align=left valign=middle>" );
    _write( left );
    if ( style != "LIST" )
      {
        if ( siteItem.children.length > 0 )
          _write( "<td><a href='javascript:treeIconClicked(items["+siteItem.id+"])' onMouseOver='window.status=\"\"; return true'><img name='treeIcon"+siteItem.id+"' src='"+getTreeIcon(siteItem).src+"' border='0' width='19' height='16'></a></td>" );
        else
          _write( "<td><img src='"+getTreeIcon(siteItem).src+"' width='19' height='16'></td>" );
        _write( "<td><img src='"+scriptURL+"space.gif' width='3' height='16'></td>" );
      }
    var icon = siteItem.colapsedIcon;
    if ( (browser == "OTHER") && (siteItem.children.length > 0) )
      icon = siteItem.expandedIcon;
    if ( icon != null )
      {
        outputItemAnchor( siteItem, "<img name='icon"+siteItem.id+"' src='"+scriptURL+icon+"' border='0' width='"+siteItem.iconWidth+"' height='"+siteItem.iconHeight+"'>" );
        outputItemAnchor( siteItem, "<img src='"+scriptURL+"space.gif' border='0' width='3' height='16'>" );
      }
    if ( siteItem.text != null )
      {
        var s = siteItem.text;
        if ( (siteItem.font != null) || (siteItem.size != null) || (siteItem.color != null) || (browser == "IE" || browser == "NS6") )
          {
            var s1 = "<font";
            if ( browser == "IE" || browser == "NS6" )	s1 += " id='style"+siteItem.id+"'";
            if ( siteItem.font != null )				s1 += " face='"+siteItem.font+"'";
            if ( siteItem.size != null )				s1 += " size='"+siteItem.size+"'";
            if ( siteItem.color != null )				s1 += " color='"+siteItem.color+"'";
            s1 += ">";
            s = s1+s+"</font>";
          }
        if ( siteItem.bold )
          s = "<b>"+s+"</b>";
        if ( siteItem.italic )
          s = "<i>"+s+"</i>";
        outputItemAnchor( siteItem, s );
      }
    _write( "<td width=100%></td>" );
    _write( "</tr>" );
    if ( browser == "IE" )
      {
        _write( "</table>" );
        siteItem.obj = document.all["item"+siteItem.id];
        siteItem.treeIcon = document.all["treeIcon"+siteItem.id];
        siteItem.icon = document.all["icon"+siteItem.id];
        if ( siteItem.text != null )
          siteItem.style = document.all["style"+siteItem.id].style;
      }
    else if ( browser == "NS6" )
      {
	    _write( "</table>" );
        _writeln( "</span>" );
        
        //siteItem.obj = document.getElementById("item"+siteItem.id);
        //siteItem.treeIcon = eval("document.treeIcon"+siteItem.id);
        //siteItem.icon = eval("document.icon"+siteItem.id);
        //if ( siteItem.text != null )
        //  siteItem.style = document.getElementById("style"+siteItem.id).style;
        
        // This is a work around for NS6 - do not load all of these items now, must be
        // loaded "as needed"
        
      }
    else if ( browser == "NS" )
      {
        _write( "</table>" );
        _writeln( "</layer>" );
        siteItem.obj = document.sitemap.document.layers["item"+siteItem.id];
        siteItem.treeIcon = siteItem.obj.document.images["treeIcon"+siteItem.id];
        siteItem.icon = siteItem.obj.document.images["icon"+siteItem.id];
      }
    else
      _writeln( "</table>" );
    if ( (siteItem.last) || (style != "TREE") )
      left += "<td><img src='"+blankImg.src+"' width='19' height='16'></td>";
// For no indent
//	"<td><img src='"+blankImg.src+"' width='0' height='16' Cellpadding='0' cellspacing='0'></td>";
    else
      left += "<td><img src='"+treeLineImg.src+"' width='19' height='16'></td>";
    for ( var i=0; i<siteItem.children.length; i++ )
      renderItem( siteItem.children[i], left );
  }



// ----------------------------------------------------------------------------
// Restores all item icons after the window was resized, under NS.
// ----------------------------------------------------------------------------
function restoreIcons()
  {
    for ( var i=0; i<items.length; i++ )
      updateIcons( items[i] );
  }



// ----------------------------------------------------------------------------
// Selects an item (and deselects whichever is selected).
//
// Parameters:
//   siteItem   item to select
// ----------------------------------------------------------------------------
function selectItem( siteItem )
  {
    if ( selectedItem != null )
      {
        selectedItem.selected = false;
        if ( getStyleObj(selectedItem) != null )
          {
            getStyleObj(selectedItem).color = "";
            getStyleObj(selectedItem).backgroundColor = "";
          }
        updateIcons( selectedItem );
      }
    selectedItem = siteItem;
    if ( siteItem != null )
      {
        siteItem.selected = true;
        if ( getStyleObj(siteItem) != null )
          {
            getStyleObj(siteItem).color = selectedColor;
            getStyleObj(siteItem).backgroundColor = selectedBackground;
          }
        updateIcons( siteItem );
      }
  }



// ----------------------------------------------------------------------------
// Called when the tree icon of an item is clicked. Expands/collapses the
// item.
//
// Parameters:
//   siteItem   sitemap item that was clicked
// ----------------------------------------------------------------------------
function treeIconClicked( siteItem )
  {
    if ( (browser == "OTHER") || (siteItem.children.length == 0) )
      return;
    if ( siteItem.opened )
      colapse( siteItem );
    else
      expand( siteItem );
    siteItem.opened = !siteItem.opened;
    updateIcons( siteItem );
    adjustY();
  }



// ----------------------------------------------------------------------------
// Updates the icons of an item according to its state.
// ----------------------------------------------------------------------------
function updateIcons( siteItem )
  {
    if ( (style != "LIST") && (siteItem.children.length != 0) ) {
      setTreeIconObj(siteItem, getTreeIcon(siteItem));
    }
    if ( getIconObj(siteItem) == null )
      return;
    if ( (siteItem.selected) && (siteItem.selectedIcon != null) )
      getIconObj(siteItem).src = scriptURL+siteItem.selectedIcon;
    else if ( (siteItem.mouseOver) && (siteItem.mouseOverIcon != null) )
      getIconObj(siteItem).src = scriptURL+siteItem.mouseOverIcon;
    else if ( siteItem.opened )
      getIconObj(siteItem).src = scriptURL+siteItem.expandedIcon;
    else
      getIconObj(siteItem).src = scriptURL+siteItem.colapsedIcon;
    
  }



// ----------------------------------------------------------------------------
// Writes a string to the sitemap document.
//
// Note: for netscape 6, all write()'s must be complete tags or text or they
// will not be parsed properly.
// ----------------------------------------------------------------------------
function _write( s )
  {
    var s1 = s;
	//s1 = s1.replace(/</g, '&lt;');
	//s1 = s1.replace(/>/g, '&gt;');
	//s1 = s1 + "<br><br>";
	 if ( browser == "NS" )
	   document.sitemap.document.write( s1 );
	 //else if ( browser == "NS6" )
	 //  document.getElementById('sitemap').innerHTML += s1;
	 else
	   document.write( s1 );
  }


// ----------------------------------------------------------------------------
// Writes a string and a CRLF to the sitemap document.
//
// Note: for netscape 6, all write()'s must be complete tags or text or they
// will not be parsed properly.
// ----------------------------------------------------------------------------
function _writeln( s )
  {
   var s1 = s;
   //s1 = s1.replace(/</g, '&lt;');
   //s1 = s1.replace(/>/g, '&gt;');
   //s1 = s1 + "<br><br>";
    if ( browser == "NS" )
      document.sitemap.document.writeln( s1 );
	//else if ( browser == "NS6" )
	//  document.getElementById('sitemap').innerHTML += s1 + "\n";
    else
      document.writeln( s1 );
  }



// ----------------------------------------------------------------------------
// Public section.
//
// The functions in this section comprise the interface between
// the script and outside code.
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Item object; packs together all item data for rendering and managing
// its state.
//
// Parameters:
//   colapsedIcon   item icon or icon to be used when the item is colapsed
//   expandedIcon   icon to be used when the item is expanded
//   mouseOverIcon  icon to be used when the mouse is over the item
//   selectedIcon   icon to be used when the item is selected
//   iconWidth      width of the icons
//   iconHeight     height of the icons
//   text           item text
//   font           item font
//   bold           true to make the font bold
//   italic         true to make the font italic
//   size           font size
//   color          text color
//   message        status bar mouse over message
//   url            item url
//   target         url target
//   last           true if the item is the last children of its parent
// ----------------------------------------------------------------------------
function Item( colapsedIcon, expandedIcon, mouseOverIcon, selectedIcon, iconWidth, iconHeight, text, font, bold, italic, size, color, message, url, target, last )
  {
    this.id = items.length;
    this.colapsedIcon = colapsedIcon;
    this.expandedIcon = expandedIcon;
    this.mouseOverIcon = mouseOverIcon;
    this.selectedIcon = selectedIcon;
    this.iconWidth = iconWidth;
    this.iconHeight = iconHeight;
    this.text = text;
    this.font = font;
    this.bold = bold;
    this.italic = italic;
    this.size = size;
    this.color = color;
    this.message = message;
    this.url = url;
    this.target = target;

    this.opened = false;
    this.selected = false;
    this.mouseOver = false;

    this.children = new Array();
    this.last = last;
    this.obj = null;
    this.treeIcon = null;
    this.icon = null;
    this.style = null;
    this.parent = null;

    items[this.id] = this;
  }



// ----------------------------------------------------------------------------
// Adds a new item to the sitemap.
//
// Parameters:
//   siteItem     item to add
//   parent       item parent (if null, adds to top level)
// ----------------------------------------------------------------------------
function addItem( siteItem, parent )
  {
    if ( parent == null )
      topItems[topItems.length] = siteItem;
    else
      parent.children[parent.children.length] = siteItem;
    siteItem.parent = parent;
  }



// ----------------------------------------------------------------------------
// Generates the HTML code for the entire sitemap. Notice that the "items"
// array must contain the sitemap items in the order they will appear.
//
// Parameters:
//   _style               sitemap style
//   _expandTopItems      true to create the sitemap with the top level items expanded
//   _mouseOverColor      color to use when the mouse is over an item
//   _selectedColor       color to use when an item is selected
//   _selectedBackground  background color to use when an item is selected
//   _scriptURL           URL to the script directory
// ----------------------------------------------------------------------------
function renderSitemap( _style, _expandTopItems, _mouseOverColor, _selectedColor, _selectedBackground, _scriptURL )
  {
    if ( document.all )
      browser = "IE";
    else if ( document.layers )
      browser = "NS";
	else if ( document.getElementById ) 
	  browser = "NS6";
	
    if ( browser == "OTHER" )
      _style = "LIST";
    style = _style;
	
    scriptURL = _scriptURL;
    expandTopItems = _expandTopItems;
    mouseOverColor = _mouseOverColor;
    selectedColor = _selectedColor;
    selectedBackground = _selectedBackground;
	
	blankImg.src = scriptURL+"blank.gif";
	simpleImg.src = scriptURL+"simple.gif";
	simplelImg.src = scriptURL+"simplel.gif";
	minusImg.src = scriptURL+"minus.gif";
	colapseImg.src = scriptURL+"colapse.gif";
	colapselImg.src = scriptURL+"colapsel.gif";
	plusImg.src = scriptURL+"plus.gif";
	expandlImg.src = scriptURL+"expandl.gif";
	expandImg.src = scriptURL+"expand.gif";
	spaceImg.src = scriptURL+"space.gif";
	treeLineImg.src = scriptURL+"treeline.gif";
	
    if ( browser == "NS" )
      {
        document.writeln( "<ilayer id='sitemap'></ilayer>" );
        window.onload = display;
      }
    else if ( browser == "NS6" )
	  {
	    //window.onload = display;
	    display();
	  }
    else
      display();
  }
  
