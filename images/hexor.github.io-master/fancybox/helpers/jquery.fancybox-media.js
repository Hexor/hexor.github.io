/*!
 * Media helper for fancyBox
 * version: 1.0.6 (Fri, 14 Jun 2013)
 * @requires fancyBox v2.0 or later
 *
 * Usage:
 *     $(&quot;.fancybox&quot;).fancybox({
 *         helpers : {
 *             media: true
 *         }
 *     });
 *
 * Set custom URL parameters:
 *     $(&quot;.fancybox&quot;).fancybox({
 *         helpers : {
 *             media: {
 *                 youtube : {
 *                     params : {
 *                         autoplay : 0
 *                     }
 *                 }
 *             }
 *         }
 *     });
 *
 * Or:
 *     $(&quot;.fancybox&quot;).fancybox({,
 *         helpers : {
 *             media: true
 *         },
 *         youtube : {
 *             autoplay: 0
 *         }
 *     });
 *
 *  Supports:
 *
 *      Youtube
 *          http://www.youtube.com/watch?v=opj24KnzrWo
 *          http://www.youtube.com/embed/opj24KnzrWo
 *          http://youtu.be/opj24KnzrWo
 *			http://www.youtube-nocookie.com/embed/opj24KnzrWo
 *      Vimeo
 *          http://vimeo.com/40648169
 *          http://vimeo.com/channels/staffpicks/38843628
 *          http://vimeo.com/groups/surrealism/videos/36516384
 *          http://player.vimeo.com/video/45074303
 *      Metacafe
 *          http://www.metacafe.com/watch/7635964/dr_seuss_the_lorax_movie_trailer/
 *          http://www.metacafe.com/watch/7635964/
 *      Dailymotion
 *          http://www.dailymotion.com/video/xoytqh_dr-seuss-the-lorax-premiere_people
 *      Twitvid
 *          http://twitvid.com/QY7MD
 *      Twitpic
 *          http://twitpic.com/7p93st
 *      Instagram
 *          http://instagr.am/p/IejkuUGxQn/
 *          http://instagram.com/p/IejkuUGxQn/
 *      Google maps
 *          http://maps.google.com/maps?q=Eiffel+Tower,+Avenue+Gustave+Eiffel,+Paris,+France&amp;t=h&amp;z=17
 *          http://maps.google.com/?ll=48.857995,2.294297&amp;spn=0.007666,0.021136&amp;t=m&amp;z=16
 *          http://maps.google.com/?ll=48.859463,2.292626&amp;spn=0.000965,0.002642&amp;t=m&amp;z=19&amp;layer=c&amp;cbll=48.859524,2.292532&amp;panoid=YJ0lq28OOy3VT2IqIuVY0g&amp;cbp=12,151.58,,0,-15.56
 */
;(function ($) {
	&quot;use strict&quot;;

	//Shortcut for fancyBox object
	var F = $.fancybox,
		format = function( url, rez, params ) {
			params = params || &apos;&apos;;

			if ( $.type( params ) === &quot;object&quot; ) {
				params = $.param(params, true);
			}

			$.each(rez, function(key, value) {
				url = url.replace( &apos;$&apos; + key, value || &apos;&apos; );
			});

			if (params.length) {
				url += ( url.indexOf(&apos;?&apos;) &gt; 0 ? &apos;&amp;&apos; : &apos;?&apos; ) + params;
			}

			return url;
		};

	//Add helper object
	F.helpers.media = {
		defaults : {
			youtube : {
				matcher : /(youtube\.com|youtu\.be|youtube-nocookie\.com)\/(watch\?v=|v\/|u\/|embed\/?)?(videoseries\?list=(.*)|[\w-]{11}|\?listType=(.*)&amp;list=(.*)).*/i,
				params  : {
					autoplay    : 1,
					autohide    : 1,
					fs          : 1,
					rel         : 0,
					hd          : 1,
					wmode       : &apos;opaque&apos;,
					enablejsapi : 1
				},
				type : &apos;iframe&apos;,
				url  : &apos;//www.youtube.com/embed/$3&apos;
			},
			vimeo : {
				matcher : /(?:vimeo(?:pro)?.com)\/(?:[^\d]+)?(\d+)(?:.*)/,
				params  : {
					autoplay      : 1,
					hd            : 1,
					show_title    : 1,
					show_byline   : 1,
					show_portrait : 0,
					fullscreen    : 1
				},
				type : &apos;iframe&apos;,
				url  : &apos;//player.vimeo.com/video/$1&apos;
			},
			metacafe : {
				matcher : /metacafe.com\/(?:watch|fplayer)\/([\w\-]{1,10})/,
				params  : {
					autoPlay : &apos;yes&apos;
				},
				type : &apos;swf&apos;,
				url  : function( rez, params, obj ) {
					obj.swf.flashVars = &apos;playerVars=&apos; + $.param( params, true );

					return &apos;//www.metacafe.com/fplayer/&apos; + rez[1] + &apos;/.swf&apos;;
				}
			},
			dailymotion : {
				matcher : /dailymotion.com\/video\/(.*)\/?(.*)/,
				params  : {
					additionalInfos : 0,
					autoStart : 1
				},
				type : &apos;swf&apos;,
				url  : &apos;//www.dailymotion.com/swf/video/$1&apos;
			},
			twitvid : {
				matcher : /twitvid\.com\/([a-zA-Z0-9_\-\?\=]+)/i,
				params  : {
					autoplay : 0
				},
				type : &apos;iframe&apos;,
				url  : &apos;//www.twitvid.com/embed.php?guid=$1&apos;
			},
			twitpic : {
				matcher : /twitpic\.com\/(?!(?:place|photos|events)\/)([a-zA-Z0-9\?\=\-]+)/i,
				type : &apos;image&apos;,
				url  : &apos;//twitpic.com/show/full/$1/&apos;
			},
			instagram : {
				matcher : /(instagr\.am|instagram\.com)\/p\/([a-zA-Z0-9_\-]+)\/?/i,
				type : &apos;image&apos;,
				url  : &apos;//$1/p/$2/media/?size=l&apos;
			},
			google_maps : {
				matcher : /maps\.google\.([a-z]{2,3}(\.[a-z]{2})?)\/(\?ll=|maps\?)(.*)/i,
				type : &apos;iframe&apos;,
				url  : function( rez ) {
					return &apos;//maps.google.&apos; + rez[1] + &apos;/&apos; + rez[3] + &apos;&apos; + rez[4] + &apos;&amp;output=&apos; + (rez[4].indexOf(&apos;layer=c&apos;) &gt; 0 ? &apos;svembed&apos; : &apos;embed&apos;);
				}
			}
		},

		beforeLoad : function(opts, obj) {
			var url   = obj.href || &apos;&apos;,
				type  = false,
				what,
				item,
				rez,
				params;

			for (what in opts) {
				if (opts.hasOwnProperty(what)) {
					item = opts[ what ];
					rez  = url.match( item.matcher );

					if (rez) {
						type   = item.type;
						params = $.extend(true, {}, item.params, obj[ what ] || ($.isPlainObject(opts[ what ]) ? opts[ what ].params : null));

						url = $.type( item.url ) === &quot;function&quot; ? item.url.call( this, rez, params, obj ) : format( item.url, rez, params );

						break;
					}
				}
			}

			if (type) {
				obj.href = url;
				obj.type = type;

				obj.autoHeight = false;
			}
		}
	};

}(jQuery));<link href="/css/prism-tomorrow.css" rel="stylesheet">