/**
 * Portfolio with interactive viewer and gallery navigation.
 * @namespace
 * @author Marc Hottinger
 * @version 1.0.0
 * @license GPL-3.0-or-later
 **/
let Portfolio = (function($) {
    let currentProjectId
    ,   $carousel;

    this.status = "amazing";

    /**
     * Initializes the portfolio by listening to different events.
     */
	this.init = () => {
        $(document).on("xhrUpdate", (e) => {
            console.log(e);
            _switchProject(e);
        });

        $(window).on("load", () => {
            $carousel = $(".carousel");
            Portfolio.XHR.enable();
            Portfolio.Viewer.reset();
            _initializeMenu();

            // CryptMailto();
            // linkTo_UnCryptMailto("nbjmup;nbefmfjof/ipuujohfsAhnbjm/dpn");
        });

        $(window).on("popstate", () => {
            console.log("Popped history stack");
            setTimeout(() => {
                Portfolio.Menu.close();
                Portfolio.Page.hideContent();
            }, 200);
        });

        $(window).on("resize", () => {
            _refresh();
        });
    };

    /**
     * Initializes the menu if coming from the front-page.
     */
    function _initializeMenu() {
        console.log("Initializing Menu");
        let dataProjectUrl = $("#data-project").attr("data-front-page-url")
        ,   dataProjectID = $carousel.attr("data-page-id")
        ,   dataProjectTitle = $carousel.attr("data-page-title")
        ,   historyStateInfo = { title: dataProjectTitle, url: dataProjectUrl };

        currentProjectId = dataProjectID;
        console.log("Project:" + currentProjectId);
        
        if (dataProjectUrl) {
            console.log("Replace history state")
            console.log(historyStateInfo, historyStateInfo.title, historyStateInfo.url);
            history.replaceState(historyStateInfo, historyStateInfo.title, historyStateInfo.url);
            $(".page-id-" + currentProjectId).addClass("current-menu-item current_page_item");
        }
    }

    /**
     * Switches between projects after waiting for the image of the first slide to be loaded. Updates the highlighted menu link. Closes the menu.
     * @param {object} e A custom event object fired when a bespoke ajax request has been made to load a new project.
     */
    function _switchProject(e) {
        console.log("Switch project");
        currentProjectId = e.detail.id;

        Portfolio.XHR.Partials.switch(e, {
            waitImgEls : ".carousel-item.active img"
            }, () => {
                console.log('Switch');
                $carousel = $("#portfolio-carousel-" + currentProjectId);
                Portfolio.Menu.highlight(currentProjectId);
                Portfolio.Viewer.reset();
                Portfolio.Menu.close();
        });
    };

    /**
     * 
     */
    function _refresh() {
        console.log('Refresh');
        // Logic when resizing portfolio or else.
        if($(window).width() < 992) {
			Portfolio.Menu.close()
            Portfolio.Viewer.standby();
            Portfolio.Page.hideContent();
		} else {
			Portfolio.Viewer.reset();
			Portfolio.Viewer.repaint($(".carousel-item.active"));
		}
    }

	return this;
})(jQuery);

/**
 * Portfolio navigation menu.
 * @namespace
 * @author Marc Hottinger
 * @version 1.0.0
 * @license GPL-3.0-or-later
 **/
Portfolio.Menu = ((P, $) => {
    let $menuBurger = $("#burger")
    ,   $menuPanel = $(".menu-panel")
    ,   isOpen = false;

    $(window).on("load", () => {
        $menuBurger.on("click", () => {
            Portfolio.Menu.toggle();
        });
    });

    this.open = (callback) => {
        console.log("Menu opening");
        $menuPanel
        .one('transitionend', function () {
                console.log("Menu open");
                typeof callback === 'function' && callback();
            })
            .add($menuBurger).addClass("open");

        return isOpen = true;
    };

    this.close = (callback) => {
        console.log("Menu closing");
        $menuPanel
        .one('transitionend', function () {
                console.log("Menu closed");
                typeof callback === 'function' && callback();
            })
            .add($menuBurger).removeClass("open");
        
        return isOpen = false;
    };

    this.toggle = (callback) => {
        console.log("Menu toggling");
        return isOpen = (isOpen) ? close(callback) : open(callback);
    };

    this.highlight = (id) => {
        console.log("Menu highlight:", id);
        let $menuItems = $(".menu-item")
		,	$targetMenuItems = $(".page-id-" + id);

		$menuItems.removeClass("current-menu-item current_page_item");
		$targetMenuItems.addClass("current-menu-item current_page_item");
    };

    return this;
})(Portfolio, jQuery);


Portfolio.Page = ((P, $) => {
    let isOpen = false;

    // TODO rename classes that trigger the info-panel like so: info-panel-open, info-panel-close
    $(".info-panel-trigger").on("click", (e) => {
        e.preventDefault();
        showContent();
    });

    $(".close-panel").on("click", (e) => {
        e.preventDefault();
        hideContent();
    });

    this.showContent = () => {
        console.log("Content shown");
        Portfolio.Viewer.zoomOut();
        $(".info-panel").addClass("open");

        return isOpen = true;
    };
    this.hideContent = () => {
        console.log("Content hidden");
        $(".info-panel").removeClass("open");
        
        return isOpen = false;
    };
    
    this.toggleContent = () => {
        console.log("Content toggled");
        return isOpen = (isOpen) ? hideContent() : showContent();
    }

	return this;
})(Portfolio, jQuery);

/**
 * Portfolio viewer with advanced features.
 * @namespace
 * @author Marc Hottinger
 * @version 1.0.0
 * @license GPL-3.0-or-later
 **/
Portfolio.Viewer = ((P, $) => {
    let $window = $(window)
    ,   $carousel
    ,   $currentCarouselItem
    ,   $currentMedia
    ,   $currentImg
    ,   eCarousel
    ,   bCarousel
    ,   currentSlide = 0
    ,   isZoomed = false
    ,   mouseMoving = false
    ,   rect
    ,   xPos
    ,   yPos
    ,   xPercent
    ,   yPercent;

    $(window).on("load", () => {
        console.log('Creating BS carousel', $carousel, bCarousel);

        reset();

        bCarousel = new bootstrap.Carousel(eCarousel, {
            ride : false,
            wrap : true
        });

        if ($window.width >= 992) {
            reset();
        } else {
            standby();
        }

        $currentMedia
            .on("mousemove", handleMouseMove)
            .on("mousemove", handleMouseMoveDelay)
            .on("click", () => {
                showControls();
            })
    });

    $(window).on("keydown", (event) => {
        if (event.defaultPrevented) {
          return; // Do nothing if event already handled
        }
      
        switch(event.code) {
          case "Escape":
            zoomOut();
            Portfolio.Menu.close();
            Portfolio.Page.hideContent();
            break;
        case "ArrowLeft":
            prev();
            break;
        case "ArrowRight":
            next();
            break;
        }
    });

    /**
     * Resets the portfolio's viewer state. Means that we start (or restart) from a know state.
     */
    this.reset = () => {
        console.log("Viewer reset");
        
        $carousel = $(".carousel");
        $currentCarouselItem = $carousel.find(".carousel-item.active");
        $currentMedia = $currentCarouselItem.find(".media");
        $currentImg = $currentCarouselItem.find(".media img");
        eCarousel = $carousel.get(0);
        
        $currentMedia
            .off("mousemove")
            .off("click")
            .on("mousemove", handleMouseMove)
            .on("mousemove", handleMouseMoveDelay)
            .on("click", () => {
                return isZoomed = (isZoomed) ? zoomOut() : zoomIn();
        });

        repaint($(".carousel-item.active"));
        $carousel.removeClass("disabled");
        
// // // // // // // // // 
        $carousel.off('slide.bs.carousel');
        $carousel.on('slide.bs.carousel', (e) => {
            console.log('BS Carousel Sliding');

            $currentCarouselItem = $(e.relatedTarget);
            $currentMedia = $currentCarouselItem.find(".media");
            $currentImg = $currentCarouselItem.find(".media img");

            $currentCarouselItem.find(".media")
                .off("mousemove")
                .off("click")
                .on("mousemove", handleMouseMove)
                .on("mousemove", handleMouseMoveDelay)
                .on("click", () => {
                    return isZoomed = (isZoomed) ? zoomOut() : zoomIn();
            });

            zoomOut();
            showControls();
            repaint($(e.relatedTarget));
        });
    };

    /**
     * Pauses the portfolio's viewer behaviour (carousel, controls, zoom, etc).
     */
    this.standby = () => {
        bCarousel.pause();
        $carousel.addClass("disabled");
    };

    /**
     * Clones the styles (containing css variables) from a carousel item to the body tag in order to make them globally.
     * @param {object} $carouselItem A jQuery object.
     */
    this.repaint = ($carouselItem) => {
        console.log('Viewer repaint');
        let carouselItemStyles = $carouselItem.attr("style");
		$("body").attr("style", carouselItemStyles);
    };

    this.next = () => {
        $carousel.carousel('next');
    };

    this.prev = () => {
        $carousel.carousel('prev');
    };

    this.cycle = () => {
        $carousel.carousel(currentSlide++);
    };

    /**
     * Shows the portfolio's viewer slide controls and captions.
     */
    this.showControls = () => {
        if (!isZoomed) {
            $carousel.find(".carousel-caption").removeClass("muted locked");
        }
    };

    /**
     * Hides the portfolio's viewer slide controls and captions.
     */
    this.hideControls = (locked = false) => {
        if ($window.width() >= 991) {
            let classes = (locked) ? "muted locked": "muted";
            $carousel.find(".carousel-caption").addClass(classes);
        }
    };

    /**
     * @author W.S. Toh
     * @license unknown
     * @link https://www.cssscript.com/image-zoom-pan-hover-detail-view/
     */
	this.zoomIn = () => {
        console.log("zoomIn");

        $currentMedia.addClass("loading");

		let imgsrc = $currentImg.attr("data-source")
        ,   img = new Image();

		img.src = imgsrc.replace('-scaled', '');

		img.onload = () => {
            console.log("zoomIn loaded");

            $currentMedia.addClass("zoomed").removeClass("loading");
            $currentImg.addClass("hidden");
            hideControls(true);

            $currentMedia.css({
                "background-image": 'url("' + imgsrc + '")',
                "background-size": img.naturalWidth + "px",
                "background-position": xPercent + " " + yPercent,
            });

			$currentMedia.on("mousemove", (e) => {
                if (isZoomed) {
                    $currentMedia.css({
                        "background-position": xPercent + " " + yPercent,
                    });
                }
			});
		}

        return isZoomed = true;
    };

	this.zoomOut = () => {
        isZoomed = false;
        console.log("zoomOut");
        $currentMedia.removeClass("zoomed");
        $currentImg.removeClass("hidden");
        showControls();
        return isZoomed = false;
    };

    const handleMouseMove = debounce((e) => {
        if (!mouseMoving) {
            console.log('Moving mouse');
            showControls();
        }

        rect = e.target.getBoundingClientRect();
                xPos = e.clientX - rect.left;
                yPos = e.clientY - rect.top;
                xPercent = xPos / ($currentMedia.get(0).clientWidth / 100) + "%";
                yPercent = yPos / ($currentMedia.get(0).clientHeight / 100) + "%";
        
                $currentMedia.css({
                    "background-repeat": "no-repeat",
                    "background-position": xPercent + " " + yPercent
                });

        mouseMoving = true;
    }, 0);

    const handleMouseMoveDelay = debounce((e) => {
        console.log('Moving mouse (debounce delay)');
        hideControls();
        mouseMoving = false;
    }, 2500);

	return this;
})(Portfolio, jQuery);

(function($) {
    Portfolio.init();
    // Portfolio.Utils.enablePrintConsole();
})(jQuery);