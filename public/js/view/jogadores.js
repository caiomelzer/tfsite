function fillAgeList(){
	var maxAgeList = '';
	for(var i=$('#min_age').val();i<100;i++){
		maxAgeList += '<option value="'+i+'">'+i+'</option>';
	}
	$('#max_age').html(maxAgeList);
}

function listPosition(){
	$.ajax({
		url:'/api/positions/'+$('#ground').val(),
		type: 'GET',
		success: function(res){
			if(res.status == 0){
				showMessageError();
			}
			else{
				var content = '';
				$.each(res.data, function(i,v){
					content += '<option value="'+res.data[i].id+'">'+res.data[i].name+'</option>';
				});
				$('#position').html(content);
			}
		}
	});
}

function listPlayers(){
	console.info('dacaca');
	$.ajax({
		url:'/jogadores/buscar/',
		type: 'GET',
		data: $('#form_jogadores_buscar').serializeObject(),
		success: function(res){
			if(res.status == 0){
				showMessageError();
			}
			else{
				$('#list_jogadores').html(res);
			}
		}
	});
}

$(document).on('ready', function(){ 
    $('#form_jogadores_buscar').on('submit', function(){
    	listPlayers()
    	return false;
	});

    $.ajax({
		url:'/api/grounds',
		type: 'GET',
		success: function(res){
			if(res.status == 0){
				showMessageError();
			}
			else{
				var content = '';
				$.each(res.data, function(i,v){
					content += '<option value="'+res.data[i].id+'">'+res.data[i].name+'</option>';
				});
				$('#ground').html(content);
			}
		}
	});

	listPosition();

	$('#ground').on('change', function(){
		listPosition();
	});

	var minAgeList = '';
	for(var i=1;i<100;i++){
		minAgeList += '<option value="'+i+'">'+i+'</option>';
	}
	$('#min_age').html(minAgeList);

	$('#min_age').on('change', function(){
		fillAgeList();
	});

	listPlayers();	
});
