$(document).on('ready', function(){ 
	
	$.each($('.games-invites-list').children(), function(i,v){
		var dataInfo = $(v).children('time').attr('datetime').split(' ');
		$(v).children('time').children('.day').text(dataInfo[2]);
		$(v).children('time').children('.month-year').text(dataInfo[1]+' / '+dataInfo[3]);
		$(v).children('time').children('.time').text(dataInfo[4].split(':')[0]+':'+dataInfo[4].split(':')[1]);
	});

	$('.label-warning').on('click', function(){
		console.info($(this).attr('data-team'));
		$('#invite').attr('data-team',$(this).attr('data-team'));
		$('#invite').attr('data-game',$(this).attr('data-game'));
		$.ajax({
			url:'/jogos/convites/'+$(this).attr('data-game')+'/lista/'+$(this).attr('data-team'),
			type: 'GET',
			success: function(res){
				if(res.status == 0){
					showMessageError();
				}
				else{
					console.info(res.data);
					var content = '';
					$.each(res.data, function(i, v){
						content += '<li><span class="col-md-1 picture"><img src="/images/uploads/'+v.picture+'" /></span><span class="col-md-10 player-name">'+v.first_name+' '+v.last_name+' - '+v.positions+'</span>';
						if(v.status === 1)
							content +='<span data-player="'+v.player_id+'" class="col-md-1 label-danger"><i class="glyphicon glyphicon-remove"></i></span><span data-player="'+v.player_id+'" class="col-md-1 label-success hidden"><i class="glyphicon glyphicon-ok"></i></span></li>';
						else
							content +='<span data-player="'+v.player_id+'" class="hidden col-md-1 label-danger"><i class="glyphicon glyphicon-remove"></i></span><span data-player="'+v.player_id+'" class="col-md-1 label-success"><i class="glyphicon glyphicon-ok"></i></span></li>';
					});
					$('.jogadores-lista-convidar').html(content);
					$('.jogadores-lista-convidar .label-success').on('click', function(){
						$.ajax({
							url:'/jogos/convites/'+$('#invite').attr('data-game')+'/'+$('#invite').attr('data-team')+'/'+$(this).attr('data-player'),
							type: 'POST',
							success: function(res){
								if(res.status == 0){
									showMessageError();
								}
								else{
									$(this).addClass('hidden');
								}
							}
						});
						$(this).addClass('hidden').parent().children('.label-danger').removeClass('hidden');

					});
					$('.jogadores-lista-convidar .label-danger').on('click', function(){
						$.ajax({
							url:'/jogos/convites/'+$('#invite').attr('data-game')+'/'+$('#invite').attr('data-team')+'/'+$(this).attr('data-player')+'/remover',
							type: 'POST',
							success: function(res){
								if(res.status == 0){
									showMessageError();
								}
								else{
									$(this).addClass('hidden');
								}
							}
						});
						$(this).addClass('hidden').parent().children('.label-success').removeClass('hidden');
					});
				}
			}
		});
	});

	$('.games-invites-item .label-danger').on('click', function(){
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

	$('.games-invites-item .label-success').on('click', function(){
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