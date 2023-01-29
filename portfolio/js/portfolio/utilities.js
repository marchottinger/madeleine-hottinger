/**
 * Portfolio' utilities.
 * @namespace
 * @author Marc Hottinger
 * @version 1.0.0
 * @license GPL-3.0-or-later
 **/
 Utils = (function ($) {
    //  TODO Make sure that this function triggers the callback when ALL images have been loaded.
    this.waitLoad = ($els, callback) => {
        $els.each(function () {
            $el = $(this);

            if ($el.is("img")) {
                $el.one("load", function () {
                    typeof callback === 'function' && callback();
                }).each(function () {
                    if (this.complete) {
                        $(this).trigger('load');
                    }
                });
            } else {
                console.log("No image. Skipping Lazy loading.")
                typeof callback === 'function' && callback();
            }
        });

        return $el;
    };

    this.parseQuery = () => {
        const urlParams = new URLSearchParams(location.search);
        
        for (const [key, value] of urlParams) {
            switch(key) {
                case "debug":
                    Portfolio.setDebug(true);
					debug = true;
					break;
            }
        }
    }

    this.printConsole = function (message, level = "log") {
        switch (level) {
            case "error":
                console.error(message);
                break;
            case "info":
                console.info(message);
                break;
            case "warn":
                console.warn(message);
                break;
            case "log":
            default:
                console.log(message);
                break;

        }
    };

    return this;
})(jQuery);

const debounce = (callback, wait) => {
    let timeoutId = null;
    return (...args) => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
            callback.apply(null, args);
        }, wait);
    };
}