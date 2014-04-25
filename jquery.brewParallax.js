/* Copyright (c) 2014 The Brew Agency Ltd (http://www.brewagency.com)
 *
 * Author: Andrew Thomas
 * 
 * Version: 1.0.3
 *
 * Requires: jQuery 1.10.1 +, jquery.mousewheel.js, jquery.scrollTo-min.js
 *
 */

if(typeof($) == 'undefined') $ = jQuery;

$.fn.extend({

    brewParallax: function (options) {

        var defaults = {
            containerVelocity: -0.5,
            containerAnimation: 'background-position',
            containerParallax: true,
            innerElements: [],
            innerVelocities: [],
            innerAnimations: [],
            parallaxOffset: 0,
            onWaypoint: function () { },
            smoothScrolling: false,
            smoothScrollBody: false,
            scrollYVelocity: 500,
            scrollYSpeed: 800
        }

        options = $.extend(defaults, options);

        var $window = $(window);
        var container = this;
        var scrollTimer;
        var topPositions = [];

        $(container).each(function () {

            for (element in options.innerElements) {
                topPositions[element] = $(this).find(options.innerElements[element]).position().top;
            }

        });

        function update(evt) {

            parallaxScroll(0);

        }

        function parallaxScroll(animationDuration) {

            var pos = $window.scrollTop();
            var currentInnerElement = 0;
            $(container).each(function () {
                var $element = $(this);
                var offset = $element.offset().top + options.parallaxOffset;
                var height = $element.height();
                if (offset < pos && pos < (offset + height - options.parallaxOffset)) {

                    if (options.containerParallax) {

                        if (options.containerVelocity < 0) {

                            var yBackgroundPos = Math.round((pos - offset) * options.containerVelocity) + 'px';

                        }

                        else {

                            var yBackgroundPos = Math.round(height + (pos - offset) * options.containerVelocity) + 'px';

                        }

                        $(this).css(options.containerAnimation, 'center ' + yBackgroundPos);

                    }

                    for (var i = 0; i < options.innerElements.length; i++) {

                        currentInnerElement = i;

                        $(this).find(options.innerElements[i]).each(function (i) {

                            // initailise animation object
                            var animation = {};
                            var animationValue;
                            var animationType = options.innerAnimations[currentInnerElement];
                            if (animationType == 'top') {

                                animationValue = Math.round((pos - offset) * options.innerVelocities[currentInnerElement]) + topPositions[currentInnerElement] + 'px';

                            }

                            else if (animationType == 'opacityOut') {

                                animationValue = 1 - ((pos - offset) / height);
                                animationType = 'opacity';

                            }

                            else if (animationType == 'opacityIn') {

                                animationValue = 0 + ((pos - offset) / height);
                                animationType = 'opacity';

                            }

                            else {

                                animationValue = Math.round((pos - offset) * options.containerVelocity) + 'px';

                            }

                            animation[animationType] = animationValue;
                            $(this).stop().animate(animation, animationDuration);

                        });

                    }

                    options.onWaypoint.apply(this);

                }
            });

        }

        // throttle used to limit impact on client when monitoring scroll event
        function throttle(ms, callback) {
            var timer, lastCall = 0;

            return function () {
                var now = new Date().getTime(),
					diff = now - lastCall;
                if (diff >= ms) {
                    lastCall = now;
                    callback.apply(this, arguments);
                }
            };
        }

        $window.scroll(throttle(10, update));

        // normalise and smooth out mousewheel
        if (options.smoothScrolling) {

            if (typeof $('body').mousewheel == 'undefined') {

                if (window.console) {

                    console.warn('jquery.mousewheel.js is required for smooth scrolling');

                }

            }

            else if (typeof scrollTo == 'undefined') {

                if (window.console) {

                    console.warn('jquery.scrollTo-min.js is required for smooth scrolling');

                }

            }

            else {

                if (options.smoothScrollBody) {

                    scrollable = $('body');

                }

                else {

                    scrollable = this;

                }

                var scrolling = false;
                $(scrollable).mousewheel(function (event, delta) {

                    if (!scrolling) {

                        scrolling = true;
                        if (delta < 0) {
                            $('body').stop().scrollTo('+=' + options.scrollYVelocity, options.scrollYSpeed, function () { scrolling = false; });
                        }
                        else
                            $('body').stop().scrollTo('-=' + options.scrollYVelocity, options.scrollYSpeed, function () { scrolling = false; });

                    }

                    return false;
                });

            }

        }

        parallaxScroll(0);

    }

});