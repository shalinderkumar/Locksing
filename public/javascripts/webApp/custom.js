/*** navbar js ***/
$('.navbar li a').click(function(){
	$(this).parent('li').siblings('li').removeClass('change');
	$(this).parent('li').siblings('li').find('.drop-wrap').slideUp();
	$(this).parent('li').find('.drop-wrap').slideToggle();
	$(this).parent('li').toggleClass('change');
});

$('.tab-navigation li a').click(function(){
	$('.action-data').removeClass('show');
	$(".tab-navigation li .tabs").toggleClass('show');

});
$(document).click(function(){
	$('.tab-navigation li .tabs').removeClass('show');
});
$('.tab-navigation li a').click(function(e){
    e.stopPropagation();
});
$('.tabs').click(function(e){
    e.stopPropagation();
});


$(document).ready(function(){
	
	$('.tab-navigation .tabs li:first a').click(function(){
		$('.tab-navigation li a.drop span.mdi').removeClass('mdi-grid').addClass('mdi-view-grid');
	});
	$('.tab-navigation .tabs li:last a').click(function(){
		$('.tab-navigation li a.drop span.mdi').removeClass('mdi-grid').addClass('mdi-format-list-bulleted');
	});
	$('.tabs li a').click(function(){
		var tab_id = $(this).attr('data-tab');

		$('.tabs li a').removeClass('current');
		$('.tab-content').removeClass('current');

		$(this).addClass('current');
		$("#"+tab_id).addClass('current');
	})

})


/**pop up**/	
		
	function common_popup(common){
		setTimeout(function(){$(".modal-window-wrapper").addClass("modal-wrapper-visible");}, 100);
		setTimeout(function(){$(common).addClass("modal-window-visible");}, 100);	
		setTimeout(function(){$(common).addClass("modal-window-visible1");}, 200);
		setTimeout(function(){$("body").addClass("no-scroll");}, 100); 
	}	
	$('.modal-window-wrapper').on('click', function(e) {
		  if (e.target == this){
			setTimeout(function(){$(".modal-window-wrapper").removeClass("modal-wrapper-visible");}, 300);
			setTimeout(function(){$(".modal-window").removeClass("modal-window-visible");}, 200);	
			setTimeout(function(){$(".modal-window").removeClass("modal-window-visible1");}, 100);
			setTimeout(function(){$("body").removeClass("no-scroll");}, 200);  		
		  return;
	  }
	 });

	function close_pop()
	{
		setTimeout(function(){$(".modal-window-wrapper").removeClass("modal-wrapper-visible");}, 300);
		setTimeout(function(){$(".modal-window").removeClass("modal-window-visible");}, 200);	
		setTimeout(function(){$(".modal-window").removeClass("modal-window-visible1");}, 100);			
		setTimeout(function(){$("body").removeClass("no-scroll");}, 200);  
	}	

    $(".cancel_cp").click(function(){
		setTimeout(function(){$(".cropper-wrapper").removeClass("modal-wrapper-visible");}, 300);
		setTimeout(function(){$(".cropper-window").removeClass("modal-window-visible");}, 200);		
		setTimeout(function(){$(".cropper-window").removeClass("modal-window-visible1");}, 100);
		setTimeout(function(){$("body").removeClass("fix-scroll");}, 200);	
    });


/*tooltip*/
if ($(window).width() > 992) {
$('.custom-tooltip').hover(function(){
		var title = $(this).attr('data-name');
	 	$(this).append('<span class="tooltip">'+ title + '</span>').fadeIn('slow');;
	},function() {$('.tooltip').remove();
});
}


//scroll
		(function($){
			$(window).on("load",function(){
				if ($(window).width() > 992) {				
					$(".scroll_custom").mCustomScrollbar({
						mouseWheelPixels: 500	
					});
				}
			});
		})(jQuery); 	


 $('#menu_toggle').click(function() {
        $('body').addClass('toggle-nav');        
    });
 $(document).click(function(){
		$('body').removeClass('toggle-nav');
		});
  $('.close-icon a').click(function(){
		$('body').removeClass('toggle-nav');
		});
	$('#menu_toggle,.wrapper .left-panel').click(function(e){
		    e.stopPropagation();
		});


	$('.search-t-b a').click(function(){
		$('.common-section.search').toggle();
		$('.common-section.search input[type="text"]').focus();
		$('#datepicker').hide();
	});
	
	if ($(window).width() < 600) {
		$(document).click(function(){
			$('.common-section.search').hide();
		});
	}
	
	$('.search-t-b a,.common-section.search').click(function(e){
		    e.stopPropagation();
		});

	$('.table tr:last .action a').click(function(){
        var  data_height = $('.action-data').innerHeight();
        $('.table-wrapper').css('padding-bottom', data_height )
    });
     $('.table tr:nth-last-child(2) .action a').click(function(){
        var  data_height = $('.action-data').innerHeight();
        $('.table-wrapper').css('padding-bottom', data_height )
    });
    $(document).click(function(){
        $('.table-wrapper').css('padding-bottom', '0' )
    });
   
