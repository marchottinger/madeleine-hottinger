<?php global $wp_query;
    $loop = 'notfound';

    if ($wp_query->is_page) {
        $loop = is_front_page() ? 'front' : 'page';
	}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
	<meta name="description" content="Découvrez les travaux artistiques en gravure de Madeleine Hottinger, artiste suisse issue de l'école cantonale des beaux arts de Lausanne, écal.">
    <title>Gravures de Madeleine Hottinger - <?php echo wp_title(''); ?></title>
    <link rel="apple-touch-icon" sizes="180x180" href="<?php echo get_template_directory_uri(); ?>/images/favicon/apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32" href="<?php echo get_template_directory_uri(); ?>/images/favicon/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="<?php echo get_template_directory_uri(); ?>/images/favicon/favicon-16x16.png">
	<!-- <link rel="manifest" href="<?php echo get_template_directory_uri(); ?>/images/favicon/site.webmanifest"> -->
	<link rel="mask-icon" href="<?php echo get_template_directory_uri(); ?>/images/favicon/safari-pinned-tab.svg" color="#5bbad5">
	<meta name="msapplication-TileColor" content="#ffffff">
	<meta name="theme-color" content="#ffffff">
    <?php wp_head(); ?>
	<script type="text/javascript">
        function UnCryptMailto( s ) {
            var n = 0;
            var r = "";
            for( var i = 0; i < s.length; i++)
            {
                n = s.charCodeAt( i );
                if( n >= 8364 )
                {
                    n = 128;
                }
                r += String.fromCharCode( n - 1 );
            }
            return r;
        }

        function linkTo_UnCryptMailto( s ) {
            location.href=UnCryptMailto( s );
        }

        

        function CryptMailto() {
            var n = 0;
            var r = "";
            // var s = "mailto:" + document.forms[0].emailField.value;
            var s = "mailto:madeleine.hottinger@gmail.com";
            // var e = document.forms[0].emailField.value;

            // e = e.replace(/@/, " [at] ");
            // e = e.replace(/\./g, " [dot] ");

            for (var i = 0; i < s.length; i++) {
                n = s.charCodeAt(i);
                if (n >= 8364) {
                    n = 128;
                }
                r += String.fromCharCode(n + 1);
            }

            console.log(r);
            // document.forms[0].cyptedEmailField.value = r;
            // document.forms[0].HTMLCyptedEmailField.value = "<a href=\"javascript:linkTo_UnCryptMailto('" + r + "');\">" + e + "</a>";
        }
    </script>
</head>
<body <?php body_class(); ?>>
<?php $page_title = get_the_title();?>
<div class="container-fluid px-0">
	<div id="burger-nav" class="row gx-0 d-flex d-lg-none">
		<div class="col-auto me-auto">
            <span>Madeleine Hottinger est une artiste graveur suisse. <a class="info-panel-trigger" href="/a-propos">En savoir plus</a></span>
		</div>
        <div class="col-auto">
			<div id="burger">
				<span></span>
				<span></span>
				<span></span>
			</div>
		</div>
	</div>
	<div class="row gx-0"><?php
if ($loop == "page") {
} else if ($loop = "front") {
}?>