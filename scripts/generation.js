function SetGrid() {
    Clear();
    SetTeams();
    var numberOfTeams = teamNames.length;
    SetTable(numberOfTeams);

    if ((numberOfTeams != 0)&&(numberOfTeams & (numberOfTeams - 1)) == 0) {

        for (var i = 0; i < Math.log2(numberOfTeams); i++) {

            document.getElementById("bracket-area2").innerHTML += '<div class="col" name="round' + i + '"></div>';
            document.getElementById("bracket-area2").innerHTML += '<div class="con-col-'+ i +'"></div>';

            for (var j = 0; j < Math.floor(numberOfTeams / Math.pow(2, i+2)); j++){
                document.getElementsByClassName("con-col-" + i)[0].innerHTML += '<div class="connector"></div>';
            }
            for (var j = 0; j < numberOfTeams / Math.pow(2, i+1); j++){
                document.getElementsByName("round"+i)[0].innerHTML += '<div class="game-node"><input type="text" readonly class="name-text" id="name'+ (i*100 + 2*j) +'" onclick="DecideTheWinner(this)"> <input type="text" readonly class="name-text" id="name'+ (i*100 + 2*j+1) +'" onclick="DecideTheWinner(this)"> </div>';
            }
            lastGameRound = i;
        }
        document.getElementById("bracket-area2").innerHTML += '<div id="winner"></div>';
        for (var j = 0; j < numberOfTeams / 2; j++){
            var elementsToFill1 = document.getElementById("name"+(2*j));
            var elementsToFill2 = document.getElementById("name"+(2*j+1));

            elementsToFill1.value = teamNames[j];
            elementsToFill2.value = teamNames[teamNames.length-j-1];
        }
    }
    else {
        nearestPower = Math.pow(2,Math.floor(Math.log(numberOfTeams)/Math.log(2)));

        for (var i = 0; i < Math.log2(numberOfTeams); i++) {

            document.getElementById("bracket-area2").innerHTML += '<div class="col" name="round' + i + '"></div>';
            document.getElementById("bracket-area2").innerHTML += '<div class="con-col-'+ i +'"></div>';

            for (var j = 0; j < Math.floor(nearestPower*2 / Math.pow(2, i+2)); j++){
                document.getElementsByClassName("con-col-" + i)[0].innerHTML += '<div class="connector"></div>';
            }
            for (var j = 0; j < nearestPower*2 / Math.pow(2, i+1); j++){
                document.getElementsByName("round"+i)[0].innerHTML += '<div class="game-node"><input type="text" readonly class="name-text" id="name'+ (i*100 + 2*j) +'" onclick="DecideTheWinner(this)"> <input type="text" readonly class="name-text" id="name'+ (i*100 + 2*j+1) +'" onclick="DecideTheWinner(this)"> </div>';
            }
            lastGameRound = i;
        }
        document.getElementById("bracket-area2").innerHTML += '<div id="winner"></div>';

        var firstRoundTeams = (numberOfTeams - nearestPower) * 2;
        var upBuffer = Math.floor((numberOfTeams - firstRoundTeams)/2);
        var bottomBuffer = Math.ceil((numberOfTeams - firstRoundTeams)/2);
        var teamsAreNotEven = numberOfTeams % 2 != 0 ? 1 : 0;
        var bottomCounter = 0;

        for (var j = 0; j < numberOfTeams / 2; j++){

            var elementsToFill1;
            var elementsToFill2;

            //первая
            if ( upBuffer > 2*j ){
                elementsToFill1 = document.getElementById("name"+(100+(2*j)));
            }
            else if (numberOfTeams - bottomBuffer <= 2*j){
                elementsToFill1 = document.getElementById("name"+(100+ (nearestPower - (bottomBuffer - bottomCounter)) ) );
                bottomCounter++;
            }
            else {
                elementsToFill1 = document.getElementById("name"+((2*j)+upBuffer));
            }

            //вторая
            if (upBuffer > 2*j+1){
                elementsToFill2 = document.getElementById("name"+(100+(2*j+1)));
            }
            else if (numberOfTeams - bottomBuffer <= 2*j+1){
                elementsToFill2 = document.getElementById("name"+(100 + (nearestPower - (bottomBuffer - bottomCounter))));
                bottomCounter++;
            }
            else {
                elementsToFill2 = document.getElementById("name"+((2*j+1) + upBuffer));
            }

            elementsToFill1.value = teamNames[j];
            if ((2*j+1 < numberOfTeams && numberOfTeams % 2 != 0) || (numberOfTeams % 2 == 0)){
                elementsToFill2.value = teamNames[teamNames.length-j-1];
            }
        }

        for (var k = 0; k < upBuffer; k++){

            document.getElementById("name"+(2*k)).setAttribute("disabled", "disabled");
            document.getElementById("name"+(2*k+1)).setAttribute("disabled", "disabled");
        }

        for (var k = nearestPower - bottomBuffer; k < nearestPower; k++){
            document.getElementById("name" + (2*k)).setAttribute("disabled", "disabled");
            document.getElementById("name" + (2*k+1)).setAttribute("disabled", "disabled");
        }
    }
}

function SetGroupRounds() {

    Clear();
    SetTeams();

    var numberOfTeams = teamNames.length;
    var numberOfMaps = parseInt(document.getElementById("maps-number").value);
    var groups = [];
    var groupCap = parseInt(document.getElementById("group-cap").value);
    var numberOfGroups = numberOfTeams / groupCap;
    var numRow = '';


    for (var k = 0; k < numberOfMaps; k++){
        numRow += '<th>' + (k + 1) + '</th>';
    }

    console.log(numberOfGroups);
    for (var i = 0; i < numberOfGroups; i++){

        document.getElementById("bracket-area2").innerHTML += '<table id="group-'+ i +'" class="group-table"></table>';
        document.getElementById("group-"+i).innerHTML += '<tr><th>Group ' + (i+1) + '</th>' + numRow + '</tr>';

        groups[i] = [];
        for (var j = i*groupCap; j < i*groupCap + groupCap; j++){
            groups[i].push(teamNames[j]);
        }
        groups[i] = groups[i].filter(item => item);
        for (var k = 0; k < groups[i].length; k++)
            document.getElementById("group-"+i).innerHTML += '<tr>' + SetTableRowGroup(groups[i][k], numberOfMaps) + '</tr>';

    }

}

function SetTable(numOfTeams) {
    scoreTable.innerHTML += '<tr><td>Team</td><td>Games</td><td>Wins</td><td>Losses</td><td>Total Score</td></tr>'
    for (var k = 0; k < numOfTeams; k++) {
        scoreTable.innerHTML += '<tr id="'+ teamNames[k] +'-score">'+ SetTableRow(teamNames[k], scores[teamNames[k]].games, scores[teamNames[k]].wins, scores[teamNames[k]].losses, scores[teamNames[k]].score) +'</tr>';
    }
}

function SetTableRow(name, games, wins, losses, totalScore){
    return '<td>'+ name +'</td><td>'+ games +'</td><td>'+ wins +'</td><td>'+ losses +'</td><td>'+ totalScore +'</td>';
}

function SetGroupTable(group, mapsNumber) {
    var numRow;
    var insertCode;
    for (var k = 0; k < mapsNumber; k++){
        numRow += '<td>' + (k + 1) + '</td>';
    }

    insertCode += '<tr><td>' + 'Name' + '</td>' + numRow + '</tr>';

    group.forEach((item) => {
        insertCode += '<tr>' + SetTableRowGroup(item, mapsNumber) + '</tr>';
    });
    return insertCode;
}

function SetTableRowGroup(name, mapsNumber) {
    var mapRow = '';
    for (var k = 0; k < mapsNumber; k++){
        mapRow += '<td></td>';
    }
    return '<td>'+ name +'</td>' + mapRow;
}
