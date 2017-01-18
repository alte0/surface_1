(function($, undefined) {
	$(function() {

			//slick slider
			// var slider = $('.wrap-feature-columns');
			// slider.slick({
			// 	infinite: true,
			// 	speed: 1000,
			// 	slidesToShow: 1,
			// 	adaptiveHeight: true,
			// 	slidesToScroll: 1,
			// 	autoplay: true,
			// 	autoplaySpeed: 2500,
			// 	// arrows: false,
   //    });
   var $carousel = $('.wrap-feature-columns');
   var $heught = $('.feature-column');
           function showSliderScreen($widthScreen) {
               // console.log($widthScreen);

               if ($widthScreen <= "767") {
                   if (!$carousel.hasClass('slick-initialized')) {
                   		$heught.matchHeight();
                       $carousel.slick({
													infinite: true,
													speed: 1000,
													slidesToShow: 1,
													adaptiveHeight: true,
													slidesToScroll: 1,
													autoplay: true,
													autoplaySpeed: 4500,
													arrows: false,
													dots: true
                       });
                   }

               } else {
                   if ($carousel.hasClass('slick-initialized')) {
                       $carousel.slick('unslick');
                       $heught.matchHeight({ remove: true });
                   }
                }   
           }

           var widthScreen = $(window).width();
           $(window).ready(showSliderScreen(widthScreen)).resize(
               function () {
                   var widthScreen = $(window).width();
                   showSliderScreen(widthScreen);
               }
           );

	});
})(jQuery);
