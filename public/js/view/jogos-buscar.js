$(document).on('ready', function(){ 
	$.ajax({
		url:'/api/times/categorias',
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
				$('#category').html(content);
				console.info(res);
			}

		}
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

	$('.reset').on('click', function(){
		$('#ground option').eq(0).prop('selected',true);
		$('#category option').eq(0).prop('selected',true);
		$('#alias').val('');
	});

});