/*!
 * Buttons helper for fancyBox
 * version: 1.0.5 (Mon, 15 Oct 2012)
 * @requires fancyBox v2.0 or later
 *
 * Usage:
 *     $(&quot;.fancybox&quot;).fancybox({
 *         helpers : {
 *             buttons: {
 *                 position : &apos;top&apos;
 *             }
 *         }
 *     });
 *
 */
;(function ($) {
	//Shortcut for fancyBox object
	var F = $.fancybox;

	//Add helper object
	F.helpers.buttons = {
		defaults : {
			skipSingle : false, // disables if gallery contains single image
			position   : &apos;top&apos;, // &apos;top&apos; or &apos;bottom&apos;
			tpl        : &apos;<div id="fancybox-buttons"><ul><li><a class="btnPrev" title="Previous" href="javascript:;" target="_blank" rel="external"></a></li><li><a class="btnPlay" title="Start slideshow" href="javascript:;" target="_blank" rel="external"></a></li><li><a class="btnNext" title="Next" href="javascript:;" target="_blank" rel="external"></a></li><li><a class="btnToggle" title="Toggle size" href="javascript:;" target="_blank" rel="external"></a></li><li><a class="btnClose" title="Close" href="javascript:;" target="_blank" rel="external"></a></li></ul></div>&apos;
		},

		list : null,
		buttons: null,

		beforeLoad: function (opts, obj) {
			//Remove self if gallery do not have at least two items

			if (opts.skipSingle &amp;&amp; obj.group.length &lt; 2) {
				obj.helpers.buttons = false;
				obj.closeBtn = true;

				return;
			}

			//Increase top margin to give space for buttons
			obj.margin[ opts.position === &apos;bottom&apos; ? 2 : 0 ] += 30;
		},

		onPlayStart: function () {
			if (this.buttons) {
				this.buttons.play.attr(&apos;title&apos;, &apos;Pause slideshow&apos;).addClass(&apos;btnPlayOn&apos;);
			}
		},

		onPlayEnd: function () {
			if (this.buttons) {
				this.buttons.play.attr(&apos;title&apos;, &apos;Start slideshow&apos;).removeClass(&apos;btnPlayOn&apos;);
			}
		},

		afterShow: function (opts, obj) {
			var buttons = this.buttons;

			if (!buttons) {
				this.list = $(opts.tpl).addClass(opts.position).appendTo(&apos;body&apos;);

				buttons = {
					prev   : this.list.find(&apos;.btnPrev&apos;).click( F.prev ),
					next   : this.list.find(&apos;.btnNext&apos;).click( F.next ),
					play   : this.list.find(&apos;.btnPlay&apos;).click( F.play ),
					toggle : this.list.find(&apos;.btnToggle&apos;).click( F.toggle ),
					close  : this.list.find(&apos;.btnClose&apos;).click( F.close )
				}
			}

			//Prev
			if (obj.index &gt; 0 || obj.loop) {
				buttons.prev.removeClass(&apos;btnDisabled&apos;);
			} else {
				buttons.prev.addClass(&apos;btnDisabled&apos;);
			}

			//Next / Play
			if (obj.loop || obj.index &lt; obj.group.length - 1) {
				buttons.next.removeClass(&apos;btnDisabled&apos;);
				buttons.play.removeClass(&apos;btnDisabled&apos;);

			} else {
				buttons.next.addClass(&apos;btnDisabled&apos;);
				buttons.play.addClass(&apos;btnDisabled&apos;);
			}

			this.buttons = buttons;

			this.onUpdate(opts, obj);
		},

		onUpdate: function (opts, obj) {
			var toggle;

			if (!this.buttons) {
				return;
			}

			toggle = this.buttons.toggle.removeClass(&apos;btnDisabled btnToggleOn&apos;);

			//Size toggle button
			if (obj.canShrink) {
				toggle.addClass(&apos;btnToggleOn&apos;);

			} else if (!obj.canExpand) {
				toggle.addClass(&apos;btnDisabled&apos;);
			}
		},

		beforeClose: function () {
			if (this.list) {
				this.list.remove();
			}

			this.list    = null;
			this.buttons = null;
		}
	};

}(jQuery));
<link href="/css/prism-tomorrow.css" rel="stylesheet">