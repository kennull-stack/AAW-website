if ((typeof window.Shopify) == 'undefined') {
    window.Shopify = {};

}

function debounce(func) {
    var timer;
    return function(event) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(func, 1000, event);
    }; 
} 
var DOMAnimations = {
    slideUp: function(element, duration = 500) {
        return new Promise(function(resolve, reject) { 
            element.style.height = element.offsetHeight + 'px';
            element.style.transitionProperty = `height, margin, padding`;
            element.style.transitionDuration = duration + 'ms';
            element.offsetHeight;
            element.style.overflow = 'hidden';
            element.style.height = 0; 
            element.style.paddingTop = 0;
            element.style.paddingBottom = 0;
            element.style.marginTop = 0;
            element.style.marginBottom = 0;
            window.setTimeout(function() {
                element.style.display = 'none';
                element.style.removeProperty('height');
                element.style.removeProperty('padding-top');
                element.style.removeProperty('padding-bottom');
                element.style.removeProperty('margin-top');
                element.style.removeProperty('margin-bottom');
                element.style.removeProperty('overflow');
                element.style.removeProperty('transition-duration');
                element.style.removeProperty('transition-property');
                resolve(false);
            }, duration)
        })
    },

    slideDown: function(element, duration = 500) {

        return new Promise(function(resolve, reject) {

            element.style.removeProperty('display');
            let display = window.getComputedStyle(element).display;

            if (display === 'none')
                display = 'block';

            element.style.display = display;
            let height = element.offsetHeight;
            element.style.overflow = 'hidden';
            element.style.height = 0;
            element.style.paddingTop = 0;
            element.style.paddingBottom = 0;
            element.style.marginTop = 0;
            element.style.marginBottom = 0;
            element.offsetHeight;
            element.style.transitionProperty = `height, margin, padding`;
            element.style.transitionDuration = duration + 'ms';
            element.style.height = height + 'px';
            element.style.removeProperty('padding-top');
            element.style.removeProperty('padding-bottom');
            element.style.removeProperty('margin-top');
            element.style.removeProperty('margin-bottom');
            window.setTimeout(function() {
                element.style.removeProperty('height');
                element.style.removeProperty('overflow');
                element.style.removeProperty('transition-duration');
                element.style.removeProperty('transition-property');
            }, duration)
        })
    },

    slideToggle: function(element, duration = 500) {
        if (window.getComputedStyle(element).display === 'none') {
            return this.slideDown(element, duration);
        } else {
            return this.slideUp(element, duration);
        }
    },

    classToggle: function(element, className) {
        if (element.classList.contains(className)) {
            element.classList.remove(className)
        } else {
            element.classList.add(className)
        }
    }
}

if (!Element.prototype.fadeIn) {
    Element.prototype.fadeIn = function() {
        let ms = !isNaN(arguments[0]) ? arguments[0] : 400,
            func = typeof arguments[0] === 'function' ? arguments[0] : (
                typeof arguments[1] === 'function' ? arguments[1] : null
            );

        this.style.opacity = 0;
        this.style.filter = "alpha(opacity=0)";
        this.style.display = "inline-block";
        this.style.visibility = "visible";

        let $this = this,
            opacity = 0,
            timer = setInterval(function() {
                opacity += 50 / ms;
                if (opacity >= 1) {
                    clearInterval(timer);
                    opacity = 1;

                    if (func) func('done!');
                }
                $this.style.opacity = opacity;
                $this.style.filter = "alpha(opacity=" + opacity * 100 + ")";
            }, 50);
    }
}

if (!Element.prototype.fadeOut) {
    Element.prototype.fadeOut = function() {
        let ms = !isNaN(arguments[0]) ? arguments[0] : 400,
            func = typeof arguments[0] === 'function' ? arguments[0] : (
                typeof arguments[1] === 'function' ? arguments[1] : null
            );

        let $this = this,
            opacity = 1,
            timer = setInterval(function() {
                opacity -= 50 / ms;
                if (opacity <= 0) {
                    clearInterval(timer);
                    opacity = 0;
                    $this.style.display = "none";
                    $this.style.visibility = "hidden";

                    if (func) func('done!');
                }
                $this.style.opacity = opacity;
                $this.style.filter = "alpha(opacity=" + opacity * 100 + ")";
            }, 50);
    }
}

Shopify.bind = function(fn, scope) {
    return function() {
        return fn.apply(scope, arguments);
    }
};
Shopify.setSelectorByValue = function(selector, value) {
    for (var i = 0, count = selector.options.length; i < count; i++) {
        var option = selector.options[i];
        if (value == option.value || value == option.innerHTML) {
            selector.selectedIndex = i;
            return i;
        }
    }
};
Shopify.addListener = function(target, eventName, callback) {
    target.addEventListener ? target.addEventListener(eventName, callback, false) : target.attachEvent('on' + eventName, callback);
};
Shopify.postLink = function(path, options) {
    options = options || {};
    var method = options['method'] || 'post';
    var parameters = options['parameters'] || {};

    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for (var key in parameters) {
        var fields = document.createElement("input");
        fields.setAttribute("type", "hidden");
        fields.setAttribute("name", key);
        fields.setAttribute("value", parameters[key]);
        form.appendChild(fields);
    }
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
};
Shopify.CountryProvinceSelector = function(country_domid, province_domid, options) {
    this.countryEl = document.getElementById(country_domid);
    this.provinceEl = document.getElementById(province_domid);
    this.provinceContainer = document.getElementById(options['hideElement'] || province_domid);
    Shopify.addListener(this.countryEl, 'change', Shopify.bind(this.countryHandler, this));

    this.initCountry();
    this.initProvince();
};

Shopify.CountryProvinceSelector.prototype = {
    initCountry: function() {
        var value = this.countryEl.getAttribute('data-default');
        Shopify.setSelectorByValue(this.countryEl, value);
        this.countryHandler();
    },

    initProvince: function() {
        var value = this.provinceEl.getAttribute('data-default');
        if (value && this.provinceEl.options.length > 0) {
            Shopify.setSelectorByValue(this.provinceEl, value);
        }
    },

    countryHandler: function(e) {
        var opt = this.countryEl.options[this.countryEl.selectedIndex];
        var raw = opt.getAttribute('data-provinces');
        var provinces = JSON.parse(raw);

        this.clearOptions(this.provinceEl);
        if (provinces && provinces.length == 0) {
            if (this.provinceContainer) {
                this.provinceContainer.style.display = 'none';
            }
        } else {
            for (var i = 0; i < provinces.length; i++) {
                var opt = document.createElement('option');
                opt.value = provinces[i][0];
                opt.innerHTML = provinces[i][1];
                this.provinceEl.appendChild(opt);
            }

            if (this.provinceContainer) {
                this.provinceContainer.style.display = '';
            }
        }
    },

    clearOptions: function(selector) {
        while (selector.firstChild) {
            selector.removeChild(selector.firstChild);
        }
    },

    setOptions: function(selector, values) {
        for (var i = 0, count = values.length; i < values.length; i++) {
            var opt = document.createElement('option');
            opt.value = values[i];
            opt.innerHTML = values[i];
            selector.appendChild(opt);
        }
    }
};

class HTMLUpdateUtility {
    /**
     * Used to swap an HTML node with a new node.
     * The new node is inserted as a previous sibling to the old node, the old node is hidden, and then the old node is removed.
     *
     * The function currently uses a double buffer approach, but this should be replaced by a view transition once it is more widely supported https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API
     */
    static viewTransition(oldNode, newContent, preProcessCallbacks = [], postProcessCallbacks = []) {
      preProcessCallbacks?.forEach((callback) => callback(newContent));
  
      const newNodeWrapper = document.createElement('div');
      HTMLUpdateUtility.setInnerHTML(newNodeWrapper, newContent.outerHTML); 
      const newNode = newNodeWrapper.firstChild;
  
      // dedupe IDs
      const uniqueKey = Date.now();
      oldNode.querySelectorAll('[id], [form]').forEach((element) => {
        element.id && (element.id = `${element.id}-${uniqueKey}`);
        element.form && element.setAttribute('form', `${element.form.getAttribute('id')}-${uniqueKey}`);
      });
  
      oldNode.parentNode.insertBefore(newNode, oldNode);
      oldNode.style.display = 'none';
  
      postProcessCallbacks?.forEach((callback) => callback(newNode));
  
      setTimeout(() => oldNode.remove(), 500);
    }
  
    // Sets inner HTML and reinjects the script tags to allow execution. By default, scripts are disabled when using element.innerHTML.
    static setInnerHTML(element, html) {
      element.innerHTML = html;
      element.querySelectorAll('script').forEach((oldScriptTag) => {
        const newScriptTag = document.createElement('script');
        Array.from(oldScriptTag.attributes).forEach((attribute) => {
          newScriptTag.setAttribute(attribute.name, attribute.value);
        });
        newScriptTag.appendChild(document.createTextNode(oldScriptTag.innerHTML));
        oldScriptTag.parentNode.replaceChild(newScriptTag, oldScriptTag);
      });
    }
}

class Accordion {
    constructor(el) {
        this.el = el;
        this.summary = el.querySelector('summary');
        this.content = el.querySelector('[detail-expand]');
        this.animation = null;
        this.isClosing = false;
        this.isExpanding = false;
        this.summary.addEventListener('click', (e) => this.onClick(e));
    }
    onClick(e) {

        e.preventDefault();

        this.el.style.overflow = 'hidden';

        if (this.isClosing || !this.el.open) {
            this.open();

        } else if (this.isExpanding || this.el.open) {
            this.shrink();
        }
    }
    shrink() {
        this.isClosing = true;
        const startHeight = `${this.el.offsetHeight}px`;
        const endHeight = `${this.summary.offsetHeight}px`;
        if (this.animation) {

            this.animation.cancel();
        }
        // Start a WAAPI animation
        this.animation = this.el.animate({
            height: [startHeight, endHeight]
        }, {
            duration: 400,
            easing: 'ease-out'
        });

        // When the animation is complete, call onAnimationFinish()
        this.animation.onfinish = () => this.onAnimationFinish(false);
        this.animation.oncancel = () => this.isClosing = false;
    }
    open() {
        this.el.style.height = `${this.el.offsetHeight}px`;
        this.el.open = true;
        window.requestAnimationFrame(() => this.expand());
    }
    expand() {
        // Set the element as "being expanding"
        this.isExpanding = true;
        const startHeight = `${this.el.offsetHeight}px`;
        const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;

        if (this.animation) {
            this.animation.cancel();
        }
        this.animation = this.el.animate({
            height: [startHeight, endHeight]
        }, {
            duration: 400,
            easing: 'ease-out'
        });

        this.animation.onfinish = () => this.onAnimationFinish(true);
        this.animation.oncancel = () => this.isExpanding = false;
    }
    onAnimationFinish(open) {
        this.el.open = open;
        this.animation = null;
        this.isClosing = false;
        this.isExpanding = false;
        this.el.style.height = this.el.style.overflow = '';
    }
}

if ((typeof Shopify) === 'undefined') { Shopify = {}; }
if (!Shopify.formatMoney) {
    Shopify.formatMoney = function(cents, format) {
        var value = '',
            placeholderRegex = /\{\{\s*(\w+)\s*\}\}/,
            formatString = (format || this.money_format);

        if (typeof cents == 'string') {
            cents = cents.replace('.', '');
        }

        function defaultOption(opt, def) {
            return (typeof opt == 'undefined' ? def : opt);
        }

        function formatWithDelimiters(number, precision, thousands, decimal) {
            precision = defaultOption(precision, 2);
            thousands = defaultOption(thousands, ',');
            decimal = defaultOption(decimal, '.');

            if (isNaN(number) || number == null) {
                return 0;
            }

            number = (number / 100.0).toFixed(precision);

            var parts = number.split('.'),
                dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
                cents = parts[1] ? (decimal + parts[1]) : '';

            return dollars + cents;
        }

        switch (formatString.match(placeholderRegex)[1]) {
            case 'amount':
                value = formatWithDelimiters(cents, 2);
                break;
            case 'amount_no_decimals':
                value = formatWithDelimiters(cents, 0);
                break;
            case 'amount_with_comma_separator':
                value = formatWithDelimiters(cents, 2, '.', ',');
                break;
            case 'amount_no_decimals_with_comma_separator':
                value = formatWithDelimiters(cents, 0, '.', ',');
                break;
            case 'amount_no_decimals_with_space_separator':
                value = formatWithDelimiters(cents, 0, ' ', ' ');
                break;
        }
        return formatString.replace(placeholderRegex, value);
    };
}

function focusableElements(wrapper) {
    if (!wrapper) return false;
    let elements = Array.from(
        wrapper.querySelectorAll("hamburger-menu,summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe")
    );
    return elements;
}
const listFocusElements = {};
var previousFocusElement = '';

function focusElementsRotation(wrapper) {
    stopFocusRotation();
    let elements = focusableElements(wrapper);
    if (elements == false) return false;
    let first = elements[0];
    first.focus();
    let last = elements[elements.length - 1];
    listFocusElements.focusin = (e) => {
        if (
            e.target !== wrapper &&
            e.target !== last &&
            e.target !== first
        )
            return;

        document.addEventListener('keydown', listFocusElements.keydown);
    };

    listFocusElements.focusout = function() {
        document.removeEventListener('keydown', listFocusElements.keydown);
    };

    listFocusElements.keydown = function(e) {
        if (e.code.toUpperCase() !== 'TAB') return;
        if (e.target === last && !e.shiftKey) {
            e.preventDefault();
            first.focus();
        }
        if ((e.target === wrapper[0] || e.target === first) && e.shiftKey) {
            e.preventDefault();
            last.focus();
        }
    };

    document.addEventListener('focusout', listFocusElements.focusout);
    document.addEventListener('focusin', listFocusElements.focusin);
}

function stopFocusRotation() {
    document.removeEventListener('focusin', listFocusElements.focusin);
    document.removeEventListener('focusout', listFocusElements.focusout);
    document.removeEventListener('keydown', listFocusElements.keydown);
}

function pad(num, size) {
    return num.toString().padStart(size, "0");
}

function parseDate(date) {
    const parsed = Date.parse(date);
    if (!isNaN(parsed)) return parsed
    return Date.parse(date.replace(/-/g, '/').replace(/[a-z]+/gi, ' '));
}

function getTimeRemaining(endtime) {
    const total = parseDate(endtime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return {
        total,
        days,
        hours,
        minutes,
        seconds,
    };
}

function shippingEstimates() {
    if (Shopify && Shopify.CountryProvinceSelector) {
        var country = document.getElementById("shippingCountry");
        if (!country) {
            return false;
        }
        var shipping = new Shopify.CountryProvinceSelector(
            "shippingCountry",
            "shippingProvince", {
                hideElement: "shipping-province-container",
            }
        );
        setupEventListeners();
    }
}

function setupEventListeners() {
    if (document.getElementById("fetch-sipping-estimates")) {
        const button = document.getElementById("fetch-sipping-estimates");
        button.addEventListener("click", (e) => {
            e.preventDefault();
            const shippingEstimatesResponse = document.getElementById("shipping-estimates-response");
            shippingEstimatesResponse.innerHTML = "";
            shippingEstimatesResponse.classList.remove("success");
            shippingEstimatesResponse.classList.remove("error");
            shippingEstimatesResponse.hidden = true;

            const shippingAddress = {};
            shippingAddress.zip = document.getElementById("shippingZip").value || "";
            shippingAddress.country = document.getElementById("shippingCountry").value || "";
            shippingAddress.province = document.getElementById("shippingProvince").value || "";
            fetchShippingEstimates(shippingAddress);
        });
    }

}

const fetchShippingEstimates = async(shippingAddress) => {
    const response = await fetch("/cart/shipping_rates.json", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ shipping_address: shippingAddress }),
    })
    if (response.ok) {
        const shippingRates = await response.json();
        _fetchResponse(shippingRates);
    } else {
        const errresponse = await response.json();
        _fetchError(errresponse);
    }
};

const _fetchError = (XMLHttpRequest, textStatus) => {
    const shippingEstimatesResponse = document.getElementById("shipping-estimates-response");

    for (const [property, messages] of Object.entries(XMLHttpRequest)) {
        for (const message of messages) {
            shippingEstimatesResponse.innerHTML = `<p class="error-message no-bg">${message}</p>`;
        }
    }
    shippingEstimatesResponse.style.display = 'block';
};

const _fetchResponse = (response) => {
        const shippingEstimatesResponse = document.getElementById("shipping-estimates-response");
        if (response.shipping_rates && response.shipping_rates.length > 0) {
            const html = `${response.shipping_rates.map((shipping) => {
            return `<p><strong>${shipping.name}</strong>: ${Shopify.formatMoney(shipping.price * 100, moneyFormat)}</p>`;
        }).join("")}`;
        const shippingEstimateMultipleMessages = `<div class="success-message">${html}</div>`;
        shippingEstimatesResponse.innerHTML = shippingEstimateMultipleMessages;
        shippingEstimatesResponse.style.display = 'block';
    } else {
        shippingEstimatesResponse.innerHTML = `<p class="error-message no-bg">${shipRateUnavailable}</p>`;
        shippingEstimatesResponse.style.display = 'block';
    }
};

function countdownClock(section = document) {
    const parentSelectors = section.querySelectorAll("[data-countdown]");
    if (parentSelectors) {
      Array.from(parentSelectors).forEach(function (parentSelector) {
        const dateSelector = parentSelector.querySelector("[data-countdown-input]");
        if (dateSelector.value != "") {
          const myArr = dateSelector.value.split("/");
          let _day = myArr[0];
          let _month = myArr[1];
          let _year = myArr[2];
          const endtime = _month + "/" + _day + "/" + _year + " 00:00:00";
          const days = parentSelector.querySelector("#days");
          const hours = parentSelector.querySelector("#hours");
          const minutes = parentSelector.querySelector("#minutes");
          const seconds = parentSelector.querySelector("#seconds");
  
          var timeinterval = setInterval(function () {
            var time = getTimeRemaining(endtime);
            if (time.total <= 0) {
              parentSelector.style.display = "none";
              clearInterval(timeinterval);
            } else {
              days.innerHTML = pad(time.days, 2);
              hours.innerHTML = pad(time.hours, 2);
              minutes.innerHTML = pad(time.minutes, 2);
              seconds.innerHTML = pad(time.seconds, 2);
            }
          }, 1000);
        }
      });
    }
}

slickSlider = function(selector, slideIndex) {
    var optionContainer = selector.attr('data-slick');
    if (optionContainer) {
        var options = JSON.parse(optionContainer);
        let optionsnew = Object.assign(options, { prevArrow: prevArrow, nextArrow: nextArrow });
        if (selector.hasClass('slick-slider')) {
            selector.slick('resize');
        } else {
            if (slideIndex) {
                selector.not('.slick-slider').slick(optionsnew).slick('select', slideIndex);
            } else {
                selector.not('.slick-slider').slick(optionsnew).slick('resize');
            }
        }
        selector.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
          if (selector.hasClass("carousel-block-color-true")) {
            let nxtSlide = $(slick.$slides.get(nextSlide))
            let textColor = nxtSlide.find(".announcement-bar-item").attr("data-color");
            let backgroundColor = nxtSlide.find(".announcement-bar-item").attr("data-bg");
            let linkColor = nxtSlide.find(".announcement-bar-item").attr("data-link");
            selector.closest(".announcement-bar-main").css({ "--announcement-bar-background":backgroundColor, "--announcement-bar-color":textColor, "--announcement-bar-link-color":linkColor });
  
          }
          if(selector.hasClass("block-color-enable")){
            let nxtSlide = $(slick.$slides.get(nextSlide));
            let backgroundColor = nxtSlide.find(".slideshow-item").attr("data-color");
            selector.closest(".section-container").css({"--body-background":backgroundColor})
          }
          
          selector[0].querySelectorAll(".youtube_video,.youtube-video,iframe[src*='www.youtube.com']").forEach((video) => {
                if(video.getAttribute('data-autoplay') == 'true' || video.hasAttribute('autoplay')) return false;
                video.contentWindow.postMessage('{"event":"command","func":"' + "pauseVideo" + '","args":""}',"*");
            });
            selector[0].querySelectorAll(".vimeo_video,.vimeo-video, iframe[src*='player.vimeo.com']").forEach((video) => {
                if(video.getAttribute('data-autoplay') == 'true' || video.hasAttribute('autoplay')) return false;
                video.contentWindow.postMessage('{"method":"pause"}', "*");
            });
            selector[0].querySelectorAll("video").forEach((video) => {
                if(video.getAttribute('data-autoplay') == 'true' || video.hasAttribute('autoplay')) return false;
                video.pause();
            });
        });

    }
}
sliders = function() {
        var sliders = jQuery('body').find('[data-slick]');
        if (sliders.length > 0) {
            sliders.each(function(index) {
                if (!jQuery(this).hasClass('slick-slider')) {
                    let slider = jQuery(this);
                    slickSlider(slider);
                } else {
                    jQuery(this).slick('resize');
                }
            });
        }
       
}
function detailDisclouserInit(section = document) {
    let detailsElements = section.querySelectorAll('[data-detail-button]');
    Array.from(detailsElements).forEach((detailsElement) => {
        new Accordion(detailsElement);
      
    });
    
}
/*-------------collapsible-content------------------ */
function collapsiblecontentClose() {
    var closeButtons = document.querySelectorAll('[data-close-button]');
    Array.from(closeButtons).forEach(function(closeButton) {
        closeButton.addEventListener("click", (event) => {
            event.preventDefault();
            closeButton.closest(".accordion-item").removeAttribute("open");
        });
    });

}

function sideDrawerInt() {
    let sideDrawerSelectors = document.querySelectorAll('[data-sidedrawer-button]');
    let sideDrawerBodySelectors = document.querySelectorAll('[data-sidedrawer-wrapper]');
    let id = '';
    if (sideDrawerSelectors) {
        Array.from(sideDrawerSelectors).forEach(function(element) {
            element.addEventListener("click", (e) => {
                e.preventDefault();
                Array.from(sideDrawerBodySelectors).forEach(function(sideElement) {
                    if (sideElement.classList.contains("show")) {
                        setTimeout(() => {
                            sideElement.style.display = "none";
                        }, 300)
                        setTimeout(() => {
                            sideElement.classList.remove('show');
                        }, 200);
                    }
                })
                id = element.getAttribute("data-id");
                let sideElementBody = document.querySelector("#" + id);
                document.querySelector("body").classList.add("no-scroll");
                if(id=='pickup-side-drawer'){
                    let drawerid = document.querySelector("#"+id);
                    document.querySelector("body").classList.add("pickup-side-drawer-open");
                    if (drawerid.querySelector("[data-slick]")) {
                        let slider = drawerid.querySelector("[data-slick]")
                        setTimeout(function(){
                            if (slider.classList.contains("slick-initialized")) {
                                jQuery(slider)[0].slick.refresh();
                            }
                        },500)
                       
                    }
                }
                if(id=='cart-side-drawer'){
                    let drawerid = document.querySelector("#"+id);
                    if (drawerid.querySelector("[data-slick]")) {
                        let slider = drawerid.querySelector("[data-slick]")
                        setTimeout(function(){
                            if (slider.classList.contains("slick-initialized")) {
                                jQuery(slider)[0].slick.refresh();
                            }
                        },500)
                       
                    }
                }

                setTimeout(() => {
                    sideElementBody.style.display = 'flex';
                }, 200)
                setTimeout(() => {
                    sideElementBody.classList.add('show');
                }, 300);

                setTimeout(()=>{
                    if(previousFocusElement == ''){
                        previousFocusElement = element;
                    }
                    focusElementsRotation(sideElementBody);
                },1000)
            });
        })
    }
    let sideDrawerClose = document.querySelectorAll('[data-sidedrawer-close]');
    if (sideDrawerClose) {
        Array.from(sideDrawerClose).forEach(function(element) {
            element.addEventListener("click", (e) => {
                e.preventDefault();

                Array.from(sideDrawerBodySelectors).forEach(function(sideElement) {
                    if (sideElement.classList.contains("show")) {
                        setTimeout(() => {
                            document.querySelector("body").classList.remove("no-scroll");
                            document.querySelector("body").classList.remove("pickup-side-drawer-open");
                            sideElement.classList.remove('show');
                            if(sideElement.classList.contains("quickview-side-drawer")){
                             sideElement.querySelector('[data-quickview-content]').innerHTML='';
                            }
                        }, 300);
                        setTimeout(() => {
                          
                            sideElement.style.display = "none";
                        }, 500)
                        stopFocusRotation();
                        if(previousFocusElement){
                            previousFocusElement.focus();
                            previousFocusElement = "";
                        }
                     
                        
                    }
                })

            });
        })
    }
}
function quickViewElements(section = document) {
    let quickviewElements = section.querySelectorAll("[data-quickview-action]");
    Array.from(quickviewElements).forEach(function(element) {
        initQuickView(element);
    });
}
function initQuickView(element) {
    element.addEventListener('click', (event) => {
        event.preventDefault();
        if(element.getAttribute("href")){
            var _url = element.getAttribute("href");
                if (_url.indexOf("?") > -1) {
                    _url = _url.split("?");
                    _url = _url[0];
                }
                var productUrl = _url + '?section_id=quick-view';
                element.classList.add("loading")
                //quickviewContainer.querySelector('[data-quickview-content]').innerHTML = preLoaderIcon;
                fetch(productUrl)
                    .then((response) => response.text())
                    .then((text) => {
                        var sectionhtml = new DOMParser().parseFromString(text, "text/html").querySelector(".shopify-section");
                        element.classList.remove("loading")
                        if(document.querySelector('[data-quickview-content-wrapper]')){
                            let quickviewContainer = document.querySelector('[data-quickview-content-wrapper]'); 
                                setTimeout(() => {
                                    quickviewContainer.style.display  = 'flex';
                                }, 200)    
                                setTimeout(function(){
                                    quickviewContainer.classList.add('show');
                                    document.querySelector('body').classList.add('no-scroll');
                                },400)
                                quickviewContainer.innerHTML = sectionhtml.querySelector("[data-quickview-content-wrapper]").innerHTML;
                                if (Shopify.PaymentButton) {
                                    Shopify.PaymentButton.init();
                                }
                                customDropdownElements(quickviewContainer);
                                popupContentElements();
                                setTimeout(function(){
                                sideDrawerInt();
                                productMedia3dModel();
                                videoPauseOnScroll();
                                },1000)
                            
                        }else{
                            if (window.innerWidth >767){
                                if(element.closest('.shopify-section').querySelectorAll('.quick-view-active')){
                                    let activeQuickViews = element.closest('.shopify-section').querySelectorAll('.quick-view-active')
                                    Array.from(activeQuickViews).forEach(function(activeQuick) {
                                        setTimeout(function(){
                                        activeQuick.classList.remove('quick-view-active');
                                        },70)
                                        setTimeout(function(){
                                        activeQuick.querySelector('[data-grid-quick-view-content]').innerHTML = '';
                                        },200)
                                    });
                                }
                                let currentGridViewCard = element.closest('[data-product-card]');
                                currentGridViewCard.querySelector('[data-grid-quick-view]').classList.add('quick-view-active');
                                let quickViewContent = currentGridViewCard.querySelector('[data-grid-quick-view-content]');
                                if(sectionhtml.querySelector(".shopify-payment-button")){
                                    sectionhtml.querySelector(".shopify-payment-button").remove();
                                }
                               
                                // currentGridViewCard.querySelector(".product-card-quick-view-content").appendChild(sectionhtml.querySelector("[data-grid-quick-view-close").cloneNode(true))
                                 quickViewContent.appendChild(sectionhtml.querySelector("product-info").cloneNode(true));
                                // quickViewContent.appendChild(sectionhtml.querySelector("[data-price-wrapper]").cloneNode(true));
                                // quickViewContent.appendChild(sectionhtml.querySelector("[data-product-variants]").cloneNode(true)); 
                                // quickViewContent.appendChild(sectionhtml.querySelector(".quantity-atc-button-wrapper").cloneNode(true));
                                // quickViewContent.appendChild(sectionhtml.querySelector("[data-quick-card-error]").cloneNode(true));
                                
                                customDropdownElements(currentGridViewCard);
                                popupContentElements(); 
                                setTimeout(function(){
                                productMedia3dModel();
                                videoPauseOnScroll();
                                },1000)
                            }else{
                                if(document.querySelector('[data-quickview-content-mobile]')){
                                    let quickviewContainer = document.querySelector('[data-quickview-content-mobile]'); 
                                        setTimeout(() => {
                                            quickviewContainer.style.display  = 'flex';
                                        }, 200)    
                                        setTimeout(function(){
                                            quickviewContainer.classList.add('show');
                                            document.querySelector('body').classList.add('no-scroll');
                                        },400)
                                        quickviewContainer.innerHTML = sectionhtml.querySelector("[data-quickview-content-mobile]").innerHTML;
                                        if (Shopify.PaymentButton) {
                                            Shopify.PaymentButton.init();
                                        }
                                        customDropdownElements(quickviewContainer);
                                
                                        popupContentElements();
                                        setTimeout(function(){
                                        sideDrawerInt();
                                        productMedia3dModel();
                                        videoPauseOnScroll();
                                        },1000)
                                      
                                    }
                            }

                        }
                    }).catch((e) => {
                        console.log(`Error: ${e}`);
                    });
        }
    });
}

/*-------------shipping bar ------------------ */
let convertShippingAmount = freeShippingAmount;

function checkShippingAvailablity() {
    let selectedCountry = Shopify.country;
    let shippingCountriesContainer = $('#shipping-countries');

    if (shippingCountriesContainer.length == 0) {
        shippingCountriesContainer = $('#shippingCountry');
    }

    if (shippingCountriesContainer && shippingCountriesContainer.find('option').length > 0) {
        let shippingSelectedCountry = countryListData[selectedCountry];
        if (shippingCountriesContainer.find('[value="' + shippingSelectedCountry + '"]').length > 0) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
function freeShippingBar(totalPrice, itemCount) {
    let shippingCountryAvailable = checkShippingAvailablity();
    let shippingBarContainer = document.querySelector('[data-free-shipping-wrapper]');
    if (itemCount == 0  && document.querySelector('[data-shipping-message]')) {
        document.querySelector('[data-shipping-message]').classList.add('hidden');
        shippingBarContainer.classList.add('hidden');
        return false;
    }
    if (shippingCountryAvailable && shippingBarContainer) {
        shippingBarContainer.classList.add('hidden');
        let cartTotalPrice = totalPrice;
        let freeShippingNeedPrice = Shopify.formatMoney((convertShippingAmount - cartTotalPrice), moneyFormat);
        let shippingPercentage = parseFloat((cartTotalPrice * 100) / convertShippingAmount).toFixed(2);
        if (shippingPercentage > 10 && shippingPercentage < 100) {
            shippingPercentage = shippingPercentage - 5;
        } else if (shippingPercentage > 100) {
            shippingPercentage = 100
        }
        if (document.querySelector('[data-shipping-message]')) {
            if (shippingPercentage >= 100) {

                document.querySelector('[data-shipping-message]').textContent = freeShippingBarSuccessText;
            } else {
                document.querySelector('[data-shipping-message]').textContent = ShippingBarText.replace('||amount||', freeShippingNeedPrice);
            }
        }

        if (document.querySelector('[data-shipping-bar]')) {
            document.querySelector('[data-shipping-bar]').style.width = shippingPercentage + '%';
        }
  
        shippingBarContainer.classList.remove('hidden');
        document.querySelector('[data-shipping-message]').classList.remove('hidden')
      

    }
}
if (freeShippingBarStatus) {
    freeShippingBar(cartTotalPrice, cartItemCount);
}

function updateCartNote() {
    let cartNoteElements = document.querySelectorAll('[data-cart-note]')
    var cartNoteTyping;
    Array.from(cartNoteElements).forEach(function(element) {
        element.addEventListener('keydown', (event) => {
            clearTimeout(cartNoteTyping);
        });
        element.addEventListener('keyup', (event) => {
            clearTimeout(cartNoteTyping);
            cartNoteTyping = setTimeout(function() {
                const body = JSON.stringify({
                    note: element.value
                });
                // cartNoteAPI(body);
                fetch(cartUpdateUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Accept': `application/json` },
                        body
                    })
                    .then((response) => {
                        return response.text();
                    })
            }, 1000);
        });
    })
    if(document.querySelector("[data-cart-note-trigger]")){
        let cartnotupdate  =document.querySelector("[data-cart-note-trigger]");
        cartnotupdate.addEventListener('click',function(event){
            let element = document.querySelector('[data-cart-note]');
            const body = JSON.stringify({
                note: element.value
            });
            fetch(cartUpdateUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': `application/json` },
                body
            })
            .then((response) => {
                return response.text();
            })
        })
    
    }
  
}

function cartNoteAPI(body) {
    fetch(cartUpdateUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': `application/json` },
            body
        })
        .then((response) => {
            return response.text();
        })
}

function cartDrawerNoteInit() {
    if(document.querySelector("[data-cart-toggle]") && document.querySelector("[data-cart-note-wrapper]")) {
        let cartDrawerNoteBtn = document.querySelector("[data-cart-toggle]");
        let cartDrawerNoteWrap = document.querySelector("[data-cart-note-wrapper]");
        let cartDrawerApiTrigger = document.querySelectorAll("[data-cart-note-trigger]");
        Array.from(cartDrawerApiTrigger).forEach(function(element) {
            element.addEventListener("click", function(event) {
                DOMAnimations.slideUp(cartDrawerNoteWrap, 300);
            });
            
        })

        // let cartDrawerApiTrigger = document.querySelector("[data-cart-note-trigger]");
        cartDrawerNoteBtn.addEventListener("click", function(event) {
            DOMAnimations.slideToggle(cartDrawerNoteWrap, 300);
        });
       
    }
}

function cartCountUpdate(count) {
    let cartselector = document.querySelector("[data-header-cart-count]")
    if (count == 0) {
        cartselector.textContent = 0;
        cartselector.classList.add("hidden")

    } else {
        if(count<=99){
            cartselector.classList.remove('large-count');
            count=count;
        }else{
            count='';
            cartselector.classList.add('large-count');
        }
        cartselector.textContent = count;
        cartselector.classList.remove("hidden")
    }
}

function colorSwatchesMediaChanged(section = document) {
    let gridSwatchTriggers = section.querySelectorAll("[card-color-option]");
    Array.from(gridSwatchTriggers).forEach(function(element) {
        element.addEventListener("mouseover", function(event) {
            let productGrid = element.closest('[data-product-card]');
            let gridMainImage = productGrid.querySelector('[data-main-image]')
            let moreImageElement = element.querySelector('script');
            if (productGrid.querySelector(".variant-item.active")) {
                productGrid.querySelector(".variant-item.active").classList.remove("active");
            }
            element.classList.add("active");
            if (moreImageElement && gridMainImage) {
                let swatchMedia = new DOMParser().parseFromString(JSON.parse(moreImageElement.textContent), "text/html").querySelector('.media-content');
                gridMainImage.innerHTML = swatchMedia.innerHTML;
            }
        });
        element.addEventListener("click", function(event) {
            let url = element.getAttribute('data-url');
            if (url) {
                let finalUrl = window.location.origin + url;
                window.location.href = finalUrl
            }
        })
    })

}
function updateStickyBarOptions(container){

    if(document.querySelector("[data-sticky-products-wrapper]") && container.querySelector(".product-variants-options")){
            let getproductoptionsHtmls = container.querySelector(".product-variants-options").innerHTML;
            let optionscontainer = container.querySelector("[data-sticky-products-wrapper] .product-variants-options");
            let divContent = document.createElement('div');
            divContent.innerHTML = getproductoptionsHtmls;
            let optionsitems = divContent.querySelectorAll(".productOption");
            Array.from(optionsitems).forEach(function(option){
                let optionsId = option.getAttribute("id");
                optionsId="sticky-"+optionsId;
                option.setAttribute("id",optionsId);
                if(option.closest(".custom-select-item")){
                   let optionParent  = option.closest(".custom-select-item");
                   optionParent.querySelector(".option").setAttribute("for",optionsId)
                }

            if(option.getAttribute("name").indexOf("sticky") == -1){
                option.setAttribute("name","sticky-"+option.getAttribute("name"));
                option.removeAttribute("form");
                option.removeAttribute("checked");
                if(option.parentElement.classList.contains('active')){
                    option.setAttribute("checked",true);
                }
            } 
            })
            optionscontainer.innerHTML = divContent.innerHTML;
            //stickyProductOptions();
          
    }
}

function updateBackInStock(variant,container){
  console.log("container",container);
  console.log(variant,"variant");
    if(container){
        let backInStockWrapper = container.querySelector('[data-back-in-stock]')
        if(backInStockWrapper){
            let backInStockVariant = container.querySelector('[data-variant-title]')
            let backInStockVariantUrl = container.querySelector('[data-variant-url]')
            if (variant != undefined) {
                let baseUrl = window.location.pathname;
                if (baseUrl.indexOf("/products/") > -1) {
                    let _updateUrl = baseUrl + "?variant=" + variant.id+"&contact_posted=true";
                    backInStockVariantUrl.value =  _updateUrl;
                }
                backInStockVariant.value = variant.name;
               console.log(variant.available);
                if(variant.available){
                    if(!Shopify.designMode){
                        backInStockWrapper.classList.add('hidden')
                    }
                }
                else{
                    backInStockWrapper.classList.remove('hidden')
                }
            }
            else{
                if(!Shopify.designMode){
                    backInStockWrapper.classList.remove('hidden')
                }
            }
        }
    }
}


function initStickyAddToCart(section = document) {
    let mainProductForm = section.querySelector('.main-product-form[action^="' + cartAdd + '"]');
    let footerElement = document.querySelector("footer")
    if (mainProductForm) {
        let formScrollTop = mainProductForm.offsetTop;
        let stickyBar = section.querySelector('[data-sticky-products-wrapper]');
        if (stickyBar) {
            if (stickyBar.querySelector('.sticky-cart-button')) {
                let stickyButton = stickyBar.querySelector('.sticky-cart-button');
                stickyButton.addEventListener('click', function(event) {
                    event.preventDefault();
                    let optionsElement = stickyBar.querySelector(".sticky-cart-options");
                    if(stickyButton.classList.contains('open')){
                        stickyButton.classList.remove('open')
                        DOMAnimations.slideUp(optionsElement, 300);
                    }else{
                        stickyButton.classList.add('open');
                        DOMAnimations.slideDown(optionsElement, 300);
                    }
                    
                })
            }
            window.addEventListener('scroll', function(event) {
                if(isOnScreen(footerElement, true)){
                    stickyBar.classList.remove('show');
                }else{
                    if (isOnScreen(mainProductForm, true) || window.scrollY < (formScrollTop + 100) ) {
                       stickyBar.classList.remove('show');
                    } else {
                        stickyBar.classList.add('show');
                    }
                }
            
            });
        }
    }
}

/* get variant based on selected options end */
const classAddToSelector = (selector, valueIndex, available, combinationExists) => {
    const optionValue = Array.from(selector.querySelectorAll(".productOption"))[valueIndex];
    if (optionValue.hasAttribute('custom-dropdown')) {
        optionValue.parentElement.classList.toggle("hidden", !combinationExists);
        optionValue.classList.toggle("not-available", !available);
    } else {
        optionValue.parentElement.classList.toggle("hidden", !combinationExists);
        optionValue.classList.toggle("not-available", !available);
    }
};

function isOnScreen(elem, form) {
    if (elem.length == 0) {
        return;
    }
    var $window = $(window);
    var viewport_top = $window.scrollTop();
    var viewport_height = $window.height();
    var viewport_bottom = viewport_top + viewport_height;
    var $elem = $(elem);
    var top = $elem.offset().top;
    var height = $elem.height();
    var bottom = top + height;

    return (
        (top >= viewport_top && top < viewport_bottom) ||
        (bottom > viewport_top && bottom <= viewport_bottom) ||
        (height > viewport_height &&
            top <= viewport_top &&
            bottom >= viewport_bottom)
    );
}
// Product recommendation start 
function productRecommendations() {
    const productRecommendationsSections = document.querySelectorAll("[product-recommendations]");
    Array.from(productRecommendationsSections).forEach(function(productRecommendationsSection) {
        productRecommendationsInit(productRecommendationsSection);
    });
}

function productRecommendationsInit(productRecommendationsSection) {
    const url = productRecommendationsSection.dataset.url;
    fetch(url)
        .then((response) => response.text())
        .then((text) => {
            const html = document.createElement("div");
            html.innerHTML = text;
            const recommendations = html.querySelector("[product-recommendations]");
            if (recommendations && recommendations.innerHTML.trim().length) {
                productRecommendationsSection.innerHTML = recommendations.innerHTML;
                productRecommendationsSection.closest('.shopify-section').style.display = 'block'
                let slider = productRecommendationsSection.querySelector("[data-slick]");
                if (slider) {
                    let sliderId = slider.getAttribute("id");
                    if (!slider.classList.contains("slick-initialized")) {
                        slickSlider($("#" + sliderId));
                    }
                }
                quickViewElements(productRecommendationsSection);
                colorSwatchesMediaChanged();
                productCardHoverInit();
                if(animationStatus){
                    if (AOS) { 
                      AOS.refreshHard() 
                    }
                  }
            }
        })
        .catch((e) => {
            console.error(e);
        });
}
// document.addEventListener("shopify:section:load",productRecommendations,false);
function recentlyViewedProducts() {
    let rvpWrappers = document.querySelectorAll('[data-recent-viewed-products]')
    Array.from(rvpWrappers).forEach(function(element) {
        let currentProduct = parseInt(element.dataset.product);
        let section = element.closest('.shopify-section');
        let cookieName = 'recently-viewed-products';
        let rvProducts = JSON.parse(window.localStorage.getItem(cookieName) || '[]');
        if (!isNaN(currentProduct)) {
            if (!rvProducts.includes(currentProduct)) {
                rvProducts.unshift(currentProduct);
            }
            window.localStorage.setItem(cookieName, JSON.stringify(rvProducts.slice(0, 14)));

            if (rvProducts.includes(parseInt(currentProduct))) {
                rvProducts.splice(rvProducts.indexOf(parseInt(currentProduct)), 1);
            }
        }
        let currentItems = rvProducts.map((item) => "id:" + item).slice(0, 14).join(" OR ");
        fetch(element.dataset.section + currentItems)
            .then(response => response.text())
            .then(text => {
                const html = document.createElement('div');
                html.innerHTML = text;
                const recents = html.querySelector('[data-recent-viewed-products]');
                if (recents && recents.innerHTML.trim().length) {
                    element.innerHTML = recents.innerHTML;
                    element.closest('.shopify-section').classList.remove('hidden');
                    let slider = section.querySelector("[data-slick]");
                    if (slider) {
                        let sliderId = slider.getAttribute("id");
                        if (!slider.classList.contains("slick-initialized")) {
                            slickSlider($("#" + sliderId));
                        }
                    }
                   quickViewElements(section);
                    colorSwatchesMediaChanged();
                    productCardHoverInit();
                    if(animationStatus){
                        if (AOS) { 
                          AOS.refreshHard() 
                        }
                      }
                   
                }
            })
            .catch(e => {
                console.error(e);
            });
    })
}

function marqueeScrollBar(selector) {
    var marqueeElement = selector;
    var marqueeParent = marqueeElement.closest('.shopify-section');
    var position = marqueeParent.getBoundingClientRect();
    var elementPosition = marqueeElement.getBoundingClientRect();
    var Elewidth = position.width;
    if (isOnScreen(marqueeParent)) {

        let speed = parseInt(marqueeElement.getAttribute('data-marquee-speed'))
        if (window.innerWidth < 768 && marqueeElement.hasAttribute('data-marquee-speed-mobile')) {
            speed = parseInt(marqueeElement.getAttribute("data-marquee-speed-mobile"));
        }
        if (marqueeElement.classList.contains('rtl-direction')) {
            var marqueepsoition = -(Elewidth / 2) + elementPosition.top;
            marqueeElement.style.transform = `translate3d(${(marqueepsoition / speed) * 10}px, 0px, 0px)`;
        } else {
            var marqueepsoition = (Elewidth / 2) - elementPosition.top;
            marqueeElement.style.transform = `translate3d(${marqueepsoition / speed * 10}px, 0px, 0px)`;
        }
    }
}

function marqueeTextScroll(section = document) {
    let marqueeElements = section.querySelectorAll('[data-marquee-on-scroll]');
    Array.from(marqueeElements).forEach((element) => {
        window.addEventListener('scroll', function() {
            marqueeScrollBar(element);
        });
    });
}

function marqueeTextAutoplay(section = document) {
    let marqueeElements = section.querySelectorAll('[data-marquee-text]');
    Array.from(marqueeElements).forEach((element) => {
        if (!element.querySelector("[data-marque-node]")) return false;
        let resizedMobile = false;
        let resizedDesktop = false;
        marqueeTextAutoplayInit(element)
        window.addEventListener('resize', function() {
            if (window.innerWidth > 767 && resizedDesktop == false) {
                marqueeTextAutoplayInit(element)
                resizedDesktop = true;
                resizedMobile = false;
            } else if (window.innerWidth < 768 && resizedMobile == false) {
                marqueeTextAutoplayInit(element)
                resizedMobile = true;
                resizedDesktop = true;
            }
        });
    });
}

function marqueeTextAutoplayInit(element) {
    let scrollingSpeed = parseInt(element.getAttribute("data-marquee-speed") || 15);
    if (window.innerWidth < 768 && element.hasAttribute('data-marquee-speed-mobile')) {
        scrollingSpeed = parseInt(element.getAttribute("data-marquee-speed-mobile"));
    }
    const contentWidth = element.clientWidth,
        node = element.querySelector("[data-marque-node]"),
        nodeWidth = node.clientWidth;
    // windowWidth = window.innerWidth;
    let slowFactor = 1 + (Math.max(1600, contentWidth) - 375) / (1600 - 375);
    element.parentElement.style.setProperty("--animation-speed", `${(scrollingSpeed * slowFactor * nodeWidth / contentWidth).toFixed(3)}s`);

}
/*------------------------Video play button------------------------------*/
function videoPlayInit() {
    if (document.querySelectorAll('[data-video-play-button]')) {
        let playButtons = document.querySelectorAll('[data-video-play-button]');
        Array.from(playButtons).forEach(function(playButton) {
            if (playButton) {
                videoPlayButtonClickEvent(playButton);
            }
        })
    }
}

function videoPlayButtonClickEvent(playButton) {
    if(playButton.closest('[data-video-main-wrapper]')){
        let parent_wrapper = playButton.closest('[data-video-main-wrapper]');
        let video_style = parent_wrapper.querySelector('video');
        let iframe_style = parent_wrapper.querySelector('iframe');
        playButton.addEventListener("click", function(event) {
            event.preventDefault();
            playButton.style.display = "none";
            let videoWrapper = parent_wrapper.querySelector('.video-content-wrapper');
            let videoTitle = parent_wrapper.querySelector('.video-title');
            parent_wrapper.querySelector('.video-thumbnail').style.display = "none";
            if (videoWrapper) {
                videoWrapper.style.display = "none";
            }
            if (videoTitle) {
                videoTitle.style.display = "none";
            }
            if (video_style) {
                video_style.style.display = "block";
                video_style.play();
            } else {
                if(iframe_style){
                    iframe_style.style.display = "block";
                }
               
            }
        })
    }
    
}
/*** End */

function imageCarousel(section = document) {
    let imageCarouselElements = section.querySelectorAll('[data-image-carousel]');
    Array.from(imageCarouselElements).forEach(function(imageCarouselElement) {
        imageCarouselElement.addEventListener('mouseover', function() {
            if (imageCarouselElement.classList.contains('active')) return false;
            let parentSection = imageCarouselElement.closest('.shopify-section');
            let activeItem = parentSection.querySelector(".images-carousel-content-item.active");
            let preId = activeItem.getAttribute("id");
            if (activeItem) {
                activeItem.classList.remove('active');
                imageCarouselElement.classList.add('active');
            }
            let currnetId = imageCarouselElement.getAttribute("id");
            let previousActives = parentSection.querySelectorAll(".images-carousel-img.active");
            Array.from(previousActives).forEach(function(previousActive){ 
                previousActiveIndex= previousActive.getAttribute("data-id");
                if(previousActiveIndex && previousActiveIndex != currnetId){
                    parentSection.querySelector(".images-carousel-img[data-id='"+previousActiveIndex+"']").classList.remove("active");
                    parentSection.querySelector(".images-carousel-img[data-id='"+previousActiveIndex+"']").classList.add("processing");
                    parentSection.querySelector(".images-carousel-img[data-id='"+previousActiveIndex+"']").style.zIndex = 2;
                }    
            })
            setTimeout(function(){
                Array.from(previousActives).forEach(function(previousActive){
                    previousActiveIndex= previousActive.getAttribute("data-id");
                    if(previousActiveIndex && previousActiveIndex != currnetId){
                        parentSection.querySelector(".images-carousel-img[data-id='"+previousActiveIndex+"']").classList.remove("processing");
                        parentSection.querySelector(".images-carousel-img[data-id='"+previousActiveIndex+"']").style.zIndex = 1;
                    }   
                })
            },300)

      
            let imageDetailsItem = parentSection.querySelector(".images-carousel-img[data-id='"+currnetId+"']")
            if(imageDetailsItem){
                imageDetailsItem.classList.add("active");
                imageDetailsItem.style.zIndex = 3;
            }
            let activeDescItem = parentSection.querySelector(".images-carousel-content-description.active");
            if (activeDescItem) {               
                if (preId != currnetId) {
                    activeDescItem.classList.remove('active');
                    activeDescItem.style.display='none';
                }
            }
            let currentActiveDesc = parentSection.querySelector('.images-carousel-content-description[data-id="' + currnetId + '"]');
            if (currentActiveDesc) {
                currentActiveDesc.classList.add('active')
                // setTimeout(function() {
                    currentActiveDesc.fadeIn(300)
                // }, 200)
            }
          
        })
    })
}

function customDropdownElements(section = document) {
    let customDropdowns = section.querySelectorAll('[data-custom-select]');
    Array.from(customDropdowns).forEach(function(dropdown) {
        dropdown.addEventListener('click', () => {
            DOMAnimations.slideToggle(dropdown.querySelector('[data-custom-select-summary]'), 300);
        });
        dropdown.onkeydown = function(e) {
            if (e.keyCode == 13 || e.keyCode == 32) {
                dropdown.click();
            }
        };
        section.addEventListener('click', (event) => {
            if (!dropdown.parentNode.contains(event.target)) {
                DOMAnimations.slideUp(dropdown.querySelector('[data-custom-select-summary]'), 300);
            }
        });
    });
}

function customDropdownElementsLocalization(section = document) {
    let customDropdowns = section.querySelectorAll('[data-details-head]');
    Array.from(customDropdowns).forEach(function(dropdown) {
        let parentSection=  dropdown.closest(".shopify-localization-form");
        if(dropdown.classList.contains('hover-event')){
            dropdown.addEventListener('mouseover', () => {
                if(dropdown.classList.contains("animation"))return false;
                dropdown.classList.add("animation")
                setTimeout(function(){
                    parentSection.querySelector("[data-details-select-summary]").style.opacity="1";
                    parentSection.querySelector("[data-details-select-summary]").style.transform="none";
                },100)
                parentSection.querySelector("[data-details-select-summary]").style.display="block"
            });

            dropdown.addEventListener('mouseleave', () => {
                setTimeout(function(){
                    parentSection.querySelector("[data-details-select-summary]").style.display="none"
                },100)
                parentSection.querySelector("[data-details-select-summary]").style.opacity="0";
                parentSection.querySelector("[data-details-select-summary]").style.transform="translate3d(0, 10%, 0)";
                dropdown.classList.remove("animation")
            });
          
            let mouseoverEvent = new MouseEvent("mouseover", {
                            bubbles: true,
                            cancelable: true,
                            view: window,
                        });
                        let mouseleaveEvent = new MouseEvent("mouseleave", {
                            bubbles: true,
                            cancelable: true,
                            view: window,
                            });
                        
                dropdown.onkeydown = function(e) {
                    if (e.keyCode == 13 || e.keyCode == 32) {
                        if(dropdown.classList.contains("animation")){
                            dropdown.dispatchEvent(mouseleaveEvent);
                        }else{
                            dropdown.dispatchEvent(mouseoverEvent);
                        }
                    
                    }
                };
              
        }
        else{
            dropdown.addEventListener('click', () => {
                if(dropdown.classList.contains("animation")){
                    setTimeout(function(){
                        parentSection.querySelector("[data-details-select-summary]").style.display="none"
                    },300)
                    parentSection.querySelector("[data-details-select-summary]").style.opacity="0";
                    parentSection.querySelector("[data-details-select-summary]").style.transform="translate3d(0, 10%, 0)";
                    dropdown.classList.remove("animation")
    
                }else{
                    dropdown.classList.add("animation")
                    setTimeout(function(){
                        parentSection.querySelector("[data-details-select-summary]").style.opacity="1";
                        parentSection.querySelector("[data-details-select-summary]").style.transform="none";
                    },300)
                    parentSection.querySelector("[data-details-select-summary]").style.display="block"
                }
            });

            dropdown.onkeydown = function(e) {
                if (e.keyCode == 13 || e.keyCode == 32) {
                    dropdown.click();
                }
            };
        }
        section.addEventListener('click', (event) => {
            if (!dropdown.parentNode.contains(event.target)) {
                dropdown.classList.remove("animation")
                setTimeout(function(){
                    parentSection.querySelector("[data-details-select-summary]").style.display="none"
                },300)
                parentSection.querySelector("[data-details-select-summary]").style.opacity="0";
                parentSection.querySelector("[data-details-select-summary]").style.transform="translate3d(0, 10%, 0)";
                
            } 
        });
    });
}
function initMaps(section = document) {
    let mapSelectors = section.querySelectorAll('[data-map-container]');
    Array.from(mapSelectors).forEach(function(selector) {
        createMap(selector);
    })
}
var apiloaded = null;

function checkMapApi(selector, section = document) {
    let mapSelectors = section.querySelectorAll('[data-map-container]');
    let mapAddress = false;
    if (selector) {
        if (selector.getAttribute('data-location') != '' || selector.getAttribute('data-location') != null) {
            mapAddress = true
        }
    }
    Array.from(mapSelectors).forEach(function(selector) {
        if (selector.getAttribute('data-location') != '' || selector.getAttribute('data-location') != null) {
            mapAddress = true
        }
    })
    if (!mapAddress) return false;
    if (selector || mapSelectors.length > 0) {
        if (apiloaded === "loaded") {
            if (selector) {
                createMap(selector);
            } else {
                initMaps(section);
            }
        } else {

            if (apiloaded !== "loading") {
                apiloaded = "loading";
                if (
                    typeof window.google === "undefined" ||
                    typeof window.google.maps === "undefined"
                ) {
                    var script = document.createElement("script");
                    script.onload = function() {
                        apiloaded = "loaded";
                        if (selector) {
                            createMap(selector);
                        } else {
                            initMaps(section);
                        }
                    };
                    script.src = "https://maps.googleapis.com/maps/api/js?key=" + googleMapApiKey;
                    document.head.appendChild(script);
                }
            }
        }
    }
}
const createMarker = (map, position) => {
    return new google.maps.Marker({
        position: position,
        map: map
    });
};
const markers = [];
const updateMap = (map,latitude, longitude) => {
    map.setCenter({ lat: latitude, lng: longitude });
    map.setZoom(15);
    markers.forEach(marker => marker.setMap(null));
    const position = { lat: latitude, lng: longitude };
    const marker = createMarker(map, position);
    markers.push(marker);
};

function mapSidebarElementsInt(section = document) {
    var mapElements = section.querySelectorAll('.store-locator-content-item');
    Array.from(mapElements).forEach(function(mapElement) {
        if (mapElement.hasAttribute('data-store-heading')) return false;
        mapSidebarElements(mapElement);
    });
}

function mapSidebarElements(element, map, geocoder) {
    let parent = element.closest('.store-locator-box');
    element.addEventListener("click", (event) => {
        setTimeout(() => {
        let activeElement = parent.querySelector('.store-locator-content-item.active');
        let embedMap = parent.querySelector('[data-store-locator-embed]');
        let embedFrame = parent.querySelector('[data-store-locator-iframe]');
        let currentLocation = element.getAttribute('data-map');
        if (embedFrame && embedMap) {
            if (activeElement) {
                activeElement.classList.remove('active');
            }
            element.classList.add('active');
            if (currentLocation != '') {
                embedMap.classList.remove('hidden');
                embedFrame.src = 'https://www.google.com/maps?q=' + encodeURIComponent(currentLocation) + '&output=embed';
            } else {
                embedMap.classList.add('hidden');
            }
            return;
        }
        var geocoder =new google.maps.Geocoder();
        let ativeImageElemnt = parent.querySelector('.store-locator-img.active');
        if (activeElement) {
            activeElement.classList.remove('active');
            element.classList.add('active');
        }
        let getMediaRef = element.getAttribute('data-media');
        let currentMedia = parent.querySelector('#' + getMediaRef);
        if (currentMedia) {
            if (ativeImageElemnt) {
                ativeImageElemnt.classList.remove('active');
                ativeImageElemnt.classList.add('hidden');
            }
            currentMedia.classList.remove('hidden');
            currentMedia.classList.add('active');
        }
        let mapSelector = parent.querySelector('.store-locator-map');
        if (currentLocation != '') {
            if (mapSelector) {
                mapSelector.classList.remove('hidden')
            }
            if(googleMapApiKey != '' ){
                let geoDetail = getGeoDetails(geocoder, currentLocation);
                geoDetail.then(function(currentLocation) {
                    if (geoDetail != null) {
                            map = new google.maps.Map(mapSelector, {
                            center: {
                                lat: 0,
                                lng: 0,
                            },
                            zoom: 8,
                            });
                        updateMap(map,currentLocation[0], currentLocation[1]);
                    }
                })
            }

        } else {
            if (mapSelector) {
                mapSelector.classList.add('hidden')
            }
        }
    },500)
    })

}

function createMap(selector) {
    var geocoder =new google.maps.Geocoder();
    var address = jQuery(selector).data("location");
    var mapStyle = jQuery(selector).data("map-style");
    geocoder.geocode({ address: address }, function(results, status) {
        if (results != null) {
            var options = {
                zoom: 17,
                backgroundColor: "none",
                center: results[0].geometry.location,
                mapTypeId: mapStyle,
            };
            var map = (this.map = new google.maps.Map(selector, options));
            var center = (this.center = map.getCenter());
            var marker = new google.maps.Marker({
                map: map,
                position: map.getCenter(),
            });
            window.addEventListener("resize", function() {
                setTimeout(function() {
                    google.maps.event.trigger(map, "resize");
                    map.setCenter(center);
                }, 250);
            });
            let parentSection = selector.closest('.shopify-section');
            var details = parentSection.querySelectorAll('[data-store-details]');
            Array.from(details).forEach(function(element) {
                mapSidebarElements(element, map, geocoder)
            });
        }
    });
}
async function getGeoDetails(geocoder, address) {
    let getAddress = new Promise(function(resolve, reject) {
        geocoder.geocode({ 'address': address }, function(results, status) {
            if (status === 'OK') {
                resolve([results[0].geometry.location.lat(), results[0].geometry.location.lng()]);
            } else {
                reject(new Error('Couldnt\'t find the location ' + address));
            }
        })
    })
    return await getAddress;
}

function initBeforeAfter(section = document) {
    let cursors = section.querySelectorAll("[data-image-comparison-button]");
    setTimeout(() => {
        Array.from(cursors).forEach(function(cursor) {
            imageComparison(cursor);
        });
    }, 500);
}

function imageComparison(cursor){
    if (!cursor.offsetParent) {
        return false;
    }
    let layout='';
    let active = false;
    const parentSection = cursor.closest(".shopify-section");
    const imagWrapper =parentSection.querySelector(".image-comparison-wrapper"); 
    cursor.addEventListener('mousedown', function(){
        active = true;
        parentSection.classList.add('scrolling');
    });
    cursor.addEventListener('mouseup',function(){
        active = false;
        parentSection.classList.remove('scrolling');
    });
  
    parentSection.addEventListener('mousemove',function(e){
        if (!active) return;
        if(parentSection.querySelector(".image-comparison-wrapper") && parentSection.querySelector(".image-comparison-wrapper").getAttribute("data-layout") === "horizontal"){
            layout=parentSection.querySelector(".image-comparison-wrapper").getAttribute("data-layout");
       }
       let bounding=parentSection.getBoundingClientRect();
        const event = (e.touches && e.touches[0]) || e;
        let x = layout? event.pageX - (bounding.left + window.scrollX): event.pageY - (bounding.top + window.scrollY);           
        scrollIt(x,layout,parentSection);
    });


    cursor.addEventListener('touchstart', function(){
        active = true;
        parentSection.classList.add('scrolling');
    })

    cursor.addEventListener('touchend',function(){
        active = false;
        parentSection.classList.remove('scrolling');
    });

    parentSection.addEventListener('touchmove',function(e){
        if (!active) return;
        if(parentSection.querySelector(".image-comparison-wrapper")){
            layout=parentSection.querySelector(".image-comparison-wrapper").getAttribute("data-layout");
       }
       let bounding=parentSection.getBoundingClientRect();
        const event = (e.touches && e.touches[0]) || e;
        let x = layout? event.pageX - (bounding.left + window.scrollX): event.pageY - (bounding.top + window.scrollY);           
        scrollIt(x,layout,imagWrapper);
    });

    function scrollIt(x,layout,imagWrapper) {
        const distance = layout ? imagWrapper.clientWidth : imagWrapper.clientHeight;
        const max = distance - 20;
        const min = 20;
        const mouseX = Math.max(min, (Math.min(x, max)));
        const mousePercent = (mouseX * 100) / distance;
        parentSection.querySelector(".image-comparison-wrapper").style.setProperty('--percent', mousePercent + '%');
    }

 
}

function popupContentElements() {
    let popupElements = document.querySelectorAll("[data-popup-header]");
    let popupBody = document.querySelectorAll("[data-popup-body]");
    let closepopupElement = document.querySelectorAll("[data-popup-close]");
    Array.from(popupElements).forEach(function(element) {
        element.addEventListener("click", function(event) {
            event.preventDefault();
            let id = element.getAttribute("href");
            Array.from(popupBody).forEach(function(bodyElement) {
                bodyElement.classList.remove("show");
                bodyElement.style.display = "none";
            });
            if(element.hasAttribute("data-product-media")){
                let mediaId = element.getAttribute("id");              
                let mediaParent = element.closest(".shopify-section").querySelector('.product-media-popup-content');             
                let mediaPopId=mediaParent.querySelector("#"+mediaId);
                if (mediaId && mediaParent) {
                    let childCount = mediaParent.children.length;
                    let firstChild = mediaParent.firstChild;
                    if (childCount > 1) {
                        mediaParent.insertBefore(mediaPopId, firstChild)
                    }                 
                }              
            }
            document.querySelector("body").classList.add("no-scroll");
            if(id == '#sizeChart'){
                document.querySelector("body").classList.add("sizeChart-popup-open");
            }
            document.querySelector(id).style.display = "block";
            setTimeout(function() {
                document.querySelector(id).classList.add("show");
                if(element.hasAttribute("data-product-media")){
                    element.closest(".shopify-section").querySelector('.popup-content').scrollTop = 0;  
                }
            }, 300)

        })
    })

    Array.from(closepopupElement).forEach(function(closeElement) {
        closeElement.addEventListener("click", function(event) {
            event.preventDefault();
            document.querySelector("body").classList.remove("no-scroll");
            document.querySelector("body").classList.remove("sizeChart-popup-open");
           
            setTimeout(function() {
                closeElement.closest("[data-popup-body]").style.display = "none";
                if(closeElement.closest("[data-popup-body]").classList.contains("quick-popup")){
                    closeElement.closest("[data-popup-body]").querySelector('[data-quickview-content]').innerHTML='';
                } 
            }, 200)
            setTimeout(function() {
                closeElement.closest("[data-popup-body]").classList.remove("show");
            }, 300)
           
           
        })
    });

    if(document.querySelectorAll('[data-grid-quick-view-close]')){
        Array.from(document.querySelectorAll('[data-grid-quick-view-close]')).forEach(function(closequickgrid) {
            closequickgrid.addEventListener("click", function(event) {
               setTimeout(function(){
                closequickgrid.closest('[data-grid-quick-view]').classList.remove('quick-view-active')
               },400)
               setTimeout(function(){
                closequickgrid.closest('[data-grid-quick-view]').querySelector('[data-grid-quick-view-content]').innerHTML = '';
               },700)
            })
        })
    }
}

function slideToggleInt(section = document) {
    let slideElements = section.querySelectorAll("[data-slide-toggle]");
    Array.from(slideElements).forEach(function(element) {
        element.addEventListener('click', function(event) {
            event.preventDefault();
            let parent = element.closest('[data-slide-toggle-wrapper]');
            if (parent.classList.contains("active")) {
                parent.classList.remove('active');
            } else {
                parent.classList.add('active');
            }
            DOMAnimations.slideToggle(parent.querySelector("[data-slide-toggle-body]"), 300);
        })
    })
}

function hideBanner() {
    if (document.querySelector(".cookies-popup")) {
        setTimeout(function() {
            document.querySelector(".cookies-popup").classList.remove("show");
        }, 300)
        document.querySelector(".cookies-popup").style.display = "none"
    }
}

function showBanner() {
    if (document.querySelector(".cookies-popup")) {
        document.querySelector(".cookies-popup").style.display = "block"
        setTimeout(function() {
            document.querySelector(".cookies-popup").classList.add("show");
        }, 500)
    }
}

function handleAccept(e) {
    window.Shopify.customerPrivacy.setTrackingConsent(true, hideBanner),
        document.addEventListener("trackingConsentAccepted", function() {});
}

function handleDecline() {
    window.Shopify.customerPrivacy.setTrackingConsent(!1, hideBanner);
}

function initCookieBanner() {
    const userCanBeTracked = window.Shopify.customerPrivacy.userCanBeTracked(),
        userTrackingConsent = window.Shopify.customerPrivacy.getTrackingConsent();
    if (userCanBeTracked && userTrackingConsent === "no_interaction") {
        showBanner();
    }
}

function cookiesBanner() {
    window.Shopify.loadFeatures([{ name: "consent-tracking-api", version: "0.1" }], function(e) {
        if (e) throw e;
        initCookieBanner();
    });

}

function ageVerificationInit() {
    let ageVerificationContainer = document.querySelector('.age-verification-popup');
    if (ageVerificationContainer) {
        let ageVerifyWrapper = ageVerificationContainer.querySelector("[data-age-verification-container]");
        let ageDeclineWrapper = ageVerificationContainer.querySelector("[data-under-age-container]");
        let age_decline = ageVerificationContainer.querySelector("[data-under-age-button]");
        let age_accept = ageVerificationContainer.querySelector("[data-over-age-button]");
        let age_retry = ageVerificationContainer.querySelector("[data-age-decline-button]");
        let ageVerified = getCookie("ageVerified");
        if (ageVerified != 'true' && window.location.pathname.indexOf('/challenge') < 0) {
            ageVerificationContainer.classList.add('show');
            ageVerificationContainer.style.display = "block"
            document.querySelector('body').classList.add('no-scroll')
        }
        if (age_accept) {
            age_accept.addEventListener('click', function(event) {
                event.preventDefault();
                ageVerificationContainer.classList.remove('show');
                ageVerificationContainer.style.display = "none"
                document.querySelector('body').classList.remove('no-scroll');
                setCookie('ageVerified', 'true', 15)
            })
        }
        if (age_decline) {
            age_decline.addEventListener('click', function(event) {
                event.preventDefault();
                if (ageVerifyWrapper && ageDeclineWrapper) {
                    ageVerifyWrapper.classList.add('hidden');
                    ageDeclineWrapper.classList.remove('hidden');
                }
            })
        }
        if (age_retry) {
            age_retry.addEventListener('click', function(event) {
                event.preventDefault();
                if (ageVerifyWrapper && ageDeclineWrapper) {
                    ageDeclineWrapper.classList.add('hidden');
                    ageVerifyWrapper.classList.remove('hidden');
                }
            })
        }
    }
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function copyCouponcode() {
    let copyText = document.querySelector(".coupon-code-name-text");
    let textArea = document.createElement("textarea");
    textArea.value = copyText.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("Copy");
    textArea.remove();
    let copyelement = document.querySelector(".coupon-code-message");
    copyelement.textContent='Copied';
    setTimeout(function(){
        copyelement.textContent='';
    },1000)
  }

function menuHamburgerEvent(section = document) {
    let hamburgerElements = section.querySelectorAll('[data-mobile-hamburger]');
    let mainheader = document.querySelector('header');
    let bodyElement = document.querySelector('body');
    let dropdownChildrens = document.querySelectorAll('[data-children-menu]');
    let stickyElement = 'false';
    if (mainheader && mainheader.hasAttribute("data-header-sticky")) {
        stickyElement = mainheader.getAttribute("data-header-sticky")
    }
    Array.from(hamburgerElements).forEach(function(hamburgerElement) {
        hamburgerElement.addEventListener("click", function(event) {
            event.preventDefault();           
            let timeout = 10;
            let  menubarElement = document.querySelector('[data-menu-drawer]');
            if (hamburgerElement.classList.contains('mobile-dock-link') && document.querySelector('.header').classList.contains('is-hidden')) {
                timeout = 850
                document.querySelector('.header').classList.remove('is-hidden')
            }
            if (stickyElement == 'false' && hamburgerElement.classList.contains("hamburger-toggler")) {
                if(document.querySelector('.header').classList.contains("is-sticky")){
                    document.querySelector('.header').classList.remove("is-sticky");
                    document.querySelector('.header').classList.remove("sticky-active");
                }
            }
            if (hamburgerElement.classList.contains('mobile-dock-link') && stickyElement == 'false') {
                document.querySelector('.header').classList.add("is-sticky");
                document.querySelector('.header').classList.add("sticky-active");   
            }
            setTimeout(() => {
             if(hamburgerElement.classList.contains("mobile-menu-item-inner")){
               if(hamburgerElement.closest(".mobile-menu-item").classList.contains("has-children")){
                hamburgerElement.closest(".mobile-menu-item").classList.add("show");
                }
             }
             if(hamburgerElement.classList.contains('hamburger-toggler')){                                                                                                                                                                                                      
                if (bodyElement.classList.contains('menu-open')) {
                    bodyElement.classList.remove('no-scroll', 'menu-open');
                    menubarElement.classList.remove('show');
                    Array.from(dropdownChildrens).forEach(function(dropdownChildren){
                        dropdownChildren.classList.remove('show');
                        setTimeout(() => {
                            if(dropdownChildren.querySelector('[data-submenu-items]')){
                                DOMAnimations.slideUp(dropdownChildren.querySelector('[data-submenu-items]'));
                            }
                        }, 300);
                    })
                } else {
                    bodyElement.classList.add('no-scroll', 'menu-open');
                    menubarElement.classList.add('show');
                } 
            
             }
            })
        });

        let closemobilemenu = document.querySelector("[data-mobile-hamburger-close]");
        if(closemobilemenu){
            closemobilemenu.addEventListener("click", function(event){
                let  menubarElement = document.querySelector('[data-menu-drawer]');
                bodyElement.classList.remove('no-scroll', 'menu-open');
                menubarElement.classList.remove('show');
                
                if(document.querySelector('.header').classList.contains("is-sticky")){
                    document.querySelector('.header').classList.remove("is-sticky");
                    document.querySelector('.header').classList.remove("sticky-active");
                  }
                Array.from(dropdownChildrens).forEach(function(dropdownChildren){
                    dropdownChildren.classList.remove('show');
                })
    
            })
        }
     
        
    })
    window.addEventListener("resize", function() {
        let  menubarElement = document.querySelector('[data-menu-drawer]');
        if (window.innerWidth > 991 && bodyElement.classList.contains('menu-open')) {
            bodyElement.classList.remove('menu-open', 'no-scroll');
            Array.from(dropdownChildrens).forEach(function(dropdownChildren){
                dropdownChildren.classList.remove('show');
            })
            menubarElement.classList.remove('show');
        }
    })
}
function mobileMenuitemsEvent() {
    let navBarbackElemets = document.querySelectorAll("[data-menu-navback]");
    let submenuDropdowns= document.querySelectorAll("[data-submenu-dropdown]");
    Array.from(navBarbackElemets).forEach(function(navBarbackElement) {
        navBarbackElement.addEventListener("click", function(event) {
            event.target.closest('.mobile-menu-item.show').classList.remove('show');
            let mobileItems = event.target.closest('.mobile-menu-item').querySelectorAll('.show[data-children-menu]')
            setTimeout(() => {
                Array.from(mobileItems).forEach(function(subMenu){
                    subMenu.classList.remove('show');
                    if(subMenu.querySelector('[data-submenu-items]')){
                        DOMAnimations.slideUp(subMenu.querySelector('[data-submenu-items]'));
                    }
                })
            }, 500);
        })
    })
    Array.from(submenuDropdowns).forEach(function(submenuDropdown){
        submenuDropdown.addEventListener("click", function(event) {
            let menuParent = event.target.closest('.mobile-submenu-item');
            let menuList = menuParent.querySelector(".mobile-grand-submenu");
            if (!menuParent.classList.contains('show')) {
              
                DOMAnimations.classToggle(menuParent, 'show');
                DOMAnimations.slideToggle(menuList);
            }else{
         
                DOMAnimations.slideToggle(menuList);
                setTimeout(function(){
                    DOMAnimations.classToggle(menuParent, 'show'); 
                },500)
            
            }
        })
    })
    /* ---dropDown menu mobile---*/
}
function headerNavigationPosition(section = document) {
    if (window.innerWidth < 992) return false;
    let allNavigations = section.querySelectorAll("[data-navigation-item]");
    Array.from(allNavigations).forEach(function(navItem) {
        navItem.classList.remove("left-menu");
        let windowSize = window.innerWidth - 200;
        let currentPosition = navItem.offsetLeft + navItem.clientWidth;
        if (navItem.querySelector(".nav-submenu.inner")) {
            currentPosition =currentPosition + navItem.querySelector(".nav-submenu.inner").clientWidth;
        }
        if (currentPosition >= windowSize) {
            navItem.classList.add("left-menu");
        }
    });
}

function productGiftOptions(section = document) {
    let giftCardWrappers = section.querySelectorAll('[data-gift-card-box]');
    Array.from(giftCardWrappers).forEach(function(giftCard) {
        let jsCheck = giftCard.querySelector('[data-js-gift-card-selector]')
        if (jsCheck) {
            jsCheck.disabled = false;
            Array.from(giftCard.querySelectorAll('[data-gift-input]')).forEach(function(input) {
              input.disabled = true;
            });
            jsCheck.addEventListener('click', function() {
                let giftCardContent = giftCard.querySelector('[data-gift-card-content]');
                if (jsCheck.checked) {
                    DOMAnimations.slideDown(giftCardContent, 500);
                    Array.from(giftCard.querySelectorAll('[data-gift-input]')).forEach(function(input) {
                      input.disabled = false;
                    });
                } else {
                    DOMAnimations.slideUp(giftCardContent, 500);
                    Array.from(giftCard.querySelectorAll('[data-gift-input]')).forEach(function(input) {
                      input.disabled = true;
                    });
                    let formErrorWrapper = giftCard.querySelector('.form-message__wrapper');
                    if (formErrorWrapper) {
                        formErrorWrapper.classList.add('hidden')
                        let formErrorMessage = formErrorWrapper.querySelector('.error-message');
                        if (formErrorMessage) {
                            formErrorMessage.innerHTML = '';
                        }
                    }
                }
            })
        }
        let noJsCheck = giftCard.querySelector('[data-no-js-gift-card-selector]')
        if (noJsCheck) {
            noJsCheck.disabled = true;
        }
    })
}
window.addEventListener("resize", (event) => {
    var sliders = jQuery('body').find('[data-slick]');
    if (sliders.length > 0 &&jQuery('body').find('[data-slick]').hasClass("slick-initialized")) {
        sliders.each(function(index) {
                jQuery(this).slick('resize');     
        });
    }
    fullHeightCalculate();   
});

function mobileCategoriesInit(section = document){
    if(document.querySelector("[data-mobile-categories-head]")){
        let mobileEement = document.querySelector("[data-mobile-categories-head]");
        let crossElements = document.querySelectorAll("[data-mobile-categories-close]");
        let closeElement =document.querySelector(".close-categories"); 
        
        let mobileMainContnet = document.querySelector("[data-mobile-categories-content]");
        mobileEement.addEventListener('click', function() {
            mobileEement.classList.add("hidden");
            mobileEement.closest(".mobile-categories-wrapper").classList.add("categories-active")
            document.querySelector("body").classList.add("no-scroll"); 
            closeElement.style.display="flex";
            mobileMainContnet.style.display = `block`;
            mobileMainContnet.classList.add("active")
        })
        Array.from(crossElements).forEach(function(element){
            element.addEventListener('click', function() {
                mobileEement.classList.remove("hidden");
                mobileEement.closest(".mobile-categories-wrapper").classList.remove("categories-active")
                document.querySelector("body").classList.remove("no-scroll"); 
                closeElement.style.display="none";
                mobileMainContnet.style.display = "none";
                mobileMainContnet.classList.remove("active")
            })
        })    
    }
}
function contentTabs(section = document){
    let tabHeads= document.querySelectorAll("[data-tabs-main-head]");
    Array.from(tabHeads).forEach(function(tabhead){
        tabhead.addEventListener('click',function(event){
            event.preventDefault();
            let tabId = tabhead.getAttribute("href");
            let parent =tabhead.closest(".tabbed-content");
            parent.querySelector(".tabbed-content-link.active").classList.remove("active")
            tabhead.classList.add("active");
            parent.querySelector(".tabbed-content-body-item.active").classList.remove("active")
            parent.querySelector(tabId).classList.add("active");
        })
    })
    
}
function spotLight(section = document){
    let spotlightitems =section.querySelectorAll("[data-spotlight-item]");
    Array.from(spotlightitems).forEach(function(spotlightitem){
        let parent =spotlightitem.closest(".spotlight-item");
        spotlightitem.addEventListener("click",function(){
            if(parent.querySelector("[data-spotlight-details].active")){
                parent.querySelector("[data-spotlight-details].active").classList.remove("active");   
            } 
            if(spotlightitem.closest(".spotlight-product-inner-item").classList.contains("active")){
                spotlightitem.closest(".spotlight-product-inner-item").classList.remove("active");
                if(spotlightitem.closest(".spotlight-product-item").querySelector("[data-spotlight-details].active")){
                    spotlightitem.closest(".spotlight-product-item").querySelector("[data-spotlight-details].active").classList.remove("active");
                }
                  
            }else{
                if(parent.querySelector(".spotlight-product-inner-item.active")){
                    parent.querySelector(".spotlight-product-inner-item.active").classList.remove("active");
                }
                spotlightitem.closest(".spotlight-product-inner-item").classList.add("active");
                spotlightitem.closest(".spotlight-product-item").querySelector("[data-spotlight-details]").classList.add("active")
            }
        })
        let closeSpotLight = spotlightitem.closest(".spotlight-product-item").querySelector("[data-spotlight-close]");
        if(closeSpotLight){
            closeSpotLight.addEventListener("click",function(){
                if(parent.querySelector("[data-spotlight-details].active")){
                    parent.querySelector("[data-spotlight-details].active").classList.remove("active"); 
                      
                } 
                if(parent.querySelector(".spotlight-product-inner-item.active")){
                    parent.querySelector(".spotlight-product-inner-item.active").classList.remove("active");
                }  
                
            })
        }  
    });

    let spotlightHoverItems = section.querySelectorAll("[data-single-spot-item]");
    Array.from(spotlightHoverItems).forEach(function(spotlightHoverItem){
        spotlightHoverItem.addEventListener("mouseover", function(event){
            if(spotlightHoverItem.querySelector("[data-spotlight-details]")){
                if(spotlightHoverItem.querySelector("[data-spotlight-details].active")){
                    return false;
                }
                spotlightHoverItem.querySelector("[data-spotlight-details]").classList.add("active") 
            }

        })

        spotlightHoverItem.addEventListener("mouseout", function(event){
            if(spotlightHoverItem.querySelector("[data-spotlight-details]")){
                if(spotlightHoverItem.querySelector("[data-spotlight-details].active")){
                    spotlightHoverItem.querySelector("[data-spotlight-details]").classList.remove("active")   
                }
               
            }

        })
    })

}

function mediaListItem(section = document){
    let mediaItems = section.querySelectorAll("[data-media-item]");
    Array.from(mediaItems).forEach(function(mediaItem){
        mediaItem.addEventListener("mouseover", function(){
            if(window.innerWidth < 1025) return false;
            if(mediaItem.classList.contains('active')) return false;
            let midHeight = window.pageYOffset + (window.innerHeight/2);
            const screenPartition = window.innerHeight/3;
            const screenPartitionOneStart = window.pageYOffset;
            const screenPartitionOneend = screenPartitionOneStart + screenPartition;
            const screenPartitionTwoStart = screenPartitionOneend + 1;
            const screenPartitionTwoend = screenPartitionOneend + screenPartition;
            const screenPartitionThreeStart = screenPartitionTwoend + 1;
            const screenPartitionThreeend = screenPartitionTwoend + screenPartition;
            const offsetTop = mediaItem.offsetTop + (mediaItem.clientHeight / 2); 


            mediaItem.classList.remove('position-bottom','position-top','position-center');
            mediaItem.classList.add('active');

            if (offsetTop <= screenPartitionOneend) {
                mediaItem.classList.add('position-top');
            } else if (offsetTop >= screenPartitionTwoStart && offsetTop <= screenPartitionTwoend){
                mediaItem.classList.add('position-center');
            } else if (offsetTop >= screenPartitionThreeStart){
                mediaItem.classList.add('position-bottom');
            }
        });
        mediaItem.addEventListener("mouseleave", function(){
            if(window.innerWidth < 1025) return false;
            mediaItem.classList.remove('active')
        });
    });
}
function productCardHoverInit(section = document) {
    let hoverelements = section.querySelectorAll(".product-card[data-options-hover]");
    Array.from(hoverelements).forEach(function (hoverelement) {
      if (hoverelement) {
            hoverelement.addEventListener("mouseover", function (element) {
                if (window.innerWidth > 1024) {
                const imageHeight = hoverelement.querySelector(".product-card-img").offsetHeight,
                    infoHeight = hoverelement.querySelector(".product-card-detail-info").offsetHeight,
                    hoverContent=hoverelement.querySelector(".product-options").offsetHeight;
                    if(hoverContent > infoHeight){
                        const difference = hoverContent-infoHeight;
                        heightExpanded = imageHeight + hoverContent+ difference;
                        const mainCardheight = hoverelement.offsetHeight;
                        if(mainCardheight<heightExpanded){
                            hoverelement.style.height = heightExpanded + "px"; 
                        }  
                    }  
                }
            });
            hoverelement.addEventListener("mouseleave", function (element) {
                if (window.innerWidth > 1024) {
                    hoverelement.style.height = null;
                }
            });
      }
    });
  }
class CollectionBanner extends HTMLElement{
    constructor(){
        super(); 
        Array.from(this.querySelectorAll('[data-coll-banner]')).map((collBanner) => {
            collBanner.addEventListener('mouseover', this.onMouseOverHandler.bind(this, collBanner));
        });

        this._initialRun();
        const resizeObserver = new ResizeObserver(() => this._initialRun());
        resizeObserver.observe(this);
    }
    _initialRun(){
        if(this.querySelectorAll('[data-coll-desc]')){
            Array.from(this.querySelectorAll('[data-coll-desc]')).map((item) => {
                item.closest('[data-coll-banner]').style.setProperty("--desc-height", `${item.getBoundingClientRect().height}px`);
            });
        }
        // this.buttonHeight = this.querySelector('[data-coll-button] a').getBoundingClientRect().height;
        // this.style.setProperty("--button-height", `${this.buttonHeight}px`);
    }
    onMouseOverHandler(collBanner) {
        if (collBanner.classList.contains('active')) return;
        // console.log(this)
        Array.from(this.closest('section').querySelectorAll('[data-coll-banner]')).map((item) => {
            item.classList.remove('active');
        });
        collBanner.classList.add('active');
        if(this.closest('section').querySelector(`[data-bg-id="${collBanner.id}"]`).classList.contains('active')) return;
        Array.from(this.closest('section').querySelectorAll('[data-bg-id]')).map((bgitem) => {
            bgitem.classList.remove('active');
        });
        this.closest('section').querySelector(`[data-bg-id="${collBanner.id}"]`).classList.add('active')
    }
}
customElements.define('collection-banner', CollectionBanner);

class DeferredMedia extends HTMLElement {
    constructor() {
        super();
        if (this.classList.contains("autoplay-status-false")) {
            let loadBtn ='';
            if(this.closest(".product-media-item")){
                 loadBtn = this.closest(".product-media-item").querySelector('.js-load-media');
            }else{
                 loadBtn = this.closest(".shopify-section").querySelector('.js-load-media');
            }
        
            loadBtn.addEventListener('click', this.loadContent.bind(this));
        } else {
        this.addObserver();
        }
    }
    addObserver() {
        if ('IntersectionObserver' in window === false) return;
        const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
            // this.loadContent(false, false, 'observer');
            this.loadContent();
            observer.unobserve(this);
            }
        });
        }, { rootMargin: '0px 0px 1000px 0px' });
        observer.observe(this);
    }
    loadContent() {
        if(this.parentElement.classList.contains('media-banner-parallax')){
            this.style.position = 'absolute';
            this.parentElement.style.position = 'fixed';
          }
        
        const content = this.querySelector('template').content.firstElementChild.cloneNode(true);
        this.appendChild(content);
        if(this.querySelector('video') && this.querySelector('video').hasAttribute("data-autoplay") || this.querySelector('video') && this.querySelector('video').hasAttribute("autoplay")){
            this.querySelector('video').play();
            productCardHoverInit();
            if(this.closest(".product-media-item")){
                this.closest(".product-media-item").querySelector('.js-load-media').style.display='none'; 
            }
        }
        
    }
}
customElements.define('deferred-media', DeferredMedia);

function testimonialLoadMore(){
        let testimonialItems =document.querySelectorAll("[data-testimonial-load-more]");
        Array.from(testimonialItems).forEach(function(testimonialItem){
            if(testimonialItem){
                testimonialItem.addEventListener("click",function(){
                    let parentSection = testimonialItem.closest(".shopify-section");
                    let items = parentSection.querySelectorAll(".testimonials-slider-item.hidden-items");
                    Array.from(items).forEach(function(item,index){
                        if(item){
                            setTimeout(function(){
                                item.style.opacity="1";
                                item.style.transform="none";
                            },index+1*200)
                            item.style.display="block"
                        }  
                    })
                    setTimeout(function(){
                        testimonialItem.closest(".testimonials-load-more").style.setProperty('display', 'none', 'important')
                    },300)
                   
                })
            }

        })
}

    /*-------------tabbed-collections------------------ */
function tabbedCollection(section = document) {
    var bindAll = function() {
        var menuElements = document.querySelectorAll('[data-tab-filters]');

        Array.from(menuElements).forEach(function(menuElement){
            menuElement.addEventListener('click', change, false);
        })
 
    }
    var clear = function(section) {
        var menuElements = section.querySelectorAll('[data-tab-filters]');
        for (var i = 0; i < menuElements.length; i++) {
            menuElements[i].querySelector(".collection-tabs-header-link").classList.remove('active');
            var id = menuElements[i].getAttribute('data-tab-filters');
            document.getElementById(id).classList.remove('active');
            // let allElement = document.getElementById(id).querySelectorAll("[data-product-card]")

            if (section.querySelector('[data-id="' + id + '"]')) {
                section.querySelector('[data-id="' + id + '"]').classList.remove('active');
                let allElement = section.querySelector('[data-id="' + id + '"]').querySelectorAll(".product-card")
                    Array.from(allElement).forEach(function(item) {
                        item.classList.remove('aos-animate');
                    })
            }
            if(section.querySelector('[data-id-link="' + id + '"]')){
                section.querySelector('[data-id-link="' + id + '"]').classList.remove('active');
            }
            
        }
    }
    var change = function(e) {
        e.preventDefault();
        let section = e.currentTarget.closest(".collection-tabs");
        clear(section);
        e.currentTarget.querySelector(".collection-tabs-header-link").classList.add('active');
        var id = e.currentTarget.getAttribute('data-tab-filters');
        document.getElementById(id).classList.add('active');
        if (section.querySelector('[data-id="' + id + '"]')) {
            section.querySelector('[data-id="' + id + '"]').classList.add('active');
            let allElement =  section.querySelector('[data-id="' + id + '"]').querySelectorAll(".product-card")
            setTimeout(() => {
                Array.from(allElement).forEach(function(item) {
                    item.classList.add('aos-animate');
                })
            }, 300);
        }
        if(section.querySelector('[data-id-link="' + id + '"]')){
            section.querySelector('[data-id-link="' + id + '"]').classList.add('active');
        }
        $('.collection-tabs-products-content[id="' + id + '"]').slick('setPosition');
        if(animationStatus){
            if (AOS) { 
                AOS.refreshHard() 
            }
            }

    }
    bindAll();
}
function productImagehoverZoom(section = document){

    let clickElements = document.querySelectorAll("[data-zoom-hover]");
    Array.from(clickElements).forEach(function(element){
        element.addEventListener("click",function(){
            if(window.innerWidth>768){
                let image = element.querySelector('img');
                zoomOverlayCreate(image,element);
            }

        }) 
    })
    var zoomOverlayCreate = function(image,element) {
        let imageSrc='';
        if(image.closest("[data-media-inner]").classList.contains("main-image-first")){
            imageSrc=image.src;
          
        }else{
            imageSrc=image.getAttribute("data-original");
        }
        const OverlayElement = document.createElement("div");
        const overlayImage = document.createElement("img");
        overlayImage.setAttribute("src", `${imageSrc}`);
        if(image.closest("[data-zoom-hover]").classList.contains('image-zoom-overlay')){
            image.closest("[data-zoom-hover]").classList.remove("image-zoom-overlay");
            resetElement(image.closest("[data-zoom-hover]").querySelector('.zoom-image-hover')); 
        }else{
            let zoomRatio = 2;
           
            overlayImage.onload = () => {
                OverlayElement.setAttribute("class", "zoom-image-hover cursor-pointer zoom"),OverlayElement.style.backgroundImage = `url('${overlayImage.src}')`,OverlayElement.style.backgroundSize=`${overlayImage.width*zoomRatio}px`, OverlayElement.style.cursor = "zoom-out"
                image.closest("[data-media-inner]").insertBefore(OverlayElement,image.closest(".media-box"));
                image.closest("[data-zoom-hover]").classList.add("image-zoom-overlay");
                mouseEvent(image);
            }
        }
       
    }
    var mouseEvent=function(image){
    if(image.closest("[data-product-media]").querySelector('.zoom-image-hover')){
        let zoomElement= image.closest("[data-product-media]").querySelector('.zoom-image-hover');
        zoomElement.addEventListener("mousemove" ,function(event){
            zoomWithMedia(image,zoomElement,event);
        })

        zoomElement.addEventListener("mouseleave" ,function(event){
            resetElement(zoomElement);
        })
    }
       
    }
    var zoomWithMedia = function(image,overlayElement, event){
        let zoomer = event.currentTarget;

        event.offsetX ? offsetX = event.offsetX : offsetX = event.touches[0].pageX
        event.offsetY ? offsetY = event.offsetY : offsetX = event.touches[0].pageX
        x = offsetX/zoomer.offsetWidth*100
        y = offsetY/zoomer.offsetHeight*100
        overlayElement.style.backgroundPosition = x + '% ' + y + '%'
      

    }
    var resetElement =function(overlayElement){
        if (overlayElement && overlayElement.classList.contains("active")) {
            overlayElement.closest("[data-product-media]").classList.remove("image-zoom-overlay");
            overlayElement.remove();
        }        
       
    }

}
function footerDropdownCheck() {
    let windowCenter = window.innerHeight / 2;
    if (document.querySelector('.footer-bottom-content')) {

        let elementScrollTop = document.querySelector('.footer-bottom-content').getBoundingClientRect().top;
        let customContents = document.querySelector('.footer-bottom-content').querySelectorAll(".custom-select-content")
        if (isOnScreen(document.querySelector('.footer-bottom-content'))) {
            Array.from(customContents).forEach(function(element){
                if (elementScrollTop < windowCenter) {
                    element.classList.add('bottom-position');
                    element.classList.remove('top-position');
                } else {
                    element.classList.add('top-position');
                    element.classList.remove('bottom-position')
                }
            })
            
        }
    }
}


function videoTextOverlay(){
    let windowCenter = window.innerHeight / 2;
    let textElements = document.querySelectorAll("[data-text-overlay-content]");
    Array.from(textElements).forEach(function(element){
        let elemetheight =element.closest(".video-text-overlay").querySelector(".video-text-overlay-media").getBoundingClientRect().height;
     let innerElements =element.querySelectorAll("[data-text-overlay-inner]");
        Array.from(innerElements).forEach(function(innerElement){
            let topSection = innerElement.closest('[data-text-overlay-content]')
            let elementScrollTop = innerElement.getBoundingClientRect().top;
            if (elementScrollTop < windowCenter) {
                if(innerElement.classList.contains('scrolled')) return;
                // if(topSection.querySelector(".scrolled")){
                //     topSection.querySelector(".scrolled").classList.remove('scrolled')
                // }
                
                innerElement.classList.add('scrolled');
            } else {
                innerElement.classList.remove('scrolled');
            }
    
        })
    })
}

function tabbedMenus() {
    const menuMainHeader = document.querySelector('[data-header-section]');
    
    if (menuMainHeader && menuMainHeader.getAttribute('data-header-style') === 'header_8') {
        const menuItems = document.querySelectorAll('[data-menu-item]');
        const menuListBottoms = document.querySelectorAll('[data-menu-list-bottom]');
        const menuListBox = document.querySelector('[data-menu-list-box]');
        
        if (!menuListBox) return;

        menuItems.forEach(menuItem => {
            menuItem.addEventListener('click', function (event) {
                const index = this.getAttribute('data-index');
                const link = this.querySelector('a');
                const href = link.getAttribute('href');

                // Check if it's a "#" link or an anchor-based link
                if (href === "#" || (href.includes("#") && !href.includes(window.location.hostname))) {
                    event.preventDefault(); // Prevent default anchor behavior
                    
                    // Remove active class from all menu items
                    menuItems.forEach(item => item.classList.remove('active'));

                    // Add active class to the clicked menu item
                    this.classList.add('active');

                    const activeMenuListBottom = document.querySelector(`.menu-list-bottom[data-index="${index}"]`);
                    
                    if (activeMenuListBottom) {
                        // Close all open submenus first
                        menuListBottoms.forEach(menu => {
                            menu.classList.remove('active');
                            menu.classList.add('d-md-none');
                        });

                        // Toggle the clicked submenu
                        activeMenuListBottom.classList.toggle('active');
                        activeMenuListBottom.classList.toggle('d-md-none');
                    }
                }
            });
        });

        // Close menus when clicking outside
        document.addEventListener('click', function (event) {
            if (!menuMainHeader.contains(event.target)) {
                menuListBottoms.forEach(menuListBottom => {
                    menuListBottom.classList.remove('active');
                    menuListBottom.classList.add('d-md-none');
                });

                // Remove active class from all menu items
                menuItems.forEach(item => item.classList.remove('active'));
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", function(section = document ){
    onLoadEvents();
}, false);
function onLoadEvents(){
    if(document.querySelector('header')){
        stickyHeaderInit(); 
    }
    updateContainerHeight();
    videoTextOverlay();
    productImagehoverZoom();
    productCardHoverInit();
    menuHamburgerEvent();
    sliders();
    mobileCategoriesInit();
    customDropdownElements();
    customDropdownElementsLocalization();
    countdownClock();
    videoPlayInit();
    detailDisclouserInit();
    quickViewElements();
   // quantitySelectors();
    updateCartNote();
    //cartItemRemoveElements();
    //stickyProductOptions();
    //productVariantOption();
    //getAddToCartElements();
    marqueeTextScroll();
    marqueeTextAutoplay();
    collapsiblecontentClose();
    imageCarousel();
    checkMapApi();
    mapSidebarElementsInt();
    initBeforeAfter();
    popupContentElements();
    colorSwatchesMediaChanged();
    productRecommendations();
    sideDrawerInt();
    cartDrawerNoteInit();
    fullHeightCalculate();
    slideToggleInt();
    cookiesBanner();
    ageVerificationInit();
    recentlyViewedProducts();
    shippingEstimates();
    mobileMenuitemsEvent();
    headerNavigationPosition();
    productGiftOptions();
    contentTabs();
    spotLight();
    testimonialLoadMore();
    mediaListItem();
    tabbedCollection();
   initStickyAddToCart();
    tabbedMenus();
    if(animationStatus){
        if (AOS) { 
          AOS.refreshHard() 
        }
      }

    if (document.querySelector('[data-parallax-banner]')) {
        new universalParallax().init({
            speed:10
        });
    }
}

function updateContainerHeight(){
    if(document.querySelector('[data-hero-section-id]')){
        let hero_sliders = document.querySelectorAll('[data-hero-section-id]');
        Array.from(hero_sliders).forEach(function(slider) {
            const section_id = slider.dataset.heroSectionId;
            const container_height = slider.querySelector('.hero-slideshow-desc-outer').offsetHeight; 
            document.querySelector(`#shopify-section-${section_id}`).style.setProperty('--container-height', `${container_height}px`);
        });
    }
}

document.addEventListener("shopify:section:unload", function(section) {
    let target = section.target;
    if(target.querySelector('header')){
      setTimeout(function(){
        stickyHeaderInit(); 
        },600)
    }
});

document.addEventListener("shopify:section:load", function(section) {
    let target = section.target;
    let bodyElement = document.querySelector('body');
    let sliders = target.querySelectorAll('[data-slick]')
    Array.from(sliders).forEach(function(slider) {
        if (!slider.classList.contains('slick-initialized')) {
            slickSlider($(slider));
        }
    })
    
    if(document.querySelector("[data-dropdown-close]")){
        document.querySelector("[data-dropdown-close]").addEventListener("click", function(event){
            event.preventDefault();
            document.querySelector('[data-dropdown-body]').classList.remove("is-open")
        })
    }
    if(target.classList.contains('header')){
        if (bodyElement.classList.contains('menu-open')) {
            bodyElement.classList.remove('no-scroll', 'menu-open'); 
        } 
        if(target.querySelector('.menu-container')){
            menuDropdownInit(); 
            Array.from(document.querySelectorAll('.nav-menu')).forEach(function(menuitem,index){
                setTimeout(() => {
                    menuitem.classList.add("animation")
                }, (200 * (index + 1)));
            })
        }
    }
    if(target.querySelector('header') || target.classList.contains('mobile-dock')){
    }
    menuHamburgerEvent(target);
    if(target.querySelector('header')){
        mobileMenuitemsEvent();
        setTimeout(function(){
          stickyHeaderInit(); 
        },600)
        fullHeightCalculate();   
    }
    if(target.querySelector('announcement-bar')){
        fullHeightCalculate();   
    }
    if (target.querySelector('[data-parallax-banner]')) {
        new universalParallax().init({
            speed:10
        });
    }
    updateContainerHeight(target);
    initMaps(target);
    videoPlayInit(target);
    countdownClock(target);
    videoTextOverlay(target);
    detailDisclouserInit(target);
    marqueeTextScroll(target);
    marqueeTextAutoplay(target);
    checkMapApi(target);
    mapSidebarElementsInt(target);
    initBeforeAfter(target);
    popupContentElements(target);
    colorSwatchesMediaChanged(target);
    productRecommendations(target);
    slideToggleInt(target);
    cookiesBanner(target);
    ageVerificationInit(target);
    recentlyViewedProducts(target);
    sideDrawerInt(target );
    customDropdownElements(target);
    customDropdownElementsLocalization(target);
    headerNavigationPosition(target);
    imageCarousel(target);
    shippingEstimates(target);
    mobileCategoriesInit(target);
    contentTabs(target);
    spotLight(target);
    testimonialLoadMore(target);
    mediaListItem(target);
    productCardHoverInit(target);
    videoPauseOnScroll();
    tabbedCollection(target);
    productImagehoverZoom(target);
    initStickyAddToCart(target)
    if(animationStatus){
        if (AOS) { 
          AOS.refreshHard() 
        }
    }
    tabbedMenus();
});

document.addEventListener("shopify:section:select", function (event) {
    let target = event.target;
    let bodyElement = document.querySelector('body');
    let sliders = target.querySelectorAll('[data-slick]')
    Array.from(sliders).forEach(function(slider) {
        if (!slider.classList.contains('slick-initialized')) {
            slickSlider($(slider));
        }
    })
    
    if(target.classList.contains('mobile-dock')){
        if(target.querySelector('.mobile-dock-bar')){
            target.querySelector('.mobile-dock-bar').classList.add('dock-active')
        }
    }
    if(document.querySelector("[data-dropdown-close]")){
        document.querySelector("[data-dropdown-close]").addEventListener("click", function(event){
            event.preventDefault();
            document.querySelector('[data-dropdown-body]').classList.remove("is-open")
        })
    }
    if(target.classList.contains('header')){
        if (bodyElement.classList.contains('menu-open')) {
            bodyElement.classList.remove('no-scroll', 'menu-open'); 
        } 
    }
    
    if(target.querySelector('header')){
        stickyHeaderInit();
        // menuHamburgerEvent();
    }
    // menuHamburgerEvent();
  
    
})

document.addEventListener("shopify:section:deselect", function (event) {
    let target = event.target;
    if(target.classList.contains('mobile-dock')){
        if(target.querySelector('.mobile-dock-bar')){
            target.querySelector('.mobile-dock-bar').classList.remove('dock-active')
        }
    }
});
window.addEventListener('scroll', function() {
    footerDropdownCheck();
    document.querySelectorAll(".youtube_video,.youtube-video,iframe[src*='www.youtube.com']").forEach((video) => {
        if (!isOnScreen(video) && video.getAttribute('data-autoplay') == 'false') {
            video.contentWindow.postMessage('{"event":"command","func":"' + "pauseVideo" + '","args":""}',"*");
        }
    });
   
    document.querySelectorAll(".vimeo_video,.vimeo-video, iframe[src*='player.vimeo.com']").forEach((video) => {
        if (!isOnScreen(video) && video.getAttribute('data-autoplay') == 'false') {
            video.contentWindow.postMessage('{"method":"pause"}', "*");
        }
    });
    document.querySelectorAll("video").forEach((video) => {
        if (!isOnScreen(video) && video.getAttribute('data-autoplay') == 'false') {
            video.pause();
        }
    });
    document.querySelectorAll("section").forEach((section) => {
        if (isOnScreen(section)) {          
            if(section.classList.contains("before-after")){
                setTimeout(function(){
                    section.classList.add("section-in-view");
                    if(section.querySelector(".image-comparison-wrapper")){
                        section.querySelector(".image-comparison-wrapper").classList.add("animating")
                        setTimeout(function(){
                            section.querySelector(".image-comparison-wrapper").classList.remove("animating")
                        },1000)
                    }
                  
                },1000)
            }else{
                setTimeout(function(){
                section.classList.add("section-in-view");
                },500)
            } 
        }
        if (isOnScreen(section)) {
            videoTextOverlay()  
        }         
    });
    if(document.querySelector(".image-true") && document.querySelector(".mobile-categories-title")){
        document.querySelector(".mobile-categories-title").classList.add("hidden") 
    }   
});

function videoPauseOnScroll(){
    let containerElements = document.querySelectorAll("[data-quickview-content]");
   
    Array.from(containerElements).forEach(function(containerElement){
        containerElement.addEventListener("scroll", function(element){
            document.querySelectorAll(".youtube_video,.youtube-video,iframe[src*='www.youtube.com']").forEach((video) => {
                if (!isOnScreen(video) && video.getAttribute('data-autoplay') == 'false') {
                    video.contentWindow.postMessage('{"event":"command","func":"' + "pauseVideo" + '","args":""}',"*");
                }
            });
           
            document.querySelectorAll(".vimeo_video,.vimeo-video, iframe[src*='player.vimeo.com']").forEach((video) => {
                if (!isOnScreen(video) && video.getAttribute('data-autoplay') == 'false') {
                    video.contentWindow.postMessage('{"method":"pause"}', "*");
                }
            });
            document.querySelectorAll("video").forEach((video) => {
                if (!isOnScreen(video) && video.getAttribute('data-autoplay') == 'false') {
                    video.pause();
                }
            });

        })
    })
}

window.addEventListener('scroll', debounce(function() {
    if(document.querySelector(".mobile-categories-title")){
        document.querySelector(".mobile-categories-title").classList.remove("hidden");
    } 
    
}))

document.addEventListener("shopify:block:select", function(block) {
    let target = block.target;
    let slider = target.closest('.slick-initialized');
    if (slider) {
        let slidesLength = parseInt(slider.dataset.slidesLength);
        let slidesToShow = $(slider).slick("slickGetOption","slidesToShow");
        let leastValue =  slidesLength - slidesToShow;
        let indexValue = parseInt(target.getAttribute("data-slide"));
        if(slidesToShow > 1 & indexValue > leastValue & window.innerWidth > 767){
            indexValue = Math.ceil(leastValue) 
        }
        $(slider).slick('slickGoTo', indexValue);
    }
   
  
    if (target.closest(".tabbed-content-wrapper")) {
        let dataId=target.getAttribute("href");
        let parent =target.closest(".tabbed-content-wrapper");
        parent.querySelector(".tabbed-content-link.active").classList.remove("active")
        target.classList.add("active");
        parent.querySelector(".tabbed-content-body-item.active").classList.remove("active")
        parent.querySelector(dataId).classList.add("active");
    
    }
    if(target.closest(".images-carousel")){
        let dataindex=target.getAttribute("data-id");
        Array.from(target.closest(".images-carousel").querySelectorAll(".images-carousel-content-item")).forEach(function(element){
            element.classList.remove("active");
            if(element.classList.contains("images-carousel-content-description")){
                element.fadeOut(100);
            }
          
        })
        document.querySelector("#"+dataindex).classList.add("active");
        document.querySelector(".images-carousel-content-item[data-id='"+dataindex+"']").classList.add("active");
        setTimeout(function() {
            document.querySelector(".images-carousel-content-item[data-id='"+dataindex+"']").fadeIn(300)
        }, 200)
       
    }
    if(target.classList.contains('hamburger-promotion')){
        if(document.querySelector('[data-hamburger-menu]')){        
            document.querySelector('[data-hamburger-menu]').dispatchEvent(new Event('click', { bubbles: true }));
        }
    }
    if(target.classList.contains('menu-item')){
        target.classList.add('hover')
    }
    if(animationStatus){
        if (AOS) { 
          AOS.refreshHard() 
        }
      }
})

document.addEventListener("shopify:block:deselect", function(block) {
    let target = block.target;
    if(target.classList.contains('hamburger-promotion')){
        if(document.querySelector('hamburger-menu.close-toggle')){        
            document.querySelector('hamburger-menu.close-toggle').dispatchEvent(new Event('click', { bubbles: true }));
        }
    }
    if(target.classList.contains('menu-item')){
        target.classList.remove('hover')
    }
    
})
class hamburgerMenu extends HTMLElement {
    constructor() {
        super();
        if(this.classList.contains('close-toggle')){
            this.addEventListener("click", this.hideMenu.bind(this));
            this.addEventListener("keydown", function(event) {
                if (event.key === "Enter") {
                  this.hideMenu();
                  stopFocusRotation();
                  if(previousFocusElement){
                      previousFocusElement.focus();
                      previousFocusElement = "";
                  }
                }
              }.bind(this));
        }else{
            this.addEventListener("click", this.showMenu.bind(this));
            this.addEventListener("keydown", function(event) {
                if (event.key === "Enter") {
                  this.showMenu();
                }
              }.bind(this));
            menuDropdownInit();
            
        }
    }
    hideMenu() {
        document.body.classList.remove('hamburger-open','no-scroll');
        Array.from(document.querySelectorAll('.nav-menu')).forEach(function(menuitem){
            menuitem.classList.remove("animation")
        })
        setTimeout(() => {  
            let activeMenus = document.querySelectorAll('.dropdown-detail.open');
            Array.from(activeMenus).forEach((el)=>{
                el.classList.remove('open')
            })
        }, 300);
    }
    showMenu() {
        document.body.classList.add('hamburger-open','no-scroll');
        setTimeout(() => {
            Array.from(document.querySelectorAll('.nav-menu')).forEach(function(menuitem,index){
                setTimeout(() => {
                    menuitem.classList.add("animation")
                }, (200 * (index + 1)));
            })
            if(previousFocusElement == ''){
                previousFocusElement = this;
            }
            if(document.querySelector('.menu-container')){
              focusElementsRotation(document.querySelector('.menu-container'));
            }
          }, 200);
    }
  }
  customElements.define("hamburger-menu", hamburgerMenu);

function menuDropdownInit(){
    let menuElements = document.querySelectorAll('[data-menu-dropdown-item]');
    Array.from(menuElements).forEach((el)=>{
        el.addEventListener('click', function(e){
            e.preventDefault();
            if(el.closest('.dropdown-detail')){
                el.closest('.dropdown-detail').classList.add('open');
            }
        });
    });
    let menuHoverElements = document.querySelectorAll('[data-menu-hover]');
    Array.from(menuHoverElements).forEach((el)=>{
        el.addEventListener('mouseover', function(e){
            if(el.classList.contains('animated')) return false;
            if(el.querySelector('.nav-menu-link-deco') && document.querySelector(el.dataset.filter)){
                el.classList.add('animated');
                el.querySelector('.nav-menu-link-deco').style.filter = 'url('+el.dataset.filter+')';
                let svgFilter = document.querySelector(el.dataset.filter)
                if(svgFilter.querySelector('feTurbulence')){
                    let interval = setInterval(() => {
                        let randomValue = Math.random() * (0.9999 - 0.0001 + 1) + 0.0001;
                        svgFilter.querySelector('feTurbulence').setAttribute('baseFrequency',randomValue.toFixed(4));
                    }, 100);
                    
                    setTimeout(() => {
                        clearInterval(interval);
                        el.querySelector('.nav-menu-link-deco').style.filter = 'none';
                        svgFilter.querySelector('feTurbulence').setAttribute('baseFrequency',0)
                    }, 500);
                }
            }
        });
        el.addEventListener('mouseout', function(e){
            el.classList.remove('animated')
        });
    });
    let backElements = document.querySelectorAll('[data-menu-dropdown-back');
    Array.from(backElements).forEach((el)=>{
        el.addEventListener('click', function(e){
            e.preventDefault();
            if(el.closest('.dropdown-detail')){
                el.closest('.dropdown-detail').classList.remove('open');
            }
        });
    });
}

function fullHeightCalculate(){
    let fullHeight = 0;
    let announcementBar = document.querySelector('.announcement-bar');
    let header = document.querySelector('header');
    if(announcementBar){
        fullHeight += announcementBar.offsetHeight;
    }
    if(header && !header.classList.contains('transparent-true')){
        if(announcementBar){
            fullHeight += announcementBar.offsetHeight;
        }
      
    }
    document.querySelector('body').style.setProperty('--fullHeight', `${window.innerHeight - fullHeight}px`);
}

document.addEventListener('keydown', function(event) {
    if (event.keyCode == 27) {

        let activeDrawers = document.querySelectorAll('[side-drawer-body].show,.side-drawer.show,[data-search-wrapper].show,[data-popup-body].show,[data-dropdown-body].is-open');
        Array.from(activeDrawers).forEach(function(activeDrawer){
                setTimeout(() => {
                    document.querySelector("body").classList.remove("no-scroll");
                    document.querySelector("body").classList.remove("pickup-side-drawer-open");
                    document.querySelector("body").classList.remove("sizeChart-popup-open");
                    activeDrawer.classList.remove('show');
                    activeDrawer.classList.remove('is-open');
                }, 300);
                if(!activeDrawer.classList.contains('drawer-main')){
                    setTimeout(() => {
                        activeDrawer.style.display = "none";
                    }, 500)
                }
                stopFocusRotation();
                if(previousFocusElement){
                    previousFocusElement.focus();
                    previousFocusElement = "";
                }
        });

        let dropdowns = document.querySelectorAll('.custom-select-localization.animation');
        Array.from(dropdowns).forEach(function(dropdown){
            setTimeout(function(){
                dropdown.querySelector("[data-details-select-summary]").style.display="none"
            },100)
            dropdown.querySelector("[data-details-select-summary]").style.opacity="0";
            dropdown.querySelector("[data-details-select-summary]").style.transform="translate3d(0, 10%, 0)";
            dropdown.classList.remove("animation");
            stopFocusRotation();
            if(previousFocusElement){
                previousFocusElement.focus();
                previousFocusElement = "";
            }
        });

        let sorting = document.querySelector('[data-collection-sort]');
        if(sorting){
            DOMAnimations.slideUp(sorting.querySelector('[data-custom-select-summary]'), 300);
            
        }

    }
    if (event.keyCode == 13 || event.keyCode == 32){
       if(document.querySelector("#filterFormdropdown")){
        return false;
       } 
    }
});

class cardsSlider extends HTMLElement {
    constructor() {
        super();
        const cardsMainCarousels = this.querySelectorAll("[data-main-carousel]");
        const cardsSecondaryCarousels = this.querySelector("[data-secondary-carousel-list]");

        cardsMainCarousels.forEach(cardsMainCarousel => {
            const carouselList = cardsMainCarousel.querySelector("[data-cards-main-carousel-list]");
            const carouselListItems = carouselList.querySelectorAll("[data-cards-main-carousel-list-item]");
            const carouselNavigationBtns = cardsMainCarousel.querySelectorAll("[data-cards-main-carousel-navigation] > button");
            const carouselNavigationNext = cardsMainCarousel.querySelector("[data-cards-main-carousel-navigation] > .next");

            carouselListItems[0].classList.add("active");
            carouselListItems[1].classList.add("next-card");
            carouselListItems[carouselListItems.length - 1].classList.add("prev-card");

             var secondaryListItems = cardsSecondaryCarousels.querySelectorAll("li");
            secondaryListItems.length == 2 && secondaryListItems[0].classList.add("next-card"),
            secondaryListItems.length >= 2 && secondaryListItems[1].classList.add("active"),
            secondaryListItems.length >= 3 && secondaryListItems[2].classList.add("next-card"),

            carouselNavigationBtns.forEach(direction => {
                direction.addEventListener("click", e => {
                    e.preventDefault();
                    this.changeSlide(direction, carouselListItems, cardsSecondaryCarousels);
                });
            });

            this.addSwipeEvents(cardsMainCarousel, carouselListItems, cardsSecondaryCarousels);
        });
    }

    changeSlide(direction, carouselListItems, cardsSecondaryCarousels) {
        const carouselItemsLength = carouselListItems.length;
        let itemIndex = 0;
        let newItemIndex = 0;

        carouselListItems.forEach((item, index) => {
            item.classList.remove("prev-card", "next-card", "previously-active");
            if (item.classList.contains("active")) {
                itemIndex = index;
                item.classList.remove("active");
                item.classList.add("previously-active");
            }
        });

        newItemIndex = direction.classList.contains("prev") 
            ? (itemIndex === 0 ? carouselItemsLength - 1 : itemIndex - 1) 
            : (carouselItemsLength === itemIndex + 1 ? 0 : itemIndex + 1);

        // Update classes for next and prev cards
        this.updateClasses(carouselListItems, newItemIndex);
        this.updateSecondaryItems(newItemIndex, cardsSecondaryCarousels, carouselItemsLength);

        // Remove previously-active class after animation
        setTimeout(() => {
            carouselListItems.forEach(item => item.classList.remove("previously-active"));
            cardsSecondaryCarousels.querySelectorAll("li").forEach(item => item.classList.remove("previously-active"));
        }, 1000);
    }

    updateClasses(carouselListItems, newItemIndex) {
        const carouselItemsLength = carouselListItems.length;

        carouselListItems[newItemIndex].classList.add("active");
        carouselListItems[newItemIndex - 1 < 0 ? carouselItemsLength - 1 : newItemIndex - 1].classList.add("prev-card");
        carouselListItems[newItemIndex + 1 >= carouselItemsLength ? 0 : newItemIndex + 1].classList.add("next-card");
    }

    updateSecondaryItems(newItemIndex, cardsSecondaryCarousels, carouselItemsLength) {
       const secondaryListItems = cardsSecondaryCarousels.querySelectorAll("li");
     secondaryListItems.forEach( (item, index) => {
                        item.classList.remove("prev-card"),
                        item.classList.remove("next-card"),
                        item.classList.remove("previously-active"),
                        item.classList.contains("active") && (item.classList.remove("active"),
                        item.classList.add("previously-active"))
                    }
                    );
                    var newSecondaryItemIndex = newItemIndex + 1;
                    newItemIndex == carouselItemsLength - 1 && (newSecondaryItemIndex = 0),
                    newSecondaryItemIndex == carouselItemsLength - 1 ? (secondaryListItems[0].classList.add("next-card"),
                    secondaryListItems[newSecondaryItemIndex - 1].classList.add("prev-card")) : newSecondaryItemIndex == 0 ? (secondaryListItems[carouselItemsLength - 1].classList.add("prev-card"),
                    secondaryListItems[newSecondaryItemIndex + 1].classList.add("next-card")) : (secondaryListItems[newSecondaryItemIndex - 1].classList.add("prev-card"),
                    secondaryListItems[newSecondaryItemIndex + 1].classList.add("next-card")),
                    secondaryListItems[newSecondaryItemIndex].classList.add("active"),
                    setTimeout( () => {
                     
                        secondaryListItems.forEach( (item, index) => {
                            item.classList.remove("previously-active")
                        }
                        )
                    }
                    , 1000)
}


  addSwipeEvents(element, carouselListItems, cardsSecondaryCarousels) {
    let startX;
    let isMoving = false;

    element.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        isMoving = false; // Reset moving state
    });

    element.addEventListener("touchmove", (e) => {
        const moveX = e.touches[0].clientX;
        if (!isMoving) {
            if (startX - moveX > 50) {
                this.changeSlide(element.querySelector(".next"), carouselListItems, cardsSecondaryCarousels);
                isMoving = true; // Set moving state
            } else if (moveX - startX > 50) {
                this.changeSlide(element.querySelector(".prev"), carouselListItems, cardsSecondaryCarousels);
                isMoving = true; // Set moving state
            }
        }
    });


    element.addEventListener("touchend", (e) => {
        if (isMoving) {
            e.preventDefault(); 
        }
    });
}

}
customElements.define("cards-slider", cardsSlider);

let subscribers = {};

function subscribe(eventName, callback) {
  if (subscribers[eventName] === undefined) {
    subscribers[eventName] = [];
  }

  subscribers[eventName] = [...subscribers[eventName], callback];

  return function unsubscribe() {
    subscribers[eventName] = subscribers[eventName].filter((cb) => {
      return cb !== callback;
    });
  };
}
function fetchConfig(type = 'json') {
    return {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: `application/${type}` },
    };
  }

function publish(eventName, data) {
  if (subscribers[eventName]) {
    subscribers[eventName].forEach((callback) => {
      callback(data);
    });
  }
}
const ON_CHANGE_DEBOUNCE_TIMER = 300;

const PUB_SUB_EVENTS = {
    cartUpdate: 'cartUpdate',
    quantityUpdate: 'quantityUpdate',
    variantChange: 'variantChange',
    cartError: 'cartError',
    facetUpdate: 'facetUpdate',
    quantityRules: 'quantityRules',
    quantityBoundries: 'quantityBoundries',
    optionValueSelectionChange: 'optionValueSelectionChange',
};
 class ProductInfo extends HTMLElement {
      quantityInput = undefined;
      quantityForm = undefined;
      onVariantChangeUnsubscriber = undefined;
      cartUpdateUnsubscriber = undefined;
      abortController = undefined;
      pendingRequestUrl = null;
      preProcessHtmlCallbacks = [];
      postProcessHtmlCallbacks = [];

      constructor() {
        super();

        this.quantityInput = this.querySelector('.quantity-input');
      }

      connectedCallback() {
        this.section = this.closest('section');
        this.initializeProductSwapUtility();

        this.onVariantChangeUnsubscriber = subscribe(
          PUB_SUB_EVENTS.optionValueSelectionChange,
          this.handleOptionValueChange.bind(this)
        );

        this.initQuantityHandlers();
        sideDrawerInt();
        this.dispatchEvent(new CustomEvent('product-info:loaded', { bubbles: true }));

          if(this.section){
            let sliders = this.section.querySelectorAll("[data-slick]");
            Array.from(sliders).forEach(function(slider, index) {
                slickSlider($(slider));          
            });
          }
      }

      addPreProcessCallback(callback) {
        this.preProcessHtmlCallbacks.push(callback);
      }

      initQuantityHandlers() {
        if (!this.quantityInput) return;
        this.quantityForm = this.querySelector('[data-qty-wrapper]');
        if (!this.quantityForm) return;
        this.setQuantityBoundries();
        if (!this.dataset.originalSection) {
          this.cartUpdateUnsubscriber = subscribe(PUB_SUB_EVENTS.cartUpdate, this.fetchQuantityRules.bind(this));
        }
      }

      disconnectedCallback() {
        this.onVariantChangeUnsubscriber();
        this.cartUpdateUnsubscriber?.();
      }

      initializeProductSwapUtility() {
        this.preProcessHtmlCallbacks.push((html) =>
          html.querySelectorAll('.scroll-trigger').forEach((element) => element.classList.add('scroll-trigger--cancel'))
        );
        this.postProcessHtmlCallbacks.push((newNode) => {
          window?.Shopify?.PaymentButton?.init();
          window?.ProductModel?.loadShopifyXR();
        });
      }

      handleOptionValueChange({ data: { event, target, selectedOptionValues } }) {
      
        if (!this.contains(event.target)) return;
      
        const isStickyProduct = this.sectionId === 'sticky-product';
        const currentScroll = window.scrollY;
      
        this.resetProductFormState();
      
        const productUrl = target.dataset.productUrl || this.pendingRequestUrl || this.dataset.url;
        this.pendingRequestUrl = productUrl;
      
        const shouldSwapProduct = this.dataset.url !== productUrl;
        const shouldFetchFullPage = this.dataset.updateUrl === 'true' && shouldSwapProduct;
      
        const restoreScroll = () => {
          if (isStickyProduct) {
            const stickyWrapper = document.querySelector('[data-sticky-products-wrapper]');
            if (stickyWrapper) {
            stickyWrapper.classList.add('show');
            } 
          }
        };
      
        this.renderProductInfo({
          requestUrl: this.buildRequestUrlWithParams(productUrl, selectedOptionValues, shouldFetchFullPage),
          targetId: target.id,
          callback: (html) => {
            const baseCallback = shouldSwapProduct
              ? this.handleSwapProduct(productUrl, shouldFetchFullPage)
              : this.handleUpdateProductInfo(productUrl);
      
            baseCallback(html);
            restoreScroll(); 
          },
        });
      }
      

      resetProductFormState() {
        const productForm = this.productForm;
        productForm?.toggleSubmitButton(true);
        productForm?.handleErrorMessage();
      }

      handleSwapProduct(productUrl, updateFullPage) {
        return (html) => {
          this.productModal?.remove();

           const selector = updateFullPage ? "product-info[id^='product-info']" : 'product-info';
          const variant = this.getSelectedVariant(html.querySelector(selector));
          this.updateURL(productUrl, variant?.id);

          if (updateFullPage) {
            document.querySelector('head title').innerHTML = html.querySelector('head title').innerHTML;

            HTMLUpdateUtility.viewTransition(
              document.querySelector('main'),
              html.querySelector('main'),
              this.preProcessHtmlCallbacks,
              this.postProcessHtmlCallbacks
            );
          } else {
            HTMLUpdateUtility.viewTransition(
              this,
              html.querySelector('product-info'),
              this.preProcessHtmlCallbacks,
              this.postProcessHtmlCallbacks
            );
          }
        };
      }

      renderProductInfo({ requestUrl, targetId, callback }) {
        this.abortController?.abort();
        this.abortController = new AbortController();

        fetch(requestUrl, { signal: this.abortController.signal })
          .then((response) => response.text())
          .then((responseText) => {
            this.pendingRequestUrl = null;
            const html = new DOMParser().parseFromString(responseText, 'text/html');
            callback(html);
          })
          .then(() => {
       
            if(targetId){
                document.querySelector(`#${targetId}`)?.focus();
            }
           
          })
          .catch((error) => {
            if (error.name === 'AbortError') {
              console.log('Fetch aborted by user');
            } else {
              console.error(error);
            }
          });
      }

      getSelectedVariant(productInfoNode) {
        const selectedVariant = productInfoNode.querySelector('variant-selects [data-selected-variant]')?.innerHTML;
        return !!selectedVariant ? JSON.parse(selectedVariant) : null;
      }

      buildRequestUrlWithParams(url, optionValues, shouldFetchFullPage = false) {
        const params = [];

        !shouldFetchFullPage && params.push(`section_id=${this.sectionId}`);

        if (optionValues.length) {
          params.push(`option_values=${optionValues.join(',')}`);
        }

        return `${url}?${params.join('&')}`;
      }

      updateOptionValues(html) {
        const variantSelects = html.querySelector('variant-selects');
        if (variantSelects) {
          HTMLUpdateUtility.viewTransition(this.variantSelectors, variantSelects, this.preProcessHtmlCallbacks);
        }
      }

      handleUpdateProductInfo(productUrl) {
        
        return (html) => {
          const variant = this.getSelectedVariant(html);

          if(this.querySelector('[data-pickup-availability]'))
          {
              this.pickupAvailability(variant); 
          }
          console.log(this.querySelector('[data-variant-url]'),"wreewre");
          if(this.querySelector('[data-variant-url]'))
          {
            updateBackInStock(variant,this);
          }
          this.updateOptionValues(html);
          this.updateURL(productUrl, variant?.id);
          this.updateVariantInputs(variant?.id);

          if (!variant) {
            this.setUnavailable();
            return;
          }

          this.updateMedia(html, variant?.featured_media?.id);

          const updateSourceFromDestination = (id, shouldHide = (source) => false) => {
            const source = html.getElementById(`${id}-${this.sectionId}-${this.productId}`);
            const destination = this.querySelector(`#${id}-${this.dataset.section}-${this.productId}`);
            if (source && destination) {
              destination.innerHTML = source.innerHTML;
              destination.classList.toggle('hidden', shouldHide(source));
            }
          };

          updateSourceFromDestination('price');
          updateSourceFromDestination('sku');
          updateSourceFromDestination('product-inventory');
          updateSourceFromDestination('Volume');
          updateSourceFromDestination('Price-Per-Item');

          this.updateQuantityRules(this.sectionId, html);
          this.querySelector(`#Quantity-Rules-${this.dataset.section}-${this.productId}`)?.classList.remove('hidden');
          this.querySelector(`#Volume-Note-${this.dataset.section}-${this.productId}`)?.classList.remove('hidden');

          this.productForm?.toggleSubmitButton( html.getElementById(`ProductSubmitButton-${this.sectionId}-${this.productId}`)?.hasAttribute('disabled') ?? true,  window.variantStrings.soldOut );

          publish(PUB_SUB_EVENTS.variantChange, {
            data: {
              sectionId: this.sectionId,
              html,
              variant,
            },
          });
          
        };
      } 

      updateVariantInputs(variantId) {
       
        this.querySelectorAll(`#product-form-${this.sectionId}-${this.productId}, #ProductFormInstallment-${this.sectionId}-${this.productId}`,'product-form-sticky-product'
        ).forEach((productForm) => {
          const input = productForm.querySelector('input[name="id"]');

          input.value = variantId ?? '';
          input.dispatchEvent(new Event('change', { bubbles: true }));
        });
      }

      pickupAvailability(variant) {
        let pickupSection = this.querySelector('[data-pickup-availability]');
        let pickupContent = this.querySelector('[data-pickup-availability-content]');
        let pickupDrawer = this.querySelector('[data-pickup-location-list]');
        if (pickupSection) {
            if (variant != undefined && variant.available == true) {
                var rootUrl = pickupSection.dataset.rootUrl;
                var variantId = variant.id;
                if (!rootUrl.endsWith("/")) {
                    rootUrl = rootUrl + "/";
                }
                var variantSectionUrl = `${rootUrl}variants/${variantId}/?section_id=pickup-availability`;
        
                fetch(variantSectionUrl)
                    .then((response) => response.text())
                    .then((text) => {
                        
                        if(pickupDrawer && pickupDrawer.classList.contains('slick-initialized')){
                            $(pickupDrawer).slick('unslick');
                        }
                        var pickupAvailabilityHTML = new DOMParser().parseFromString(text, "text/html").querySelector(".shopify-section");
                        let currentVariantPickupContent = pickupAvailabilityHTML.querySelector('[data-pickup-availability-content]');
                        let currentVariantPickuplist = pickupAvailabilityHTML.querySelector('[data-pickup-location-list]');
                        pickupContent.innerHTML = currentVariantPickupContent ? currentVariantPickupContent.innerHTML : '';
                        pickupDrawer.innerHTML = currentVariantPickuplist ? currentVariantPickuplist.innerHTML : '';
                        if (currentVariantPickupContent.innerHTML != '') {
                            pickupSection.setAttribute('available', '')
                        } else {
                            pickupSection.removeAttribute('available')
                        }
                        if(pickupDrawer){ 
                            slickSlider($(pickupDrawer))
                        }
                        // sideDrawerEventsInit(parentSection)
                        sideDrawerInt(); 
                        
                    })
                    .catch((e) => {});
            } else {
                pickupContent.innerHTML = '';
                pickupDrawer.innerHTML = '';
                pickupSection.removeAttribute('available')
            } 
        }
      }

      updateURL(url, variantId) {
        this.querySelector('share-button')?.updateUrl(
          `${window.shopUrl}${url}${variantId ? `?variant=${variantId}` : ''}`
        );

        if (this.dataset.updateUrl === 'false') return;
        window.history.replaceState({}, '', `${url}${variantId ? `?variant=${variantId}` : ''}`);
      }

      setUnavailable() {
        this.productForm?.toggleSubmitButton(true, window.variantStrings.unavailable);

        const selectors = ['price', 'product-inventory', 'sku', 'Price-Per-Item', 'Volume-Note', 'Volume', 'Quantity-Rules']
          .map((id) => `#${id}-${this.dataset.section}`)
          .join(', ');
        document.querySelectorAll(selectors).forEach(({ classList }) => classList.add('hidden'));
      }

     updateMedia(parsedHTML, variantFeaturedMediaId) {
    
        if (!variantFeaturedMediaId) return; 
    
        let variantMediaId = variantFeaturedMediaId;
          let variantMedia = this.querySelector('#productMedia-' + variantMediaId);
          let mediaParent = this.querySelector('[data-product-main-media]');
        if (variantMedia && mediaParent) {
            if (mediaParent.classList.contains('slick-initialized')) {
                let slickIndex = variantMedia.closest(".slick-slide").getAttribute("data-slick-index");
                let slider = $(mediaParent)
                slider.slick('slickGoTo', slickIndex);
            } else {
                let childCount = mediaParent.children.length;
                let firstChild = mediaParent.firstChild;
                if (childCount > 1) {
                    mediaParent.insertBefore(variantMedia, firstChild)
                }
            }
    
        }
    
    }

      setQuantityBoundries() {
        const data = {
          cartQuantity: this.quantityInput.dataset.cartQuantity ? parseInt(this.quantityInput.dataset.cartQuantity) : 0,
          min: this.quantityInput.dataset.min ? parseInt(this.quantityInput.dataset.min) : 1,
          max: this.quantityInput.dataset.max ? parseInt(this.quantityInput.dataset.max) : null,
          step: this.quantityInput.step ? parseInt(this.quantityInput.step) : 1,
        };

        let min = data.min;
        const max = data.max === null ? data.max : data.max - data.cartQuantity;
        if (max !== null) min = Math.min(min, max);
        if (data.cartQuantity >= data.min) min = Math.min(min, data.step);

        this.quantityInput.min = min;

        if (max) {
          this.quantityInput.max = max;
        } else {
          this.quantityInput.removeAttribute('max');
        }
        this.quantityInput.value = min;

        publish(PUB_SUB_EVENTS.quantityUpdate, undefined);
      }

      fetchQuantityRules() {
        const currentVariantId = this.productForm?.variantIdInput?.value;
        if (!currentVariantId) return;
        return fetch(`${this.dataset.url}?variant=${currentVariantId}&section_id=${this.dataset.section}`)
          .then((response) => response.text())
          .then((responseText) => {
            const html = new DOMParser().parseFromString(responseText, 'text/html');
            this.updateQuantityRules(this.dataset.section, html);
          })
          .catch((e) => console.error(e))
          .finally(() => {});
      }

      updateQuantityRules(sectionId, html) {
        if (!this.quantityInput) return;
        this.setQuantityBoundries();

        const quantityFormUpdated = html.getElementById(`Quantity-Form-${sectionId}-${this.productId}`);
        const selectors = ['.quantity-input'];
        for (let selector of selectors) {
          const current = this.quantityForm.querySelector(selector);
          const updated = quantityFormUpdated.querySelector(selector);
          if (!current || !updated) continue;
          if (selector === '.quantity-input') {
            const attributes = ['data-cart-quantity', 'data-min', 'data-max', 'step'];
            for (let attribute of attributes) {
              const valueUpdated = updated.getAttribute(attribute);
              if (valueUpdated !== null) {
                current.setAttribute(attribute, valueUpdated);
              } else {
                current.removeAttribute(attribute);
              }
            }
          } else {
            current.innerHTML = updated.innerHTML;
          }
        }
      }

      get productForm() {
        return this.querySelector(`product-form`);
      }

      get productModal() {
        return document.querySelector(`#ProductModal-${this.dataset.section}`);
      }

      get variantSelectors() {
        return this.querySelector('variant-selects');
      }
      get quickOrderList() {
        const quickOrderListSectionId = SectionId.getIdForSection(
          SectionId.parseId(this.sectionId),
          'quick_order_list'
        );
        return document.querySelector(`quick-order-list[data-id^="${quickOrderListSectionId}"]`);
      }

      get sectionId() {
        return this.dataset.originalSection || this.dataset.section;
      }
       get productId() {
          return this.getAttribute('data-product-id');
      }
    }
customElements.define('product-info', ProductInfo);


class VariantSelects extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.addEventListener('change', (event) => {
      const inputElement = this.getInputForEventTarget(event.target);
      this.updateSelectionMetadata(event.target);
      // Fire pub/sub event
      publish(PUB_SUB_EVENTS.optionValueSelectionChange, {
        data: {
          event,
          target: inputElement,
          selectedOptionValues: this.selectedOptionValues,
        },
      });

      // Optional: Also dispatch a native CustomEvent
      this.dispatchEvent(new CustomEvent('variant-change', {
        bubbles: true,
        detail: {
          selectedOptionValues: this.selectedOptionValues
        }
      }));
    });
  }

  updateSelectionMetadata(target) {
    if (target.tagName === 'SELECT' && target.selectedOptions.length) {
      const previouslySelected = Array.from(target.options).find(option =>
        option.hasAttribute('selected')
      );
      if (previouslySelected) {
        previouslySelected.removeAttribute('selected');
      }
      target.selectedOptions[0].setAttribute('selected', '');
    }
  }

  getInputForEventTarget(target) {
    return target.tagName === 'SELECT' ? target.selectedOptions[0] : target;
  }

  get selectedOptionValues() {
    return Array.from(this.querySelectorAll('select option[selected], fieldset input:checked'))
      .map((element) => element.getAttribute('data-option-value-id'));
  }
}

customElements.define('variant-selects', VariantSelects);


class ProductForm extends HTMLElement {
      constructor() {
        super();
        this.section = this.closest('section');
        this.form = this.querySelector('form');
        if(!this.form) return;
        this.variantIdInput.disabled = false;
        this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
        this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
        this.submitButton = this.querySelector('[type="submit"]');
        this.submitButtonText = this.submitButton.querySelector('span');
        if (document.querySelector('cart-drawer')) this.submitButton.setAttribute('aria-haspopup', 'dialog');
        this.hideErrors = this.dataset.hideErrors === 'true';
      }

      onSubmitHandler(evt) {
        evt.preventDefault();
        this.handleErrorMessage();
         if (this.submitButton) {
          this.submitButton.classList.add('loading');
        }
        const config = fetchConfig('javascript');
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
        delete config.headers['Content-Type'];

        const formData = new FormData(this.form);
        if (this.cart) {
          formData.append(
            'sections',
            this.cart.getSectionsToRender().map((section) => section.id)
          );
          formData.append('sections_url', window.location.pathname);
          this.cart.setActiveElement(document.activeElement);
        }
        config.body = formData;

        fetch(`${routes.cart_add_url}`, config)
          .then((response) => response.json())
          .then((response) => {
            if (response.status) {
              publish(PUB_SUB_EVENTS.cartError, {
                source: 'product-form',
                productVariantId: formData.get('id'),
                errors: response.errors || response.description,
                message: response.message,
              });
              this.handleErrorMessage(response.description);

              const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
              if (!soldOutMessage) return;
              soldOutMessage.classList.remove('hidden');
              this.error = true;
              return;
            } else if (!this.cart) {
              window.location = window.routes.cart_url;
              return;
            }

            if (!this.error)
              publish(PUB_SUB_EVENTS.cartUpdate, {
                source: 'product-form',
                productVariantId: formData.get('id'),
                cartData: response,
              });
            this.error = false;
            this.cart.renderContents(response);   
            cartDrawerNoteInit();
          
          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
             this.submitButton.classList.remove('loading');
            if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');

          });
      }

       handleErrorMessage(errorMessage = false) {
          this.errorMessageWrapper = this.querySelector('[data-error-text]');
          if (!this.errorMessageWrapper) return;
          this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);
    
          if (this.errorMessageWrapper && errorMessage != false) {
            this.errorMessageWrapper.textContent = errorMessage;
            this.errorMessageWrapper.style.display= 'block';
          }else{
            this.errorMessageWrapper.style.display= 'none';
          }
        }

     toggleSubmitButton(disable = false, text, unavailable = false,test) {
      if (!this.submitButton) return;
      // Remove any previous attributes
      this.submitButton.removeAttribute('loading');
      this.submitButton.removeAttribute('unavailable');
      const submitButtonText = this.submitButton.querySelector('[data-submit-button]');
      const submitButtonTextChild = this.submitButton.querySelector('[data-submit-button] span');
      if (disable) {
        this.submitButton.setAttribute('disabled', '');
        if (unavailable) this.submitButton.setAttribute('unavailable', '');

        if (text && submitButtonText) {
          console.log(text,submitButtonText);
          submitButtonText.textContent = text;
        } else {
          this.submitButton.setAttribute('loading', '');
        }
      } else {
        this.submitButton.removeAttribute('disabled');
        const defaultText =
          this.submitButton.getAttribute('data-pre-order') === 'true'
            ? window.variantStrings.preOrder
            : window.variantStrings.addToCart;
        if(submitButtonText){
            submitButtonText.textContent = defaultText;
        }
        
      }
    }

      get variantIdInput() {
        return this.querySelector('[name="id"]');
      }
    }
  customElements.define('product-form', ProductForm);
class QuantityInput extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector('input');
    this.changeEvent = new Event('change', { bubbles: true });
    this.input.addEventListener('change', this.onInputChange.bind(this));
    this.querySelectorAll('button').forEach((button) =>
      button.addEventListener('click', this.onButtonClick.bind(this))
    );
  }

  quantityUpdateUnsubscriber = undefined;

  connectedCallback() {
    this.validateQtyRules();
    this.quantityUpdateUnsubscriber = subscribe(PUB_SUB_EVENTS.quantityUpdate, this.validateQtyRules.bind(this));
  }

  disconnectedCallback() {
    if (this.quantityUpdateUnsubscriber) {
      this.quantityUpdateUnsubscriber();
    }
  }

  onInputChange(event) {
    this.validateQtyRules();
  }

  onButtonClick(event) {
    event.preventDefault();
    const previousValue = this.input.value;
    if (event.currentTarget.name === 'plus') {
      if (parseInt(this.input.dataset.min) > parseInt(this.input.step) && this.input.value == 0) {
        this.input.value = this.input.dataset.min;
      } else {
        this.input.stepUp();
      }
    } else {
      this.input.stepDown();
    }

    if (previousValue !== this.input.value) this.input.dispatchEvent(this.changeEvent);

    if (this.input.dataset.min === previousValue && event.currentTarget.name === 'minus') {
      this.input.value = parseInt(this.input.min);
    }
  }

  validateQtyRules() {
    const value = parseInt(this.input.value);
    if (this.input.min) {
      const buttonMinus = this.querySelector(".quantity-button[name='minus']");
      buttonMinus.classList.toggle('disabled', parseInt(value) <= parseInt(this.input.min));
    }
    if (this.input.max) {
      const max = parseInt(this.input.max);
      const buttonPlus = this.querySelector(".quantity-button[name='plus']");
      buttonPlus.classList.toggle('disabled', value >= max);
    }
  }
}

customElements.define('quantity-input', QuantityInput);

class CartDrawer extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    this.querySelectorAll('[data-sidedrawer-close]').forEach((el) => {
      el.addEventListener('click', this.close.bind(this));
    });
    this.setHeaderCartIconAccessibility();
  }

  setHeaderCartIconAccessibility() {
     const cartLink = document.querySelector('[href="#cart-side-drawer"]');
    if (!cartLink) return;

    cartLink.setAttribute('role', 'button');
    cartLink.setAttribute('aria-haspopup', 'dialog');
    cartLink.addEventListener('click', (event) => {
      event.preventDefault();
      this.open(cartLink);
    });
    cartLink.addEventListener('keydown', (event) => {
      if (event.code.toUpperCase() === 'SPACE') {
        event.preventDefault();
        this.open(cartLink);
      }
    });
  }

  open(triggeredBy) {
    if (triggeredBy) this.setActiveElement(triggeredBy);

  const cartDrawerNote = this.querySelector('[id^="Details-"] summary');
  if (cartDrawerNote && !cartDrawerNote.hasAttribute('role')) {
    this.setSummaryAccessibility(cartDrawerNote);
  }

  const quickviewWrapper = document.querySelector('[data-quickview-content-wrapper]');
  
  if (quickviewWrapper && quickviewWrapper.classList.contains('show')) {
    quickviewWrapper.classList.remove('show');
    setTimeout(() => {
      quickviewWrapper.style.display = 'none';
    }, 300); 
  }
    setTimeout(() => {
      this.style.display = 'flex'; 
    }, 400);
    setTimeout(() => {
      this.classList.add('show');
    }, 450);

      let cartCount = document.querySelector('[data-cart-content]').getAttribute('data-item-count');
      cartCountUpdate(cartCount);

    // this.addEventListener(
    //   'transitionend',
    //   () => {
    //     const containerToTrapFocusOn = this.classList.contains('is-empty')
    //       ? this.querySelector('.drawer__inner-empty')
    //       : document.getElementById('CartDrawer');
    //     const focusElement = this.querySelector('.drawer__inner') || this.querySelector('.drawer__close');
    //     trapFocus(containerToTrapFocusOn, focusElement);
    //   },
    //   { once: true }
    // );

    document.body.classList.add('overflow-hidden');
  }

  close() {
     setTimeout(() => {
        this.style.display = 'none';
    }, 500)
    setTimeout(() => {
        this.classList.remove('show');
    }, 300);
    document.body.classList.remove('overflow-hidden');
  }

  setSummaryAccessibility(cartDrawerNote) {
    cartDrawerNote.setAttribute('role', 'button');
    cartDrawerNote.setAttribute('aria-expanded', 'false');

    if (cartDrawerNote.nextElementSibling.getAttribute('id')) {
      cartDrawerNote.setAttribute('aria-controls', cartDrawerNote.nextElementSibling.id);
    }

    cartDrawerNote.addEventListener('click', (event) => {
      event.currentTarget.setAttribute('aria-expanded', !event.currentTarget.closest('details').hasAttribute('open'));
    });

    cartDrawerNote.parentElement.addEventListener('keyup', onKeyUpEscape);
  }

  renderContents(parsedState) {
    this.querySelector('.drawer__inner').classList.contains('is-empty') &&
      this.querySelector('.drawer__inner').classList.remove('is-empty');
    this.productId = parsedState.id;
    this.getSectionsToRender().forEach((section) => {
      const sectionElement = section.selector
        ? document.querySelector(section.selector)
        : document.getElementById(section.id);

      if (!sectionElement) return;
      sectionElement.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
    });

    setTimeout(() => {
       this.querySelectorAll('[data-sidedrawer-close]').forEach((el) => {
      el.addEventListener('click', this.close.bind(this));
    });
      this.open();
    });
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector).innerHTML;
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-drawer',
        selector: '#CartDrawer',
      }
    ];
  }

  getSectionDOM(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector);
  }

  setActiveElement(element) {
    this.activeElement = element;
  }
}

customElements.define('cart-drawer', CartDrawer);

class CartRemoveButton extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('click', (event) => {
      event.preventDefault();
      const cartItems = this.closest('cart-items') || this.closest('cart-drawer-items');
      cartItems.updateQuantity(this.dataset.index, 0, event);
    });
  }
}

customElements.define('cart-remove-button', CartRemoveButton);

class CartItems extends HTMLElement {
  constructor() {
    super();
    this.lineItemStatusElement =
      document.getElementById('shopping-cart-line-item-status') || document.getElementById('CartDrawer-LineItemStatus');

    const debouncedOnChange = debounce((event) => {
      this.onChange(event);
    }, 300);

    this.addEventListener('change', debouncedOnChange.bind(this));
  }

  cartUpdateUnsubscriber = undefined;

  connectedCallback() {
    this.cartUpdateUnsubscriber = subscribe(PUB_SUB_EVENTS.cartUpdate, (event) => {
      if (event.source === 'cart-items') {
        return;
      }
      return this.onCartUpdate();
    });
  }

  disconnectedCallback() {
    if (this.cartUpdateUnsubscriber) {
      this.cartUpdateUnsubscriber();
    }
  }

  resetQuantityInput(id) {
    const input = this.querySelector(`#Quantity-${id}`);
    input.value = input.getAttribute('value');
    this.isEnterPressed = false;
  }

  setValidity(event, index, message) {
    event.target.setCustomValidity(message);
    event.target.reportValidity();
    this.resetQuantityInput(index);
    event.target.select();
  }

  validateQuantity(event) {
    const inputValue = parseInt(event.target.value);
    const index = event.target.dataset.index;
    let message = '';

    if (inputValue < event.target.dataset.min) {
      message = window.quickOrderListStrings.min_error.replace('[min]', event.target.dataset.min);
    } else if (inputValue > parseInt(event.target.max)) {
      message = window.quickOrderListStrings.max_error.replace('[max]', event.target.max);
    } else if (inputValue % parseInt(event.target.step) !== 0) {
      message = window.quickOrderListStrings.step_error.replace('[step]', event.target.step);
    }

    if (message) {
      this.setValidity(event, index, message);
    } else {
      event.target.setCustomValidity('');
      event.target.reportValidity();
      this.updateQuantity(
        index,
        inputValue,
        event,
        document.activeElement.getAttribute('name'),
        event.target.dataset.quantityVariantId
      );
    }
  }

  onChange(event) {
    this.validateQuantity(event);
  }

  onCartUpdate() {
    if (this.tagName === 'CART-DRAWER-ITEMS') {
      return fetch(`${routes.cart_url}?section_id=cart-drawer`)
        .then((response) => response.text())
        .then((responseText) => {
          const html = new DOMParser().parseFromString(responseText, 'text/html');
          const selectors = ['cart-drawer-items', 'cart-drawer-footer'];
          for (const selector of selectors) {
            const targetElement = document.querySelector(selector);
            const sourceElement = html.querySelector(selector);
            if (targetElement && sourceElement) {
              targetElement.replaceWith(sourceElement);
            }
          }
        })
        .catch((e) => {
          console.error(e);
        });
    } else {
      return fetch(`${routes.cart_url}?section_id=main-cart-items`)
        .then((response) => response.text())
        .then((responseText) => {
          const html = new DOMParser().parseFromString(responseText, 'text/html');
          const sourceQty = html.querySelector('cart-items');
          this.innerHTML = sourceQty.innerHTML;
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }

  getSectionsToRender() {
    return [
      {
        id: 'main-cart-items',
        section: document.getElementById('main-cart-items').dataset.id,
        selector: '.js-contents',
      },
      {
        id: 'main-cart-footer',
        section: document.getElementById('main-cart-footer').dataset.id,
        selector: '.main-cart-summary-price',
      }
    ];
  }

  updateQuantity(line, quantity, event, name, variantId) {
   
    const body = JSON.stringify({
      line,
      quantity,
      sections: this.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname,
    });
    fetch(`${routes.cart_change_url}`, { ...fetchConfig(), ...{ body } })
      .then((response) => {
        return response.text();
      })
      .then((state) => {
        const parsedState = JSON.parse(state);
          const quantityElement = document.getElementById(`Quantity-${line}`) || document.getElementById(`drawer-quantity-${line}`);
          const items = document.querySelectorAll('[data-cart-item]');          
          if (parsedState.errors) {
            quantityElement.value = quantityElement.getAttribute('value');
            this.updateLiveRegions(line, parsedState.errors);
            return;
          }
          this.classList.toggle('is-empty', parsedState.item_count === 0);
          const cartDrawerWrapper = document.querySelector('cart-drawer') || document.querySelector('cart-items');
          if (cartDrawerWrapper) cartDrawerWrapper.classList.toggle('is-empty', parsedState.item_count === 0);
          this.getSectionsToRender().forEach((section) => {
            const elementToReplace = document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);
            elementToReplace.innerHTML = this.getSectionInnerHTML( parsedState.sections[section.section], section.selector );
          });
         

        let cartCount = document.querySelector('[data-cart-content]').getAttribute('data-item-count');
      cartCountUpdate(cartCount);
          let itemCount = parseInt(cartDrawerWrapper.querySelector('[data-cart-content]').dataset.itemCount);
          let totalPrice = parseInt(cartDrawerWrapper.querySelector('[data-cart-content]').dataset.cartTotalPrice);
          if (freeShippingBarStatus) {
          setTimeout(() => {
            freeShippingBar(totalPrice, itemCount);
          }, 300); // delay in milliseconds (300ms = 0.3 seconds)
          let slider = cartDrawerWrapper.querySelector("[data-slick]");
            if (slider) {
                let sliderId = slider.getAttribute("id");
                if (!slider.classList.contains("slick-initialized")) {
                    slickSlider($("#" + sliderId));
                }
            }
        }
        
          const updatedValue = parsedState.items[line - 1] ? parsedState.items[line - 1].quantity : undefined;
          let message = '';
          if (items.length === parsedState.items.length && updatedValue !== parseInt(quantityElement.value)) {
            if (typeof updatedValue === 'undefined') {
              message = window.cartStrings.error;
            } else {
              message = window.cartStrings.quantityError.replace('[quantity]', updatedValue);
            }
          } 
          this.updateLiveRegions(line, message);
        publish(PUB_SUB_EVENTS.cartUpdate, { source: 'cart-items', cartData: parsedState, variantId: variantId });
      })
      .catch(() => {
        const errors = document.getElementById('cart-errors') || document.getElementById('CartDrawer-CartErrors');
        errors.textContent = window.cartStrings.error;
      })
      .finally(() => {
        console.log("finish");
      });
  }

  updateLiveRegions(line, message) {  
    const lineItemError =
      document.getElementById(`Line-item-error-${line}`) || document.getElementById(`drawer-error-${line}`);
    if (lineItemError) lineItemError.textContent = message;
  }

  getSectionInnerHTML(html, selector) {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector).innerHTML;
  }
}

customElements.define('cart-items', CartItems);

class CartDrawerItems extends CartItems {
  getSectionsToRender() {
    return [
      {
        id: 'CartDrawer', 
        section: 'cart-drawer',
        selector: '.drawer__inner',
      },
      {
        id: 'CartDrawer',
        section: 'cart-drawer',
        selector: '.cart-summary-price',
      }
    ];
  }
}

customElements.define('cart-drawer-items', CartDrawerItems);
