/********** Functions **********/
        /**** Generic ****/
//Load all pokemon miniatures into a panel
function loadSelectionPanel(panel, expr){
    switch (expr) {
            case "Safari":
            console.log("Safari");
                for (i=0; i < dataSet.length;i++){
                var pokemonbutton = $('<a id="' + dataSet[i][5] + '_' + $(dataSet[i][2]).html() + '" class="pokemon404" href="' + $(dataSet[i][2]).attr('href') + '">' + '<img src="' + $(dataSet[i][1]).attr("src") + '"/></a>');
                panel.append(pokemonbutton);
                }
                break;
            case "Comparison":
            console.log("Comparison");
            for (i=0; i < dataSet.length;i++){
                var pokemonbutton = $('<input type="image" id="'+ dataSet[i][5] + '_' + $(dataSet[i][2]).html() + '" class="poke_button" ' +' title="' + $(dataSet[i][2]).html()  + '" src="' + $(dataSet[i][1]).attr("src") + '" />')
                panel.append(pokemonbutton);
            }
                break;
            default:
                ;
        }
};

function secureAPI(sUrl) {
        if (sUrl.indexOf('https') == -1)
            return sUrl.replace('http','https');
        else
            return sUrl;
    }
    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

//Display/Hide pokemon that doesn't fit a certain description
function searchPoke(pokeName,searchbarid,pokemoncontainer,pokemonclass){
            /*Here's an exemple
            pokename : instance of search bar
            searchbarid : poke_search_left
            pokemoncontainer : poke_selection_left
            pokemonclass : poke_button
            */
    var name = pokeName.value;
    var pokeList = $("#" + pokeName.id.replace(searchbarid, pokemoncontainer)).find(pokemonclass);
    console.log(pokeList.length + " pokemon found");
    pokeList.each(function(index, pokemon){
        if(pokemon.id.toLowerCase().indexOf(name.toLowerCase()) > -1){
            pokemon.style.display = 'inline-block';
        }
        else{
            pokemon.style.display = 'none';
        }
    })
}

function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };


/**** Pokemon ****/
function getStat() {
    var pokeid = $('#pokeid').val();
    $("#pokename").val('');
    $.ajax({
        url: 'http://pokeapi.co/api/v1/pokemon/' + pokeid + '/', 
        method: 'GET',
        success: function(result) {
            $('#infoblock').empty();
            $('#infoblock').append(result.name + '</br>');
            $('#infoblock').append('Attack : ' + result.attack + '</br>');
            $('#infoblock').append('Defense : ' + result.defense + '</br>');
            $('#infoblock').append('Speed : ' + result.speed + '</br>');
        }
    });
}

function getData() {

        var pokeId = getUrlParameter('id');

        if ($.isNumeric(pokeId) == false) {
            $('#pokePage').empty();
            $('#pokePage').load('404.html');
            return false;
        }

        //rajouter une image de loading pour faire joli
        $.ajax({
            url: 'https://pokeapi.co/api/v2/pokemon/' + pokeId + '/', 
            method: 'GET',
            dataType: 'json',
            success: function(result) {
                                
                fillNameDiv(toTitleCase(result.name));
                addPic(result.sprites.front_default);
                getEvolutionChain(result.species.url, pokeId);

                drawChart(result.stats);
                drawBarChart();
                drawTable(result.moves);                

                $('#dvloader').hide();
            }
        });
    }
        /**** Safari ****/
function pokeballGo(){
    if ($('#safari_park').css('display') == 'none'){
        $('#safari_park').show();
    }
    else {
        $('#safari_park').hide();
    }
};