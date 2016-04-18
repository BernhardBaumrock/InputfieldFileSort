$( window ).load(function() {

    // this stores the field where drag&drop uploads where started
    var activefield;

    // find all image fields and edit them
    $('li.Inputfield.InputfieldImage, li.Inputfield.InputfieldFile').each(function() {
        var field = $(this);
        field.find('i.toggle-icon').parent()
            .append('<a class="InputfieldFileSort HideIfEmpty" href="#"><i class="fa fa-sort-alpha-desc"></i></a>')
            .append('<a class="InputfieldFileSort HideIfEmpty" href="#"><i class="fa fa-sort-alpha-asc"></i></a>');
    });

    $('.InputfieldFileSort').click(function() {
        var field = $(this).closest('li.Inputfield');
        var direction = $(this).find('i.fa').attr('class');
        direction = direction.substring(direction.lastIndexOf("-") + 1); // get only asc or desc part of class
        sortitems(field, direction);
        // prevent the image display toggle
        return false;
    });

    // trigger automatic sort
    $(document).on('AjaxUploadDone', function() {
        // on drag&drop upload there is no active element
        // in that case trigger all autosort fields
        var field = $(this.activeElement).closest('li.Inputfield');

        // if there is no active field it was a drag&drop upload
        // take the field from drag&drop listener
        if(field.length == 0) field = activefield.closest('li.Inputfield');

        if(field.find('input[type=file]').hasClass('autosort-asc')) sortitems(field, 'asc');
        if(field.find('input[type=file]').hasClass('autosort-desc')) sortitems(field, 'desc');
    });

    // listen to drop areas
    $('.InputfieldFileUpload').each(function() {
        var dropArea = $(this).get(0);
        dropArea.addEventListener("drop", function (evt) {
            activefield = $(this);
        }, false);  
    });
});

var sortitems = function(field, direction) {

    if(field.find('li.InputfieldFileItem').length == 0) return;
    tinysort(field.find('li.InputfieldFileItem'), {selector:'a.InputfieldFileName', attr:'title', order:direction});

    // update sort values
    var sort = 0;
    field.find('input.InputfieldFileSort').each(function() {
        $(this).val(sort);
        sort++;
    });

    // add state-changed class
    field.addClass('InputfieldStateChanged');
}
