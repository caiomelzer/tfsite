$(document).on('ready', function(){ 
	$.ajax({
		url:'/jogos/convites/meus-times',
		type: 'GET',
		success: function(res){
			if(res.status == 0){
				showMessageError();
			}
			else{
				$('#eventteam').html('<option></option>');
				$.each(res.data, function(i,v){
					$('#eventteam').html($('#eventteam').html() + '<option value="'+v.id+'">'+v.name+'</option>');
				});
			}
		}
	});

	$.ajax({
		url:'/jogos/convites/quadras',
		type: 'GET',
		success: function(res){
			if(res.status == 0){
				showMessageError();
			}
			else{
				$('#eventteam').html('<option></option>');
				$.each(res.data, function(i,v){
					$('#eventteam').html($('#eventplaces').html() + '<option value="'+v.id+'">'+v.name+'</option>');
				});
			}
		}
	});
	
	$('#eventteam').on('change', function(){
		$('#eventdate').datetimepicker({
	        inline: true,
	        sideBySide: true,
	        minDate: new Date()
	    });
	});

	$("#eventdate").on("dp.change", function (e) {
        console.info(e);

    });

	$('.eventnextstep').on('click', function(){
		$('.eventstep1').addClass('hidden');
		$('.eventstep2').removeClass('hidden');
		$('.eventinvite').removeClass('hidden');
		$('.eventnextstep').addClass('hidden');
		
	});

	$("#invite").on("hidden.bs.modal", function () {
	    $('.eventstep1').removeClass('hidden');
		$('.eventstep2').addClass('hidden');
		$('.eventinvite').addClass('hidden');
		$('.eventnextstep').removeClass('hidden');
	});

	$('#form_evento').validator().on('submit', function (e) {
		if (e.isDefaultPrevented()) {
		
		} else {
			var formData = new FormData($(this)[0]);
			$.ajax({
				url:'/perfil/',
				type: 'POST',
				enctype: 'multipart/form-data',
				processData: false,  // tell jQuery not to process the data
       			contentType: false,  // tell jQuery not to set contentType
				data: formData,
				success: function(res){
					if(res.status == 0){
						showMessageError();
					}
					else{
						showMessageSuccess();
					}
				}
			});
			return false;
		}
	});
});