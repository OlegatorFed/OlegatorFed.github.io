var firstRoundTexts = document.getElementsByClassName("name-text");
var teamNames = [];
var scores = {};
var scoreTable = document.getElementById("score-table");
var lastGameRound;
tourMode = document.getElementById("tour-mode").checked;
editMode = document.getElementById("edit-mode").checked;
var mode = !editMode;

UpdateMode();
UpdateTeamsNumber();
ScoreInit();