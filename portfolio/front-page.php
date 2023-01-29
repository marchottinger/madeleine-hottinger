<?php
$page_id = get_field('linked_page');
get_header();
$post = get_post($page_id);
$permalink = get_permalink($post);
setup_postdata($post);?>
<div id="data-project" data-front-page-url="<?php echo $permalink; ?>" data-front-page-id="<?php echo $page_id; ?>" data-front-page-title="<?php echo get_the_title(); ?>"></div>
<?php
echo outputPartial();
wp_reset_postdata(); // Check if useful
get_footer();

function outputPartial() {
	ob_start();
	include('page.php');
	$content = ob_get_contents();
	ob_get_clean();

	return $content;
}
?>