function listTeams(){
	$.ajax({
		url:'/times/buscar/',
		type: 'GET',
		data: $('#form_times_buscar').serializeObject(),
		success: function(res){
			if(res.status == 0){
				showMessageError();
			}
			else{
				$('#list_times').html(res);
			}
		}
	});
}

$(document).on('ready', function(){ 
    listTeams();
    $('#form_times_buscar').on('submit', function(){
    	listTeams();
    	return false;
	});	

	$.ajax({
		url:'/api/grounds/',
		type: 'GET',
		success: function(res){
			if(res.status == 0){
				//showMessageError();
			}
			else{
				var content = '<option value=""></option>';
				$.each(res.data, function(i,v){
					content += '<option value="'+v.id+'">'+v.name+'</option>';
				});
				$('#ground').html(content);
				console.info(res);
			}

		}
	});

	$.ajax({
		url:'/api/cities/',
		type: 'GET',
		success: function(res){
			if(res.status == 0){
				//showMessageError();
			}
			else{
				var content = '<option value=""></option>';
				$.each(res.data, function(i,v){
					content += '<option value="'+v.city_id+'">'+v.abr+' - '+v.city_name+'</option>';
				});
				$('#city').html(content);
			}

		}
	});

	var hour = '<option value=""></option>';
	for(var h=0; h<24; h++){
		for(var m=0; m<60; m=m+5){
			if(h<10){
				if(m<10)
					hour += '<option value="0'+h+':0'+m+'">0'+h+':0'+m+'</option>';
				else
					hour += '<option value="0'+h+':'+m+'">0'+h+':'+m+'</option>';
			}
			else{
				if(m<10)
					hour += '<option value="'+h+':0'+m+'">'+h+':0'+m+'</option>';
				else
					hour += '<option value="'+h+':'+m+'">'+h+':'+m+'</option>';
			}
			
		}
	}
	$('#hour').html(hour);

	$.ajax({
		url:'/api/times/categorias',
		type: 'GET',
		success: function(res){
			var content = '<option value=""></option>';
			$.each(res.data, function(i,v){
				content += '<option value="'+res.data[i].id+'">'+res.data[i].name+'</option>';
			});
			$('#category_id').html(content);
		}
	});
	
});
