$(document).on('ready', function(){ 
    $('#form_agremiacao').validator().on('submit', function (e) {
		if (e.isDefaultPrevented()) {
		
		} else {
			var content = [];
			var formData = new FormData($(this)[0]);
			$.ajax({
				url:'/agremiacoes/editar/'+document.location.pathname.split('/')[3],
				type: 'POST',
				enctype: 'multipart/form-data',
				processData: false,  
       			contentType: false,  
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
		url:'/api/states/'+$('#country').attr('data-loaded'),
		type: 'GET',
		success: function(res){
			var content = '';
			$.each(res.data, function(i,v){
				content += '<option value="'+res.data[i].id+'">'+res.data[i].name+'</option>';
			});
			$('#state').html(content);
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




	$( document ).ajaxComplete(function( event, request, settings ) {
		selectLoadedOption();
	});

});