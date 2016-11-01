$(document).on('ready', function(){ 
    $('#form_perfil').validator().on('submit', function (e) {
		if (e.isDefaultPrevented()) {
		
		} else {
			$.ajax({
				url:'/perfil/',
				type: 'POST',
				data: $('#form_perfil').serializeObject(),
				success: function(res){
					if(res.status == 1){
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
});