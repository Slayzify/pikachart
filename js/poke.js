function getEvolutionChain(sUrl, pokeId) {

    $.ajax({
            url: secureAPI(sUrl), 
            method: 'GET',
            dataType: 'json',            
            success: function(result) {
                
                getExtendedInfo(result);

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

                        $('#dvloader').hide();
                        $('#overlay').hide();
                    }
                });
            }
        });
    }
    
    function drawEvolutionChain(conditionsArray, pokename) {
        
        var finalString = '';

        try{
            if (conditionsArray[0].condition == 'item')
                finalString += 'Needs ' + conditionsArray[0].value.name + ' to evolve. ';

            if (conditionsArray[0].condition == 'trigger' && conditionsArray[0].value.name != 'level-up')
                finalString += 'Needs ' + conditionsArray[0].value.name + ' to evolve. ';

            if (conditionsArray[0].condition == '0')
                finalString += 'Evolves near ' + conditionsArray[0].value.location.name + '. ';

            if (conditionsArray[0].condition == 'trigger' && conditionsArray[1].condition == 'min_level')
                finalString += 'Needs to be at least level ' + conditionsArray[1].value + ' to evolve. ';

            if (conditionsArray[0].condition == 'trigger' && conditionsArray[1].condition == 'min_happiness')
                finalString += 'Needs at least ' + conditionsArray[1].value + ' hapiness to evolve. ';

            if (conditionsArray[0].condition == 'trigger' && conditionsArray[1].condition == 'known_move_type')
                finalString += 'Needs a ' + conditionsArray[1].value.name + ' type move to evolve. ';

            if (conditionsArray[0].condition == 'trigger' && conditionsArray[1].condition == 'held_item')
                finalString += 'Needs to hold ' + conditionsArray[1].value.name + ' to evolve. ';

            if (conditionsArray[0].condition == 'trigger' && conditionsArray[1].condition == 'known_move')
                finalString += 'Needs to know ' + conditionsArray[1].value.name + ' move to evolve. ';

            if (conditionsArray[0].condition == 'trigger' && conditionsArray[2].condition == 'time_of_day')
                finalString += 'Evolves on ' + conditionsArray[2].value + ' only. ';

            if (conditionsArray[0].condition == 'trigger' && conditionsArray[2].condition == 'min_affection')
                finalString += 'Needs at least ' + conditionsArray[2].value + ' affection to evolve. ';

            if (conditionsArray[1].condition == '1')
                finalString += 'Evolves near ' + conditionsArray[1].value.location.name + '. ';

            if (conditionsArray[2].condition == '2')
                finalString += 'Evolves near ' + conditionsArray[2].value.location.name + '. ';

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

    function getGeneralInfo(objInfo) {

        $('#height').append('Height : ' + objInfo.height/10 + ' m');
        $('#weight').append('Weight : ' + objInfo.weight/10 + ' kg');
        
        for (var i=0; i < objInfo.types.length; i++) {
            if (i > 0)
                $('#type').append(toTitleCase(objInfo.types[i].type.name));
            else
                $('#type').append('Types : ' + toTitleCase(objInfo.types[i].type.name + ' / '));
        }
    }

    function getExtendedInfo(objExt) {
        //console.log(objExt)

        var genderM = 8;
        var xp = [];

        xp[0] = {name:'slow', value:1250000};
        xp[1] = {name:'medium', value:1000000};
        xp[2] = {name:'fast', value:800000};
        xp[3] = {name:'medium-slow', value:1059860};
        xp[4] = {name:'slow-then-very-fast', value:600000};
        xp[5] = {name:'fast-then-very-slow', value:1640000};
        
        for (var i=0; i < xp.length; i++) {            
            if (xp[i].name == objExt.growth_rate.name) {
                $('#xpclass').append('XP to lvl 100 : ' + xp[i].value);
                break;
            }
        }

        for (var i=0; i < objExt.flavor_text_entries.length; i++) {            
            if (objExt.flavor_text_entries[i].language.name == 'en' && objExt.flavor_text_entries[i].version.name == 'alpha-sapphire')
                $('#desc').append(objExt.flavor_text_entries[i].flavor_text);
        }

        $('#gender-ratio').append('Gender Ratio : M ' + (genderM - objExt.gender_rate) + '/8 ' + 'F ' + objExt.gender_rate + '/8');        
        $('#catch-rate').append('Catch Rate : ' + objExt.capture_rate + '/255');
    }

