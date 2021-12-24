function GetJSON(url) {
    var Httpreq = new XMLHttpRequest();
    Httpreq.open("GET",url,false);
    Httpreq.send(null);
    return Httpreq.responseText;
}

function ScoreInit() {
    teamNames.forEach((item) => {
        if (typeof scores[item] === 'undefined'){
            scores[item] = {
                games: 0,
                wins: 0,
                losses: 0,
                score: 0
            };
        }
    })
}
function SumArr(arr) {
    return arr.reduce(function (a, b) {
            return a + b;
        })
}

function SortScores() {
    for (var i = 0; i < teamNames.length; i++){
        for (var j = i+1; j < teamNames.length; j++){
            if (scores[teamNames[i]]["Test competitive modules"]["total"] <= scores[teamNames[j]]["Test competitive modules"]["total"]){
                [teamNames[i], teamNames[j]] = [teamNames[j], teamNames[i]];
            }
        }
    }
}

function UpdateTable() {
    scoreTable.innerHTML = '';
    SetTable(teamNames.length);
}

function SetTeams() {
    scores = [];
    for (var i = 0; i < userJSON.users.length; i++){

        if (userJSON.users[i].jury == 0){

            teamNames.push(userJSON.users[i].name);
            scores[userJSON.users[i].name] = {};
            if (Object.keys(resultJSON[i]).length > 0){

                problems.forEach((item) => {

                    scores[userJSON.users[i].name][item] = {};
                    scores[userJSON.users[i].name][item]['tests'] = [];
                    scores[userJSON.users[i].name][item]['points'] = [];
                    resultJSON[i][item].forEach((item1) => {
                        console.log(item1.id);
                        GetTests(item1.id).runs[0].tests.forEach((item2) => {
                            scores[userJSON.users[i].name][item]['tests'].push(item2.points);
                        })
                        scores[userJSON.users[i].name][item]['points'].push(item1.points);
                    });
                    scores[userJSON.users[i].name][item]['total'] = SumArr(scores[userJSON.users[i].name][item]['tests']);
                });
            }
            else {

                problems.forEach((item) => {
                    scores[userJSON.users[i].name][item] = {};
                    scores[userJSON.users[i].name][item]['total'] = 0;
                });
            }
        }
    }
    SortScores();
    UpdateTeamsNumber();
}

function DecideTheWinner(element) {
    textFieldNumber = element.id.substr(4,element.className.length);
    teamName = element.value;
    loserElement = (textFieldNumber % 2 == 0) ? document.getElementById("name" + (parseInt(textFieldNumber) + 1)) : document.getElementById("name" + (parseInt(textFieldNumber) - 1));
    console.log(Math.ceil(Math.log2(teamNames.length)) - 1, Math.floor(textFieldNumber / 100));

    if (mode && Math.ceil(Math.log2(teamNames.length)) - 1 != Math.floor(textFieldNumber / 100)){

        loserName = loserElement.value;

        scores[teamName].games++;
        scores[teamName].wins++;

        scores[loserName].games++;
        scores[loserName].losses++;

        SortScores();

        loserElement.setAttribute("disabled", "disabled");
        element.setAttribute("disabled", "disabled");
        UpdateTable();
        document.getElementById("name" + (Math.floor(textFieldNumber / 100)*100 + 100 + Math.floor(textFieldNumber % 100 / 2))).value = element.value;
    }
    else if (Math.ceil(Math.log2(teamNames.length)) - 1 == Math.floor(textFieldNumber / 100)) {
        document.getElementById("winner").innerText = teamName;

        loserElement.setAttribute("disabled", "disabled");
        element.setAttribute("disabled", "disabled");
    }

}

function UpdateMode() {
    tourMode = document.getElementById("tour-mode").checked;
    editMode = document.getElementById("edit-mode").checked;
    mode = !editMode;
    if (editMode){
        if (document.getElementById("bracket-area2").innerHTML !== ''){
            Clear();
            SetGrid();
        }
        document.getElementById("generate-btn").disabled = false;
        document.getElementById("clear-btn").disabled = false;
        document.getElementById("teams-names").readOnly = false;
    }
    else {
        document.getElementById("teams-names").readOnly = true;
        document.getElementById("generate-btn").disabled = true;
        document.getElementById("clear-btn").disabled = true;
    }
}

function Clear() {
    document.getElementById("bracket-area2").innerHTML = "";
    document.getElementById("score-table").innerHTML = "";
    teamNames = [];
}

function UpdateTeamsNumber() {
    //SetTeams();
    document.getElementById("teams-counter").innerText = "Number of teams: " + teamNames.length;
}