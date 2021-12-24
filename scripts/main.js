var firstRoundTexts = document.getElementsByClassName("name-text");
var teamNames = [];
var scores = {};
var scoreTable = document.getElementById("score-table");
var lastGameRound;
tourMode = document.getElementById("tour-mode").checked;
editMode = document.getElementById("edit-mode").checked;
var mode = !editMode;
var userJSON = JSON.parse(GetJSON("https://imcs.dvfu.ru/cats/?f=users;cid=5913343;sid=pQm2uTL9c0NvaJKao0Dx314YUnlapD;json=1"));
var matchJSON = JSON.parse(GetJSON("https://imcs.dvfu.ru/cats/?f=console;cid=5913343;sid=pQm2uTL9c0NvaJKao0Dx314YUnlapD;search=contest_id%3Dthis,elements_count%3E1;json=1;i_value=-1"));
var resultJSON = [];
var problems = ["Test competitive modules"];

UpdateMode();
//UpdateTeamsNumber();
//SetProblems();
SetJSON();
//SetTeams();

function GetResult(matchCount){
    return JSON.parse(GetJSON('https://imcs.dvfu.ru/cats/?f=console;cid=5913343;sid=pQm2uTL9c0NvaJKao0Dx314YUnlapD;search=contest_id%3Dthis,parent_id%3D' + matchJSON[matchCount].id + ';json=1;i_value=-1'));
}

function GetTests(resultId) {
    return JSON.parse(GetJSON('https://imcs.dvfu.ru/cats/?f=run_details;cid=5913343;rid=' + resultId + ';sid=pQm2uTL9c0NvaJKao0Dx314YUnlapD;json=1'));
}

function GetMatches(userId) {
    return matchJSON.filter(function (matchJSON) {
        return matchJSON.team_id == userId;
    })
}

function SetProblems() {
    matchJSON.forEach((item) => {
        if (problems.indexOf(item.problem_title) === -1){
            problems.push(item.problem_title);
            console.log(item.problem_title);
        }
    });
}

function SetJSON() {
    for (var i = 0; i < userJSON.users.length; i++){
        if (userJSON.users[i].jury == 0){
            resultJSON[i] = {};
            for (var j = 0; j < matchJSON.length; j++){
                resultJSON[i][matchJSON[j].problem_title];
                if (matchJSON[j].team_id == i){
                    resultJSON[i][matchJSON[j].problem_title] = GetResult(j);
                }
            }
            document.getElementById("teams").innerHTML += '<tr><td>' + userJSON.users[i].name + '</td></tr>';
        }
    }
}

