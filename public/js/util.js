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

function selectLoadedOption(){
    $.each($('select[data-loaded]'), function(i, e) {
        $(e).children('option[value="'+$(e).attr('data-loaded')+'"]').attr('selected','selected');
    });
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

function resetForm(e){
    var b = $(e).attr('id');
    $(e).find('input[type=text]').val('');
    $(e).find('select').prop('selectedIndex', 0);
    $(e).find('input[type=checkbox]').prop('checked', false);
}

function initSite(){
    $('.reset').on('click', function(e){
        resetForm($(this).parents('form'));
    });
}


$(document).on('ready', function(){ 
    initSite();
});