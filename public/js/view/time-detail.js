$(document).on('ready', function(){
	var team_id = $('.follow').attr('data-id');
	$.ajax({
		url:'/times/following/'+team_id,
		type: 'GET',
		success: function(res){
			if(res.status == 0){
				showMessageError();
			}
			else{
				if(res.data === 0)
					$('.follow').removeClass('hidden');
				else
					$('.unfollow').removeClass('hidden');
			}
		}
	});

	$.ajax({
		url:'/jogos/convites/meus-times/'+team_id,
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
		url:'/jogos/convites/quadras/'+team_id,
		type: 'GET',
		success: function(res){
			if(res.status == 0){
				showMessageError();
			}
			else{
				$('#eventplace').html('<option></option>');
				$.each(res.data, function(i,v){
					$('#eventplace').html($('#eventplace').html() + '<option value="'+v.id+'">'+v.abr+', '+v.city_name+' - '+v.name+'</option>');
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
        $('input[name=event_h_date]').val(e.date._d);
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
			var formData = $('#form_evento').serializeObject();
			$.ajax({
				url:'/jogos/convites',
				type: 'POST',
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
			$('#invite').modal('hide');
			return false;
		}
	});

	$('.follow').on('click', function(e){
		var team_id = $(this).attr('data-id');
		$.ajax({
			url:'/times/follow/'+team_id,
			type: 'POST',
			success: function(res){
				if(res.status == 0){
					showMessageError();
				}
				else{
					showMessageSuccess();
					$('.unfollow').removeClass('hidden');
					$('.follow').addClass('hidden');
				}
			}
		});
	});

	$('.unfollow').on('click', function(e){
		var team_id = $(this).attr('data-id');
		$.ajax({
			url:'/times/unfollow/'+team_id,
			type: 'POST',
			success: function(res){
				if(res.status == 0){
					showMessageError();
				}
				else{
					showMessageSuccess();
					$('.follow').removeClass('hidden');
					$('.unfollow').addClass('hidden');
				}
			}
		});
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