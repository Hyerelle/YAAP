jQuery(document).ready(function($) {

    /* ======= Scrollspy ======= */
    $('body').scrollspy({ target: '#header', offset: 400});
    
    /* ======= Fixed header when scrolled ======= */
    
    $(window).bind('scroll', function() {
         if ($(window).scrollTop() > 50) {
             $('#header').addClass('navbar-fixed-top');
         }
         else {
             $('#header').removeClass('navbar-fixed-top');
         }
    });
   
    /* ======= ScrollTo ======= */
    $('a.scrollto').on('click', function(e){
        
        //store hash
        var target = this.hash;
                
        e.preventDefault();
        
		$('body').scrollTo(target, 800, {offset: -70, 'axis':'y', easing:'easeOutQuad'});
        //Collapse mobile menu after clicking
		if ($('.navbar-collapse').hasClass('in')){
			$('.navbar-collapse').removeClass('in').addClass('collapse');
		}
		
	});

    var $title = $('h2.title.animated');
    var $subtitle = $('p.intro.animated.sub');
    var $listIntro = $('p.intro.animated.list')

    var triggerTitle = function() {
        $title.addClass('fadeInLeft');
        // setTimeout(function() { $subtitle.css('visibility', 'visible'); $subtitle.addClass('fadeInRight'); }, 250)
        $subtitle.addClass('fadeInRight');

    }

    var triggerListIntro = function() {
        $listIntro.each(function(i) {
            var $elt = $(this);
            setTimeout(function() { $elt.css('visibility', 'visible'); $elt.addClass('fadeInDown'); }, i*250)
        })
    }

    triggerTitle();
    setTimeout(triggerListIntro, 500)

});