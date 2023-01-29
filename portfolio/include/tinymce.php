<?php
	function mrw_mce_init($args){
		$style_formats = array(
			array(
				'title' => 'Paragraphe',
				'format' => 'p'
			),
			array(
				'title' => 'Titre 2',
				'format' => 'h2'
			),
			array(
				'title' => 'Titre 3',
				'format' => 'h3'
			),
			array(
				'title' => 'Titre 4',
				'format' => 'h4'
			),
			array(
				'title' => 'Titre 5',
				'format' => 'h5'
			),
			array(
				'title' => 'Titre 6',
				'format' => 'h6'
			)
		);
	 	$text_styles = array();
		$text_styles = apply_filters( 'mrw_mce_text_style', $text_styles );
		if( !empty( $text_styles) ) {
			$text_styles = array(
				'title' => 'Text Styles',
				'items' => $text_styles
			);
			$other_formats = array_pop( $style_formats );
			$style_formats = array_merge( $style_formats, array( $text_styles ), array( $other_formats ) );
		}
		$style_formats = apply_filters( 'mrw_mce_style_formats', $style_formats );
		$args['style_formats'] = json_encode( $style_formats );
		return $args;
	}
	add_filter( 'tiny_mce_before_init', 'mrw_mce_init' );
	
	// Gestion des boutons dans l'éditeur.
	if( !function_exists('base_extended_editor_mce_buttons') ){
		function base_extended_editor_mce_buttons($buttons) {
			return array(
				'styleselect', 'bold', 'italic', 'underline', 'bullist', 'numlist', 'forecolor', 'link', 'unlink', 'pastetext', 'wp_fullscreen', 'wp_adv'
			);
		}
		add_filter("mce_buttons", "base_extended_editor_mce_buttons", 0);
	}
	if( !function_exists('base_extended_editor_mce_buttons_2') ){
		function base_extended_editor_mce_buttons_2($buttons) {
			return array('code');
		}
		add_filter("mce_buttons_2", "base_extended_editor_mce_buttons_2", 0);
	}
	
	function wpr_custom_color_tinymce( $options ) {
		$options['textcolor_map'] = json_encode(
			array(
				'2F3D47', 'main',
				'FF4E00', 'Secondary',
			)
		);
		return $options;
	}
	//add_filter( 'tiny_mce_before_init', 'wpr_custom_color_tinymce' );
?>