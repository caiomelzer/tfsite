function listEntities(){
$.ajax({
		url:'/agremiacoes/buscar',
		type: 'GET',
		data: $('#form_agremiacoes_buscar').serializeObject(),
		success: function(res){
			if(res.status == 0){
				showMessageError();
			}
			else{
				$('#list_agremiacoes').html(res);
			}
		}
	});
}

$(document).on('ready', function(){ 
    listEntities();
    $('#form_agremiacoes_buscar').on('submit', function(){
    	listEntities();
    	return false;
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
});
