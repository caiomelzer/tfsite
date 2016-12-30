function listTeams(){
$.ajax({
		url:'/times/buscar/meus-times',
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
});
