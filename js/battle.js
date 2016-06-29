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

function deleteBattle(){
    var idDelete = $('#battle_id_selection').val();
    
    $.ajax({
        url: 'https://api.mongolab.com/api/1/databases/pikadb/collections/fight/'+ idDelete +'?apiKey=Iq2U_zn9n2pFQk2nyLNnHzPL8EtNr2t5',
        type: 'DELETE',
        async: true,
        timeout: 300000,
        success: function(data) { alert('deleted'); },
        error: function (xhr, status, err) { alert(err); }
    });
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
                $('#battle_container').append($("<audio id='battle_audio' style='display:none;' controls autoplay></audio><div id='battle_box'><div id='battle_screen'><div id='ennemy_box' class='fighter_box'><div class='hp_bar'></div><img id='ennemy_Sprite'></img></div><div id='defender_box'  class='fighter_box'><img id='defender_Sprite'></img><div class='hp_bar'></div></div></div></br><div id='battle_moves' ></div></div><div id='logbox'>Battle log :</br></div>"));
                
                //store json
                $("#battle_container").data("battle",result);
                
                //load ennemy
                $('#ennemy_box .hp_bar').append($('<div id="ennemy_hp" class="fullHP"></div>'));
                $('#ennemy_hp').progressbar({ value:parseInt(100*result.poke2.currentHP/result.poke2.maxHP)});
                $('#ennemy_Sprite').attr("src", result.poke2.frontSprite);
                $('#ennemy_box').data("poke",result.poke2);
                
                //load defender
                $('#defender_Sprite').attr("src", result.poke1.backSprite);
                $('#defender_box .hp_bar').append($('<div id="defender_hp" class="fullHP"></div>'));
                $('#defender_hp').progressbar({ value: parseInt(100*result.poke1.currentHP/result.poke1.maxHP)});
                $('#defender_box').data("poke",result.poke1);
                
                //load moves
                for(i=0;i<result.poke1.moves.length;i++){
                    var name = 'poke_move_' + result.poke1.moves[i].name;
                    var attack = $('<button id="' + name + '" onclick="initTurn(this)"' + ((result.poke1.currentHP <= 0 || result.poke2.currentHP <= 0)?'disabled="true"':'') +'>' + result.poke1.moves[i].name + ' | ' + result.poke1.moves[i].pp + ' PP</button>');
                    $('#battle_moves').append(attack);
                    $("#"+name).data("move",result.poke1.moves[i]);
                }
                
                //load log
                $('#logbox').append(result.fightLog);
                
                //music battle-----------------------
                $('#battle_audio').append($('<source src="./sound/battle.mp3" type="audio/mpeg">'));
            }
    })
}

function updateMoves(attack_button, over){
    
    var move = $(attack_button).data("move");
        move.pp-= 1;
    if (move.pp <= 0)
        $(attack_button).attr("disabled",true);
    $(attack_button).data("move",move);
    $(attack_button).html(move.name + " | " + move.pp + " PP");
}

function updateHP(){
    var battle = $("#battle_container").data("battle");
    $("#defender_hp").progressbar('value', parseInt(100*battle.poke1.currentHP/battle.poke1.maxHP));
    $("#ennemy_hp").progressbar( 'value', parseInt(100*battle.poke2.currentHP/battle.poke2.maxHP));
    
    //console.log("curr : " + battle.poke1.currentHP + ", max : " + battle.poke1.maxHP);
    //console.log("curr : " + battle.poke2.currentHP + ", max : " + battle.poke2.maxHP);
}

function HPStage(pokemon){
    return pokemon.currentHP/pokemon.maxHP;
}

function initTurn(attack_button){
    var battle = $("#battle_container").data("battle");
    var ennemy = $("#ennemy_box").data("poke");
    var defender = $("#defender_box").data("poke");
    var attack = $(attack_button).data("move");
    var log = battle.fightLog;
    
    
    
    
    
    
    log += defender.name + " used " + $(attack_button).data("move").name;
    $("#logbox").append("</br>" + defender.name + " used " + $(attack_button).data("move").name + "!")
    
    ennemy.currentHP -= (((2*defender.level+10)/250)*(defender.attack/ennemy.defense)*attack.power)/2+2;
        
        
    if (defender.currentHP >0 && ennemy.currentHP >0){
        if (ennemy.moves.length = 1){
            if(ennemy.moves[0].pp <= 0){
                defender.currentHP -= (((2*ennemy.level+10)/250)*(ennemy.attack/defender.defense)*20)/2+2;
                ennemy.currentHP -= (((2*defender.level+10)/250)*(ennemy.attack/ennemy.defense)*10)/2+2;
            }else{
                defender.currentHP -= (((2*ennemy.level+10)/250)*(ennemy.attack/defender.defense)*ennemy.moves[0].power)/2+2;
                ennemy.moves[0]-=1;
            }
        }else{
            var iMove = Math.random()*ennemy.moves.length;
            if(ennemy.moves[iMove].pp <= 0){
                defender.currentHP -= (((2*ennemy.level+10)/250)*(ennemy.attack/defender.defense)*20)/2+2;
                ennemy.currentHP -= (((2*defender.level+10)/250)*(ennemy.attack/ennemy.defense)*10)/2+2;
            }else{
                defender.currentHP -= (((2*ennemy.level+10)/250)*(ennemy.attack/defender.defense)*ennemy.moves[iMove].power)/2+2;
                ennemy.moves[iMove]-=1;
            }
        }
    }
    
    if (ennemy.currentHP <= 0 || defender.currentHP <=0)
        $('[id^="poke_move_"]').each(function(){
            $(this).attr("disabled",true);
        })
    
    
    //updateHP
    if(HPStage(defender) < 0.5 && HPStage(defender) > 0.2){
        $("#defender_hp").removeClass("fullHP");
        $("#defender_hp").addClass("midHP");
    }
    if(HPStage(defender) <= 0.2){
        $("#defender_hp").removeClass("midHP");
        $("#defender_hp").addClass("lowHP");
    }
    if(HPStage(ennemy) < 0.5 && HPStage(ennemy) > 0.2){
        $("#ennemy_hp").removeClass("fullHP");
        $("#ennemy_hp").addClass("midHP");
    }
    if(HPStage(ennemy) <= 0.2){
        $("#ennemy_hp").removeClass("midHP");
        $("#ennemy_hp").addClass("lowHP");
    }
    
        
    updateMoves(attack_button);
    
    battle.poke1 = defender;
    battle.poke2 = ennemy;
    battle.fightLog = log;

    $.ajax({
        url: 'https://api.mongolab.com/api/1/databases/pikadb/collections/fight/'+ battle._id.$oid +'?apiKey=Iq2U_zn9n2pFQk2nyLNnHzPL8EtNr2t5',
        type: 'PUT',
        data: JSON.stringify(battle),
        contentType: 'application/json',
        success: function(result) {
        }
    });

    $("#battle_container").data("battle",battle);
    $("#ennemy_box").data("poke",ennemy);
    $("#defender_box").data("poke", defender);
    updateHP();
    
    //count attacks if == 0 -> loop
    
}