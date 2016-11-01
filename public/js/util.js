$.fn.serializeObject = function(){
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

function showMessageError(){
    $(".alert-danger").removeClass('hidden');
    setTimeout( function(){ 
        $(".alert-danger").addClass('hidden');
    }, 9000 );
}

function showMessageSuccess(){
    $(".alert-success").removeClass('hidden');
    setTimeout( function(){ 
        $(".alert-success").addClass('hidden');
    }, 9000 );
}