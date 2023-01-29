Portfolio.XHR.Partials = (function(x, $) {
    this.show = function(callback) {};
    this.hide = function(callback) {};
    /**
     * 
     * @param {event} e A csutom event object cast by the xhrUpdate event.
     * @param {object} [options] An object of property-value pairs to set options. Sane defaults are provided and further customization is possible.
     * @param {function} [callback] An optional function executed as a callback.
     */
    this.switch = function(e, options, callback) {
        // console.log("js^^/Portfolio/xhr/ui.js - function switchPartial, var $target: ", $target, ", var id: ", id, ", var content: ", /*content*/);
        let defaults = {
            $target: $("#xhr-target"),
            $nav: $("#xhr-nav nav a"),
            waitImgEls: null,
            id: e.detail.id,
            title: e.detail.pageTitle,
            content: e.detail.content
        };
        options = options || defaults;
        let o = $.extend({}, defaults, options);
        
        // o.$nav.addClass("updating");
        o.$target.addClass("updating").one('transitionend webkitTransitionEnd oTransitionEnd', function () {
            o.$target.html(o.content);
            
            let $waitImgEls = o.$target.find(o.waitImgEls);
            if ($waitImgEls.length) {
                Portfolio.Utils.waitLoad($waitImgEls, function() {
                    o.$target.off('transitionend webkitTransitionEnd oTransitionEnd');
                    // o.$nav.removeClass("updating");
                    o.$target.removeClass("updating");
                    
                    typeof callback === 'function' && callback();
                });
            } else {
                // o.$nav.removeClass("updating");
                o.$target.removeClass("updating");
                typeof callback === 'function' && callback();
            }

            document.title = "Gravures de Madeleine Hottinger - " + o.title;
        });
    };
    
    return this;
})(Portfolio.XHR, jQuery);


// TODO Add this code snippet to the functions.php of your wordpress to add the id of each page in the wordpress menu.
// function wpse_menu_item_id_class( $classes, $item ) {
//     if (isset( $item->object_id)) {
//         $classes[] = sprintf( 'page-id-%d', $item->object_id );
// 	}

//     return $classes;
// }
// add_filter( 'nav_menu_css_class', 'wpse_menu_item_id_class', 10, 2 ); 