$(document).on('ready', function(){ 
	$.ajax({
		url:'/api/grounds/',
		type: 'GET',
		success: function(res){
			var content = '';
			$.each(res.data, function(i,v){
				content += '<option value="'+res.data[i].id+'">'+res.data[i].name+'</option>';
			});
			if($('#ground option').length > 1)
				$('#ground').html(content);
			else
				$('#ground').html($('#ground').html()+content);
		}
	});

	$('#ground').on('change', function(){
		$.ajax({
			url:'/api/positions/'+$('#ground').val(),
			type: 'GET',
			success: function(res){
				var content = '';
				$.each(res.data, function(i,v){
					content += '<option value="'+res.data[i].id+'">'+res.data[i].name+'</option>';
				});
				if($('#position option').length > 1)
					$('#position').html(content);
				else
					$('#position').html($('#position').html()+content);
			}
		});
	});

	$('#form_jogador').validator().on('submit', function (e) {
		if (e.isDefaultPrevented()) {
		
		} else {
			var formData = new FormData($(this)[0]);
			$.ajax({
				url:'/jogadores/editar',
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
		}
		return false;
	});
});