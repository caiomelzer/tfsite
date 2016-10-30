$(function(){ 
	$("input,select,textarea").not("[type=submit]").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function($form, event, errors) {
            // Here I do nothing, but you could do something like display 
            // the error messages to the user, log, etc.
        },
        submitSuccess: function($form, event) {
            alert("OK");
            event.preventDefault();
        },
        filter: function() {
            return $(this).is(":visible");
        }
    }); 
});