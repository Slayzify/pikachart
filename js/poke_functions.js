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
    //if (scr_height <= 500)
        //return ((scr_height - 100) <= 0 )? scr_height : (scr_height - 100);
    if (scr_height == 0)
        return scr_height;
    else
        return scr_height / Math.floor(scr_height / 350);
}

function calcWidth(width){
    var scr_width = width;
    //if (scr_width <= 500)
        //return ((scr_width - 100) <= 0 )? scr_width : (scr_width - 100);
    if (scr_width == 0)
        return scr_width;
    else
        return scr_width / Math.floor(scr_width / 350);
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
    var loadinggif = $("<img id='loading' class='hm' alt='Loading... PLease wait' src='images/Loading.gif'/>");
    custom_stats.prepend(loadinggif);
    $.ajax({
            url: 'https://pokeapi.co/api/v2/pokemon/' + $(poke).attr('id').split('_')[0] + '/', 
            method: 'GET',
            dataType: 'json',
            success: function(pokemon){
                var stats = [];
                for (var i=0; i < pokemon.stats.length; i++) {
                    stats.push(pokemon.stats[i].base_stat);
                }
                drawChart(pokemon.stats, setPokeData(custom_stats, stats, pokemon, pokemon.name));
            }
    });
}

function editableZone(poke){
    return $(poke).parent().parent().find('.stats_generator');
}

/*function getSide(poke){
    return $(poke).parent().parent().find('.stats_generator').attr('id').replace('custom_stats_','');
}*/

function getSide(poke){
    return editableZone(poke).attr('id').replace('pokemon_content','');
}

function getContainerSide(container){
    return $(container).attr('id').split('_')[$(container).attr('id').split('_').length - 1];
}


function setPokeData(container, statsval, pokemon, name){
    container.empty();
    container.append($("<p id='pokeID-"+ name +"' class='hm'>" + toTitleCase(name) + "</p>"));
    var stats = ["spd","spdef","spatk","def","atk","hp"];
    var statsnames = ["Spd","Sp.Def","Sp.Atk","Def","Atk","HP"];
    var singlestat = "<div id='poke_stats_%Name' class='stat_container'><span id='stat_name_%Name'>%StatName :</span> <input id='stat_value_%Name' class='stat_value' type='text' value='%Stat_val' readonly='readonly'/></div>";
    var modifier = ""; //a compléter pour ajouter le calculateur de stats
    var movetable = "<div id='pokemoves_%Side'><table id='moves_%Side'><tr><th class'move_header'>Name</th><th class'move_header'>Type</th><th class'move_header'>PP</th><th class'move_header'>Power</th><th class'move_header'>Effect</th><th class'move_header'>Level</th><th class'move_header'>Method</th></tr></table></div>";
    var radar = $("<canvas id='" + name + "-" + $(container).attr('id').replace("custom_stats_","") + "-Radar' height=" + calcHeight($(window).height()) + "  width=" + calcWidth(container.width()) + "></canvas>");
    container.append(radar);
    for (var i = 0; i < stats.length; i++){
        var children = $(singlestat.replace('%Name',stats[i]).replace("%StatName",statsnames[i]).replace("%Stat_val",statsval[i]));
        //children.append(modifier);
        container.append(children);
    }
    container.append($("<br/>"))
    var moves = $(movetable.replace("%Side", getContainerSide(container)).replace("%Side", getContainerSide(container)));
    container.append(moves);
    drawMoveTable(moves.find("#moves_" + getContainerSide(container)), pokemon.moves);
    return radar;
}

function updateStat(origin){
    $(this)
    
}

















function drawMoveTable(movetable, moves) {

        for (var i=0; i < moves.length; i++) {
            //faire un tri des données à récupérer
            for (var j=0; j < moves[i].version_group_details.length; j++) {

                if (moves[i].version_group_details[j].version_group.name == 'omega-ruby-alpha-sapphire') {

                    drawMoveRow(movetable, {
                        move: moves[i].move,
                        details: moves[i].version_group_details[j]
                    });
                }
            }
        }
    }

    function drawMoveRow(movetable, move) {
        console.log(movetable.attr('id'));
        var row = $('<tr class="move_row"/>');
        movetable.append(row);
        
        var move_name = $('<td class="move_name move_cell">' + toTitleCase(move.move.name) + '</td>');
        var move_PP = $('<td class="move_PP move_cell"/>');
        var move_power = $('<td class="move_power move_cell"/>');
        var move_type = $("<td class='move_type move_cell'/>");
        var move_effect = $("<td class='move_effect move_cell'/>");
        
        var move_level = $("<td class='move_level move_cell'>" + move.details.level_learned_at + "</td>");
        var move_method = $("<td class='move_method move_cell'><img alt='" + move.details.move_learn_method.name +"' title='" + toTitleCase(move.details.move_learn_method.name) + "' src='./images/moves/" + move.details.move_learn_method.name + ".png'/></td>");
        
        row.append(move_name);
        row.append(move_type);
        row.append(move_PP);
        row.append(move_power);
        row.append(move_effect);
        row.append(move_level);
        row.append(move_method);
        getMoveSpecs(move.move.url, move_type, move_PP, move_power, move_effect, row);
    }


    /* Returns the type of a move and appends it to the table */
    function getMoveSpecs(sUrl, move_type, move_pp, move_power, move_effect, move_row) {
        $.ajax({
            url: secureAPI(sUrl), 
            method: 'GET',
            dataType: 'json',            
            success: function(result) {
                move_type.html($("<img src='./images/types/" + toTitleCase(result.type.name) + ".gif'/>"));
                move_pp.html(result.pp);
                move_power.html(result.power);
                var sMove = result.effect_entries[0].short_effect;
                sMove = sMove.replace("$effect_chance%", "");
                move_effect.html(sMove);
                move_row.attr('title', result.effect_entries[0].effect);
            }
        });
    }
    
    