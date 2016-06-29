$(function(){
    loadSavedBattles();
})

function loadSavedBattles(){
    var selector = $('#battle_id_selection');
    var sUrl = "https://api.mongolab.com/api/1/databases/pikadb/collections/fight?apiKey=Iq2U_zn9n2pFQk2nyLNnHzPL8EtNr2t5&f={_id:1}";
    var id = getUrlParameter("id");
    $.ajax({
            url: secureAPI(sUrl), 
            method: 'GET',
            dataType: 'json',            
            success: function(result) {
                for (i=0; i < result.length;i++){
                    $(selector).append("<option" + (result[i]._id.$oid == id ? " selected ":"") + ">" + result[i]._id.$oid + "</option>");
                }
                selectedBattle(getUrlParameter('id')=="");
            }
    })
}

function selectedBattle(isSelect){
    var id = "";
    if (isSelect){
        id= $('#battle_id_selection').val();
    }else{
        id = getUrlParameter('id');
    }
    if(id!=""){
        beginBattle(id);
    }
}

function beginBattle(idBattle){
    var sUrl = "https://api.mongolab.com/api/1/databases/pikadb/collections/fight/" + idBattle + "?apiKey=Iq2U_zn9n2pFQk2nyLNnHzPL8EtNr2t5";
    $.ajax({
            url: secureAPI(sUrl), 
            method: 'GET',
            dataType: 'json',            
            success: function(result) {
                //empty container
                $('#battle_container').empty();
                //reset content to empty
                $('#battle_container').append($("<audio id='battle_audio' style='display:none;' controls autoplay></audio><div id='battle_box'><div id='battle_screen'><div id='defender_box' class='fighter_box'><div class='hp_bar'></div></div><div id='ennemy_box' class='fighter_box'><div class='hp_bar'></div></div></div><div id='battle_moves'></div></div><div id='logbox'>Battle log :</br></div>"));
                
                //load ennemy
                $('#ennemy_box .hp_bar').append($('<div id="ennemy_hp" class="fullHP"></div>'));
                $('#ennemy_hp').progressbar({ value:parseInt(100*result.poke2.currentHP/result.poke2.maxHP)});
                $('#ennemy_box').append($('<img src="' + result.poke2.frontSprite + '"></img>'));
                $('#ennemy_box').data("poke",result.poke2);
                
                //load defender
                $('#defender_box').append($('<img src="' + result.poke1.backSprite + '"></img>'));
                $('#defender_box .hp_bar').append($('<div id="defender_hp" class="fullHP"></div>'));
                $('#defender_hp').progressbar({ value: parseInt(100*result.poke1.currentHP/result.poke1.maxHP)});
                $('#defender_box').data("poke",result.poke1);
                
                //load moves
                for(i=0;i<result.poke1.moves.length;i++){
                    var name = 'move_' + result.poke1.moves[i].name;
                    var attack = $('<button id="' + name + '">' + result.poke1.moves[i].name + '</button>');
                    $('#battle_moves').append(attack);
                    $(name).data("move",result.poke1.moves[i]);
                }
                
                //load log
                $('#logbox').append(result.fightLog);
                
                //music battle
                $('#battle_audio').append($('<source src="./sound/battle.mp3" type="audio/mpeg">'));
            }  
    })
}

function updateMoves(){
    //countPP
    //updateData
    //disable if needed
}

function initTurn(attack_button){
    
}