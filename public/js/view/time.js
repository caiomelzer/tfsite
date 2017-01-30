$(document).on('ready', function(){ 
    $('#form_time').validator().on('submit', function (e) {
		if (e.isDefaultPrevented()) {
		
		} else {
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

	$('#invite').on('shown', function() {
        tablePlayersInvite.ajax.reload();
        tablePlayers.ajax.reload();
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
	.on('click', '.players-remove', function(){
		$.post('/times/jogadores/'+document.location.pathname.split('/')[3]+'/remover/'+$(this).attr('data-id'), function(data){
			tablePlayersInvite.ajax.reload();
        	tablePlayers.ajax.reload();
		});
		
	});

});