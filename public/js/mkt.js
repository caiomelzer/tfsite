console.info('start1');
$(document).on('ready', function(){
	$.each($('.banner'), function(i,v){
		$.ajax({
			url:'/mkt/imprimir/'+$(v).attr('banner'),
			type: 'GET',
			success: function(res){
				$(v).html(res.content);
			}
		});
	});
	
});
