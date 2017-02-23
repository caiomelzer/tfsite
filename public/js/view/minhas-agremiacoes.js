function listEntities(){
$.ajax({
		url:'/agremiacoes/buscar/minhas-agremiacoes',
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
});
