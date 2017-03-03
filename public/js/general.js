$(document).on('ready', function(){ 
	$('#form_contato').validator().on('submit', function (e) {
		if (e.isDefaultPrevented()) {
		
		} else {
			$.ajax({
				url:'/adm/tickets/novo',
				type: 'POST',
				data: $('#form_contato').serializeObject(),
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