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


});