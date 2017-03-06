$(document).on('ready', function(){ 
	


	$.each($('.time'), function(i,v){
		var dataInfo = $(v).attr('datetime').replace(' ','-').split('-');
		$('.date', $(v)).text(dataInfo[2]+'/'+ dataInfo[1]+'/'+ dataInfo[0]);
		$('.hour', $(v)).text(dataInfo[3]);
	});






	$('.label-danger').on('click', function(){
		$.ajax({
			url:'/jogos/convites/resposta',
			type: 'POST',
			data: {
				game_id: $(this).parent('.games-invites-item').attr('data-id'),
				opponent_confirm: 2
			},
			success: function(res){
				if(res.status == 0){
					showMessageError();
				}
				else{
					showMessageSuccess();
				}
			}
		});
	});

	$('.label-success').on('click', function(){
		$.ajax({
			url:'/jogos/convites/resposta',
			type: 'POST',
			data: {
				game_id: $(this).parent('.games-invites-item').attr('data-id'),
				opponent_confirm: 1
			},
			success: function(res){
				if(res.status == 0){
					showMessageError();
				}
				else{
					showMessageSuccess();
				}
			}
		});
		$(this).parent().remove();
	});



	
});