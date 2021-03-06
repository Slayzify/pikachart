/********** On Load **********/
    /**** Generic ****/

    /**** Comparaison ****/
$(function(){
    $('[id^="pokeimport_"]').each(function(){
        $(this).attr('id',("" + $(this).attr('id')).replace("pokeimport_","pokeimported_"));
        $(this).load($(this).attr('id').replace('pokeimported_','') + '.html');
        
    });
});
$(function(){
    $('[id^="pokeimport2_"]').each(function(){        
        $(this).attr('id',("" + $(this).attr('id')).replace("pokeimport2_","pokeimported2_"));
        $(this).load($(this).attr('id').replace('pokeimported2_','') + '.poke');
    });
});
$(function(){
    $('[id^="comparison_poke_selection_"]').each(function(){
        loadSelectionPanel($(this), "Comparison");
        $(this).attr('id',("" + $(this).attr('id')).replace("comparison_",""));
    });
});

    /**** Safari ****/
$(function(){
    $('[id^="safari_poke_selection_"]').each(function(){
        loadSelectionPanel($(this), "Safari");
        $(this).attr('id',("" + $(this).attr('id')).replace("safari_",""));
        $( "#safari_zone" ).draggable();
    });
});

    /**** Custom_stats ****/

$(function(){
    $('[id^="custom_stats_"]').each(function(){
        if($(this).attr('id').indexOf('_Side') > -1){
            $(this).attr('id', $(this).attr('id').replace('_Side', $(this).parent().parent().attr('id').replace('pokemon_content_','')));
        }
    });
});

/*$(function(){
    $('.stat_value').keypress(function (e) {
        alert();
     //if the letter is not digit then display error and don't type anything
     if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        //display error message
        $("#errmsg").html("Digits Only").show().fadeOut("slow");
               return false;
    }
   });
});*/

    /**** Pokemon ****/

    /**** Index ****/
$(function() {
    $('#poketable').DataTable( {
        data: dataSet,
        lengthMenu: [[100, 200, 400, -1], [100, 200, 400, "All"]],
        columns: [
            {title: "#", searchable: false},
            {title: "Picture", searchable: false, sortable: false},                
            {title: "Name"},
            {title: "Type", searchable: false, sortable: false},
            {title: "URL", searchable: false, visible:false, className:'iColumn'},
            {title: "ID", searchable: false, visible: false, className:'iColumn'},
            {title: "Type1", visible: false, className:'iColumn'},
            {title: "Type2", visible: false, className:'iColumn'}
        ],
        /*"columnDefs": [
            { "visible": false, "targets": [0] }
        ]*/
    });
        /*
        $("#pokename").autocomplete({
            minLength: 3,
            source: pokedex,
            select: function( event, ui ) {                
                $('#pokename').val(ui.item.label);        
                return false;
            }
        });

        $('#pokename').on('autocompleteselect', function (e, ui) {            
            $('#pokeid').val(ui.item.value);
        });
        */   
});
