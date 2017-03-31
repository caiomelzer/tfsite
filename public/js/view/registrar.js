$(document).on('ready', function(){ 
    $('#form_registrar').validator();
	$('#username').on('keyup', function(){
    	if($('#username').val().length >=6){
    		$.post('registrar/check', {username:$('#username').val()})
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
});