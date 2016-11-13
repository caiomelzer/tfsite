function updateConfiguration(){
	$.ajax({
		url:'/configuracoes/dependentes',
		type: 'GET',
		success: function(res){
			console.info(res);
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
						console.info(r)
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
						updateConfiguration();
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

updateConfiguration();


});
//table_dependentes