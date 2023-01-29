<?php 
require_once("../../../wp-load.php");
$outputFormat = $_GET["xhr-format"];
$post_url   = $_GET['url'];
$post_id = url_to_postid($post_url);
$post = get_post($post_id);
setup_postdata($post);
processOutput();
wp_reset_postdata(); // Check if useful

function processOutput() {
	switch($outputFormat) {
		case "html":
			outputHTML();
			break;
		case "json":
		default:
			outputJSON($post);
			break;
	}
}

function outputHTML() {
	echo outputPartial();
}

function outputJSON() {
	$seconds_to_cache = 3600;
	$ts = gmdate("D, d M Y H:i:s", time() + $seconds_to_cache) . " GMT";
	header("Expires: $ts");
	header("Pragma: cache");
	header("Cache-Control: max-age=$seconds_to_cache");
	header("Content-Type: application/json");

	$title = get_the_title();
	$id = get_the_ID();
	$content = outputPartial();
	$response = array(
		"id" => $id,
		"title" => $title,
		"content" => $content
	);
	
	echo json_encode($response);
}

function outputPartial() {
	ob_start("ob_gzhandler");
	include('./page.php');
	$content = ob_get_contents();
	ob_get_clean();

	return $content;
}?>