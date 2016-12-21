function listTeams(){
	$.ajax({
		url:'/configuracoes/times/',
		type: 'GET',
		data: $('#form_times_buscar').serializeObject(),
		success: function(res){
			$('#teams_list').html(new EJS({url: '/js/partials/times_list.ejs'}).render(res));
		}
	});
}

$(document).on('ready', function(){ 
    listTeams();	
});
