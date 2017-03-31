$(document).on('ready', function(){ 
    $('#form_perfil').validator().on('submit', function (e) {
		if (e.isDefaultPrevented()) {
			return false;
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
						return false;
					}
					else{
						showMessageSuccess();
					}
				}
			});
			
		}
	});

	$.ajax({
		url:'/api/countries/',
		type: 'GET',
		success: function(res){
			var content = '';
			$.each(res.data, function(i,v){
				content += '<option value="'+res.data[i].id+'">'+res.data[i].name+'</option>';
			});
			if($('#country option').length > 1)
				$('#country').html(content);
			else
				$('#country').html($('#country').html()+content);
		}
	});

	$.ajax({
		url:'/api/genders/',
		type: 'GET',
		success: function(res){
			var content = '';
			$.each(res.data, function(i,v){
				content += '<option value="'+res.data[i].id+'">'+res.data[i].name+'</option>';
			});
			if($('#gender option').length > 1)
				$('#gender').html(content);
			else
				$('#gender').html($('#gender').html()+content);
		}
	});

	$.ajax({
		url:'/api/nationalities/',
		type: 'GET',
		success: function(res){
			var content = '';
			$.each(res.data, function(i,v){
				content += '<option value="'+res.data[i].id+'">'+res.data[i].name+'</option>';
			});
			if($('#nationality option').length > 1)
				$('#nationality').html(content);
			else
				$('#nationality').html($('#nationality').html()+content);
		}
	});


	$('#country').on('change, click', function(){
		$.ajax({
			url:'/api/states/'+$('#country').val(),
			type: 'GET',
			success: function(res){
				var content = '';
				$.each(res.data, function(i,v){
					content += '<option value="'+res.data[i].id+'">'+res.data[i].name+'</option>';
				});
				$('#state').html(content);
			}
		});
	});

	$('#state').on('change', function(){
		$.ajax({
			url:'/api/cities/'+$('#state').val(),
			type: 'GET',
			success: function(res){
				var content = '';
				$.each(res.data, function(i,v){
					content += '<option value="'+res.data[i].id+'">'+res.data[i].name+'</option>';
				});
				$('#city').html(content);
			}
		});
	});

	$('#is_player').on('change', function(){
		if($('#is_player')==0){
			console.info('hide');
		}
		else{
			console.info('show');
		}
	});

	var team_id_ = document.location.pathname.split('/')[2];
	//var team_id = $('.follow').attr('data-id');
	//console.info(team_id);
	if(team_id_ !== undefined){
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
	}	

});