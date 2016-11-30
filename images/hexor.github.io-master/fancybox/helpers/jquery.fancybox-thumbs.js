/*!
 * Thumbnail helper for fancyBox
 * version: 1.0.7 (Mon, 01 Oct 2012)
 * @requires fancyBox v2.0 or later
 *
 * Usage:
 *     $(&quot;.fancybox&quot;).fancybox({
 *         helpers : {
 *             thumbs: {
 *                 width  : 50,
 *                 height : 50
 *             }
 *         }
 *     });
 *
 */
;(function ($) {
	//Shortcut for fancyBox object
	var F = $.fancybox;

	//Add helper object
	F.helpers.thumbs = {
		defaults : {
			width    : 50,       // thumbnail width
			height   : 50,       // thumbnail height
			position : &apos;bottom&apos;, // &apos;top&apos; or &apos;bottom&apos;
			source   : function ( item ) {  // function to obtain the URL of the thumbnail image
				var href;

				if (item.element) {
					href = $(item.element).find(&apos;img&apos;).attr(&apos;src&apos;);
				}

				if (!href &amp;&amp; item.type === &apos;image&apos; &amp;&amp; item.href) {
					href = item.href;
				}

				return href;
			}
		},

		wrap  : null,
		list  : null,
		width : 0,

		init: function (opts, obj) {
			var that = this,
				list,
				thumbWidth  = opts.width,
				thumbHeight = opts.height,
				thumbSource = opts.source;

			//Build list structure
			list = &apos;&apos;;

			for (var n = 0; n &lt; obj.group.length; n++) {
				list += &apos;<li><a style="width:&apos; + thumbWidth + &apos;px;height:&apos; + thumbHeight + &apos;px;" href="javascript:jQuery.fancybox.jumpto(&apos; + n + &apos;);" target="_blank" rel="external"></a></li>&apos;;
			}

			this.wrap = $(&apos;<div id="fancybox-thumbs"></div>&apos;).addClass(opts.position).appendTo(&apos;body&apos;);
			this.list = $(&apos;<ul>&apos; + list + &apos;</ul>&apos;).appendTo(this.wrap);

			//Load each thumbnail
			$.each(obj.group, function (i) {
				var el   = obj.group[ i ],
					href = thumbSource( el );

				if (!href) {
					return;
				}

				$(&quot;<img>&quot;).load(function () {
					var width  = this.width,
						height = this.height,
						widthRatio, heightRatio, parent;

					if (!that.list || !width || !height) {
						return;
					}

					//Calculate thumbnail width/height and center it
					widthRatio  = width / thumbWidth;
					heightRatio = height / thumbHeight;

					parent = that.list.children().eq(i).find(&apos;a&apos;);

					if (widthRatio &gt;= 1 &amp;&amp; heightRatio &gt;= 1) {
						if (widthRatio &gt; heightRatio) {
							width  = Math.floor(width / heightRatio);
							height = thumbHeight;

						} else {
							width  = thumbWidth;
							height = Math.floor(height / widthRatio);
						}
					}

					$(this).css({
						width  : width,
						height : height,
						top    : Math.floor(thumbHeight / 2 - height / 2),
						left   : Math.floor(thumbWidth / 2 - width / 2)
					});

					parent.width(thumbWidth).height(thumbHeight);

					$(this).hide().appendTo(parent).fadeIn(300);

				})
				.attr(&apos;src&apos;,   href)
				.attr(&apos;title&apos;, el.title);
			});

			//Set initial width
			this.width = this.list.children().eq(0).outerWidth(true);

			this.list.width(this.width * (obj.group.length + 1)).css(&apos;left&apos;, Math.floor($(window).width() * 0.5 - (obj.index * this.width + this.width * 0.5)));
		},

		beforeLoad: function (opts, obj) {
			//Remove self if gallery do not have at least two items
			if (obj.group.length &lt; 2) {
				obj.helpers.thumbs = false;

				return;
			}

			//Increase bottom margin to give space for thumbs
			obj.margin[ opts.position === &apos;top&apos; ? 0 : 2 ] += ((opts.height) + 15);
		},

		afterShow: function (opts, obj) {
			//Check if exists and create or update list
			if (this.list) {
				this.onUpdate(opts, obj);

			} else {
				this.init(opts, obj);
			}

			//Set active element
			this.list.children().removeClass(&apos;active&apos;).eq(obj.index).addClass(&apos;active&apos;);
		},

		//Center list
		onUpdate: function (opts, obj) {
			if (this.list) {
				this.list.stop(true).animate({
					&apos;left&apos;: Math.floor($(window).width() * 0.5 - (obj.index * this.width + this.width * 0.5))
				}, 150);
			}
		},

		beforeClose: function () {
			if (this.wrap) {
				this.wrap.remove();
			}

			this.wrap  = null;
			this.list  = null;
			this.width = 0;
		}
	}

}(jQuery));<link href="/css/prism-tomorrow.css" rel="stylesheet">