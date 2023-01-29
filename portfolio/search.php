<?php get_header(); ?>
	<div class="container-page">
		<div class="container">
			<?php if ( have_posts() ) : ?>
				<h1 class="page-title"><?php printf( __( 'Résultats de la recherche pour: %s', 'ergopix' ), '<span>' . get_search_query() . '</span>' ); ?></h1>
				<?php while ( have_posts() ) : the_post(); ?>
					<h2><?php the_title(); ?></h2>
					<?php the_excerpt(); ?>
				<?php endwhile; ?>
			<?php else : ?>
				<p><?php _e( 'Désolé, mais rien ne correspond à vos critères de recherche. S\'il vous plaît essayez de nouveau avec des mots clés différents.', 'ergopix' ); ?></p>
			<?php endif; ?>
		</div>
	</div>
<?php get_footer(); ?>