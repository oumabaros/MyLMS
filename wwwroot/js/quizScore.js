

function AdminPanel(main) {
    section("optMain", [
        "label|class=padLeft10 alink|onclick=ReportByUser()|Report By User",
        "p",
        "label|class=padLeft10 alink|onclick=ReportByExam()|Report By Exam",
    ])
}

function closeReport() {
    divReportViewer.style.display = "none";
}
function ReportByExam() {
    divReportViewer.style.display = "block";
    dragElement(divReportViewer);

    section("soSubmit", ["label|class=padLeft10|"]);
    document.getElementById("div_report").innerHTML = "";
    section("div_report", ["div|id=div_exam|class=smhdr dim|"]);
    section("div_report", ["div|id=div_exams|"]);
       
    var data = newFormData("GetQuizzes", {});
    getData(null, data, function (js) {
        if (js.length > 0) {
            section("div_exams", [
                "label|class=padLeft10 orangeButton|style=margin-left:10px;|onclick=window.open('Quiz/ExportByExam')|Export To Excel",
                "p",
            ])
            for (var i = 0; i < js.length; i++) {
                section("div_exams", ["label|class=padRight10|icon=downArrow.png|", "label|onclick=showExamContent('" + js[i]["QuizID"] + "')|style=cursor:pointer|", "label|style=cursor:pointer|onclick=showExamContent('" + js[i]["QuizID"] + "')|" + js[i]["QuizName"]]);
                section("div_exams", ["br|"]);
                section("div_exams", ["div|id=div_exams-" + js[i]["QuizID"] + "|style=display:none;margin-left:40px;|"]);
            }
        }
    }, true);
}
function showExamContent(quizid) {
    document.getElementById("div_exams-" + quizid).innerHTML = "";
    if (document.getElementById("div_exams-" + quizid).style.display == '') {
        document.getElementById("div_exams-" + quizid).style.display = 'none';
    }
    else {
        var data = newFormData("GetUsers", {});
        getData(null, data, function (js) {
            if (js.length > 0) {
                for (var i = 0; i < js.length; i++) {
                    section("div_exams-" + quizid, ["label|class=padRight10|icon=downArrow.png|", "label||onclick=showExamUserContent('" + js[i]["UID"] + "','" + quizid + "')|style=cursor:pointer|", "label|style=cursor:pointer|onclick=showExamUserContent('" + js[i]["UID"] + "','" + quizid + "')|" + js[i]["UserName"]]);
                    section("div_exams-" + quizid, ["br|"]);
                    section("div_exams-" + quizid, ["div|id=div_users-" + js[i]["UID"] + "-" + quizid + "|style=display:none;margin-right:60px;|"]);
                }
            }
        }, true);
        document.getElementById("div_exams-" + quizid).style.display = 'block';
    }
}

function showExamUserContent(uid, quizid) {
    document.getElementById("div_users-" + uid + "-" + quizid).innerHTML = "";
    if (document.getElementById("div_users-" + uid + "-" + quizid).style.display == '') {
        document.getElementById("div_users-" + uid + "-" + quizid).style.display = 'none';
    }
    else {
        $("#div_users-" + uid + "-" + quizid).empty();
        var tries = newFormData("GetTries", { xuid: parseInt(uid), quizid: parseInt(quizid) });
        getData(null, tries, function (js) {
            if (js.length > 0) {
                var tmpTryID = "";
                for (var i = 0; i < js.length; i++) {
                    var SectionName = js[i]["SectionName"];
                    var TryID = js[i]["TryID"];
                    var TryDate = js[i]["TryDate"];
                    var SectionStatus = js[i]["SectionStatus"];
                    var QuizStatus = js[i]["QuizStatus"];

                    if (tmpTryID != TryID) {
                        section("div_users-" + uid + "-" + quizid, [
                            "div|id=div_try_" + TryID +
                            "|class=smhdr dim|style=cursor:pointer;margin-bottom:0px;|" +
                            "onclick=MyScores_ShowTryContent('" + TryID + "')", "hr"]);
                        section("div_try_" + TryID, [
                            "label|class=padRight10|icon=downArrow.png|",
                            "label|style=cursor:pointer|" + TryDate,
                            "label|class=padLeft10 cursor| (" + QuizStatus + ")",
                            "table|id=tbl_Try_" + TryID + "|class=bright|style=width:100%; display:none"
                        ]);
                        section("tbl_Try_" + TryID, [
                            "tr",
                            "td|class=padLeft10 padRight10|",
                            "td|Section",
                            "td|Date Taken",
                            "td|Status"
                        ]);
                    }
                    section("tbl_Try_" + TryID, [
                        "tr",
                        "td|class=padLeft10 padRight10|",
                        "td|class=normal|" + SectionName,
                        "td|class=normal|" + TryDate,
                        "td|class=normal|" + SectionStatus
                    ]);
                    tmpTryID = TryID;
                }
            }
        }, true);
        document.getElementById("div_users-" + uid + "-" + quizid).style.display = 'block';
    }
}

function ReportByUser() {
    divReportViewer.style.display = "block";
    dragElement(divReportViewer);
    section("soSubmit", ["label|class=padLeft10|"]);
    document.getElementById("div_report").innerHTML = "";
    section("div_report", ["div|id=div_user|class=smhdr dim|"]);
    section("div_report", ["div|id=div_users|"]);
   
    var data = newFormData("GetUsers", {});
    getData(null, data, function (js) {
        if (js.length > 0) {
            section("div_users", [
                "label|class=padLeft10 orangeButton|style=margin-left:10px;|onclick=window.open('Quiz/ExportByUser')|Export To Excel",
                "p",
            ])
            for (var i = 0; i < js.length; i++) {
                section("div_users", ["label|class=padRight10|icon=downArrow.png|", "label|onclick=showUserContent('" + js[i]["UID"] + "')|style=cursor:pointer|", "label|style=cursor:pointer|onclick=showUserContent('" + js[i]["UID"] + "')|" + js[i]["UserName"]]);
                section("div_users", ["br|"]);
                section("div_users", ["div|id=div_users-" + js[i]["UID"] + "|style=display:none;margin-left:40px;|"]);
            }
        }
    }, true);
}

function showUserContent(uid) {
    document.getElementById("div_users-" + uid).innerHTML = "";
    if (document.getElementById("div_users-" + uid).style.display == '') {

        document.getElementById("div_users-" + uid).style.display = 'none';
    }
    else {
        $('#div_users-' + uid).empty();
        var data = newFormData("GetQuizzes", {});
        getData(null, data, function (js) {
            if (js.length > 0) {
                for (var i = 0; i < js.length; i++) {
                    section('div_users-' + uid, ["label|class=padRight10|icon=downArrow.png|", "label|onclick=showExamUserContent('" + uid + "','" + js[i]["QuizID"] + "')|style=cursor:pointer|", "label|style=cursor:pointer|onclick=showExamUserContent('" + uid + "','" + js[i]["QuizID"] + "')|" + js[i]["QuizName"]]);
                    section('div_users-' + uid, ["br|"]);
                    section('div_users-' + uid, ["div|id=div_users-"+uid+"-" + js[i]["QuizID"]+ "|style=display:none;margin-left:40px;|"]);
                }
            }
        }, true);
        document.getElementById("div_users-" + uid).style.display = 'block';
    }
}
function ExportScores(QuizID) {
    var data = new FormData();
    data.append('QuizID', QuizID);
    getData("Quiz/ExportMyScore", data, function (vr) {
        
    });
}

function MyScores_ShowTryContent(TryID) {
    var tbl = document.getElementById("tbl_Try_" + TryID);
    tbl.style.display = (tbl.style.display == "none") ? "" : "none";
}

function MyScores(main, QuizID) {
    var data = newFormData("GetTries", { xuid:"GETUID", quizid:QuizID });
    getData(null, data, function (js) {

        if (js.length == 0) {
            section("optMain", ["div|class=pad10|You have not taken any quizzes yet."]);
        } else {
            section("optMain", ["div|id=div_export"]);
            var mn = document.getElementById("div_export");
            mn.innerHTML="<label class='orangeButton' style='font-size:14px;' onclick=window.open('Quiz/ExportMyScore?QuizID=" + QuizID + "')> Export To Excel</label> ";

            var tmpTryID = "";
            for (var i = 0; i < js.length; i++) {
                var QuizName = js[i]["QuizName"];
                var SectionName = js[i]["SectionName"];
                var TryID = js[i]["TryID"];
                var TryDate = js[i]["TryDate"];
                var SectionStatus = js[i]["SectionStatus"];
                var QuizStatus = js[i]["QuizStatus"];

                if (tmpTryID != TryID) {
                    
                    section("optMain", [
                        "div|id=div_try_" + TryID +
                        "|class=smhdr dim|style=cursor:pointer;margin-bottom:0px;|" +
                        "onclick=MyScores_ShowTryContent('" + TryID + "')", "hr"]);
                    section("div_try_" + TryID, [
                        "label|class=padRight10|icon=downArrow.png|",
                        "label|style=cursor:pointer|" + TryDate,
                        "label|class=padLeft10 cursor| (" + QuizStatus + ")",
                        "table|id=tbl_Try_" + TryID + "|class=bright|style=width:100%; display:none"
                    ]);
                    section("tbl_Try_" + TryID, [
                        "tr",
                        "td|class=padLeft10 padRight10|",
                        "td|Section",
                        "td|Date Taken",
                        "td|Status"
                    ]);
                }

                section("tbl_Try_" + TryID, [
                    "tr",
                    "td|class=padLeft10 padRight10|",
                    "td|class=normal|" + SectionName,
                    "td|class=normal|" + TryDate,
                    "td|class=normal|" + SectionStatus
                ]);

                tmpTryID = TryID;
                
            }
        }
    }, true);

}
