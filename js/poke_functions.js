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
                var pokemonbutton = $('<input type="image" id="'+ dataSet[i][5] + '_' + $(dataSet[i][2]).html() + '" class="poke_button" ' +' title="' + $(dataSet[i][2]).html()  + '" src="' + $(dataSet[i][1]).attr("src") + '" onclick="selectPoke(this)" />')
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

function drawChart(arrayStats, chart_container) {

    var dataArray = [];
    var labelArray = ["Spd","Sp.Def","Sp.Atk","Def","Atk","HP"];

    for (var i=0; i < arrayStats.length; i++) {
        dataArray.push(arrayStats[i].base_stat);
        //labelArray.push(toTitleCase(arrayStats[i].stat.name));
    }
    var data = {
        labels: labelArray,
        datasets: [
            {
                label: "Pokemon Stats",                    
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: dataArray
            }
        ]
    };

    var ctx = $(chart_container).get(0).getContext("2d");        
    var myRadarChart = new Chart(ctx).Radar(data);
}

function calcHeight(height){
    var scr_height = height;
    if (scr_height <= 500)
        return ((scr_height - 100) <= 0 )? scr_height : (scr_height - 100);
    if (scr_height == 0)
        return scr_height;
    else
        return scr_height / Math.floor(scr_height / 400);
}

function calcWidth(width){
    var scr_width = width;
    if (scr_width <= 500)
        return ((scr_width - 100) <= 0 )? scr_width : (scr_width - 100);
    if (scr_width == 0)
        return scr_width;
    else
        return scr_width / Math.floor(scr_width / 400);
}


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

        /**** Custom Stats ****/
function loadCprPokemon(iptPoke){
    
}

function selectPoke(poke){
    var custom_stats = editableZone(poke);
    $.ajax({
            url: 'https://pokeapi.co/api/v2/pokemon/' + $(poke).attr('id').split('_')[0] + '/', 
            method: 'GET',
            dataType: 'json',
            success: function(result){
                var stats = [];
                for (var i=0; i < result.stats.length; i++) {
                    stats.push(result.stats[i].base_stat);
                }
                drawChart(result.stats, setStats(custom_stats, stats, result.name));
            }
    });
}

function editableZone(poke){
    return $(poke).parent().parent().find('.stats_generator');
}

function getSide(poke){
    return editableZone(poke).attr('id').replace('pokemon_content','');
}

function setStats(container, statsval, pokemon){
    container.empty();
    var stats = ["spd","spdef","spatk","def","atk","hp"];
    var statsnames = ["Spd","Sp.Def","Sp.Atk","Def","Atk","HP"];
    var singlestat = "<div id='poke_stats_%Name' class='stat_container'><span id='stat_name_%Name'>%StatName :</span> <input id='stat_value_%Name' class='stat_value' type='text' value='%Stat_val' readonly='readonly'/></div>";
    var modifier = "";
    var radar = $("<canvas id='" + pokemon + "-" + $(container).attr('id').replace("custom_stats_","") + "-Radar' height=" + calcHeight($(window).height()) + "  width=" + calcWidth(container.width()) + "></canvas>");
    container.append(radar);
    for (var i = 0; i < stats.length; i++){
        var children = $(singlestat.replace('%Name',stats[i]).replace("%StatName",statsnames[i]).replace("%Stat_val",statsval[i]));
        console.log("pokemon: "+ singlestat.replace('%Name',stats[i]).replace("%StatName",statsnames[i]).replace("%Stat_val",statsval[i]));
        container.append(children);
    }
    return radar;
}

function updateStat(origin){
    $(this)
    
}