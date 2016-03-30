    function getEvolutionChain(sUrl, pokeId) {

        $.ajax({
            url: secureAPI(sUrl), 
            method: 'GET',
            dataType: 'json',            
            success: function(result) {
                
                $.ajax({
                    url: secureAPI(result.evolution_chain.url), 
                    method: 'GET',
                    dataType: 'json',            
                    success: function(result) {
                        var id = result.chain.species.url;
                        idArray = id.split('/');
                        id = idArray[6];

                        var evol = [];

                        evol.push({
                            name: result.chain.species.name, 
                            scale: 0,
                            details: result.chain.evolution_details,
                            id: id
                        });

                        evol = evol.concat(getChain(result.chain.evolves_to, 0));
                        
                        if (evol.length == 1)
                            $('#textRow').append('No evolutions known.');
                        else {                            

                            for (var i=0; i < evol.length; i++) {

                                var conditions = [];

                                for (var key in evol[i].details) {
                                    if (evol[i].details.hasOwnProperty(key)) {
                                        if (evol[i].details[key] !== null && evol[i].details[key] !== false && evol[i].details[key] !== '')
                                            conditions.push({
                                                condition: key,
                                                value: evol[i].details[key]
                                            });
                                    }
                                }

                                var elem = drawEvolutionChain(conditions, evol[i].name);

                                //mettre en gras le pokémon actuel
                                if (evol[i].id == pokeId) {
                                    $('#picRow').append('<td style="font-weight:bold">'+ '<img src="https://pokeapi.co/media/sprites/pokemon/'+ evol[i].id +'.png"></td>');
                                    $('#textRow').append('<td style="font-weight:bold">'+ elem +'</td>');
                                }
                                else {
                                    $('#picRow').append('<td><img src="https://pokeapi.co/media/sprites/pokemon/'+ evol[i].id +'.png"></td>');
                                    $('#textRow').append('<td>'+ elem +'</td>');
                                }
                            }                            
                        }
                    }
                });
            }
        });
    }
    
    function drawEvolutionChain(conditionsArray, pokename) {
        console.log(conditionsArray);
        var finalString = '';

        try{
            if (conditionsArray[0].condition == 'item')
                finalString += toTitleCase(pokename) + ' needs ' + conditionsArray[0].value.name + ' to evolve. ';

            if (conditionsArray[0].condition == 'trigger' && conditionsArray[0].value.name != 'level-up')
                finalString += toTitleCase(pokename) + ' needs ' + conditionsArray[0].value.name + ' to evolve. ';

            if (conditionsArray[0].condition == '0')
                finalString += toTitleCase(pokename) + ' evolves near ' + conditionsArray[0].value.location.name + '. ';

            if (conditionsArray[0].condition == 'trigger' && conditionsArray[1].condition == 'min_level')
                finalString += toTitleCase(pokename) + ' needs to be at least level ' + conditionsArray[1].value + ' to evolve. ';

            if (conditionsArray[0].condition == 'trigger' && conditionsArray[1].condition == 'min_happiness')
                finalString += toTitleCase(pokename) + ' needs at least ' + conditionsArray[1].value + ' hapiness to evolve. ';

            if (conditionsArray[0].condition == 'trigger' && conditionsArray[1].condition == 'known_move_type')
                finalString += toTitleCase(pokename) + ' needs a ' + conditionsArray[1].value.name + ' type move to evolve. ';

            if (conditionsArray[0].condition == 'trigger' && conditionsArray[1].condition == 'held_item')
                finalString += toTitleCase(pokename) + ' needs to hold ' + conditionsArray[1].value.name + ' to evolve. ';

            if (conditionsArray[0].condition == 'trigger' && conditionsArray[1].condition == 'known_move')
                finalString += toTitleCase(pokename) + ' needs to know ' + conditionsArray[1].value.name + ' move to evolve. ';

            if (conditionsArray[0].condition == 'trigger' && conditionsArray[2].condition == 'time_of_day')
                finalString += toTitleCase(pokename) + ' evolves on ' + conditionsArray[2].value + ' only. ';

            if (conditionsArray[0].condition == 'trigger' && conditionsArray[2].condition == 'min_affection')
                finalString += toTitleCase(pokename) + ' needs at least ' + conditionsArray[2].value + ' affection to evolve. ';

            if (conditionsArray[1].condition == '1')
                finalString += toTitleCase(pokename) + ' evolves near ' + conditionsArray[1].value.location.name + '. ';

            if (conditionsArray[2].condition == '2')
                finalString += toTitleCase(pokename) + ' evolves near ' + conditionsArray[2].value.location.name + '. ';

            if (conditionsArray[2].condition == 'relative_physical_stats' && conditionsArray[2].value == 1)
                finalString += 'Attack value superior to Defense value. ';

            if (conditionsArray[2].condition == 'relative_physical_stats' && conditionsArray[2].value == -1)
                finalString += 'Defense value superior to Attack value. ';

            if (conditionsArray[2].condition == 'relative_physical_stats' && conditionsArray[2].value == 0)
                finalString += 'Attack value equals Defense value. ';

            return finalString;

        } catch(err) {
            if (finalString == '')
                return toTitleCase(pokename);
            else
                return finalString;
        }
    }

    function getChain(arrayEvolution, scale) {

        var finalArray = [];
        var tmpArray = [];

        for (var i=0; i < arrayEvolution.length; i++) {
            var id = arrayEvolution[i].species.url;
            idArray = id.split('/');
            id = idArray[6];

            finalArray.push({
                name: arrayEvolution[i].species.name,
                scale: scale+1,
                details: arrayEvolution[i].evolution_details,
                id: id
            });
        }

        try {
            if (arrayEvolution[0].evolves_to.length)
                tmpArray = getChain(arrayEvolution[0].evolves_to, scale+2);

        } catch(err) {
            return finalArray;            
        }

        return finalArray.concat(tmpArray);
    }

    function drawBarChart() {

         var chart = AmCharts.makeChart("barChart", {
            "type": "serial",
            "theme": "light",  
            "handDrawn":true,
            "handDrawScatter":2,
            "legend": {
                "useGraphSettings": true,
                "markerSize":12,
                "valueWidth":0,
                "verticalGap":0
            },
            "dataProvider": [{
                "year": "HP",
                "income": 26.5,
                "expenses": 23.1
            }, {
                "year": "ATK",
                "income": 24.6,
                "expenses": 22
            }],
            "valueAxes": [{
                "minorGridAlpha": 0.08,
                "minorGridEnabled": true,
                "position": "top",
                "axisAlpha":0
            }],
            "startDuration": 1,
            "graphs": [{
                "balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b></span>",
                "title": "Income",
                "type": "column",
                "fillAlphas": 0.8,
                 
                "valueField": "income"
            }, {
                "balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b></span>",
                "bullet": "round",
                "bulletBorderAlpha": 1,
                "bulletColor": "#FFFFFF",
                "useLineColorForBulletBorder": true,
                "fillAlphas": 0,
                "lineThickness": 2,
                "lineAlpha": 1,
                "bulletSize": 7,
                "title": "Expenses",
                "valueField": "expenses"
            }],
            "rotate": true,
            "categoryField": "year",
            "categoryAxis": {
                "gridPosition": "start"
            },
            "export": {
                "enabled": true
             }
        });
    }


    function drawChart(arrayStats) {

        var dataArray = [];
        var labelArray = [];

        for (var i=0; i < arrayStats.length; i++) {
            dataArray.push(arrayStats[i].base_stat);
            labelArray.push(toTitleCase(arrayStats[i].stat.name));
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

        var ctx = $("#myChart").get(0).getContext("2d");        
        var myRadarChart = new Chart(ctx).Radar(data);
    }

    function fillNameDiv(sName) {
        $('#name').append(sName);
    }

    function addPic(sUrl) {
        $('#pic').append('<img src="'+ sUrl +'"/>');
    }

    function drawTable(arrayMoves) {

        for (var i=0; i < arrayMoves.length; i++) {
            //faire un tri des données à récupérer
            for (var j=0; j < arrayMoves[i].version_group_details.length; j++) {

                if (arrayMoves[i].version_group_details[j].version_group.name == 'omega-ruby-alpha-sapphire') {

                    drawRow({
                        move: arrayMoves[i].move,
                        details: arrayMoves[i].version_group_details[j]
                    });
                }
            }
        }
    }

    function drawRow(arrayElem) {

        var row = $('<tr class="move_row"/>');
        $('#moves').append(row);
        
        var move_name = $('<td class="move_name move_cell">' + toTitleCase(arrayElem.move.name) + '</td>');
        var move_PP = $('<td class="move_PP move_cell"/>');
        var move_power = $('<td class="move_power move_cell"/>');
        var move_type = $("<td class='move_type move_cell'/>");
        var move_effect = $("<td class='move_effect move_cell'/>");
        
        var move_level = $("<td class='move_level move_cell'>" + arrayElem.details.level_learned_at + "</td>");
        var move_method = $("<td class='move_method move_cell'><img alt='" + arrayElem.details.move_learn_method.name +"' title='" + toTitleCase(arrayElem.details.move_learn_method.name) + "' src='./images/moves/" + arrayElem.details.move_learn_method.name + ".png'/></td>");
        
        row.append(move_name);
        row.append(move_type);
        row.append(move_PP);
        row.append(move_power);
        row.append(move_effect);
        row.append(move_level);
        row.append(move_method);
        getMoveType(arrayElem.move.url, move_type);
        getMoveSpecs(arrayElem.move.url, move_PP, move_power);
        getMoveEffect(arrayElem.move.url, move_effect, row);
    }


    /* Returns the type of a move and appends it to the table */
    function getMoveType(sUrl, move_cell) {
        $.ajax({
            url: secureAPI(sUrl), 
            method: 'GET',
            dataType: 'json',            
            success: function(result) {
                move_cell.html($("<img src='./images/types/" + toTitleCase(result.type.name) + ".gif'/>"));
            }
        });
    }
    /* Returns the type of a move and appends it to the table */
    function getMoveEffect(sUrl, move_cell,move_row) {
        $.ajax({
            url: secureAPI(sUrl), 
            method: 'GET',
            dataType: 'json',            
            success: function(result) {
                var sMove = result.effect_entries[0].short_effect;
                sMove = sMove.replace("$effect_chance%", "");
                move_cell.html(sMove);
                move_row.attr('title', result.effect_entries[0].effect);
            }
        });
    }
    
    /* Returns the type of a move and appends it to the table */
    function getMoveSpecs(sUrl, move_cell, move_cell2) {
        $.ajax({
            url: secureAPI(sUrl), 
            method: 'GET',
            dataType: 'json',            
            success: function(result) {                
                move_cell.html(result.pp);
                move_cell2.html(result.power);
            }
        });
    }