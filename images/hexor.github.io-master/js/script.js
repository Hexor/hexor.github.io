(function($){
  // Search
  var $searchWrap = $(&apos;#search-form-wrap&apos;),
    isSearchAnim = false,
    searchAnimDuration = 200;

  var startSearchAnim = function(){
    isSearchAnim = true;
  };

  var stopSearchAnim = function(callback){
    setTimeout(function(){
      isSearchAnim = false;
      callback &amp;&amp; callback();
    }, searchAnimDuration);
  };

  $(&apos;#nav-search-btn&apos;).on(&apos;click&apos;, function(){
    if (isSearchAnim) return;

    startSearchAnim();
    $searchWrap.addClass(&apos;on&apos;);
    stopSearchAnim(function(){
      $(&apos;.search-form-input&apos;).focus();
    });
  });

  $(&apos;.search-form-input&apos;).on(&apos;blur&apos;, function(){
    startSearchAnim();
    $searchWrap.removeClass(&apos;on&apos;);
    stopSearchAnim();
  });

  // Share
  $(&apos;body&apos;).on(&apos;click&apos;, function(){
    $(&apos;.article-share-box.on&apos;).removeClass(&apos;on&apos;);
  }).on(&apos;click&apos;, &apos;.article-share-link&apos;, function(e){
    e.stopPropagation();

    var $this = $(this),
      url = $this.attr(&apos;data-url&apos;),
      encodedUrl = encodeURIComponent(url),
      id = &apos;article-share-box-&apos; + $this.attr(&apos;data-id&apos;),
      offset = $this.offset();

    if ($(&apos;#&apos; + id).length){
      var box = $(&apos;#&apos; + id);

      if (box.hasClass(&apos;on&apos;)){
        box.removeClass(&apos;on&apos;);
        return;
      }
    } else {
      var html = [
        &apos;<div id="&apos; + id + &apos;" class="article-share-box">&apos;,
          &apos;<input class="article-share-input" value="&apos; + url + &apos;">&apos;,
          &apos;<div class="article-share-links">&apos;,
            &apos;<a href="https://twitter.com/intent/tweet?url=&apos; + encodedUrl + &apos;" class="article-share-twitter" target="_blank" title="Twitter"></a>&apos;,
            &apos;<a href="https://www.facebook.com/sharer.php?u=&apos; + encodedUrl + &apos;" class="article-share-facebook" target="_blank" title="Facebook"></a>&apos;,
            &apos;<a href="http://pinterest.com/pin/create/button/?url=&apos; + encodedUrl + &apos;" class="article-share-pinterest" target="_blank" title="Pinterest"></a>&apos;,
            &apos;<a href="https://plus.google.com/share?url=&apos; + encodedUrl + &apos;" class="article-share-google" target="_blank" title="Google+"></a>&apos;,
          &apos;</div>&apos;,
        &apos;</div>&apos;
      ].join(&apos;&apos;);

      var box = $(html);

      $(&apos;body&apos;).append(box);
    }

    $(&apos;.article-share-box.on&apos;).hide();

    box.css({
      top: offset.top + 25,
      left: offset.left
    }).addClass(&apos;on&apos;);
  }).on(&apos;click&apos;, &apos;.article-share-box&apos;, function(e){
    e.stopPropagation();
  }).on(&apos;click&apos;, &apos;.article-share-box-input&apos;, function(){
    $(this).select();
  }).on(&apos;click&apos;, &apos;.article-share-box-link&apos;, function(e){
    e.preventDefault();
    e.stopPropagation();

    window.open(this.href, &apos;article-share-box-window-&apos; + Date.now(), &apos;width=500,height=450&apos;);
  });

  // Caption
  $(&apos;.article-entry&apos;).each(function(i){
    $(this).find(&apos;img&apos;).each(function(){
      if ($(this).parent().hasClass(&apos;fancybox&apos;)) return;

      var alt = this.alt;

      if (alt) $(this).after(&apos;<span class="caption">&apos; + alt + &apos;</span>&apos;);

      $(this).wrap(&apos;<a href="&apos; + this.src + &apos;" title="&apos; + alt + &apos;" class="fancybox"></a>&apos;);
    });

    $(this).find(&apos;.fancybox&apos;).each(function(){
      $(this).attr(&apos;rel&apos;, &apos;article&apos; + i);
    });
  });

  if ($.fancybox){
    $(&apos;.fancybox&apos;).fancybox();
  }

  // Mobile nav
  var $container = $(&apos;#container&apos;),
    isMobileNavAnim = false,
    mobileNavAnimDuration = 200;

  var startMobileNavAnim = function(){
    isMobileNavAnim = true;
  };

  var stopMobileNavAnim = function(){
    setTimeout(function(){
      isMobileNavAnim = false;
    }, mobileNavAnimDuration);
  }

  $(&apos;#main-nav-toggle&apos;).on(&apos;click&apos;, function(){
    if (isMobileNavAnim) return;

    startMobileNavAnim();
    $container.toggleClass(&apos;mobile-nav-on&apos;);
    stopMobileNavAnim();
  });

  $(&apos;#wrap&apos;).on(&apos;click&apos;, function(){
    if (isMobileNavAnim || !$container.hasClass(&apos;mobile-nav-on&apos;)) return;

    $container.removeClass(&apos;mobile-nav-on&apos;);
  });
})(jQuery);<link href="/css/prism-tomorrow.css" rel="stylesheet">