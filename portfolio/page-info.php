<?php
/*
Template Name: Info
Template Post Type: page
*/
get_header();?>

<div class="col-12 info-panel open d-block">
    <aside>
        <div class="row">
            <div class="col-lg-6 d-none d-lg-block">
                <div class="media">
                    <!-- <img src="/wp-content/themes/portfolio/images/DSC8904.jpg" alt="">--><?php
                    $image = get_field('image');
                    if ($image) {
                        echo wp_get_attachment_image($image, "full", "", array("loading" => "false"));
                    }?>
                </div>
            </div>
            <div class="col-12 col-lg-6 mx-auto">
                <div class="text"><?php
                    $text = get_field('text');
                    echo $text;?>
                </div>
            </div>
        </div>
    </aside>
</div><?php

get_footer();
// Votre code ici
?>