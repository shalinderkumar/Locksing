 

/**show login**/

$("#login_show").click(function(){
    $(".sign_up").fadeOut(300);
     $(".login").fadeIn(300);
});
/**show signup**/
$("#sign_up_show").click(function(){
    $(".login").fadeOut(300);
     $(".sign_up").fadeIn(300);
});
/**fogot password**/

$(".forgot-psd").click(function(){
    $(".login").fadeOut(300);
     $(".forgot").fadeIn(300);
     setTimeout(function(){$(".forgot").addClass("fade-show");}, 320);
});

/**show login fg**/

$("#back_login").click(function(){
    $(".forgot").fadeOut(300);
     $(".login").fadeIn(300);
    setTimeout(function(){$(".forgot").removeClass("fade-show");}, 50); 
});

/**pop up**/
var w = (window.innerWidth - (document.documentElement.clientWidth|| document.body.clientWidth));
function common_popup(common){
		setTimeout(function(){$(".modal-window-wrapper").addClass("modal-wrapper-visible");}, 100);
		setTimeout(function(){$(common).addClass("modal-window-visible");}, 100);	
		setTimeout(function(){$(common).addClass("modal-window-visible1");}, 200);
		setTimeout(function(){$("body").addClass("no-scroll");}, 100); 
		$("body").css({'padding-right': w });	
	}	
	$('.modal-window-wrapper').on('click', function(e) {
		  if (e.target == this){

			setTimeout(function(){$(".modal-window-wrapper").removeClass("modal-wrapper-visible");}, 300);
			setTimeout(function(){$(".modal-window").removeClass("modal-window-visible");}, 200);	
			setTimeout(function(){$(".modal-window").removeClass("modal-window-visible1");}, 100);
			setTimeout(function(){$("body").removeClass("no-scroll");}, 200);  
			$("body").css({'padding-right': '0' });	
		  return;
	  }
	 });

	function close_pop()
	{
		setTimeout(function(){$(".modal-window-wrapper").removeClass("modal-wrapper-visible");}, 300);
		setTimeout(function(){$(".modal-window").removeClass("modal-window-visible");}, 200);	
		setTimeout(function(){$(".modal-window").removeClass("modal-window-visible1");}, 100);
			
		setTimeout(function(){$("body").removeClass("no-scroll");}, 200); 
		$("body").css({'padding-right': '0' });	 

	}

	 // tabbed content
    $(".tabs_content").hide();
    $(".tabs_content:first").show();
    $(".responsivetabs li a:first").addClass("active");
    /* if in tab mode */
    $(".responsivetabs > li > a").click(function () {
        $(".tabs_content").hide();
        var activeTab = $(this).attr("rel");
        $("#" + activeTab).fadeIn();
        $(".responsivetabs > li > a").removeClass("active");
        $(this).addClass("active");
		
    });
 // text  change signature
    function change_text() {
        var text = $('#name').val();
        $('.text_style').html(text);
    }
//video

$('#video').on('ended',function(){
	$('#video').get(0).pause();
	$('#video').attr("controls",false);
	$("#video").attr("autoplay",false);	
	$('#video').get(0).load();
	$(".play-btn").removeClass("pause");
	$(".play-btn").fadeIn();
  });

function videoEnded() {
    $('#video').attr("controls",false);
	$("#video").attr("autoplay",false);
	$('#video').attr("preload","none");
	$('#video').attr('poster', 'images/poster.jpg');
	$('.video3#video').attr('poster', 'images/poster.jpg');
}


$(document).ready(function(){
	$(".play-btn").on("click",function(){
		$(this).toggleClass("pause");
		if($(this).hasClass("pause"))
		{
			$(this).fadeOut();
			$('#video').attr("controls",true);
			$('#video').attr("autoplay",true);
			$('#video').attr("preload",true);
			$('#video').get(0).play();
		}
		else{
			$(this).fadeIn();
			$('#video').attr("controls",false);
			$("#video").attr("autoplay",false);
			$('#video').attr("preload","none");
			$('#video').get(0).pause();
		}
	});
  });  

    /*left side menu*/
if ($(window).width() < 767)
{     
    $('#menu_toggle').click(function() {
        $(this).toggleClass("active");
		var el = $("body");
		if(el.hasClass('toggled-left')) el.removeClass("toggled-left");
		else el.addClass('toggled-left');
        return false; 
    });


    $('.menu ul li a').click(function() {
        $("#menu_toggle").removeClass("active");
        $('body').removeClass('toggled-left');
    });

    $('.menu, .header').click(function() {
        $("#menu_toggle").removeClass("active");
        $('body').removeClass('toggled-left');
    });
  };


$(window).scroll(function() {    
    var scroll = $(window).scrollTop();

    if (scroll >= 50) {
        $(".wrapper.home-page .header").addClass("darkHeader");
    } else {
        $(".wrapper.home-page .header").removeClass("darkHeader");
    }
});
$(window).load(function(){
    var scroll = $(window).scrollTop();

    if (scroll >= 50) {
        $(".wrapper.home-page .header").addClass("darkHeader");
    } else {
        $(".wrapper.home-page .header").removeClass("darkHeader");
    }

});	

  $(function(){
      var App = {
        init: function() {
            App.Preloader();
        },
        Preloader: function() {
          $(window).load(function() {
              $('#status').delay(400).fadeOut('slow');
              $('#preloader').delay(500).fadeOut(800);            
              $('body').delay(100).removeClass("no-scroll");
          })
        }
      }
      $(function() {
        App.init();
      });
    });

  