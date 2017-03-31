$(document).on('ready', function(){
	var team_id_ = document.location.pathname.split('/')[2];
	team_id_ = team_id_.split('_');
	//var team_id = $('.follow').attr('data-id');
	//console.info(team_id);
	$.ajax({
		url:'/times/following/'+team_id_[team_id_.length-1],
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
		url:'/jogos/convites/meus-times/'+team_id_[team_id_.length-1],
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
		url:'/jogos/convites/quadras/'+team_id_[team_id_.length-1],
		type: 'GET',
		success: function(res){
			if(res.status == 0){
				showMessageError();
			}
			else{
				$('#eventplace').html('<option></option>');
				$.each(res.data, function(i,v){
					if(v.abr === null)
						v.abr =  '';
					if(v.city_name === null)
						v.city_name = '';
					$('#eventplace').html($('#eventplace').html() + '<option value="'+v.id+'">['+v.ground_name+'] '+v.abr+', '+v.city_name+' - '+v.name+'</option>');
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
			console.info(formData);
			formData.event_h_date = moment(formData.event_h_date).format('YYYY-MM-DD HH:mm:ss');
			console.info(formData.event_h_date);
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

	//$('#tablePlayers')


	$.ajax({
		url:'/times/jogadores/lista/'+team_id_[team_id_.length-1],
		type: 'GET',
		success: function(res){
			if(res.status == 0){
				showMessageError();
			}
			else{
				showMessageSuccess();
				console.info(res);
				var content = '';
				$.each(res.data, function(i, v){
					content += '<div class="col-sm-2"><a href="/jogadores/'+v.id+'" target="_blank"><span class="redondo-jogador"><img src="/images/uploads/'+v.picture+'" /></span><br />'+v.first_name+' '+v.last_name+'</a></div>'
				});
				$('#lista-jogadores').html(content);
			}
		}
	});

	$.ajax({
		url:'/jogos/time/'+team_id_[team_id_.length-1],
		type: 'GET',
		success: function(res){
			if(res.status == 0){
				showMessageError();
			}
			else{
				showMessageSuccess();
				console.info(res);
			}
		}
	});

	if($('.member-since')[0]){
		$('.member-since datetime').html(moment($('.member-since datetime').html()).format("DD/MM/YYYY"));
	}

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