$( document ).ready(function() {

    console.log( "ready!" );

    if ($('.smart-scroll').length > 0) {
        smartScrollNav();
    }
    if ($('.page-scroll-progress').length > 0) {
        scrollProgressBar();
    }

    var scroll = new SmoothScroll('a[href*="#"]');
});
AOS.init();

//parallax
var parallaxImageltr = document.getElementsByClassName('left-to-right-parallax');
new simpleParallax(parallaxImageltr, {
	orientation: 'right',
    delay: .2,
	transition: 'cubic-bezier(0,0,0,1)'
});

var parallaxImagertl = document.getElementsByClassName('right-to-left-parallax');
new simpleParallax(parallaxImagertl, {
	orientation: 'left',
    delay: .2,
	transition: 'cubic-bezier(0,0,0,1)'
});

var parallaxImageud = document.getElementsByClassName('up-down-parallax');
new simpleParallax(parallaxImagertl, {
	orientation: 'up',
    delay: .2,
	transition: 'cubic-bezier(0,0,0,1)'
});

var parallaxImagedu = document.getElementsByClassName('down-up-parallax');
new simpleParallax(parallaxImagertl, {
	orientation: 'down',
    delay: .2,
	transition: 'cubic-bezier(0,0,0,1)'
});

//Scroll progress bar
function scrollProgressBar() {
    console.log( "Scroll progress here" );
    var getMax = function () {
      return $(document).height() - $(window).height();
    };
  
    var getValue = function () {
      return $(window).scrollTop();
    };
  
    var progressBar = $(".progress-bar"),
      max = getMax(),
      value,
      width;
  
    var getWidth = function () {
      // Calculate width in percentage
      value = getValue();
      width = (value / max) * 100;
      width = width + "%";
      return width;
    };
  
    var setWidth = function () {
      progressBar.css({ width: getWidth() });
    };
  
    $(document).on("scroll", setWidth);
    $(window).on("resize", function () {
      // Need to reset max
      max = getMax();
      setWidth();
    });
    
  }

/* NAV */
// add padding top to show content behind navbar
//$('body').css('padding-top', $('.smart-scroll')+ '90px')

// detect scroll top or down
function smartScrollNav() {   
    var last_scroll_top = 0;
    $(window).on('scroll', function() {
        scroll_top = $(this).scrollTop();
        if(scroll_top < last_scroll_top) {
            $('.smart-scroll').removeClass('scrolled-down').addClass('scrolled-up');
        }
		if(scroll_top < 10) {
			$('.smart-scroll').removeClass('scrolled-up').removeClass('scrolled-down');
		}
		if(scroll_top > last_scroll_top) { 
            $('.smart-scroll').removeClass('scrolled-up').addClass('scrolled-down');
        }
	
        last_scroll_top = scroll_top;
    });
    console.log( "Nav here" );
}