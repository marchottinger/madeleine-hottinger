<?php
function head_enqueue(){
	wp_enqueue_style('bootstrap', get_bloginfo('template_url') . '/libs/bootstrap/css/bootstrap.min.css', false, 1);
	wp_enqueue_style('webfonts', get_bloginfo('template_url') . '/webfonts.css', false, 1);
	wp_enqueue_style('style', get_bloginfo('template_url') . '/style.css', false, 1);
	wp_enqueue_script('jquery', get_bloginfo('template_url') . '/libs/jquery/js/jquery-3.6.0.min.js', "", 1, true);
	wp_enqueue_script('bootstrap', get_bloginfo('template_url') . '/libs/bootstrap/js/bootstrap.min.js', "", 1, true);
	// wp_enqueue_script('portfolio', get_bloginfo('template_url') . '/js/portfolio.js', "", 1, true);
	wp_enqueue_script('portfolio-utilities', get_bloginfo('template_url') . '/js/portfolio/utilities.js', "", 1, true);
	// wp_enqueue_script('utilities', get_bloginfo('template_url') . '/js/utilities.js', "", 1, true);
	wp_enqueue_script('scripts-test', get_bloginfo('template_url') . '/js/scripts-test.js', "", 1, true);
	// wp_enqueue_script('scripts', get_bloginfo('template_url') . '/js/scripts.js', "", 1, true);
	// wp_enqueue_script('portfolio-page', get_bloginfo('template_url') . '/js/portfolio/page.js', "", 1, true);
	// wp_enqueue_script('portfolio-menu', get_bloginfo('template_url') . '/js/portfolio/menu.js', "", 1, true);
	// wp_enqueue_script('portfolio-viewer', get_bloginfo('template_url') . '/js/portfolio/viewer.js', "", 1, true);
	wp_enqueue_script('portfolio-xhr', get_bloginfo('template_url') . '/js/portfolio/xhr.js', "", 1, true);
	wp_enqueue_script('portfolio-xhr-partials', get_bloginfo('template_url') . '/js/portfolio/xhr/partials.js', "", 1, true);
}
add_action('wp_enqueue_scripts', 'head_enqueue');

require("include/tinymce.php");
require("include/post-types.php");
require("include/taxonomies.php");

add_theme_support('post-thumbnails');

function add_class_to_all_menu_anchors($atts) {
    $atts['class'] = 'xhr-link';
 
    return $atts;
}
add_filter('nav_menu_link_attributes', 'add_class_to_all_menu_anchors', 10);

function wpse_menu_item_id_class($classes, $item) {
    if (isset($item->object_id)) {
        $classes[] = sprintf('page-id-%d', $item->object_id);
	}

    return $classes;
}
add_filter('nav_menu_css_class', 'wpse_menu_item_id_class', 10, 2);

// wp_nav_menu($args);

// Remove filter
// remove_filter('nav_menu_css_class', 'wpse_menu_item_id_class', 10, 2);

function custom_sidebar_entries ()      //creating functions post_remove for removing menu item
{ 
   remove_menu_page('index.php');
   remove_menu_page('edit.php');
   remove_menu_page('edit-comments.php');
}

add_action('admin_menu', 'custom_sidebar_entries');   //adding action for triggering function call

function mySearchWPXpdfPath(){
	$url = get_template_directory().'/pdftotext';
	return $url;
}
add_filter('searchwp_xpdf_path', 'mySearchWPXpdfPath');

function register_my_menu() {
	register_nav_menu('main-menu',__('Menu principal'));
}
add_action('init', 'register_my_menu');

add_action('map_meta_cap', 'custom_manage_privacy_options', 1, 4);
function custom_manage_privacy_options($caps, $cap, $user_id, $args){
	if (!is_user_logged_in()) return $caps;
	$user_meta = get_userdata($user_id);
	if (array_intersect(['editor', 'administrator'], $user_meta->roles)) {
		if ('manage_privacy_options' === $cap) {
			  $manage_name = is_multisite() ? 'manage_network' : 'manage_options';
			  $caps = array_diff($caps, [ $manage_name ]);
		}
	}
	return $caps;
}

if(function_exists('acf_add_options_page')){
	acf_add_options_page(array(
		'page_title' => 'Options du site',
		'menu_title'	=> 'Options du site',
		'menu_slug' => 'theme-general-settings',
		'capability' => 'edit_posts',
		'redirect' => false
	));
}

function show_terms($terms){
	$text = "";
	$i = 0;
	foreach($terms as $term){ 
		$text .= $term->name;
		if($terms[$i+1] != ""){
			$text .= '<span class="sep ms-2 me-2"><img src="'.get_template_directory_uri().'/images/sep.svg" width="3" height="3" /></span>';
		}
		$i++;
	}
	return $text;	
}

add_filter('is_xml_preprocess_enabled', 'wpai_is_xml_preprocess_enabled', 10, 1);
function wpai_is_xml_preprocess_enabled($is_enabled) {
	return false;
}

function acf_set_featured_image($value, $post_id, $field){
	if($value != ''){
		add_post_meta($post_id, '_thumbnail_id', $value);
	}
	return $value;
}
//add_filter('acf/update_value/name=vignette', 'acf_set_featured_image', 10, 3);


/**
 * Customize the title for the home page, if one is not set.
 *
 * @param string $title The original title.
 * @return string The title to use.
 */
function wpdocs_hack_wp_title_for_home( $title ) {
	if ( empty( $title ) && ( is_home() || is_front_page() ) ) {
		$title = __( 'Home', 'textdomain' ) . ' | ' . get_bloginfo( 'description' );
	}

	return $title;
}

add_filter( 'wp_title', 'wpdocs_hack_wp_title_for_home' );

function acf_sc_meta_description_area() {
	$description_val = '';
	$get_description_val = get_field('texte_dintroduction', get_the_ID());
	if($get_description_val){
		$description_val = $get_description_val;
	} else {
		$description_val = smartcrawl_get_value('metadesc', get_the_ID());
	} ?>
	<div class="sui-form-field">
		<label class="sui-label" for="wds_metadesc">
			<?php esc_html_e('Description', 'wds'); ?>
			<span><?php echo esc_html(sprintf(__('- Recommended minimum of 135 characters, maximum %d.', 'wds'), SMARTCRAWL_METADESC_LENGTH_CHAR_COUNT_LIMIT)); ?></span>
		</label>
		<textarea rows='2' name='wds_metadesc' id='wds_metadesc' class='sui-form-control wds-meta-field'><?php echo esc_textarea($description_val); ?></textarea>
	</div><?php
}

function show_post_id($pid) {
	$thepage = get_post($pid);
	$content = $thepage->post_content;
	$content = apply_filters('the_content', $content);
	echo $content;
}

function show_page_path($path) {
	$post = get_page_by_path($path);
	$content = apply_filters('the_content', $post->post_content);
	echo $content;
}

function show_page_partial($path) {
	$post = get_page_by_path($path);
	setup_postdata($post);
	ob_start("ob_gzhandler");
	include('./page-info.php');
	$content = ob_get_contents();
	ob_get_clean();
	echo $content;
	wp_reset_postdata();
} ?>