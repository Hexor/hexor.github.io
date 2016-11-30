/*!
 * fancyBox - jQuery Plugin
 * version: 2.1.5 (Fri, 14 Jun 2013)
 * requires jQuery v1.6 or later
 *
 * Examples at http://fancyapps.com/fancybox/
 * License: www.fancyapps.com/fancybox/#license
 *
 * Copyright 2012 Janis Skarnelis - janis@fancyapps.com
 *
 */

;(function (window, document, $, undefined) {
	&quot;use strict&quot;;

	var H = $(&quot;html&quot;),
		W = $(window),
		D = $(document),
		F = $.fancybox = function () {
			F.open.apply( this, arguments );
		},
		IE =  navigator.userAgent.match(/msie/i),
		didUpdate	= null,
		isTouch		= document.createTouch !== undefined,

		isQuery	= function(obj) {
			return obj &amp;&amp; obj.hasOwnProperty &amp;&amp; obj instanceof $;
		},
		isString = function(str) {
			return str &amp;&amp; $.type(str) === &quot;string&quot;;
		},
		isPercentage = function(str) {
			return isString(str) &amp;&amp; str.indexOf(&apos;%&apos;) &gt; 0;
		},
		isScrollable = function(el) {
			return (el &amp;&amp; !(el.style.overflow &amp;&amp; el.style.overflow === &apos;hidden&apos;) &amp;&amp; ((el.clientWidth &amp;&amp; el.scrollWidth &gt; el.clientWidth) || (el.clientHeight &amp;&amp; el.scrollHeight &gt; el.clientHeight)));
		},
		getScalar = function(orig, dim) {
			var value = parseInt(orig, 10) || 0;

			if (dim &amp;&amp; isPercentage(orig)) {
				value = F.getViewport()[ dim ] / 100 * value;
			}

			return Math.ceil(value);
		},
		getValue = function(value, dim) {
			return getScalar(value, dim) + &apos;px&apos;;
		};

	$.extend(F, {
		// The current version of fancyBox
		version: &apos;2.1.5&apos;,

		defaults: {
			padding : 15,
			margin  : 20,

			width     : 800,
			height    : 600,
			minWidth  : 100,
			minHeight : 100,
			maxWidth  : 9999,
			maxHeight : 9999,
			pixelRatio: 1, // Set to 2 for retina display support

			autoSize   : true,
			autoHeight : false,
			autoWidth  : false,

			autoResize  : true,
			autoCenter  : !isTouch,
			fitToView   : true,
			aspectRatio : false,
			topRatio    : 0.5,
			leftRatio   : 0.5,

			scrolling : &apos;auto&apos;, // &apos;auto&apos;, &apos;yes&apos; or &apos;no&apos;
			wrapCSS   : &apos;&apos;,

			arrows     : true,
			closeBtn   : true,
			closeClick : false,
			nextClick  : false,
			mouseWheel : true,
			autoPlay   : false,
			playSpeed  : 3000,
			preload    : 3,
			modal      : false,
			loop       : true,

			ajax  : {
				dataType : &apos;html&apos;,
				headers  : { &apos;X-fancyBox&apos;: true }
			},
			iframe : {
				scrolling : &apos;auto&apos;,
				preload   : true
			},
			swf : {
				wmode: &apos;transparent&apos;,
				allowfullscreen   : &apos;true&apos;,
				allowscriptaccess : &apos;always&apos;
			},

			keys  : {
				next : {
					13 : &apos;left&apos;, // enter
					34 : &apos;up&apos;,   // page down
					39 : &apos;left&apos;, // right arrow
					40 : &apos;up&apos;    // down arrow
				},
				prev : {
					8  : &apos;right&apos;,  // backspace
					33 : &apos;down&apos;,   // page up
					37 : &apos;right&apos;,  // left arrow
					38 : &apos;down&apos;    // up arrow
				},
				close  : [27], // escape key
				play   : [32], // space - start/stop slideshow
				toggle : [70]  // letter &quot;f&quot; - toggle fullscreen
			},

			direction : {
				next : &apos;left&apos;,
				prev : &apos;right&apos;
			},

			scrollOutside  : true,

			// Override some properties
			index   : 0,
			type    : null,
			href    : null,
			content : null,
			title   : null,

			// HTML templates
			tpl: {
				wrap     : &apos;<div class="fancybox-wrap" tabindex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>&apos;,
				image    : &apos;<img class="fancybox-image" src="{href}" alt="">&apos;,
				iframe   : &apos;<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen'="" +="" (ie="" ?="" '="" allowtransparency="true" :="" '')=""></iframe>&apos;,
				error    : &apos;<p class="fancybox-error">The requested content cannot be loaded.<br>Please try again later.</p>&apos;,
				closeBtn : &apos;<a title="Close" class="fancybox-item fancybox-close" href="javascript:;" target="_blank" rel="external"></a>&apos;,
				next     : &apos;<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;" target="_blank" rel="external"><span></span></a>&apos;,
				prev     : &apos;<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;" target="_blank" rel="external"><span></span></a>&apos;
			},

			// Properties for each animation type
			// Opening fancyBox
			openEffect  : &apos;fade&apos;, // &apos;elastic&apos;, &apos;fade&apos; or &apos;none&apos;
			openSpeed   : 250,
			openEasing  : &apos;swing&apos;,
			openOpacity : true,
			openMethod  : &apos;zoomIn&apos;,

			// Closing fancyBox
			closeEffect  : &apos;fade&apos;, // &apos;elastic&apos;, &apos;fade&apos; or &apos;none&apos;
			closeSpeed   : 250,
			closeEasing  : &apos;swing&apos;,
			closeOpacity : true,
			closeMethod  : &apos;zoomOut&apos;,

			// Changing next gallery item
			nextEffect : &apos;elastic&apos;, // &apos;elastic&apos;, &apos;fade&apos; or &apos;none&apos;
			nextSpeed  : 250,
			nextEasing : &apos;swing&apos;,
			nextMethod : &apos;changeIn&apos;,

			// Changing previous gallery item
			prevEffect : &apos;elastic&apos;, // &apos;elastic&apos;, &apos;fade&apos; or &apos;none&apos;
			prevSpeed  : 250,
			prevEasing : &apos;swing&apos;,
			prevMethod : &apos;changeOut&apos;,

			// Enable default helpers
			helpers : {
				overlay : true,
				title   : true
			},

			// Callbacks
			onCancel     : $.noop, // If canceling
			beforeLoad   : $.noop, // Before loading
			afterLoad    : $.noop, // After loading
			beforeShow   : $.noop, // Before changing in current item
			afterShow    : $.noop, // After opening
			beforeChange : $.noop, // Before changing gallery item
			beforeClose  : $.noop, // Before closing
			afterClose   : $.noop  // After closing
		},

		//Current state
		group    : {}, // Selected group
		opts     : {}, // Group options
		previous : null,  // Previous element
		coming   : null,  // Element being loaded
		current  : null,  // Currently loaded element
		isActive : false, // Is activated
		isOpen   : false, // Is currently open
		isOpened : false, // Have been fully opened at least once

		wrap  : null,
		skin  : null,
		outer : null,
		inner : null,

		player : {
			timer    : null,
			isActive : false
		},

		// Loaders
		ajaxLoad   : null,
		imgPreload : null,

		// Some collections
		transitions : {},
		helpers     : {},

		/*
		 *	Static methods
		 */

		open: function (group, opts) {
			if (!group) {
				return;
			}

			if (!$.isPlainObject(opts)) {
				opts = {};
			}

			// Close if already active
			if (false === F.close(true)) {
				return;
			}

			// Normalize group
			if (!$.isArray(group)) {
				group = isQuery(group) ? $(group).get() : [group];
			}

			// Recheck if the type of each element is `object` and set content type (image, ajax, etc)
			$.each(group, function(i, element) {
				var obj = {},
					href,
					title,
					content,
					type,
					rez,
					hrefParts,
					selector;

				if ($.type(element) === &quot;object&quot;) {
					// Check if is DOM element
					if (element.nodeType) {
						element = $(element);
					}

					if (isQuery(element)) {
						obj = {
							href    : element.data(&apos;fancybox-href&apos;) || element.attr(&apos;href&apos;),
							title   : $(&apos;<div>&apos;).text( element.data(&apos;fancybox-title&apos;) || element.attr(&apos;title&apos;) ).html(),
							isDom   : true,
							element : element
						};

						if ($.metadata) {
							$.extend(true, obj, element.metadata());
						}

					} else {
						obj = element;
					}
				}

				href  = opts.href  || obj.href || (isString(element) ? element : null);
				title = opts.title !== undefined ? opts.title : obj.title || &apos;&apos;;

				content = opts.content || obj.content;
				type    = content ? &apos;html&apos; : (opts.type  || obj.type);

				if (!type &amp;&amp; obj.isDom) {
					type = element.data(&apos;fancybox-type&apos;);

					if (!type) {
						rez  = element.prop(&apos;class&apos;).match(/fancybox\.(\w+)/);
						type = rez ? rez[1] : null;
					}
				}

				if (isString(href)) {
					// Try to guess the content type
					if (!type) {
						if (F.isImage(href)) {
							type = &apos;image&apos;;

						} else if (F.isSWF(href)) {
							type = &apos;swf&apos;;

						} else if (href.charAt(0) === &apos;#&apos;) {
							type = &apos;inline&apos;;

						} else if (isString(element)) {
							type    = &apos;html&apos;;
							content = element;
						}
					}

					// Split url into two pieces with source url and content selector, e.g,
					// &quot;/mypage.html #my_id&quot; will load &quot;/mypage.html&quot; and display element having id &quot;my_id&quot;
					if (type === &apos;ajax&apos;) {
						hrefParts = href.split(/\s+/, 2);
						href      = hrefParts.shift();
						selector  = hrefParts.shift();
					}
				}

				if (!content) {
					if (type === &apos;inline&apos;) {
						if (href) {
							content = $( isString(href) ? href.replace(/.*(?=#[^\s]+$)/, &apos;&apos;) : href ); //strip for ie7

						} else if (obj.isDom) {
							content = element;
						}

					} else if (type === &apos;html&apos;) {
						content = href;

					} else if (!type &amp;&amp; !href &amp;&amp; obj.isDom) {
						type    = &apos;inline&apos;;
						content = element;
					}
				}

				$.extend(obj, {
					href     : href,
					type     : type,
					content  : content,
					title    : title,
					selector : selector
				});

				group[ i ] = obj;
			});

			// Extend the defaults
			F.opts = $.extend(true, {}, F.defaults, opts);

			// All options are merged recursive except keys
			if (opts.keys !== undefined) {
				F.opts.keys = opts.keys ? $.extend({}, F.defaults.keys, opts.keys) : false;
			}

			F.group = group;

			return F._start(F.opts.index);
		},

		// Cancel image loading or abort ajax request
		cancel: function () {
			var coming = F.coming;

			if (coming &amp;&amp; false === F.trigger(&apos;onCancel&apos;)) {
				return;
			}

			F.hideLoading();

			if (!coming) {
				return;
			}

			if (F.ajaxLoad) {
				F.ajaxLoad.abort();
			}

			F.ajaxLoad = null;

			if (F.imgPreload) {
				F.imgPreload.onload = F.imgPreload.onerror = null;
			}

			if (coming.wrap) {
				coming.wrap.stop(true, true).trigger(&apos;onReset&apos;).remove();
			}

			F.coming = null;

			// If the first item has been canceled, then clear everything
			if (!F.current) {
				F._afterZoomOut( coming );
			}
		},

		// Start closing animation if is open; remove immediately if opening/closing
		close: function (event) {
			F.cancel();

			if (false === F.trigger(&apos;beforeClose&apos;)) {
				return;
			}

			F.unbindEvents();

			if (!F.isActive) {
				return;
			}

			if (!F.isOpen || event === true) {
				$(&apos;.fancybox-wrap&apos;).stop(true).trigger(&apos;onReset&apos;).remove();

				F._afterZoomOut();

			} else {
				F.isOpen = F.isOpened = false;
				F.isClosing = true;

				$(&apos;.fancybox-item, .fancybox-nav&apos;).remove();

				F.wrap.stop(true, true).removeClass(&apos;fancybox-opened&apos;);

				F.transitions[ F.current.closeMethod ]();
			}
		},

		// Manage slideshow:
		//   $.fancybox.play(); - toggle slideshow
		//   $.fancybox.play( true ); - start
		//   $.fancybox.play( false ); - stop
		play: function ( action ) {
			var clear = function () {
					clearTimeout(F.player.timer);
				},
				set = function () {
					clear();

					if (F.current &amp;&amp; F.player.isActive) {
						F.player.timer = setTimeout(F.next, F.current.playSpeed);
					}
				},
				stop = function () {
					clear();

					D.unbind(&apos;.player&apos;);

					F.player.isActive = false;

					F.trigger(&apos;onPlayEnd&apos;);
				},
				start = function () {
					if (F.current &amp;&amp; (F.current.loop || F.current.index &lt; F.group.length - 1)) {
						F.player.isActive = true;

						D.bind({
							&apos;onCancel.player beforeClose.player&apos; : stop,
							&apos;onUpdate.player&apos;   : set,
							&apos;beforeLoad.player&apos; : clear
						});

						set();

						F.trigger(&apos;onPlayStart&apos;);
					}
				};

			if (action === true || (!F.player.isActive &amp;&amp; action !== false)) {
				start();
			} else {
				stop();
			}
		},

		// Navigate to next gallery item
		next: function ( direction ) {
			var current = F.current;

			if (current) {
				if (!isString(direction)) {
					direction = current.direction.next;
				}

				F.jumpto(current.index + 1, direction, &apos;next&apos;);
			}
		},

		// Navigate to previous gallery item
		prev: function ( direction ) {
			var current = F.current;

			if (current) {
				if (!isString(direction)) {
					direction = current.direction.prev;
				}

				F.jumpto(current.index - 1, direction, &apos;prev&apos;);
			}
		},

		// Navigate to gallery item by index
		jumpto: function ( index, direction, router ) {
			var current = F.current;

			if (!current) {
				return;
			}

			index = getScalar(index);

			F.direction = direction || current.direction[ (index &gt;= current.index ? &apos;next&apos; : &apos;prev&apos;) ];
			F.router    = router || &apos;jumpto&apos;;

			if (current.loop) {
				if (index &lt; 0) {
					index = current.group.length + (index % current.group.length);
				}

				index = index % current.group.length;
			}

			if (current.group[ index ] !== undefined) {
				F.cancel();

				F._start(index);
			}
		},

		// Center inside viewport and toggle position type to fixed or absolute if needed
		reposition: function (e, onlyAbsolute) {
			var current = F.current,
				wrap    = current ? current.wrap : null,
				pos;

			if (wrap) {
				pos = F._getPosition(onlyAbsolute);

				if (e &amp;&amp; e.type === &apos;scroll&apos;) {
					delete pos.position;

					wrap.stop(true, true).animate(pos, 200);

				} else {
					wrap.css(pos);

					current.pos = $.extend({}, current.dim, pos);
				}
			}
		},

		update: function (e) {
			var type = (e &amp;&amp; e.originalEvent &amp;&amp; e.originalEvent.type),
				anyway = !type || type === &apos;orientationchange&apos;;

			if (anyway) {
				clearTimeout(didUpdate);

				didUpdate = null;
			}

			if (!F.isOpen || didUpdate) {
				return;
			}

			didUpdate = setTimeout(function() {
				var current = F.current;

				if (!current || F.isClosing) {
					return;
				}

				F.wrap.removeClass(&apos;fancybox-tmp&apos;);

				if (anyway || type === &apos;load&apos; || (type === &apos;resize&apos; &amp;&amp; current.autoResize)) {
					F._setDimension();
				}

				if (!(type === &apos;scroll&apos; &amp;&amp; current.canShrink)) {
					F.reposition(e);
				}

				F.trigger(&apos;onUpdate&apos;);

				didUpdate = null;

			}, (anyway &amp;&amp; !isTouch ? 0 : 300));
		},

		// Shrink content to fit inside viewport or restore if resized
		toggle: function ( action ) {
			if (F.isOpen) {
				F.current.fitToView = $.type(action) === &quot;boolean&quot; ? action : !F.current.fitToView;

				// Help browser to restore document dimensions
				if (isTouch) {
					F.wrap.removeAttr(&apos;style&apos;).addClass(&apos;fancybox-tmp&apos;);

					F.trigger(&apos;onUpdate&apos;);
				}

				F.update();
			}
		},

		hideLoading: function () {
			D.unbind(&apos;.loading&apos;);

			$(&apos;#fancybox-loading&apos;).remove();
		},

		showLoading: function () {
			var el, viewport;

			F.hideLoading();

			el = $(&apos;<div id="fancybox-loading"><div></div></div>&apos;).click(F.cancel).appendTo(&apos;body&apos;);

			// If user will press the escape-button, the request will be canceled
			D.bind(&apos;keydown.loading&apos;, function(e) {
				if ((e.which || e.keyCode) === 27) {
					e.preventDefault();

					F.cancel();
				}
			});

			if (!F.defaults.fixed) {
				viewport = F.getViewport();

				el.css({
					position : &apos;absolute&apos;,
					top  : (viewport.h * 0.5) + viewport.y,
					left : (viewport.w * 0.5) + viewport.x
				});
			}

			F.trigger(&apos;onLoading&apos;);
		},

		getViewport: function () {
			var locked = (F.current &amp;&amp; F.current.locked) || false,
				rez    = {
					x: W.scrollLeft(),
					y: W.scrollTop()
				};

			if (locked &amp;&amp; locked.length) {
				rez.w = locked[0].clientWidth;
				rez.h = locked[0].clientHeight;

			} else {
				// See http://bugs.jquery.com/ticket/6724
				rez.w = isTouch &amp;&amp; window.innerWidth  ? window.innerWidth  : W.width();
				rez.h = isTouch &amp;&amp; window.innerHeight ? window.innerHeight : W.height();
			}

			return rez;
		},

		// Unbind the keyboard / clicking actions
		unbindEvents: function () {
			if (F.wrap &amp;&amp; isQuery(F.wrap)) {
				F.wrap.unbind(&apos;.fb&apos;);
			}

			D.unbind(&apos;.fb&apos;);
			W.unbind(&apos;.fb&apos;);
		},

		bindEvents: function () {
			var current = F.current,
				keys;

			if (!current) {
				return;
			}

			// Changing document height on iOS devices triggers a &apos;resize&apos; event,
			// that can change document height... repeating infinitely
			W.bind(&apos;orientationchange.fb&apos; + (isTouch ? &apos;&apos; : &apos; resize.fb&apos;) + (current.autoCenter &amp;&amp; !current.locked ? &apos; scroll.fb&apos; : &apos;&apos;), F.update);

			keys = current.keys;

			if (keys) {
				D.bind(&apos;keydown.fb&apos;, function (e) {
					var code   = e.which || e.keyCode,
						target = e.target || e.srcElement;

					// Skip esc key if loading, because showLoading will cancel preloading
					if (code === 27 &amp;&amp; F.coming) {
						return false;
					}

					// Ignore key combinations and key events within form elements
					if (!e.ctrlKey &amp;&amp; !e.altKey &amp;&amp; !e.shiftKey &amp;&amp; !e.metaKey &amp;&amp; !(target &amp;&amp; (target.type || $(target).is(&apos;[contenteditable]&apos;)))) {
						$.each(keys, function(i, val) {
							if (current.group.length &gt; 1 &amp;&amp; val[ code ] !== undefined) {
								F[ i ]( val[ code ] );

								e.preventDefault();
								return false;
							}

							if ($.inArray(code, val) &gt; -1) {
								F[ i ] ();

								e.preventDefault();
								return false;
							}
						});
					}
				});
			}

			if ($.fn.mousewheel &amp;&amp; current.mouseWheel) {
				F.wrap.bind(&apos;mousewheel.fb&apos;, function (e, delta, deltaX, deltaY) {
					var target = e.target || null,
						parent = $(target),
						canScroll = false;

					while (parent.length) {
						if (canScroll || parent.is(&apos;.fancybox-skin&apos;) || parent.is(&apos;.fancybox-wrap&apos;)) {
							break;
						}

						canScroll = isScrollable( parent[0] );
						parent    = $(parent).parent();
					}

					if (delta !== 0 &amp;&amp; !canScroll) {
						if (F.group.length &gt; 1 &amp;&amp; !current.canShrink) {
							if (deltaY &gt; 0 || deltaX &gt; 0) {
								F.prev( deltaY &gt; 0 ? &apos;down&apos; : &apos;left&apos; );

							} else if (deltaY &lt; 0 || deltaX &lt; 0) {
								F.next( deltaY &lt; 0 ? &apos;up&apos; : &apos;right&apos; );
							}

							e.preventDefault();
						}
					}
				});
			}
		},

		trigger: function (event, o) {
			var ret, obj = o || F.coming || F.current;

			if (obj) {
				if ($.isFunction( obj[event] )) {
					ret = obj[event].apply(obj, Array.prototype.slice.call(arguments, 1));
				}

				if (ret === false) {
					return false;
				}

				if (obj.helpers) {
					$.each(obj.helpers, function (helper, opts) {
						if (opts &amp;&amp; F.helpers[helper] &amp;&amp; $.isFunction(F.helpers[helper][event])) {
							F.helpers[helper][event]($.extend(true, {}, F.helpers[helper].defaults, opts), obj);
						}
					});
				}
			}

			D.trigger(event);
		},

		isImage: function (str) {
			return isString(str) &amp;&amp; str.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i);
		},

		isSWF: function (str) {
			return isString(str) &amp;&amp; str.match(/\.(swf)((\?|#).*)?$/i);
		},

		_start: function (index) {
			var coming = {},
				obj,
				href,
				type,
				margin,
				padding;

			index = getScalar( index );
			obj   = F.group[ index ] || null;

			if (!obj) {
				return false;
			}

			coming = $.extend(true, {}, F.opts, obj);

			// Convert margin and padding properties to array - top, right, bottom, left
			margin  = coming.margin;
			padding = coming.padding;

			if ($.type(margin) === &apos;number&apos;) {
				coming.margin = [margin, margin, margin, margin];
			}

			if ($.type(padding) === &apos;number&apos;) {
				coming.padding = [padding, padding, padding, padding];
			}

			// &apos;modal&apos; propery is just a shortcut
			if (coming.modal) {
				$.extend(true, coming, {
					closeBtn   : false,
					closeClick : false,
					nextClick  : false,
					arrows     : false,
					mouseWheel : false,
					keys       : null,
					helpers: {
						overlay : {
							closeClick : false
						}
					}
				});
			}

			// &apos;autoSize&apos; property is a shortcut, too
			if (coming.autoSize) {
				coming.autoWidth = coming.autoHeight = true;
			}

			if (coming.width === &apos;auto&apos;) {
				coming.autoWidth = true;
			}

			if (coming.height === &apos;auto&apos;) {
				coming.autoHeight = true;
			}

			/*
			 * Add reference to the group, so it`s possible to access from callbacks, example:
			 * afterLoad : function() {
			 *     this.title = &apos;Image &apos; + (this.index + 1) + &apos; of &apos; + this.group.length + (this.title ? &apos; - &apos; + this.title : &apos;&apos;);
			 * }
			 */

			coming.group  = F.group;
			coming.index  = index;

			// Give a chance for callback or helpers to update coming item (type, title, etc)
			F.coming = coming;

			if (false === F.trigger(&apos;beforeLoad&apos;)) {
				F.coming = null;

				return;
			}

			type = coming.type;
			href = coming.href;

			if (!type) {
				F.coming = null;

				//If we can not determine content type then drop silently or display next/prev item if looping through gallery
				if (F.current &amp;&amp; F.router &amp;&amp; F.router !== &apos;jumpto&apos;) {
					F.current.index = index;

					return F[ F.router ]( F.direction );
				}

				return false;
			}

			F.isActive = true;

			if (type === &apos;image&apos; || type === &apos;swf&apos;) {
				coming.autoHeight = coming.autoWidth = false;
				coming.scrolling  = &apos;visible&apos;;
			}

			if (type === &apos;image&apos;) {
				coming.aspectRatio = true;
			}

			if (type === &apos;iframe&apos; &amp;&amp; isTouch) {
				coming.scrolling = &apos;scroll&apos;;
			}

			// Build the neccessary markup
			coming.wrap = $(coming.tpl.wrap).addClass(&apos;fancybox-&apos; + (isTouch ? &apos;mobile&apos; : &apos;desktop&apos;) + &apos; fancybox-type-&apos; + type + &apos; fancybox-tmp &apos; + coming.wrapCSS).appendTo( coming.parent || &apos;body&apos; );

			$.extend(coming, {
				skin  : $(&apos;.fancybox-skin&apos;,  coming.wrap),
				outer : $(&apos;.fancybox-outer&apos;, coming.wrap),
				inner : $(&apos;.fancybox-inner&apos;, coming.wrap)
			});

			$.each([&quot;Top&quot;, &quot;Right&quot;, &quot;Bottom&quot;, &quot;Left&quot;], function(i, v) {
				coming.skin.css(&apos;padding&apos; + v, getValue(coming.padding[ i ]));
			});

			F.trigger(&apos;onReady&apos;);

			// Check before try to load; &apos;inline&apos; and &apos;html&apos; types need content, others - href
			if (type === &apos;inline&apos; || type === &apos;html&apos;) {
				if (!coming.content || !coming.content.length) {
					return F._error( &apos;content&apos; );
				}

			} else if (!href) {
				return F._error( &apos;href&apos; );
			}

			if (type === &apos;image&apos;) {
				F._loadImage();

			} else if (type === &apos;ajax&apos;) {
				F._loadAjax();

			} else if (type === &apos;iframe&apos;) {
				F._loadIframe();

			} else {
				F._afterLoad();
			}
		},

		_error: function ( type ) {
			$.extend(F.coming, {
				type       : &apos;html&apos;,
				autoWidth  : true,
				autoHeight : true,
				minWidth   : 0,
				minHeight  : 0,
				scrolling  : &apos;no&apos;,
				hasError   : type,
				content    : F.coming.tpl.error
			});

			F._afterLoad();
		},

		_loadImage: function () {
			// Reset preload image so it is later possible to check &quot;complete&quot; property
			var img = F.imgPreload = new Image();

			img.onload = function () {
				this.onload = this.onerror = null;

				F.coming.width  = this.width / F.opts.pixelRatio;
				F.coming.height = this.height / F.opts.pixelRatio;

				F._afterLoad();
			};

			img.onerror = function () {
				this.onload = this.onerror = null;

				F._error( &apos;image&apos; );
			};

			img.src = F.coming.href;

			if (img.complete !== true) {
				F.showLoading();
			}
		},

		_loadAjax: function () {
			var coming = F.coming;

			F.showLoading();

			F.ajaxLoad = $.ajax($.extend({}, coming.ajax, {
				url: coming.href,
				error: function (jqXHR, textStatus) {
					if (F.coming &amp;&amp; textStatus !== &apos;abort&apos;) {
						F._error( &apos;ajax&apos;, jqXHR );

					} else {
						F.hideLoading();
					}
				},
				success: function (data, textStatus) {
					if (textStatus === &apos;success&apos;) {
						coming.content = data;

						F._afterLoad();
					}
				}
			}));
		},

		_loadIframe: function() {
			var coming = F.coming,
				iframe = $(coming.tpl.iframe.replace(/\{rnd\}/g, new Date().getTime()))
					.attr(&apos;scrolling&apos;, isTouch ? &apos;auto&apos; : coming.iframe.scrolling)
					.attr(&apos;src&apos;, coming.href);

			// This helps IE
			$(coming.wrap).bind(&apos;onReset&apos;, function () {
				try {
					$(this).find(&apos;iframe&apos;).hide().attr(&apos;src&apos;, &apos;//about:blank&apos;).end().empty();
				} catch (e) {}
			});

			if (coming.iframe.preload) {
				F.showLoading();

				iframe.one(&apos;load&apos;, function() {
					$(this).data(&apos;ready&apos;, 1);

					// iOS will lose scrolling if we resize
					if (!isTouch) {
						$(this).bind(&apos;load.fb&apos;, F.update);
					}

					// Without this trick:
					//   - iframe won&apos;t scroll on iOS devices
					//   - IE7 sometimes displays empty iframe
					$(this).parents(&apos;.fancybox-wrap&apos;).width(&apos;100%&apos;).removeClass(&apos;fancybox-tmp&apos;).show();

					F._afterLoad();
				});
			}

			coming.content = iframe.appendTo( coming.inner );

			if (!coming.iframe.preload) {
				F._afterLoad();
			}
		},

		_preloadImages: function() {
			var group   = F.group,
				current = F.current,
				len     = group.length,
				cnt     = current.preload ? Math.min(current.preload, len - 1) : 0,
				item,
				i;

			for (i = 1; i <= cnt;="" i="" +="1)" {="" item="group[" (current.index="" )="" %="" len="" ];="" if="" (item.type="==" 'image'="" &&="" item.href)="" new="" image().src="item.href;" }="" },="" _afterload:="" function="" ()="" var="" coming="F.coming," previous="F.current," placeholder="fancybox-placeholder" ,="" current,="" content,="" type,="" scrolling,="" href,="" embed;="" f.hideloading();="" (!coming="" ||="" f.isactive="==" false)="" return;="" (false="==" f.trigger('afterload',="" coming,="" previous))="" coming.wrap.stop(true).trigger('onreset').remove();="" f.coming="null;" (previous)="" f.trigger('beforechange',="" previous);="" previous.wrap.stop(true).removeclass('fancybox-opened')="" .find('.fancybox-item,="" .fancybox-nav')="" .remove();="" f.unbindevents();="" current="coming;" content="coming.content;" type="coming.type;" scrolling="coming.scrolling;" $.extend(f,="" wrap="" :="" current.wrap,="" skin="" current.skin,="" outer="" current.outer,="" inner="" current.inner,="" });="" href="current.href;" switch="" (type)="" case="" 'inline':="" 'ajax':="" 'html':="" (current.selector)="">&apos;).html(content).find(current.selector);

					} else if (isQuery(content)) {
						if (!content.data(placeholder)) {
							content.data(placeholder, $(&apos;<div class="&apos; + placeholder + &apos;"></div>&apos;).insertAfter( content ).hide() );
						}

						content = content.show().detach();

						current.wrap.bind(&apos;onReset&apos;, function () {
							if ($(this).find(content).length) {
								content.hide().replaceAll( content.data(placeholder) ).data(placeholder, false);
							}
						});
					}
				break;

				case &apos;image&apos;:
					content = current.tpl.image.replace(/\{href\}/g, href);
				break;

				case &apos;swf&apos;:
					content = &apos;<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="&apos; + href + &apos;">&apos;;
					embed   = &apos;&apos;;

					$.each(current.swf, function(name, val) {
						content += &apos;<param name="&apos; + name + &apos;" value="&apos; + val + &apos;">&apos;;
						embed   += &apos; &apos; + name + &apos;=&quot;&apos; + val + &apos;&quot;&apos;;
					});

					content += &apos;<embed src="&apos; + href + &apos;" type="application/x-shockwave-flash" width="100%" height="100%" '="" +="" embed=""></object>&apos;;
				break;
			}

			if (!(isQuery(content) &amp;&amp; content.parent().is(current.inner))) {
				current.inner.append( content );
			}

			// Give a chance for helpers or callbacks to update elements
			F.trigger(&apos;beforeShow&apos;);

			// Set scrolling before calculating dimensions
			current.inner.css(&apos;overflow&apos;, scrolling === &apos;yes&apos; ? &apos;scroll&apos; : (scrolling === &apos;no&apos; ? &apos;hidden&apos; : scrolling));

			// Set initial dimensions and start position
			F._setDimension();

			F.reposition();

			F.isOpen = false;
			F.coming = null;

			F.bindEvents();

			if (!F.isOpened) {
				$(&apos;.fancybox-wrap&apos;).not( current.wrap ).stop(true).trigger(&apos;onReset&apos;).remove();

			} else if (previous.prevMethod) {
				F.transitions[ previous.prevMethod ]();
			}

			F.transitions[ F.isOpened ? current.nextMethod : current.openMethod ]();

			F._preloadImages();
		},

		_setDimension: function () {
			var viewport   = F.getViewport(),
				steps      = 0,
				canShrink  = false,
				canExpand  = false,
				wrap       = F.wrap,
				skin       = F.skin,
				inner      = F.inner,
				current    = F.current,
				width      = current.width,
				height     = current.height,
				minWidth   = current.minWidth,
				minHeight  = current.minHeight,
				maxWidth   = current.maxWidth,
				maxHeight  = current.maxHeight,
				scrolling  = current.scrolling,
				scrollOut  = current.scrollOutside ? current.scrollbarWidth : 0,
				margin     = current.margin,
				wMargin    = getScalar(margin[1] + margin[3]),
				hMargin    = getScalar(margin[0] + margin[2]),
				wPadding,
				hPadding,
				wSpace,
				hSpace,
				origWidth,
				origHeight,
				origMaxWidth,
				origMaxHeight,
				ratio,
				width_,
				height_,
				maxWidth_,
				maxHeight_,
				iframe,
				body;

			// Reset dimensions so we could re-check actual size
			wrap.add(skin).add(inner).width(&apos;auto&apos;).height(&apos;auto&apos;).removeClass(&apos;fancybox-tmp&apos;);

			wPadding = getScalar(skin.outerWidth(true)  - skin.width());
			hPadding = getScalar(skin.outerHeight(true) - skin.height());

			// Any space between content and viewport (margin, padding, border, title)
			wSpace = wMargin + wPadding;
			hSpace = hMargin + hPadding;

			origWidth  = isPercentage(width)  ? (viewport.w - wSpace) * getScalar(width)  / 100 : width;
			origHeight = isPercentage(height) ? (viewport.h - hSpace) * getScalar(height) / 100 : height;

			if (current.type === &apos;iframe&apos;) {
				iframe = current.content;

				if (current.autoHeight &amp;&amp; iframe.data(&apos;ready&apos;) === 1) {
					try {
						if (iframe[0].contentWindow.document.location) {
							inner.width( origWidth ).height(9999);

							body = iframe.contents().find(&apos;body&apos;);

							if (scrollOut) {
								body.css(&apos;overflow-x&apos;, &apos;hidden&apos;);
							}

							origHeight = body.outerHeight(true);
						}

					} catch (e) {}
				}

			} else if (current.autoWidth || current.autoHeight) {
				inner.addClass( &apos;fancybox-tmp&apos; );

				// Set width or height in case we need to calculate only one dimension
				if (!current.autoWidth) {
					inner.width( origWidth );
				}

				if (!current.autoHeight) {
					inner.height( origHeight );
				}

				if (current.autoWidth) {
					origWidth = inner.width();
				}

				if (current.autoHeight) {
					origHeight = inner.height();
				}

				inner.removeClass( &apos;fancybox-tmp&apos; );
			}

			width  = getScalar( origWidth );
			height = getScalar( origHeight );

			ratio  = origWidth / origHeight;

			// Calculations for the content
			minWidth  = getScalar(isPercentage(minWidth) ? getScalar(minWidth, &apos;w&apos;) - wSpace : minWidth);
			maxWidth  = getScalar(isPercentage(maxWidth) ? getScalar(maxWidth, &apos;w&apos;) - wSpace : maxWidth);

			minHeight = getScalar(isPercentage(minHeight) ? getScalar(minHeight, &apos;h&apos;) - hSpace : minHeight);
			maxHeight = getScalar(isPercentage(maxHeight) ? getScalar(maxHeight, &apos;h&apos;) - hSpace : maxHeight);

			// These will be used to determine if wrap can fit in the viewport
			origMaxWidth  = maxWidth;
			origMaxHeight = maxHeight;

			if (current.fitToView) {
				maxWidth  = Math.min(viewport.w - wSpace, maxWidth);
				maxHeight = Math.min(viewport.h - hSpace, maxHeight);
			}

			maxWidth_  = viewport.w - wMargin;
			maxHeight_ = viewport.h - hMargin;

			if (current.aspectRatio) {
				if (width &gt; maxWidth) {
					width  = maxWidth;
					height = getScalar(width / ratio);
				}

				if (height &gt; maxHeight) {
					height = maxHeight;
					width  = getScalar(height * ratio);
				}

				if (width &lt; minWidth) {
					width  = minWidth;
					height = getScalar(width / ratio);
				}

				if (height &lt; minHeight) {
					height = minHeight;
					width  = getScalar(height * ratio);
				}

			} else {
				width = Math.max(minWidth, Math.min(width, maxWidth));

				if (current.autoHeight &amp;&amp; current.type !== &apos;iframe&apos;) {
					inner.width( width );

					height = inner.height();
				}

				height = Math.max(minHeight, Math.min(height, maxHeight));
			}

			// Try to fit inside viewport (including the title)
			if (current.fitToView) {
				inner.width( width ).height( height );

				wrap.width( width + wPadding );

				// Real wrap dimensions
				width_  = wrap.width();
				height_ = wrap.height();

				if (current.aspectRatio) {
					while ((width_ &gt; maxWidth_ || height_ &gt; maxHeight_) &amp;&amp; width &gt; minWidth &amp;&amp; height &gt; minHeight) {
						if (steps++ &gt; 19) {
							break;
						}

						height = Math.max(minHeight, Math.min(maxHeight, height - 10));
						width  = getScalar(height * ratio);

						if (width &lt; minWidth) {
							width  = minWidth;
							height = getScalar(width / ratio);
						}

						if (width &gt; maxWidth) {
							width  = maxWidth;
							height = getScalar(width / ratio);
						}

						inner.width( width ).height( height );

						wrap.width( width + wPadding );

						width_  = wrap.width();
						height_ = wrap.height();
					}

				} else {
					width  = Math.max(minWidth,  Math.min(width,  width  - (width_  - maxWidth_)));
					height = Math.max(minHeight, Math.min(height, height - (height_ - maxHeight_)));
				}
			}

			if (scrollOut &amp;&amp; scrolling === &apos;auto&apos; &amp;&amp; height &lt; origHeight &amp;&amp; (width + wPadding + scrollOut) &lt; maxWidth_) {
				width += scrollOut;
			}

			inner.width( width ).height( height );

			wrap.width( width + wPadding );

			width_  = wrap.width();
			height_ = wrap.height();

			canShrink = (width_ &gt; maxWidth_ || height_ &gt; maxHeight_) &amp;&amp; width &gt; minWidth &amp;&amp; height &gt; minHeight;
			canExpand = current.aspectRatio ? (width &lt; origMaxWidth &amp;&amp; height &lt; origMaxHeight &amp;&amp; width &lt; origWidth &amp;&amp; height &lt; origHeight) : ((width &lt; origMaxWidth || height &lt; origMaxHeight) &amp;&amp; (width &lt; origWidth || height &lt; origHeight));

			$.extend(current, {
				dim : {
					width	: getValue( width_ ),
					height	: getValue( height_ )
				},
				origWidth  : origWidth,
				origHeight : origHeight,
				canShrink  : canShrink,
				canExpand  : canExpand,
				wPadding   : wPadding,
				hPadding   : hPadding,
				wrapSpace  : height_ - skin.outerHeight(true),
				skinSpace  : skin.height() - height
			});

			if (!iframe &amp;&amp; current.autoHeight &amp;&amp; height &gt; minHeight &amp;&amp; height &lt; maxHeight &amp;&amp; !canExpand) {
				inner.height(&apos;auto&apos;);
			}
		},

		_getPosition: function (onlyAbsolute) {
			var current  = F.current,
				viewport = F.getViewport(),
				margin   = current.margin,
				width    = F.wrap.width()  + margin[1] + margin[3],
				height   = F.wrap.height() + margin[0] + margin[2],
				rez      = {
					position: &apos;absolute&apos;,
					top  : margin[0],
					left : margin[3]
				};

			if (current.autoCenter &amp;&amp; current.fixed &amp;&amp; !onlyAbsolute &amp;&amp; height <= viewport.h="" &&="" width="" <="viewport.w)" {="" rez.position="fixed" ;="" }="" else="" if="" (!current.locked)="" rez.top="" +="viewport.y;" rez.left="" ((viewport.h="" -="" height)="" *="" current.topratio)));="" ((viewport.w="" width)="" current.leftratio)));="" return="" rez;="" },="" _afterzoomin:="" function="" ()="" var="" current="F.current;" (!current)="" return;="" f.isopen="F.isOpened" =="" true;="" f.wrap.css('overflow',="" 'visible').addclass('fancybox-opened').hide().show(0);="" f.update();="" assign="" a="" click="" event="" (="" current.closeclick="" ||="" (current.nextclick="" f.group.length=""> 1) ) {
				F.inner.css(&apos;cursor&apos;, &apos;pointer&apos;).bind(&apos;click.fb&apos;, function(e) {
					if (!$(e.target).is(&apos;a&apos;) &amp;&amp; !$(e.target).parent().is(&apos;a&apos;)) {
						e.preventDefault();

						F[ current.closeClick ? &apos;close&apos; : &apos;next&apos; ]();
					}
				});
			}

			// Create a close button
			if (current.closeBtn) {
				$(current.tpl.closeBtn).appendTo(F.skin).bind(&apos;click.fb&apos;, function(e) {
					e.preventDefault();

					F.close();
				});
			}

			// Create navigation arrows
			if (current.arrows &amp;&amp; F.group.length &gt; 1) {
				if (current.loop || current.index &gt; 0) {
					$(current.tpl.prev).appendTo(F.outer).bind(&apos;click.fb&apos;, F.prev);
				}

				if (current.loop || current.index &lt; F.group.length - 1) {
					$(current.tpl.next).appendTo(F.outer).bind(&apos;click.fb&apos;, F.next);
				}
			}

			F.trigger(&apos;afterShow&apos;);

			// Stop the slideshow if this is the last item
			if (!current.loop &amp;&amp; current.index === current.group.length - 1) {

				F.play( false );

			} else if (F.opts.autoPlay &amp;&amp; !F.player.isActive) {
				F.opts.autoPlay = false;

				F.play(true);
			}
		},

		_afterZoomOut: function ( obj ) {
			obj = obj || F.current;

			$(&apos;.fancybox-wrap&apos;).trigger(&apos;onReset&apos;).remove();

			$.extend(F, {
				group  : {},
				opts   : {},
				router : false,
				current   : null,
				isActive  : false,
				isOpened  : false,
				isOpen    : false,
				isClosing : false,
				wrap   : null,
				skin   : null,
				outer  : null,
				inner  : null
			});

			F.trigger(&apos;afterClose&apos;, obj);
		}
	});

	/*
	 *	Default transitions
	 */

	F.transitions = {
		getOrigPosition: function () {
			var current  = F.current,
				element  = current.element,
				orig     = current.orig,
				pos      = {},
				width    = 50,
				height   = 50,
				hPadding = current.hPadding,
				wPadding = current.wPadding,
				viewport = F.getViewport();

			if (!orig &amp;&amp; current.isDom &amp;&amp; element.is(&apos;:visible&apos;)) {
				orig = element.find(&apos;img:first&apos;);

				if (!orig.length) {
					orig = element;
				}
			}

			if (isQuery(orig)) {
				pos = orig.offset();

				if (orig.is(&apos;img&apos;)) {
					width  = orig.outerWidth();
					height = orig.outerHeight();
				}

			} else {
				pos.top  = viewport.y + (viewport.h - height) * current.topRatio;
				pos.left = viewport.x + (viewport.w - width)  * current.leftRatio;
			}

			if (F.wrap.css(&apos;position&apos;) === &apos;fixed&apos; || current.locked) {
				pos.top  -= viewport.y;
				pos.left -= viewport.x;
			}

			pos = {
				top     : getValue(pos.top  - hPadding * current.topRatio),
				left    : getValue(pos.left - wPadding * current.leftRatio),
				width   : getValue(width  + wPadding),
				height  : getValue(height + hPadding)
			};

			return pos;
		},

		step: function (now, fx) {
			var ratio,
				padding,
				value,
				prop       = fx.prop,
				current    = F.current,
				wrapSpace  = current.wrapSpace,
				skinSpace  = current.skinSpace;

			if (prop === &apos;width&apos; || prop === &apos;height&apos;) {
				ratio = fx.end === fx.start ? 1 : (now - fx.start) / (fx.end - fx.start);

				if (F.isClosing) {
					ratio = 1 - ratio;
				}

				padding = prop === &apos;width&apos; ? current.wPadding : current.hPadding;
				value   = now - padding;

				F.skin[ prop ](  getScalar( prop === &apos;width&apos; ?  value : value - (wrapSpace * ratio) ) );
				F.inner[ prop ]( getScalar( prop === &apos;width&apos; ?  value : value - (wrapSpace * ratio) - (skinSpace * ratio) ) );
			}
		},

		zoomIn: function () {
			var current  = F.current,
				startPos = current.pos,
				effect   = current.openEffect,
				elastic  = effect === &apos;elastic&apos;,
				endPos   = $.extend({opacity : 1}, startPos);

			// Remove &quot;position&quot; property that breaks older IE
			delete endPos.position;

			if (elastic) {
				startPos = this.getOrigPosition();

				if (current.openOpacity) {
					startPos.opacity = 0.1;
				}

			} else if (effect === &apos;fade&apos;) {
				startPos.opacity = 0.1;
			}

			F.wrap.css(startPos).animate(endPos, {
				duration : effect === &apos;none&apos; ? 0 : current.openSpeed,
				easing   : current.openEasing,
				step     : elastic ? this.step : null,
				complete : F._afterZoomIn
			});
		},

		zoomOut: function () {
			var current  = F.current,
				effect   = current.closeEffect,
				elastic  = effect === &apos;elastic&apos;,
				endPos   = {opacity : 0.1};

			if (elastic) {
				endPos = this.getOrigPosition();

				if (current.closeOpacity) {
					endPos.opacity = 0.1;
				}
			}

			F.wrap.animate(endPos, {
				duration : effect === &apos;none&apos; ? 0 : current.closeSpeed,
				easing   : current.closeEasing,
				step     : elastic ? this.step : null,
				complete : F._afterZoomOut
			});
		},

		changeIn: function () {
			var current   = F.current,
				effect    = current.nextEffect,
				startPos  = current.pos,
				endPos    = { opacity : 1 },
				direction = F.direction,
				distance  = 200,
				field;

			startPos.opacity = 0.1;

			if (effect === &apos;elastic&apos;) {
				field = direction === &apos;down&apos; || direction === &apos;up&apos; ? &apos;top&apos; : &apos;left&apos;;

				if (direction === &apos;down&apos; || direction === &apos;right&apos;) {
					startPos[ field ] = getValue(getScalar(startPos[ field ]) - distance);
					endPos[ field ]   = &apos;+=&apos; + distance + &apos;px&apos;;

				} else {
					startPos[ field ] = getValue(getScalar(startPos[ field ]) + distance);
					endPos[ field ]   = &apos;-=&apos; + distance + &apos;px&apos;;
				}
			}

			// Workaround for http://bugs.jquery.com/ticket/12273
			if (effect === &apos;none&apos;) {
				F._afterZoomIn();

			} else {
				F.wrap.css(startPos).animate(endPos, {
					duration : current.nextSpeed,
					easing   : current.nextEasing,
					complete : F._afterZoomIn
				});
			}
		},

		changeOut: function () {
			var previous  = F.previous,
				effect    = previous.prevEffect,
				endPos    = { opacity : 0.1 },
				direction = F.direction,
				distance  = 200;

			if (effect === &apos;elastic&apos;) {
				endPos[ direction === &apos;down&apos; || direction === &apos;up&apos; ? &apos;top&apos; : &apos;left&apos; ] = ( direction === &apos;up&apos; || direction === &apos;left&apos; ? &apos;-&apos; : &apos;+&apos; ) + &apos;=&apos; + distance + &apos;px&apos;;
			}

			previous.wrap.animate(endPos, {
				duration : effect === &apos;none&apos; ? 0 : previous.prevSpeed,
				easing   : previous.prevEasing,
				complete : function () {
					$(this).trigger(&apos;onReset&apos;).remove();
				}
			});
		}
	};

	/*
	 *	Overlay helper
	 */

	F.helpers.overlay = {
		defaults : {
			closeClick : true,      // if true, fancyBox will be closed when user clicks on the overlay
			speedOut   : 200,       // duration of fadeOut animation
			showEarly  : true,      // indicates if should be opened immediately or wait until the content is ready
			css        : {},        // custom CSS properties
			locked     : !isTouch,  // if true, the content will be locked into overlay
			fixed      : true       // if false, the overlay CSS position property will not be set to &quot;fixed&quot;
		},

		overlay : null,      // current handle
		fixed   : false,     // indicates if the overlay has position &quot;fixed&quot;
		el      : $(&apos;html&apos;), // element that contains &quot;the lock&quot;

		// Public methods
		create : function(opts) {
			var parent;

			opts = $.extend({}, this.defaults, opts);

			if (this.overlay) {
				this.close();
			}

			parent = F.coming ? F.coming.parent : opts.parent;

			this.overlay = $(&apos;<div class="fancybox-overlay"></div>&apos;).appendTo( parent &amp;&amp; parent.lenth ? parent : &apos;body&apos; );
			this.fixed   = false;

			if (opts.fixed &amp;&amp; F.defaults.fixed) {
				this.overlay.addClass(&apos;fancybox-overlay-fixed&apos;);

				this.fixed = true;
			}
		},

		open : function(opts) {
			var that = this;

			opts = $.extend({}, this.defaults, opts);

			if (this.overlay) {
				this.overlay.unbind(&apos;.overlay&apos;).width(&apos;auto&apos;).height(&apos;auto&apos;);

			} else {
				this.create(opts);
			}

			if (!this.fixed) {
				W.bind(&apos;resize.overlay&apos;, $.proxy( this.update, this) );

				this.update();
			}

			if (opts.closeClick) {
				this.overlay.bind(&apos;click.overlay&apos;, function(e) {
					if ($(e.target).hasClass(&apos;fancybox-overlay&apos;)) {
						if (F.isActive) {
							F.close();
						} else {
							that.close();
						}

						return false;
					}
				});
			}

			this.overlay.css( opts.css ).show();
		},

		close : function() {
			W.unbind(&apos;resize.overlay&apos;);

			if (this.el.hasClass(&apos;fancybox-lock&apos;)) {
				$(&apos;.fancybox-margin&apos;).removeClass(&apos;fancybox-margin&apos;);

				this.el.removeClass(&apos;fancybox-lock&apos;);

				W.scrollTop( this.scrollV ).scrollLeft( this.scrollH );
			}

			$(&apos;.fancybox-overlay&apos;).remove().hide();

			$.extend(this, {
				overlay : null,
				fixed   : false
			});
		},

		// Private, callbacks

		update : function () {
			var width = &apos;100%&apos;, offsetWidth;

			// Reset width/height so it will not mess
			this.overlay.width(width).height(&apos;100%&apos;);

			// jQuery does not return reliable result for IE
			if (IE) {
				offsetWidth = Math.max(document.documentElement.offsetWidth, document.body.offsetWidth);

				if (D.width() &gt; offsetWidth) {
					width = D.width();
				}

			} else if (D.width() &gt; W.width()) {
				width = D.width();
			}

			this.overlay.width(width).height(D.height());
		},

		// This is where we can manipulate DOM, because later it would cause iframes to reload
		onReady : function (opts, obj) {
			var overlay = this.overlay;

			$(&apos;.fancybox-overlay&apos;).stop(true, true);

			if (!overlay) {
				this.create(opts);
			}

			if (opts.locked &amp;&amp; this.fixed &amp;&amp; obj.fixed) {
				obj.locked = this.overlay.append( obj.wrap );
				obj.fixed  = false;
			}

			if (opts.showEarly === true) {
				this.beforeShow.apply(this, arguments);
			}
		},

		beforeShow : function(opts, obj) {
			if (obj.locked &amp;&amp; !this.el.hasClass(&apos;fancybox-lock&apos;)) {
				if (this.fixPosition !== false) {
					$(&apos;*&apos;).filter(function(){
						return ($(this).css(&apos;position&apos;) === &apos;fixed&apos; &amp;&amp; !$(this).hasClass(&quot;fancybox-overlay&quot;) &amp;&amp; !$(this).hasClass(&quot;fancybox-wrap&quot;) );
					}).addClass(&apos;fancybox-margin&apos;);
				}

				this.el.addClass(&apos;fancybox-margin&apos;);

				this.scrollV = W.scrollTop();
				this.scrollH = W.scrollLeft();

				this.el.addClass(&apos;fancybox-lock&apos;);

				W.scrollTop( this.scrollV ).scrollLeft( this.scrollH );
			}

			this.open(opts);
		},

		onUpdate : function() {
			if (!this.fixed) {
				this.update();
			}
		},

		afterClose: function (opts) {
			// Remove overlay if exists and fancyBox is not opening
			// (e.g., it is not being open using afterClose callback)
			if (this.overlay &amp;&amp; !F.coming) {
				this.overlay.fadeOut(opts.speedOut, $.proxy( this.close, this ));
			}
		}
	};

	/*
	 *	Title helper
	 */

	F.helpers.title = {
		defaults : {
			type     : &apos;float&apos;, // &apos;float&apos;, &apos;inside&apos;, &apos;outside&apos; or &apos;over&apos;,
			position : &apos;bottom&apos; // &apos;top&apos; or &apos;bottom&apos;
		},

		beforeShow: function (opts) {
			var current = F.current,
				text    = current.title,
				type    = opts.type,
				title,
				target;

			if ($.isFunction(text)) {
				text = text.call(current.element, current);
			}

			if (!isString(text) || $.trim(text) === &apos;&apos;) {
				return;
			}

			title = $(&apos;<div class="fancybox-title fancybox-title-&apos; + type + &apos;-wrap">&apos; + text + &apos;</div>&apos;);

			switch (type) {
				case &apos;inside&apos;:
					target = F.skin;
				break;

				case &apos;outside&apos;:
					target = F.wrap;
				break;

				case &apos;over&apos;:
					target = F.inner;
				break;

				default: // &apos;float&apos;
					target = F.skin;

					title.appendTo(&apos;body&apos;);

					if (IE) {
						title.width( title.width() );
					}

					title.wrapInner(&apos;<span class="child"></span>&apos;);

					//Increase bottom margin so this title will also fit into viewport
					F.current.margin[2] += Math.abs( getScalar(title.css(&apos;margin-bottom&apos;)) );
				break;
			}

			title[ (opts.position === &apos;top&apos; ? &apos;prependTo&apos;  : &apos;appendTo&apos;) ](target);
		}
	};

	// jQuery plugin initialization
	$.fn.fancybox = function (options) {
		var index,
			that     = $(this),
			selector = this.selector || &apos;&apos;,
			run      = function(e) {
				var what = $(this).blur(), idx = index, relType, relVal;

				if (!(e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) &amp;&amp; !what.is(&apos;.fancybox-wrap&apos;)) {
					relType = options.groupAttr || &apos;data-fancybox-group&apos;;
					relVal  = what.attr(relType);

					if (!relVal) {
						relType = &apos;rel&apos;;
						relVal  = what.get(0)[ relType ];
					}

					if (relVal &amp;&amp; relVal !== &apos;&apos; &amp;&amp; relVal !== &apos;nofollow&apos;) {
						what = selector.length ? $(selector) : that;
						what = what.filter(&apos;[&apos; + relType + &apos;=&quot;&apos; + relVal + &apos;&quot;]&apos;);
						idx  = what.index(this);
					}

					options.index = idx;

					// Stop an event from bubbling if everything is fine
					if (F.open(what, options) !== false) {
						e.preventDefault();
					}
				}
			};

		options = options || {};
		index   = options.index || 0;

		if (!selector || options.live === false) {
			that.unbind(&apos;click.fb-start&apos;).bind(&apos;click.fb-start&apos;, run);

		} else {
			D.undelegate(selector, &apos;click.fb-start&apos;).delegate(selector + &quot;:not(&apos;.fancybox-item, .fancybox-nav&apos;)&quot;, &apos;click.fb-start&apos;, run);
		}

		this.filter(&apos;[data-fancybox-start=1]&apos;).trigger(&apos;click&apos;);

		return this;
	};

	// Tests that need a body at doc ready
	D.ready(function() {
		var w1, w2;

		if ( $.scrollbarWidth === undefined ) {
			// http://benalman.com/projects/jquery-misc-plugins/#scrollbarwidth
			$.scrollbarWidth = function() {
				var parent = $(&apos;<div style="width:50px;height:50px;overflow:auto"><div></div>&apos;).appendTo(&apos;body&apos;),
					child  = parent.children(),
					width  = child.innerWidth() - child.height( 99 ).innerWidth();

				parent.remove();

				return width;
			};
		}

		if ( $.support.fixedPosition === undefined ) {
			$.support.fixedPosition = (function() {
				var elem  = $(&apos;<div style="position:fixed;top:20px;"></div>&apos;).appendTo(&apos;body&apos;),
					fixed = ( elem[0].offsetTop === 20 || elem[0].offsetTop === 15 );

				elem.remove();

				return fixed;
			}());
		}

		$.extend(F.defaults, {
			scrollbarWidth : $.scrollbarWidth(),
			fixed  : $.support.fixedPosition,
			parent : $(&apos;body&apos;)
		});

		//Get real width of page scroll-bar
		w1 = $(window).width();

		H.addClass(&apos;fancybox-lock-test&apos;);

		w2 = $(window).width();

		H.removeClass(&apos;fancybox-lock-test&apos;);

		$(&quot;<style type="text/css">.fancybox-margin{margin-right:" + (w2 - w1) + "px;}</style>&quot;).appendTo(&quot;head&quot;);
	});

}(window, document, jQuery));</div></=></=></div><link href="/css/prism-tomorrow.css" rel="stylesheet">