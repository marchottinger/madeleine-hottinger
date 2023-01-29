/**
 * Portfolio' XMLHTTPRequest custom engine.
 * @namespace
 * @author Marc Hottinger
 * @version 1.0.0
 * @license GPL-3.0-or-later
 * @todo Manage different formats of response (eg. json vs html).
 **/
Portfolio.XHR = (function (e, $) {
    /**
     * The intitialization method that enables XHR
     * @param {object} [options] An object of property-value pairs to set options. Sane defaults are provided and further customization is possible.
     * @author Marc Hottinger
     * @todo Implement options to this method.
     */
    this.enable = function(options) {
        let defaults = {
            trigger : $(document.links),
            target: $(".xhr-partial"),
            format: "json",
        };
        options = options || defaults;
        let settings = $.extend({}, defaults, options);

        $(function() {
            historyStateInfo.title = document.title;
            _lookupLinks();
        });
    };
    
    /**
     * Enables external calls to load content via XHR.
     * @param {string} url The url to load.
     * @param {object} [options] An object of property-value pairs to set options. Sane defaults are provided and further customization is possible.
     */
    this.load = function(url, options) {
        let defaults = {};
        options = options || defaults;
        let settings = $.extend({}, defaults, options);

        _requestPage(url);
    };

    /**
     * Aborts the current XHR.
     */
    this.abort = function() {
        _abort();
    };

    /**
     * Manages the XHR response based on the HTTP Status code.
     * @author Marc Hottinger
     */
    function _load() {
        var msg, status = this.status;

        switch (status) {
            // In case of success / 200 OK.
            case 200:
                // Todo add logic for other response formats.
                msg = JSON.parse(this.responseText);

                // Build custom event.
                const xhrUpdate = new CustomEvent('xhrUpdate', {
                    detail: {
                        id: msg.id,
                        pageTitle: msg.title,
                        content: msg.content
                    }
                });

                // Dispatch custom event.
                document.dispatchEvent(xhrUpdate);

                // Update history state if required.
                if (updatingHistoryStateInfo) {
                    _push();
                }

                // Match response title to document title and history state.
                // document.title = historyStateInfo.title = msg.title;
                break;

            // In case of HTTP Status Code other than 200 OK.
            default:
                msg = status + ": " + (HTTPStatus[status] || "Unknown");

                // HTTP Status Codes.
                switch (Math.floor(status / 100)) {
                    case 1:
                        // Informational 1xx
                        console.log("Information code " + msg);
                        break;
                    case 2:
                        // Successful 2xx except 200, which proceeds to dispatch the event.
                        console.log("Successful code " + msg);
                        break;
                    case 3:
                        // Redirection 3xx
                        console.log("Redirection code " + msg);
                        break;
                    case 4:
                        /* Client Error 4xx */
                        console.log("Client Error #" + msg);
                        break;
                    case 5:
                        /* Server Error 5xx */
                        console.log("Server Error #" + msg);
                        break;
                    default:
                        /* Unknown status */
                        _error();
                }
        }

        _close();
    }

    /**
     * Aborts the XMLHttpRequest and closes the request.
     * @returns Exits if laoding.
     * @author Marc Hottinger
     */
    function _abort() {
        if (!loadingResponse) {
            return;
        }

        XHR.abort();
        _close();
    }

     /**
     * Logs timeout XMLHttpRequest errors.
     * @author Marc Hottinger
     */
      function _timeOut() {
        console.log("Connection timeout.");
    }

    /**
     * Logs unknow XMLHttpRequest errors.
     * @author Marc Hottinger
     */
     function _error() {
        console.log("Unknown error.");
    }

     /**
     * When request is closed, sets the loading status accordingly.
     * @author Marc Hottinger
     */
      function _close() {
        // Hide loading indicator and sets the laoding status to false.
        loadingResponse = _setLoadingStatus(false);
    }

    /**
     * Pushes the state in history.
     */
     function _push() {
        history.pushState(historyStateInfo, historyStateInfo.title, historyStateInfo.url);
        updatingHistoryStateInfo = false;
    }

    /**
     * Updates the state of the application on history pop.
     */
    function _pop() {
        // No longer manipulating history.
        updatingHistoryStateInfo = false;
        // Check if state exist and replace title's document value accordingly.
        historyStateInfo.title = (e.state) ? e.state.title : document.title;
        // Check if state exist and replace url's document value accordingly.
        historyStateInfo.url = (e.state) ? e.state.url : location.href;
        // Get page as if we clicked a link.
        _requestPartial();
    }

    /**
     * Request partial if pushState is supported, otherwise go directly to the page.
     * @param {string} url The URL of the requested page, which will be subsequently used as an id.
     * @author Marc Hottinger
     */
    function _requestPage(url) {
        if (history.pushState) {
            if (historyStateInfo.url !== url) {
                updatingHistoryStateInfo = true;
                _requestPartial(url);
            }
        } else {
            /* Ajax navigation is not supported */
            location.assign(url);
        }
    }

    /**
     * Formally request partial.
     * @param {string} [url] The URL of the requested page, which will be subsequently used as an id.
     * The url parameter is null when the request is coming from history's popstate.
     * @author Marc Hottinger
     * @returns 
     */
    function _requestPartial(url) {
        // Abort if another response is loading.
        if (loadingResponse) {
            return;
        }

        // Set history state's URL when a link is clicked by the user.
        // The url parameter is undefined if the request comes form history's popstate.
        if (url) { 
            historyStateInfo.url = _processURL(url, null);
        }

        // Initiate new XMLHttpRequest.
        XHR = new XMLHttpRequest();
        XHR.timeout = 6000;
        // Show loading indicator
        loadingResponse = _setLoadingStatus(true);
        // Manage load event.
        XHR.onload = _load;
        // Manage timeout event.
        XHR.ontimeout = _timeOut;
        // Manage error event.
        XHR.onerror = _error;
        // Set connection's details.
        XHR.open("get", _processURL("https://madeleine-hottinger.com/wp-content/themes/portfolio/page-partial.php?url=" + historyStateInfo.url, "json"), true);
        // Open connection.
        XHR.addEventListener('loadstart', _handleEvent);
        XHR.addEventListener('load', _handleEvent);
        XHR.addEventListener('loadend', _handleEvent);
        XHR.addEventListener('progress', _handleEvent);
        XHR.send();

    }

    /**
     * Arcane url processing that spits out the url with appropriate query parameters.
     * @param {string} url The URL of the requested page or partial processing template.
     * @param {string} responseFormat The desired response format.
     * @returns
     * @author Marc Hottinger
     */
    function _processURL(url, responseFormat) {
        return url
            .replace(regexpSearch, "")
        +   ("?" + url.replace(regexpHost, "&").replace(regexpView, responseFormat ? "&" + XHRFormatQueryKey + "=" + responseFormat : "").slice(1))
            .replace(regexpEndQstMark, "");
    }

    /**
     * Parses the dom in search for links to process.
     * @author Marc Hottinger
     */
    function _lookupLinks() {
        for (var i = 0, linksCount = document.links.length; i < linksCount; document.links[i++].onclick = _processLink);
    }

    /**
     * Checks if link has XHR-enabling class, then requests page through XHR Engine or else follow link as normal.
     * @returns False if link matches XHR-enabling class, else true to follow link as normal.
     * @author Marc Hottinger
     */
    function _processLink() {
        if (this.className === XHRLinksClass) {
            _requestPage(this.href);
            return false;
        }

        return true;
    }

    /**
     * Sets the status of the XHR process both visually and logically.
     * @param {boolean} status The status of the XHR process.
     * @returns
     * @author Marc Hottinger
     */
    function _setLoadingStatus(status) {
        let indicatorStatus = status ? "show" : "hide";
        // TODO add argument function in order to place the laoding indcator.
        //$(".loading-indicator").addClass(indicatorStatus);
        loadingResponse = status;
        return status;
    }

    /**
     * Handles ProgressEvent dispatched by the XHR.
     * @param {object} e The ProgressEvent that is dispatched by the XHR. 
     */
    function _handleEvent(e) {
        // Build custom event.
        // const ProgressEvent = new CustomEvent("xhr-" + e.type.toString(), e);

        // Dispatch custom event.
        // document.dispatchEvent(ProgressEvent);


        if (e.lengthComputable) {
            console.log(("XHR", e.loaded / e.total) * 100);
        } else {
            console.log("XHR", e.type, e.loaded, "bytes transferred");
        }
    }

    onpopstate = _pop;

    let XHR
    ,   XHRLinksClass            = "xhr-link"
    ,   XHRFormatQueryKey        = "xhr-format"
    ,   regexpSearch             = /\?.*$/
    ,   regexpHost               = /^[^\?]*\?*&*/
    ,   regexpView               = new RegExp("&" + XHRFormatQueryKey + "\\=[^&]*|&*$", "i")
    ,   regexpEndQstMark         = /\?$/
    ,   historyStateInfo         = { title: null, url: location.href }
    ,   updatingHistoryStateInfo = false
    ,   loadingResponse          = false
    ,   HTTPStatus = { 100: "Continue", 101: "Switching Protocols", 102: "Processing", 200: "OK", 201: "Created", 202: "Accepted", 203: "Non-Authoritative Information", 204: "No Content", 205: "Reset Content", 206: "Partial Content", 207: "Multi-Status", 208: "Already Reported", 226: "IM Used", 300: "Multiple Choices", 301: "Moved Permanently", 302: "Found", 303: "See Other", 304: "Not Modified", 305: "Use Proxy", 306: "Reserved", 307: "Temporary Redirect", 308: "Permanent Redirect", 400: "Bad Request", 401: "Unauthorized", 402: "Payment Required", 403: "Forbidden", 404: "Not Found", 405: "Method Not Allowed", 406: "Not Acceptable", 407: "Proxy Authentication Required", 408: "Request Timeout", 409: "Conflict", 410: "Gone", 411: "Length Required", 412: "Precondition Failed", 413: "Request Entity Too Large", 414: "Request-URI Too Long", 415: "Unsupported Media Type", 416: "Requested Range Not Satisfiable", 417: "Expectation Failed", 422: "Unprocessable Entity", 423: "Locked", 424: "Failed Dependency", 425: "Unassigned", 426: "Upgrade Required", 427: "Unassigned", 428: "Precondition Required", 429: "Too Many Requests", 430: "Unassigned", 431: "Request Header Fields Too Large", 500: "Internal Server Error", 501: "Not Implemented", 502: "Bad Gateway", 503: "Service Unavailable", 504: "Gateway Timeout", 505: "HTTP Version Not Supported", 506: "Variant Also Negotiates (Experimental)", 507: "Ins∫ufficient Storage", 508: "Loop Detected", 509: "Unassigned", 510: "Not Extended", 511: "Network Authentication Required" } /* http://www.iana.org/assignments/http-status-codes/http-status-codes.xml */ 

    return this;
})(Portfolio, jQuery);