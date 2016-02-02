var remainingTime = 60;
var interval;
var points = 0;
var targetText = "";
var previousText = "";

function initiate() {
    "use strict";
    $.get("http://speedtypescores.herokuapp.com/scores", function(data, status){}); // ping the Heroku app to become active
}

function startGame() {
    "use strict";
    targetText = getRandomText();
    $("#targetText").text(targetText);
    $("#time").text(remainingTime);
    interval = setInterval(gameTimer, 1000);
    $("#inputArea").text("");
    $("#inputArea").append('<input id="inputText" type="text" name="text" placeholder="Your Answer" onkeyup="checkForCorrectAnswer()" autofocus>');
    $("#inputText").val("");
    $("#inputText").bind('paste', function (e) {
       e.preventDefault(); // disable pasting into the input field
    });
    $("#startMenu").addClass("hidden");
    $("#game").removeClass("hidden");
}

function checkForCorrectAnswer() {
    "use strict";
    if ($("#inputText").val().toLowerCase().trim() == targetText) {
        points += targetText.length;
        showNextText();
    }
}

function gameTimer() {
    "use strict";
    remainingTime--;
    $("#time").text(remainingTime);
    if (remainingTime == 0) {
        showResults();
    }
}

function showNextText() {
    "use strict";
    targetText = getRandomText();
    $("#targetText").text(targetText);
    $("#inputText").val("");
}

function getRandomText() {
    var texts = ["we are a part of our environment", 
                 "he is a very eloquent speaker",
                 "that was completely gratuitous",
                 "you are such a maverick",
                 "he has always been meticulous",
                 "the punishment was nominal",
                 "we missed an important nuance",
                 "ours is a united front",
                 "respect our venerable ancestors",
                 "bite off more than you can chew",
                 "it costs an arm and a leg",
                 "cross that bridge when you come to it",
                 "give the benefit of the doubt",
                 "hit the nail on the head",
                 "kill two birds with one stone",
                 "take it with a grain of salt",
                 "let the cat out of the bag",
                 "you often burn the midnight oil",
                 "drastic times call for drastic measures",
                 "he just jumped on the bandwagon",
                 "we will keep him at bay",
                 "that was the last straw",
                 "you are preaching to the choir",
                 "he is like a squirrel",
                 "rural regions require reduced risks",
                 "he is either a sergeant or a colonel",
                 "teach a man to fish and feed him for a lifetime",
                 "that is no way for a leader to behave"];
    var text = texts[Math.floor(Math.random() * (texts.length))];
    if (previousText == text) {
        text = getRandomText();
    }
    previousText = text;
    return text;
}

function backToMenu() {
    "use strict";
    $("#startMenu").removeClass("hidden");
    $("#highscores").addClass("hidden");
    $("#game").addClass("hidden");
    $("#results").addClass("hidden");
    points = 0;
    clearInterval(interval);
    remainingTime = 60;
}

function showHighScores() {
    "use strict";
    $("#highscoreslist").text("");
    $.get("http://speedtypescores.herokuapp.com/scores", function(data, status){
        for (var i = 0; i < data.length; i++) {
            var name = $($.parseHTML(data[i].name)).text()
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");;
            $("#highscoreslist").append("<p>" + name + ": " + data[i].points + "</p>");        
        }
    });
    $("#startMenu").addClass("hidden");
    $("#game").addClass("hidden");
    $("#highscores").removeClass("hidden");
}

function showResults() {
    "use strict";
    clearInterval(interval);
    $("#points").text(points);
    $("#game").addClass("hidden");
    $("#results").removeClass("hidden");
}

function sendScore() {
    "use strict";
    var name = $("#name").val();
    if (name == "") {
        name = "anonymous";
    }
    $.ajax({
        url: "http://speedtypescores.herokuapp.com/newscore",
        type: "POST",
        data: JSON.stringify({
            name: name,
            points: points
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    });
    backToMenu();
}