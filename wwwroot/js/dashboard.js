setInterval(heartbeat, 6000);
var username, userrole;
var jsQuizzes = [];


function setBannerOptions() {
    section("bannerOptions", [
        ((userrole == "Admin") ? "label|icon=gearbox.png|id=btnReports|class=bannerButton|onclick=showOpts('Admin Panel', null, null, true)|Admin" : ""),
        "label|class=padLeft10 cursor|style=color:silver|title=Click to Logout|onclick=Logout()|Logged in as: " + username
    ]);
}

function Logout() {
    loading.style.display = "";
    window.location.href = "Logout";
}

function ReloadPage() {
    loading.style.display = "";
    setTimeout(function () { document.location.reload(); }, 1500);
}

function heartbeat() {
    getData("Heartbeat", null, function (vr) {
        console.log(vr);
        if (vr == "Logout") { window.location.href = "Home/Index"; }
    }, null, "noload");
}

function startMe() {
    setBannerOptions();
    //PageContainer.innerHTML = "";

    var data = newFormData("GetQuizzes", {});
    getData(null, data, function (js) {
        jsQuizzes = js;

        section("PageContainer", [
            ((userrole == "Admin") ? "label|class=greenButton floatRight|onclick=showOpts('Create Quiz', null, null, true)|Create New Quiz" : ""),
            "div|class=pad10|",
            "div|id=listQuizzes"
        ]);

        sectionTable("listQuizzes", "tblAvailQuizzes", "tr", null, null, "style=width:100%");
        sectionTable("", "tblAvailQuizzes", "td", "class=smhdr|Quiz Name");
        sectionTable("", "tblAvailQuizzes", "td", "class=smhdr|Quiz Type");
        sectionTable("", "tblAvailQuizzes", "td", "class=smhdr|Quiz Status");
        sectionTable("", "tblAvailQuizzes", "tr");
        sectionTable("", "tblAvailQuizzes", "td", "class=smhdr|colspan=11|<hr>");

        for (var i = 0; i < jsQuizzes.length; i++) {
            var QuizID = jsQuizzes[i]["QuizID"];
            var QuizName = jsQuizzes[i]["QuizName"];
            var QuizType = jsQuizzes[i]["QuizType"];
            var QuizStatus = jsQuizzes[i]["QuizStatus"];

            sectionTable("", "tblAvailQuizzes", "tr", "class=pad5");
            sectionTable("", "tblAvailQuizzes", "td", "colspan=10|style=height:5px|");

            sectionTable("", "tblAvailQuizzes", "tr", "class=pad5");
            sectionTable("", "tblAvailQuizzes", "td", "class=padLeft10|" + QuizName);
            sectionTable("", "tblAvailQuizzes", "td", "class=padLeft10|title=Quiz #" + QuizID + "|" + QuizType);
            sectionTable("", "tblAvailQuizzes", "td", "class=padLeft10|" + QuizStatus);
            sectionTable("", "tblAvailQuizzes", "td", "class=padLeft10|");
            sectionTable("", "tblAvailQuizzes", "td", "class=smokeButton|onclick=showOpts('Quiz', '" + QuizID + "','" + QuizName + "', true, 'ReloadPage()')|Take Quiz");
            sectionTable("", "tblAvailQuizzes", "td", "class=padLeft10|");
            sectionTable("", "tblAvailQuizzes", "td", "class=blueButton|onclick=showOpts('My Scores','" + QuizID + "','" + QuizName+"',true)|View My Scores");
            sectionTable("", "tblAvailQuizzes", "td", "class=padLeft10|");
            if (userrole == "Admin") {
                sectionTable("", "tblAvailQuizzes", "td", "class=orangeButton|onclick=showOpts('Edit Quiz', " + QuizID + ", '" + QuizName + "', true)|Edit");
                sectionTable("", "tblAvailQuizzes", "td", "class=padLeft10|");
                sectionTable("", "tblAvailQuizzes", "td", "class=redButton|onclick=DeleteQuiz(" + QuizID + ")|Delete");
            }
        }

    }, true)

}
