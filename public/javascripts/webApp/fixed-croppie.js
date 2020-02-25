var Demo = (function() {
	function output(node) {
		var existing = $('#result .croppie-result');
		if (existing.length > 0) {
			existing[0].parentNode.replaceChild(node, existing[0]);
		}
		else {
			$('#result')[0].appendChild(node);
		}
	}
	function popupResult(result) {
		//()
		var html;
		if (result.html) {
			html = result.html;
		}
		if (result.src) {
			html = '<li><img class="priview_image_src" src="' + result.src + '" /></li>';
			$(".single-img").addClass("add-edit");
		}
		$('#sample_profile_input').val(result.src);
		//$('#company_logo').val(result.src);
		$('.priview_image').html(html);
		$('#profile_edit_image').addClass('agent-pic');
			setTimeout(function(){$(".cropper-wrapper").removeClass("modal-wrapper-visible");}, 300);
			setTimeout(function(){$(".cropper-window").removeClass("modal-window-visible");}, 200);		
			setTimeout(function(){$(".cropper-window").removeClass("modal-window-visible1");}, 100);
			setTimeout(function(){$("body").removeClass("fix-scroll");}, 200);
		}


	function demoUpload(){
		var $uploadCrop;		
		function readFile(input) {
			setTimeout(function(){$(".cropper-wrapper").addClass("modal-wrapper-visible");}, 100);
			setTimeout(function(){$(".cropper-window").addClass("modal-window-visible");}, 100);		
			setTimeout(function(){$(".cropper-window").addClass("modal-window-visible1");}, 200);
			setTimeout(function(){$("body").addClass("fix-scroll");}, 100);
			
 			 if (input.files && input.files[0]) {
	            var reader = new FileReader();
	            
	            reader.onload = function (e) {
			$('.upload-demo').addClass('ready');
	            	$uploadCrop.croppie('bind', {
	            		url: e.target.result
	            	}).then(function(){
	            		console.log('jQuery bind complete');
	            	});
	            	
	            }
	            
	            setTimeout(function(){ reader.readAsDataURL(input.files[0]); }, 300);
	        }else {
		        swal("Sorry - you're browser doesn't support the FileReader API");
		    }
		}

		$uploadCrop = $('#upload-demo').croppie({
			viewport: {
				width: 250,
				height: 250

			},		
			enableExif: true
		});

		$('.upload').on('change', function () {
			//croping_image_popup(); 
			readFile(this); 
		});
		$('.upload-result').on('click', function (ev) {
			$uploadCrop.croppie('result', {
				type: 'canvas',
				size: 'viewport'
			}).then(function (resp) {
				//alert('aaaaaaaa');
				popupResult({
					src: resp
				});
			});
		});
	}

	function init() {
		demoUpload();
	}

	return {
		init: init
	};
})();

    $(".submit-clear").click(function(){
		setTimeout(function(){$(".cropper-wrapper").removeClass("modal-wrapper-visible");}, 300);
		setTimeout(function(){$(".cropper-window").removeClass("modal-window-visible");}, 200);		
		setTimeout(function(){$(".cropper-window").removeClass("modal-window-visible1");}, 100);
		setTimeout(function(){$(".cropper-wrapper1").removeClass("modal-wrapper-visible");}, 300);
		setTimeout(function(){$(".cropper-window1").removeClass("modal-window-visible");}, 200);		
		setTimeout(function(){$(".cropper-window1").removeClass("modal-window-visible1");}, 100);		
		setTimeout(function(){$("body").removeClass("fix-scroll");}, 200);	
    });