// IIFE to execute init functions  
(function($) {
	let $carousel
	,	carousel
	,	$menuBurger = $("#burger")
	,	$menuPanel = $(".menu-panel")
	,	$xhrLink = $("a.xhr-link")
	,	$xhrTarget = $(".xhr-target")
	,	debug = false
	,	zoom = false;
	
	Portfolio.XHR.enable();
	// Portfolio.Utils.parseQuery();
	
	parseQuery();
	
	// Listen to the updates' messages of the XHR requests.
    $(document).on("xhrUpdate", function(e) {
		let id = e.detail.id;

		Portfolio.XHR.Partials.switch(e, {
			waitImgEls : ".carousel-item.active img"
		}, function() {
			$carousel = $("#portfolio-carousel-" + id);
			// intitializeCarousel();
			updateMenuActivePage(id);
			updateResponsiveMode();

			let $images = $(".carousel-item img");
			Portfolio.Utils.waitLoad($images);
		});
    });

	// Listen to DOMContentLoaded event listener to execute init functions when the DOM is ready.
	$(window).on("load", function() {
		// Portfolio.Menu.enable();
		// Portfolio.Carousel.enable();
		// Portfolio.Viewer.enable();

		$carousel = $(".carousel");

		// intitializeCarousel();
		enableBurgerMenu();
		enableInfoPanel();
		enableResponsiveMode();


		// Make a function for the initial history push. Check if we are on the home page…
		let dataProjectUrl = $("#data-project").attr("data-project-url");
		let historyStateInfo = { title: "asdf", url: dataProjectUrl }
		history.replaceState(historyStateInfo, historyStateInfo.title, historyStateInfo.url);

		// Make a function for the initial menu highlight. Check if we can combine with the history push to get the ID in the custom data attr.
		let staticID = $carousel.attr("data-page-id");
		console.log(staticID);
		$(".page-id-" + staticID).addClass("current-menu-item current_page_item");
	});

	function parseQuery() {
        const urlParams = new URLSearchParams(location.search);
        
        for (const [key, value] of urlParams) {
            switch(key) {
                case "debug":
					debug = true;
					break;
            }
        }
    }

	function enableDebug() {
		if (debug) {
			$("body").addClass("debug");
			$(".carousel-control-prev").add(".carousel-control-next").css({"pointer-events": "none"});
			enableZoomMode();
		}
	}

	function zoomViewport() {

	}

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
		// enableZoomMode();
		// $(".carousel-control-prev").add(".carousel-control-next").css({"pointer-events": "none"});
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
		$(".media img").on("click", function (e) {
			zoomToggle();
		});

		$(".zoom-control").on("click", function(e) {
			zoomToggle();
		});

		$(".carousel-item.active").find(".media").on("click", function(e) {
			e.preventDefault();
			console.log(this);
			zoomToggle();
		});
	}

	function zoomToggle() {
		zoom = !zoom;

		if (zoom) {
			zoomIn();
			// zoomInLegacy();
		} else {
			zoomOut();
			// zoomOutLegacy();
		}
	}

	function zoomOutLegacy() {
		$(".zoom-control").removeClass("active");
		$(".js-image-zoom__zoomed-image").add(".js-image-zoom__zoomed-area").remove();
		$(".carousel-control-prev").add(".carousel-control-next").css({"pointer-events": "auto"});
	}
	function zoomOut() {
		let container = $(".carousel-item.active").find(".media").get(0);

		$(".zoom-control").removeClass("active");
		$(".carousel-control-prev").add(".carousel-control-next").css({"pointer-events": "auto"});

		Object.assign(container.style, {
			backgroundImage: "transparent",
			backgroundPosition: "center",
			backgroundSize: "contain"
		});
	}

	function zoomInLegacy() {
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
	var zoomIn = () => {
		// (A) GET CONTAINER + IMAGE SOURCE
		let $container = $(".carousel-item.active").find(".media"),
		container = $(".carousel-item.active").find(".media").get(0),
		$image = $container.find("img"),
		// imgsrc = container.currentStyle || window.getComputedStyle(container, false);
		// imgsrc = imgsrc.backgroundImage.slice(4, -1).replace(/"/g, "");
		imgsrc = $image.attr("data-source");
		console.log(imgsrc);
		$(".zoom-control").addClass("active");
		$(".carousel-control-prev").add(".carousel-control-next").css({"pointer-events": "none"});
		$image.css("opacity", 0);

		// (B) LOAD IMAGE + ATTACH ZOOM
		let img = new Image();
		img.src = imgsrc;
		// (B1) CALCULATE ZOOM RATIO
		let ratio = img.naturalHeight / img.naturalWidth,
			percentage = ratio * 100 + "%";
			
		img.onload = () => {
			$container.css({
				"background-image": 'url("' + imgsrc + '")',
				"background-repeat": "no-repeat",
				"background-size": img.naturalWidth + "px"
			});
			console.log("ratio:", ratio);
		
			// (B2) ATTACH ZOOM ON MOUSE MOVE
			container.onmousemove = (e) => {
				if (zoom) {
					let rect = e.target.getBoundingClientRect(),
						xPos = e.clientX - rect.left,
						yPos = e.clientY - rect.top,
						xPercent = xPos / (container.clientWidth / 100) + "%",
						// yPercent = yPos / ((container.clientWidth * ratio) / 100) + "%";
						yPercent = yPos / (container.clientHeight / 100) + "%";
			
					Object.assign(container.style, {
					backgroundPosition: xPercent + " " + yPercent,
					backgroundSize: img.naturalWidth + "px"
					});
				}
			};
		}
	};
	
	// (C) ATTACH FOLLOW ZOOM
	// window.onload = () => { addZoom("zoomC"); };

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

	function enableBurgerMenu() {
		$menuBurger.on("click", function() {
			toggleBurgerMenu();
		});

		$xhrLink.on("click", function() {
			$xhrTarget.addClass("updating");
			toggleBurgerMenu(function() {
				$xhrTarget.removeClass("updating");
			});
		});
	}

	function toggleBurgerMenu(callback) {
		if ($menuBurger.hasClass("open")) {
			$menuBurger.add($menuPanel).removeClass("open");
			$menuPanel.on('transitionend', function () {
				typeof callback === 'function' && callback();
			});
		} else {
			$menuBurger.add($menuPanel).addClass("open");
		}
	}

	function enableInfoPanel() {
		$(".info-panel-trigger").on("click", function(e) {
			e.preventDefault();
			openInfoPanel();
		});

		$(".close-panel").on("click", function(e) {
			e.preventDefault();
			closeInfoPanel();
		});
	}

	function openInfoPanel() {
		zoomOut();
		$(".info-panel").addClass("open");
	}

	function closeInfoPanel() {
		$(".info-panel").removeClass("open");
	}

	/**
	 * Updates the active state of the current page in the wordpress menu.
	 * @param {number} id The id of the current page.
	 */
	 function updateMenuActivePage(id) {
		// Update the active state in the wordpress menu.
		let $menuItems = $(".menu-item")
		,	$activeMenuItem = $(".page-id-" + id);

		$menuItems.removeClass("current-menu-item current_page_item");
		$activeMenuItem.addClass("current-menu-item current_page_item");
	}

	function switchToNextPage() {
		let $activeMenuItem = $(".current_page_item")
		,	$nextMenuItem = $activeMenuItem.next()
		,	nextMenuItemLink = $nextMenuItem.find("a");

		// $activeMenuItem.siblings();

		console.log($nextMenuItem, nextMenuItemLink);
		nextMenuItemLink.click();
	}
})(jQuery);