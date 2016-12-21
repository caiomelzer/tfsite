function updateTeams(){
	$.ajax({
		url:'/configuracoes/times',
		type: 'GET',
		async: true,
		success: function(res){
			$('#table_teams tbody').html(new EJS({url: '/js/partials/perfil_list_teams.ejs'}).render(res));
			$('.crud-delete').on('click', function(){
	            console.info($(this));
	        });
		}
	});
}

function updateEntities(){
	$.ajax({
		url:'/configuracoes/entidades',
		type: 'GET',
		async: true,
		success: function(res){
			$('#table_entities tbody').html(new EJS({url: '/js/partials/perfil_list_entities.ejs'}).render(res));
		}
	});
}

function updateDependents(){
	$.ajax({
		url:'/configuracoes/dependentes',
		type: 'GET',
		async: true,
		success: function(res){
			$('#table_dependentes tbody').html(new EJS({url: '/js/partials/perfil_list_dependents.ejs'}).render(res));
			$("[type='checkbox']").bootstrapSwitch();
			$("[type='checkbox']").on('switchChange.bootstrapSwitch', function(event, state) {
				$.ajax({
					url:'/configuracoes/dependentes',
					type: 'PUT',
					data: {
						id: $(this).attr('data-rel'),
						status: state
					},
					success: function(r){
						updateDependents();
					}
				});
			});
		}
	});
}


$(document).on('ready', function(){ 
	$('#form_dependentes').validator().on('submit', function (e) {
		if (e.isDefaultPrevented()) {
		
		} else {
			$.ajax({
				url:'/configuracoes/dependentes',
				type: 'POST',
				data: $('#form_dependentes').serializeObject(),
				success: function(res){
					if(res.status == 0){
						showMessageError();
					}
					else{
						showMessageSuccess();
						updateDependents();
					}
				}
			});
		}
		return false;
	});

	$('#form_entities').validator().on('submit', function (e) {
		if (e.isDefaultPrevented()) {
		
		} else {
			$.ajax({
				url:'/configuracoes/entidades',
				type: 'POST',
				data: $('#form_entities').serializeObject(),
				success: function(res){
					if(res.status == 0){
						showMessageError();
					}
					else{
						showMessageSuccess();
						updateEntities();
					}
				}
			});
		}
		return false;
	});

	$('#form_teams').validator().on('submit', function (e) {
		if (e.isDefaultPrevented()) {
		
		} else {
			$.ajax({
				url:'/configuracoes/times',
				type: 'POST',
				data: $('#form_teams').serializeObject(),
				success: function(res){
					if(res.status == 0){
						showMessageError();
					}
					else{
						showMessageSuccess();
						updateTeams();
					}
				}
			});
		}
		return false;
	});

	$('#username').on('change', function(){
    	if($('#username').val().length >=6){
    		$.post('/configuracoes/dependentes/check', {username:$('#username').val()})
    		.success(function(res){
    			console.info(res);
    			if(res.avaliable){
    				$('#basic-addon i').removeClass('glyphicon-remove').addClass('glyphicon-ok');
    			}
    			else{
    				$('#basic-addon i').removeClass('glyphicon-ok').addClass('glyphicon-remove');
    			}
    		});
    	}
    });
	updateDependents();
	updateEntities();
	updateTeams();

});