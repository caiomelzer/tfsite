function updateTeams(){
	$.ajax({
		url:'/configuracoes/times',
		type: 'GET',
		async: true,
		success: function(res){
			$('#table_teams tbody').html(new EJS({url: '/js/partials/perfil_list_teams.ejs'}).render(res));
			$('#modal-from-dom').on('show', function() {
		        var id = $(this).data('id'),
		            removeBtn = $(this).find('.danger');
				removeBtn.attr('href', removeBtn.attr('href').replace(/(&|\?)ref=\d*/, '$1ref=' + id));
		        $('#debug-url').html('Delete URL: <strong>' + removeBtn.attr('href') + '</strong>');
		    });

		    $('.crud-delete').on('click', function(e) {
		        e.preventDefault();
				var id = $(this).data('id');
		        $('#modal-from-dom').data('id', id).modal('show');
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

function updatePlaces(){
	$.ajax({
		url:'/configuracoes/quadras',
		type: 'GET',
		async: true,
		success: function(res){
			$('#table_places tbody').html(new EJS({url: '/js/partials/perfil_list_places.ejs'}).render(res));
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

	$('#form_places').validator().on('submit', function (e) {
		if (e.isDefaultPrevented()) {
		
		} else {
			$.ajax({
				url:'/configuracoes/quadras',
				type: 'POST',
				data: $('#form_places').serializeObject(),
				success: function(res){
					if(res.status == 0){
						showMessageError();
					}
					else{
						showMessageSuccess();
						updatePlaces();
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

	$.ajax({
		url:'/api/times/categorias',
		type: 'GET',
		success: function(res){
			var content = '';
			$.each(res.data, function(i,v){
				content += '<option value="'+res.data[i].id+'">'+res.data[i].name+'</option>';
			});
			$('#category_id').html(content);
		}
	});

	updateDependents();
	updateEntities();
	updateTeams();
	updatePlaces();
});