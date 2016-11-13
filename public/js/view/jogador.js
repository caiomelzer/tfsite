$(document).on('ready', function(){ 
	$.ajax({
		url:'/api/positions/',
		type: 'GET',
		success: function(res){
			console.info(res);
			$('#form_ground_positions').html(new EJS({url: '/js/partials/jogador_list_positions.ejs'}).render(res));
		}
	})
	.done(function(){
		$.ajax({
			url:'/api/player/positions',
			type: 'GET',
			success: function(res){
				console.info(res);
				$.each(res.data, function(i,v){
					$('input[data-rel=position_id_'+v.id+']').prop('checked', true);
					console.info($('input[data-rel=position_id_'+v.id+']'));
				});
			}
		})
	});



	$('#form_jogador').validator().on('submit', function (e) {
		if (e.isDefaultPrevented()) {
		
		} else {
			$.ajax({
				url:'/jogadores/editar',
				type: 'POST',
				data: $('#form_jogador').serializeObject(),
				success: function(res){
					if(res.status == 0){
						showMessageError();
					}
					else{
						showMessageSuccess();
					}
				}
			});
		}
		return false;
	});
});