
//function EditStandardQuizQuestionsGO() {
//    var chks = document.getElementsByName("chk-qs");
//    var quiz_body = [];
//    var marked_for_delete = [];
//    for (var i = 0; i < chks.length; i++) {
//        if (chks[i].checked) {
//            var included = parseInt(chks[i].getAttribute("included"));
//            if (included == 0) {

//                quiz_body.push(
//                    {
//                        quizid: parseInt(chks[i].getAttribute("quizid")),
//                        questionid: parseInt(chks[i].getAttribute("ques")),
//                    }
//                );
//            }
//        }
//        else {
//            var included = parseInt(chks[i].getAttribute("included"));
//            if (included == 1) {
//                marked_for_delete.push(
//                    {
//                        quizid: parseInt(chks[i].getAttribute("quizid")),
//                        questionid: parseInt(chks[i].getAttribute("ques")),
//                        sortno: parseInt(chks[i].getAttribute("sortno")),
//                    }
//                );
//            }
//        }

//    }
     
//    if (quiz_body.length > 0) {
//        for (var i = 0; i < quiz_body.length; i++) {
//            var quiz_body_data = newFormData("AddQuestionsToStandardQuiz", {
//                quizid: quiz_body[i]["quizid"],
//                questionid: quiz_body[i]["questionid"]
//            });

//            getData(null, quiz_body_data, function (js) {
//                var status = js;

//                if (status[0]["Status"] > 0) {
//                    console.log("success");
//                }
//                else {
//                    console.log("failed");
//                }
//            }, true);
//        }

//    }

//    if (marked_for_delete.length > 0) {
//        for (var i = 0; i < marked_for_delete.length; i++) {
//            var md = newFormData(
//                "DeleteQuestionsFromStandardQuiz",
//                {
//                    quizid: marked_for_delete[i]["quizid"],
//                    sortno: marked_for_delete[i]["sortno"],
//                    questionid: marked_for_delete[i]["questionid"],
//                }
//            );

//            getData(null, md, function (js) {
//                var status = js;

//                if (status[0]["Status"] > 0) {
//                    console.log("success");
//                }
//                else {
//                    console.log("failed");
//                }
//            }, true);


//        }
//    }
//    ReloadPage();
//}
//function EditStandardQuizQuestions(main,QuizID) {
//    section("soSubmit", ["label|class=liteblueButton|onclick=EditStandardQuizQuestionsGO()|Submit"]);
//    section("soSubmit", ["label|class=padLeft10|"]);
    
//    var q_data = newFormData("GetStandardQuizQuestions", { quizid: QuizID });
//    var all_questions = [];
//    section("optMain", ["div|id=div-qs"]);

//    getData(null, q_data, function (js) {
//        all_questions = js;
//        if (all_questions.length > 0) {
//            for (var i = 0; i < all_questions.length; i++) {
//                section("div-qs", ["div|id=div-qs-"+i]);
//                if (all_questions[i]["Included"] == 0) {
//                    section('div-qs-' + i, ["input|type=checkbox|sortno=" + all_questions[i]["SortNo"] +"|quizid=" + QuizID + "|included=0|ques=" + all_questions[i]["QuestionID"] + "|id=chk_" + i + "-" + all_questions[i]["QuestionID"] + "|style=cursor:pointer|name=chk-qs", "label|-", "label|style=cursor:pointer|onclick=selectQuestion('chk_" + i + "-" + all_questions[i]["QuestionID"] + "')|" + all_questions[i]["Question"]]);
//                }
//                else {
//                    section('div-qs-' + i, ["input|type=checkbox|checked=true|sortno=" + all_questions[i]["SortNo"] + "|quizid=" + QuizID + "|included=1|ques=" + all_questions[i]["QuestionID"] + "|id=chk_" + i + "-" + all_questions[i]["QuestionID"] + "|style=cursor:pointer|name=chk-qs", "label|-", "label|style=cursor:pointer|onclick=selectQuestion('chk_" + i + "-" + all_questions[i]["QuestionID"] + "')|" + all_questions[i]["Question"]]);
//                }
//            }
//        }
//    }, true);

//}
//function updateQuestions() {
//    var chks = document.getElementsByName("chkques");
//    if (chks.length > 0) {
//        for (var i = 0; i < chks.length; i++) {
//            var chkd = document.getElementById(chks[i].id).checked == true ? 1 : 0;
           
//            var question_id = chks[i].id.split('-')[1];
//            var question_data = newFormData("UpdateQuestions", { questionid: parseInt(question_id), active: chkd });
//            getData(null, question_data, function (js) {
//                var status = js;

//                if (status[0]["Status"] > 0) {
//                    console.log("success");
//                }
//                else {
//                    console.log("failed");
//                }
//            }, true);
//        }
//    }
//    ReloadPage();
//}


//function EditSectionGO() {
//    var chks = document.getElementsByName("chk-qs");
//    var quiz_body = [];
//    var marked_for_delete = [];
//    for (var i = 0; i < chks.length; i++) {
//        if (chks[i].checked) {
//            var included = parseInt(chks[i].getAttribute("included"));
//            if (included == 0) {
                
//                quiz_body.push(
//                    {
//                        quizid: parseInt(chks[i].getAttribute("quizid")),
//                        sectionno: parseInt(chks[i].getAttribute("secno")),
//                        sectionname: chks[i].getAttribute("section"),
//                        questionid: parseInt(chks[i].getAttribute("ques")),
//                    }
//                );
//            }
//        }
//        else {
//            var included = parseInt(chks[i].getAttribute("included"));
//            if (included == 1) {
//                marked_for_delete.push(
//                    {
//                        quizid: parseInt(chks[i].getAttribute("quizid")),
//                        sectionno: parseInt(chks[i].getAttribute("secno")),
//                        sectionname: chks[i].getAttribute("section"),
//                        sortno: parseInt(chks[i].getAttribute("sortno")),
//                        questionid: parseInt(chks[i].getAttribute("ques")),
//                    }
//                );
//            }
//        }
        
//    }
   
//    if (quiz_body.length > 0) {
//        for (var i = 0; i < quiz_body.length; i++) {
//            var quiz_body_data = newFormData("AddQuestionsToSections", {
//                quizid: quiz_body[i]["quizid"],
//                sectionno: quiz_body[i]["sectionno"],
//                sectionname: quiz_body[i]["sectionname"],
//                questionid: quiz_body[i]["questionid"]
//            });
            
//            getData(null, quiz_body_data, function (js) {
//                var status = js;
               
//                if (status[0]["Status"] > 0) {
//                    console.log("success");
//                }
//                else {
//                    console.log("failed");
//                }
//            },true);
//        }
        
//    }
    
//    if (marked_for_delete.length > 0) {
//        for (var i = 0; i < marked_for_delete.length;i++) {
//            var md = newFormData(
//                "DeleteQuestionFromSection",
//                {
//                    sectionname: marked_for_delete[i]["sectionname"],
//                    quizid: marked_for_delete[i]["quizid"],
//                    sectionno: marked_for_delete[i]["sectionno"],
//                    sortno: marked_for_delete[i]["sortno"],
//                    sectionname:marked_for_delete[i]["sectionname"],
//                    questionid: marked_for_delete[i]["questionid"],
//                }
//            );

//            getData(null, md, function (js) {
//                var status = js;

//                if (status[0]["Status"] > 0) {
//                    console.log("success");
//                }
//                else {
//                    console.log("failed");
//                }
//            }, true);

            
//        }
//    }
//    ReloadPage();
//}
//function EditSections(main, QuizID) {
//    section("soSubmit", ["label|class=liteblueButton|onclick=EditSectionGO()|Submit"]);
//    section("soSubmit", ["label|class=padLeft10|"]);
    
//    var jsSections = [];
//    var data = newFormData("GetSections", { quizid: QuizID });
    
//    getData(null, data, function (js) {
//        jsSections = js;
        
//        if (jsSections.length > 0) {
//            for (var i = 0; i < jsSections.length; i++) {
//                var sort_no = jsSections[i]["SortNo"];
//                section("optMain", ["div|id=div_sec-" + i + "|class=smhdr dim|style=cursor:pointer|onclick=showContent('div_sec_content-" + i + "','" + QuizID + "','" + jsSections[i]["SectionName"] + "','" + jsSections[i]["SectionNo"] + "','" + sort_no + "')"]);
//                section("div_sec-" + i, ["input|type=checkbox|id=chk_sec_content-" + i + "|style=cursor:pointer|", "label|-", "label|style=cursor:pointer|onclick=showContent('div_sec_content-" + i + "','" + QuizID + "','" + jsSections[i]["SectionName"] + "','" + jsSections[i]["SectionNo"] + "','" + sort_no +"')|" + jsSections[i]["SectionName"]]);
//                section("optMain", ["br"]);
//                section("optMain", ["div|id=div_sec_content-" + i + "|style=display:none"]);
//            }
//        }
//    },true);
//}


//function showContent(elem, quizId, sectionName,sectionNo,sortNo) {
//    var id = elem.split('-')[1];
//    var all_questions = [];

//    if (document.getElementById('chk_sec_content-' + id).checked) {
//        document.getElementById('chk_sec_content-' + id).checked = false;
//        $('#' + elem).empty();
//        document.getElementById(elem).style.display = 'none';
//    }
//    else {
//        document.getElementById('chk_sec_content-' + id).checked = true;
//        $('#' + elem).empty();
//        var q_data = newFormData("GetSectionQuestions", {sectionname:sectionName,quizid:quizId});

//        getData(null, q_data, function (js) {
//            all_questions = js;
//           if (all_questions.length > 0) {
//                for (var i = 0; i < all_questions.length; i++) {
//                    section(elem, ["div|id=div-q-" + i + "-" + id + "|style=cursor:pointer;display:table;|"]);
//                    $('#div-q-' + i + "-" + id).empty();
//                    if (all_questions[i]["Included"] == 0) {
//                        section('div-q-' + i + "-" + id, ["input|type=checkbox|sortno=" + all_questions[i]["SortNo"] + "|secno=" + sectionNo + "|quizid=" + quizId + "|section=" + sectionName + "|included=0|ques=" + all_questions[i]["QuestionID"] + "|id=chk_" + i + "_" + id + "-" + all_questions[i]["QuestionID"] + "|style=cursor:pointer|name=chk-qs", "label|-", "label|style=cursor:pointer|onclick=selectQuestion('chk_" + i + "_" + id + "-" + all_questions[i]["QuestionID"] + "')| " + all_questions[i]["Question"]]);
//                    }
//                    else {
//                        section('div-q-' + i + "-" + id, ["input|type=checkbox|sortno=" + all_questions[i]["SortNo"] +"|secno=" + sectionNo + "|quizid="+quizId+"|section=" + sectionName + "|included=1|ques=" + all_questions[i]["QuestionID"]+"|checked=true|id=chk_" + i + "_" + id + "-" + all_questions[i]["QuestionID"] + "|style=cursor:pointer|name=chk-qs", "label|-", "label|style=cursor:pointer|onclick=selectQuestion('chk_" + i + "_" + id + "-" + all_questions[i]["QuestionID"] + "')| " + all_questions[i]["Question"]]);
//                    }
//                }
//            }
//        },true);

//        document.getElementById(elem).style.display = 'block';
//    }
//}

//function selectQuestion(chk_id) {
//    if (document.getElementById(chk_id).checked) {
//        document.getElementById(chk_id).checked = false;
//    }
//    else {
//        document.getElementById(chk_id).checked = true;
//    }
    
//}
//function QuizSubmitAnswers() {
//    var js = jsCurrentSection;
//    var SectionNo = js[0]["SectionNo"];
//    var TryID = js[0]["TryID"];

//    var jsSend = [];
//    for (var i = 0; i < js.length; i++) {
//        var QuestionID = js[i]["QuestionID"];
//        var tmpAnswer = "";
//        var arrAnswers = document.getElementsByName("tq_" + QuestionID);
//        for (var ii = 0; ii < arrAnswers.length; ii++) {
//            tmpAnswer = (arrAnswers[ii].checked) ? arrAnswers[ii].value : tmpAnswer;
//        }
//        var Answer = js[i]["Answer" + tmpAnswer];

//        jsSend.push({ TryID: TryID, QuestionID: QuestionID, Answer: Answer, SectionNo:SectionNo });
//    }

//    var data = newFormData("SubmitAnswers", jsSend);
//    getData("#adHocArray", data, function (vr) {
//        var data = newFormData("QuizScoreSET", { QuizID: QuizID, SectionNo: SectionNo, TryID: TryID });
//        getData(null, data, function (js) {
//            var passedFailed = js[0]["PassedFailed"];
//            console.log(js);

//            if (passedFailed) {
//                js = jsCurrentQuiz.filter(d => d.SectionNo == SectionNo + 1);
//                if (js.length > 0) {
//                    //passed section, move to next section
//                    opts(false);
//                    showOpts("Quiz", QuizID + "|" + (SectionNo + 1), js[0]["QuizName"], true, "ReloadPage()");
//                } else {
//                    //passed exam, no more sections
//                    xconfirm("Congratulations!  You have passed the exam.");
//                    ReloadPage();
//                }
//            } else {
//                if (js[0]["QuizType"] == "Standard") {
//                    //standard exam, failed
//                    xconfirm(null, ["div|Sorry!  You have not answered all the questions correctly.", "p", "div|You will need to retake the exam."]);
//                    opts(false);
//                } else {
//                    //stepbystep exam failed section
//                    xconfirm(null, ["div|Sorry!  You have not answered all the questions correctly.", "p", "div|You will need to retake this section."]);
//                    opts(false);
//                    showOpts("Quiz", QuizID + "|" + SectionNo, jsCurrentSection[0]["QuizName"], true, "ReloadPage()");
//                }
//            }
//        }, true);
//    });
//}

//function QuizAnswers_Onchange() {
//    var js = jsCurrentSection;

//    var unchecked = false;
//    for (var i = 0; i < js.length; i++) {
//        var QuestionID = js[i]["QuestionID"];
//        var tmpAnswer = "";
//        var arrAnswers = document.getElementsByName("tq_" + QuestionID);
//        for (var ii = 0; ii < arrAnswers.length; ii++) {
//            tmpAnswer = (arrAnswers[ii].checked) ? arrAnswers[ii].value : tmpAnswer;
//        }
//        if (tmpAnswer == "") {
//            unchecked = true;
//            break;
//        }
//    }
//    if (!unchecked) {
//        section("soSubmit", ["label|class=padLeft10", "label|class=liteblueButton|onclick=QuizSubmitAnswers()|Submit"]);
//    }
//}