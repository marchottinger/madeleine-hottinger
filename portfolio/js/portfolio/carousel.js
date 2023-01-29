/**
 * Portfolio' Carousel.
 * @namespace
 * @author Marc Hottinger
 * @version 1.0.0
 * @license GPL-3.0-or-later
 **/
Portfolio.Carousel = (function($) {
    /**
     * Initializes a Bootstrap carouseL and listens to mouse clicks on its slides to switch to the next slide.
     */
    function intitializeCarousel() {
        console.log("carousel init");
        if ($carousel.length) {
            carousel = new bootstrap.Carousel($carousel.get(0), {
                ride : false,
                wrap : true
            });

            let myCarousel = $carousel.get(0);

            updateCarouselStyles($(".carousel-item.active"));

            myCarousel.addEventListener('slide.bs.carousel', function (e) {
                updateCarouselStyles($(e.relatedTarget));
                zoomOut();

                if (e.to == 0 && e.direction == "left") {
                    // switchToNextPage();
                }
            });

            $carousel.removeClass("disabled");
        
            updateCarouselCaptionOnMouseMove();
        }

        enableDebug();
    }

    /**
     * Disposes the bootstrap Carousel and adds a "diabled" class to it for further manipulation.
     */
    function stopCarousel() {
        console.log("carousel", carousel);
        if ($carousel.length) {
            $carousel.addClass("disabled");
        }
        if (carousel) {
            carousel.pause();
        }
    }

    function updateCarouselStyles($el) {
        console.log("update styles")
        let carouselItemStyles = $el.attr("style");
        $("body").attr("style", carouselItemStyles);
    }

    function updateCarouselCaptionOnMouseMove() {
        var moving = false;

        if ($(window).width() > 992) {
            $carousel.on("mousemove", function() {
                if (!moving) {
                    moving = true;

                    let displayed = false;
                    if (!displayed) {
                        displayed = true
                        displayCaption();
        
                        let to = setTimeout(() => {
                            moving = false;
                            displayed = false;
                            hideCaption();
                        }, 2000);
                    }
                }
            });
        }
    }

    /**
     * Enables the responsive mode for the portfolio, aka static mode where the carousels are displayed as a simple image list.
     */
    function enableResponsiveMode() {
        updateResponsiveMode();
        updateResponsiveModeOnResize();
    }

    /**
     * Updates the responsive mode according to the window size.
     */
    function updateResponsiveMode() {
        console.log("update resonsive mode");
        zoomOut();

        if($(window).width() < 992) {
            stopCarousel()
            closeInfoPanel();
        } else {
            intitializeCarousel();
        }
    }

    function enableZoomMode() {
        $(document).on("keypress", function (e) {
            e = e || window.event;
            // use e.keyCode
            if (e.keyCode == "90") {
                zoomToggle();
            }
        });

        $(".zoom-control").on("click", function(e) {
            zoomToggle();
        });
    }

    function zoomToggle() {
        zoom = !zoom;

        if (zoom) {
            zoomIn();
        } else {
            zoomOut();
        }
    }

    function zoomOut() {
        $(".zoom-control").removeClass("active");
        $(".js-image-zoom__zoomed-image").add(".js-image-zoom__zoomed-area").remove();
        $(".carousel-control-prev").add(".carousel-control-next").css({"pointer-events": "auto"});
    }

    function zoomIn() {
        $(".zoom-control").addClass("active");

            let $media = $(".carousel-item.active").find(".media")
            ,	media = $media.get(0)
            ,	$image = $media.find("img")
            ,	imageSrc = $image.attr("src")
            ,	imageSrcOriginal = $image.attr("data-source")
            ,	width = $(window).width()
            ,	height = $(window).height()
            ,	options = {
                    "src": imageSrc
                ,	"width": width / 2
                ,	"height": height
                ,	"zoomWidth": width /2
                ,	"zoomPosition": "original"
                ,	"fillContainer": true
                ,	"zoomStyle" : 'background-color: var(--background-default);'
                };

            // let $imageOriginal = $('<img src="' + imageSrcOriginal + '" alt="" class="preload visually-hidden">');

            // $media.append($imageOriginal);

            // Portfolio.Utils.waitLoad($imageOriginal, function() {
            // 	let imageNaturalWidth = $media.find(".preload").get(0).naturalWidth
            // 	,	imageNaturalHeight = $media.find(".preload").get(0).naturalHeight;
                
            // 	$image.attr("src", imageSrcOriginal);
            // 	$image.attr("width", imageNaturalWidth);
            // 	$image.attr("height", imageNaturalHeight);
            // 	$imageOriginal.remove();
            // 	console.log(imageNaturalWidth, imageNaturalHeight);
                
                new ImageZoom(media, options);
            // });
                

            $(".carousel-control-prev").add(".carousel-control-next").css({"pointer-events": "none"});
    }

    // CREDITS : https://www.cssscript.com/image-zoom-pan-hover-detail-view/
    var addZoom = (target) => {
        // (A) GET CONTAINER + IMAGE SOURCE
        let container = document.getElementById(	),
            imgsrc = container.currentStyle || window.getComputedStyle(container, false);
            imgsrc = imgsrc.backgroundImage.slice(4, -1).replace(/"/g, "");

        // (B) LOAD IMAGE + ATTACH ZOOM
        let img = new Image();
        img.src = imgsrc;
        img.onload = () => {
        // (B1) CALCULATE ZOOM RATIO
        let ratio = img.naturalHeight / img.naturalWidth,
            percentage = ratio * 100 + "%";

        // (B2) ATTACH ZOOM ON MOUSE MOVE
        container.onmousemove = (e) => {
            let rect = e.target.getBoundingClientRect(),
                xPos = e.clientX - rect.left,
                yPos = e.clientY - rect.top,
                xPercent = xPos / (container.clientWidth / 100) + "%",
                yPercent = yPos / ((container.clientWidth * ratio) / 100) + "%";

            Object.assign(container.style, {
            backgroundPosition: xPercent + " " + yPercent,
            backgroundSize: img.naturalWidth + "px"
            });
        };

        // (B3) RESET ZOOM ON MOUSE LEAVE
        container.onmouseleave = (e) => {
            Object.assign(container.style, {
            backgroundPosition: "center",
            backgroundSize: "cover"
            });
        };
        }
    };

    // (C) ATTACH FOLLOW ZOOM
    window.onload = () => { addZoom("zoomC"); };

    /**
     * Updates the responsive mode according to the window size on window resize.
     */
    function updateResponsiveModeOnResize() {
        $(window).on("resize", function() {
            updateResponsiveMode();
        });
    }

    function displayCaption() {
        if (!zoom) {
            $carousel.find(".carousel-caption").removeClass("muted");
        }
    }
    function hideCaption() {
        $carousel.find(".carousel-caption").addClass("muted");
    }
})(Portfolio, jQuery);