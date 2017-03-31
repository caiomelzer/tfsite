$(document).on('ready', function(){ 
    $('#form_time').validator().on('submit', function (e) {
		if (e.isDefaultPrevented()) {
		
		} else {
			var content = [];
			$.each($('#calendar-days .row'), function(i,v){
				if($(v).attr('data-rel').length > 5)
					content.push($(v).attr('data-rel'));
			});
			$('#days').val(JSON.stringify(content));
			var formData = new FormData($(this)[0]);
			$.ajax({
				url:'/times/editar/'+document.location.pathname.split('/')[3],
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
		url:'/api/genders/',
		type: 'GET',
		success: function(res){
			var content = '';
			$.each(res.data, function(i,v){
				content += '<option value="'+res.data[i].id+'">'+res.data[i].name+'</option>';
			});
			if($('#gender option').length > 1)
				$('#gender').html(content);
			else
				$('#gender').html($('#gender').html()+content);
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

	$.ajax({
		url:'/api/grounds/',
		type: 'GET',
		success: function(res){
			var content = '';
			$.each(res.data, function(i,v){
				content += '<option value="'+res.data[i].id+'">'+res.data[i].name+'</option>';
			});
			$('#ground_id').html(content);
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

	var tablePlayersInvite = $('#tablePlayersInvite').DataTable({
		"oLanguage": {
			"sProcessing": "Aguarde enquanto os dados são carregados ...",
			"sLengthMenu": "Mostrar _MENU_ registros por pagina",
			"sZeroRecords": "Nenhum registro correspondente ao criterio encontrado",
			"sInfoEmtpy": "Exibindo 0 a 0 de 0 registros",
			"sInfo": "Exibindo de _START_ a _END_ de _TOTAL_ registros",
			"sInfoFiltered": "",
			"sSearch": "Procurar",
			"oPaginate": {
				"sFirst":    "Primeiro",
				"sPrevious": "Anterior",
				"sNext":     "Próximo",
				"sLast":     "Último"
			}
		},
    	"ajax": {
			"url": "/times/jogadores/lista/disponiveis/"+document.location.pathname.split('/')[3],
			"type": "GET",
			"dataSrc": "data"
		},
		"autoWidth": true,
		columns: [
			{ data: 'picture', render: function(data, res, index){
	        		return '<img src="/images/uploads/'+data+'" height="50px" width="50px" />';
	        }},
	        { data: 'first_name' },
	        { data: 'last_name' },
	        { data: 'age' },
	        { data: 'city_name' },
	        { data: 'state_name' },
	        { data: 'country_name' },
	        { data: 'positions' },
	        { data: 'id', render: function(data, res, index){
	        	return '<button type="button" class="btn btn-primary players-add" data-id="'+data+'"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></button>';
	        }}
	    ]
	});

	var tablePlayers = $('#tablePlayers').DataTable({
    	"ajax": {
			"url": "/times/jogadores/lista/"+document.location.pathname.split('/')[3],
			"type": "GET",
			"dataSrc": "data"
		},
		"autoWidth": true,
		columns: [
			{ data: 'picture', render: function(data){
	        		return '<img src="/images/uploads/'+data+'" height="50px" width="50px" />';
	        }},
	        { data: 'first_name' },
	        { data: 'last_name' },
	        { data: 'city_name' },
	        { data: 'state_name' },
	        { data: 'country_name' },
	        { data: 'positions' },
	        { data: 'id', render: function(data){
	        		return '<button type="button" class="btn btn-danger players-remove" data-id="'+data+'"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>';
	        }}
	    ]
	});

	var tablePlaces = $('#tablePlaces').DataTable({
    	"ajax": {
			"url": "/quadras/listar",
			"type": "GET",
			"dataSrc": "data"
		},
		"autoWidth": true,
		columns: [
			{ data: 'name' },
	        { data: 'id', render: function(data){
	        	return '<button type="button" class="btn btn-primary places-add" data-id="'+data+'"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></button>';
	        }}
	    ]
	});

	$('#invite').on('shown', function() {
        tablePlayersInvite.ajax.reload();
        tablePlayers.ajax.reload();
    });

	$(document)
	.on('click', '.players-add', function(){
		$.post('/times/jogadores/'+document.location.pathname.split('/')[3]+'/adicionar/'+$(this).attr('data-id'), function(data){
			tablePlayersInvite.ajax.reload();
        	tablePlayers.ajax.reload();
		});
	})
	.on('click', '.places-add', function(){
		$.post('/times/editar/'+document.location.pathname.split('/')[3]+'/quadras/'+$(this).attr('data-id'), function(data){
			$('#places').modal('toggle');
			location.reload();
		});	
	})
	.on('click', '.places-remove', function(){
		$.post('/times/editar/'+document.location.pathname.split('/')[3]+'/quadras/'+$(this).attr('data-id'), function(data){
			location.reload();
		});	
	})
	.on('click', '.players-remove', function(){
		$.post('/times/jogadores/'+document.location.pathname.split('/')[3]+'/remover/'+$(this).attr('data-id'), function(data){
			tablePlayersInvite.ajax.reload();
        	tablePlayers.ajax.reload();
		});
	});

	var calendarHour = '';
	for(var i=0;i<24;i=i+1){
		for(var m=0;m<60;m=m+15){
			if(m<10)
				calendarHour += '<option value="'+i+':0'+m+'">'+i+':0'+m+'</option>';
			else
				calendarHour += '<option value="'+i+':'+m+'">'+i+':'+m+'</option>';
	    }
	}

	var calendarDuration = '';
	for(var i=0;i<23;i=i+1){
		for(var m=0;m<60;m=m+15){
			if(m<10)
				calendarDuration += '<option value="'+i+':0'+m+'">'+i+':0'+m+'</option>';
			else
				calendarDuration += '<option value="'+i+':'+m+'">'+i+':'+m+'</option>';
	    }
	}

	$.when(
		$('.start-hour').html(calendarHour), 
		$('.end-hour').html(calendarDuration)
	).then( function(){
		$.each($('#calendar-days .row'), function(i,v){
			if($(v).attr('data-rel').length > 0){
				var d = JSON.parse($(v).attr('data-rel'));
				$('.start-hour', $(v)).html('<option value="'+d.start+'">'+d.start+'</option>'+calendarHour);
				$('.end-hour', $(v)).html('<option value="'+d.duration+'">'+d.duration+'</option>'+calendarDuration);
			}
		});
	});


	$('.start-hour').on('change', function(){
		if($(this).parent().parent().find('.end-hour').val() !== '0:00'){
			var dayInfo = {
				start: $(this).val(),
				duration: $(this).parent().parent().find('.end-hour').val(),
				day: $(this).parent().parent().attr('id')
			}
			$(this).parent().parent().attr('data-rel', JSON.stringify(dayInfo));
		}	
		else{
			$(this).parent().parent().attr('data-rel', '');
		}

	});

	$('.end-hour').on('change', function(){
		if($(this).val() !== '0:00'){
			var dayInfo = {
				start: $(this).parent().parent().find('.start-hour').val(),
				duration: $(this).val(),
				day: $(this).parent().parent().attr('id')
			}
			$(this).parent().parent().attr('data-rel', JSON.stringify(dayInfo));
		}	
		else{
			$(this).parent().parent().attr('data-rel', '');
		}
		
	});

	

	$( document ).ajaxComplete(function( event, request, settings ) {
		selectLoadedOption();
	});

});