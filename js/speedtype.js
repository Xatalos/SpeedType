var remainingTime = 60;
var interval;
var points = 0;
var targetText = "";

var music;

function initiate() {
    "use strict";
    $.get("http://speedtypescores.herokuapp.com/scores", function(data, status){}); // ping the Heroku app to become active
    preloadMusic();
}

function preloadMusic() {
    "use strict";
    $("#game").append('<audio id="Music" class="music" preload loop> <source src="music/alliance.mp3" type="audio/mpeg"></audio>');
    music = $("#Music")[0];
}

function startGame() {
    "use strict";
    targetText = getRandomText();
    $("#targetText").text(targetText);
    $("#time").text(remainingTime);
    interval = setInterval(gameTimer, 1000);
    $("#inputText").val("");
    $("#inputText").bind('paste', function (e) {
       e.preventDefault(); // disable pasting into the input field
    });
    $("#startMenu").addClass("hidden");
    music.play();
    $("#game").removeClass("hidden");
}

function checkForCorrectAnswer() {
    "use strict";
    if ($("#inputText").val() == targetText) {
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
                 "actions speak louder than words"];
    return texts[Math.floor(Math.random() * (texts.length))];
}

function backToMenu() {
    "use strict";
    $("#startMenu").removeClass("hidden");
    $("#highscores").addClass("hidden");
    $("#credits").addClass("hidden");
    $("#game").addClass("hidden");
    $("#results").addClass("hidden");
    music.pause();
    music.currentTime = 0;
    points = 0;
    clearInterval(interval);
    remainingTime = 60;
}

function showHighScores() {
    "use strict";
    $("#highscoreslist").text("");
    $.get("http://speedtypescores.herokuapp.com/scores", function(data, status){
        for (var i = 0; i < data.length; i++) {
            $("#highscoreslist").append("<p>" + $.parseHTML(data[i].name) + ": " + data[i].points + "</p>");        
        }
    });
    $("#startMenu").addClass("hidden");
    $("#game").addClass("hidden");
    $("#highscores").removeClass("hidden");
}

function showCredits() {
    "use strict";
    $("#startMenu").addClass("hidden");
    $("#credits").removeClass("hidden");
}

function showResults() {
    "use strict";
    clearInterval(interval);
    $("#game").addClass("hidden");
    $("#results").removeClass("hidden");
}

function sendScore() {
    "use strict";
    $("#points").text(points);
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