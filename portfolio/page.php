<?php
$hasURLQuery = isset($_GET['url']);

echo getContent();

function getContent() {
    ob_start();

    $hasUndefinedUrlQuery = empty($_GET['url']);
    
    if ($hasUndefinedUrlQuery) {
        get_header();
    }

    if ($hasUndefinedUrlQuery) {?>
        <!-- <div class="col-12 col-lg-6 px-5 p-lg-0 gx-0 gallery"> -->
        <div class="col px-5 p-lg-0 gx-0 gallery">
            <main id="xhr-target"><?php
    }

    if (have_rows('modules')):
        while (have_rows('modules')): the_row();
            $settings = get_sub_field('content_settings');
            $display = $settings['content_display_enable'];
            $title = $settings['content_title'];
            $title_id = sanitize_title($title, $context = 'save');
            $type = $settings['content_type'];

            if ($display) {
                if ($type == "carousel" || "text") {?>
                    <div id="portfolio-carousel-<?php echo get_the_id(); ?>" class="carousel carousel-fade slide" data-bs-pause="true" data-page-id="<?php echo get_the_id(); ?>" data-page-title="<?php echo get_the_title(); ?>">
                        <div class="carousel-inner"><?php
                            $content = get_sub_field('content');
                            $carousel = $content['carousel'];
                            while (have_rows('content')): the_row();
                                $active = true;
                                $count = count($carousel);

                                $counter = 1;
                                while (have_rows('carousel')): the_row();
                                    if ($active) {
                                        $activeClass = 'active';
                                        $active = false;
                                    }
                                    $image = get_sub_field('image');
                                    $obj_pos = "";
                                    $obj_fit = "";
                                    $obj_styles = "";
                                    $legend = get_sub_field('description');
                                    while (have_rows('image_options')): the_row();
                                        $obj_pos = get_sub_field('position');
                                        $obj_fit = get_sub_field('size');
                                        $obj_styles = "object-position: " . $obj_pos . "; object-fit: " . $obj_fit . ";";
                                    endwhile;
                                    while (have_rows('appearance_options')): the_row();
                                        $enable_multicolor = get_sub_field('enable_multiple_colors');

                                        $txt_color_default = get_sub_field('text_color');
                                        $bg_color_default = get_sub_field('background_color');

                                        $txt_color_right = get_sub_field('text_color_2');
                                        $bg_color_right = get_sub_field('background_color_2');

                                        $txt_color_default = $txt_color_default ? $txt_color_default : "#000000";
                                        $bg_color_default = $bg_color_default ? $bg_color_default : "#FFFFFF";

                                        $txt_color_right = $txt_color_right ? $txt_color_right : "#000000";
                                        $bg_color_right = $bg_color_right ? $bg_color_right : "#F5F5F5";

                                        $style_vars_default = "--background-default: " . $bg_color_default . "; --color-default: " . $txt_color_default . ";";
                                        $style_vars_default_right = "--background-right: " . $bg_color_default . "; --color-right: " . $txt_color_default . ";";
                                        $style_vars_right = "--background-right: " . $bg_color_right . "; --color-right: " . $txt_color_right . ";";

                                        // $pane_colors = $enable_multicolor ? $style_vars_default . " " . $style_vars_right : $style_vars_default . " " . $style_vars_default_right;
                                        
                                        $pane_colors = $style_vars_default . " " . $style_vars_right;

                                        $pane_styles = 'style="' . $pane_colors . '"';
                                    endwhile;?>
                                    <div class="carousel-item <?php echo $activeClass; ?>" <?php echo $pane_styles; ?>>
                                        <div class="media">
                                            <div class="progress">
                                                <span>Chargement</span>
                                            </div><?php
                                            if ($image) {
                                                echo wp_get_attachment_image($image, "full", "", array("loading" => "false", "data-source" => wp_get_original_image_url($image), "style" => $obj_styles));
                                            }?>
                                            
                                        </div><?php 
                                        
                                        $legend_length = mb_strlen($legend, "utf-8");
                                        $single_line = ($legend_length <= 58) ? "simple" : "";
                                        $single_line = ($single_line == "simple" && $legend_length == 0) ? "simple disabled" : $single_line;
                                        // $single_line = "length-" . $legend_length;
                                        ?>
                                        <div class="row carousel-caption d-none d-md-block <?php echo $single_line; ?>">
                                            <div class="legend col-md-6 px-lg-0"><?php echo $legend; ?></div>
                                            <div class="counter col-md-6 px-lg-0 d-none d-lg-block text-end"><?php 
                                                if ($count >= 2) {
                                                    echo $counter . "/" . $count;?>

                                                    <button class="carousel-control-prev" type="button" data-bs-target="#portfolio-carousel-<?php echo get_the_id(); ?>" data-bs-slide="prev">
                                                        <span>&#x2039&nbsp;précédent</span>
                                                    </button>
                                                    <button class="carousel-control-next" type="button" data-bs-target="#portfolio-carousel-<?php echo get_the_id(); ?>" data-bs-slide="next">
                                                        <span>suivant&nbsp;&#x203A</span>
                                                    </button><?php 
                                                }?>
                                            </div>
                                        </div>
                                    </div><?php
                                    $activeClass = '';
                                    $counter++;
                                endwhile;
                            endwhile;?>
                        </div>
                        <div class="controls-wrapper d-none">
                            <button class="carousel-control-prev" type="button" data-bs-target="#portfolio-carousel-<?php echo get_the_id(); ?>" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Previous</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#portfolio-carousel-<?php echo get_the_id(); ?>" data-bs-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Next</span>
                            </button>
                            <div class="zoom-control-wrapper d-flex justify-content-center align-self-end  w-100">
                                <div class="zoom-control">
                                </div>
                            </div>
                        </div>
                    </div><?php
                }
            }
        endwhile;
    endif;

    if ($hasUndefinedUrlQuery) {?>
            </main>
        </div>
        <div id="xhr-nav" class="col-12 col-lg-6 menu-panel">
			<header><?php
                if ($type == "carousel") { ?>
                    <span class="d-none d-lg-inline">Madeleine Hottinger est une artiste graveur suisse. <a class="info-panel-trigger" href="/a-propos">En savoir plus</a></span>
                    <nav>
                        <?php wp_nav_menu( array( 'theme_location' => 'main-menu', 'depth' => 0 ) ); ?>
                    </nav><?php
                } else if ($type == "text") {
                    the_content();
                }?>
			</header>
		</div>
        
        <div class="info-panel">
            <aside>
                <div class="row gx-0">
                    <div class="col-md-6 d-none d-md-block gx-0">
                        <div class="media"><?php
                            $image = get_field('image', 525);
                            if ($image) {
                                echo wp_get_attachment_image($image, "full", "", array("loading" => "false"));
                            }?>
                        </div>
                    </div>
                    <div id="info-text" class="scrollable-y col-md-6 mx-auto gx-0">
                        <div class="text">
                            <span class="intro trigger">Madeleine Hottinger est une artiste graveur suisse. <span class="close-panel">Fermer</span></span><?php
                            $text = get_field('text', 525);
                            echo $text;?>
                        </div>
                    </div>
                </div>
            </aside>
        </div> <?php
        wp_reset_postdata();

    }
    
    $content = ob_get_contents();
    ob_end_clean();
    
    if ($hasUndefinedUrlQuery) {
        echo $content;
    } else {
        return $content;
    }
    if ($hasUndefinedUrlQuery) {?>
        </div>
        </div><?php
        get_footer();
    }
}?>