var jsCurrentQuiz = [];
var jsCurrentSection = [];
var jsEditQuiz = [];
var pptFileName = "";
var testFileName = "";
//***************************************************  CREATE QUIZ SECTION
function CreateQuiz(main) {
    //main.appendChild(dyn("label","class=alink|onclick=window.open('CMS_LearningCenter_UploadTemplate.xlsx')|Get Upload Template"));
    main.appendChild(dyn("div", "id=CreateQuizContents"));
    section("CreateQuizContents", [
        "label|class=padLeft10|1. ",
        "label|class=padLeft10|",
        "label|class=greenButton|style=font-size:14px|onclick=window.open('CMS_LearningCenter_UploadTemplate.xlsx')|Click here to download the Exam Template",
        "p",
        "label|class=padLeft10|2. Fill the required data into the excel file ",
        "label|class=padLeft10|(StepByStep columns are optional)",
        "p",
        "label|class=padLeft10|",
        "img|class=padLeft10|style=width:75%;height:75%|src=uploadTemplateExample.png",
        "p",
        "label|class=padLeft10|3. Save the file and then select it using the upload button below",
        "p",
        "p",
        "input|type=file|id=file_UploadQuiz|style=display:none|onchange=file_UploadQuiz_Onchange()",
        "label|class=padLeft10|",
        "label|class=padLeft10|",
        "label|class=orangeButton|style=font-size:14px|onclick=file_UploadQuiz.click()|Upload Quizzes",
        "label|class=padLeft10|id=lbl_file_UploadQuiz",
        "p",
        "input|type=file|multiple=true|id=file_UploadFile|style=display:none|onchange=file_UploadFile_Onchange()",
        "label|class=padLeft10|",
        "label|class=padLeft10|",
        "label|class=orangeButton|style=font-size:14px|onclick=file_UploadFile.click()|Upload Files",
        "label|class=padLeft10|id=lbl_file_UploadFile",
        "p",
        "label|class=padLeft10|4. Once a file has been selected, the \"Submit\" button will appear in the top right corner of the window",

    ])
}

function file_UploadFile_Onchange() {
    var lbl = document.getElementById('lbl_file_UploadFile');
    var fil = document.getElementById('file_UploadFile').files;
    
    var validFileExtensions = ["ppt", "pptx"];
    var selectedFiles = [];
    var filename = "";
   
    for (var i = 0; i < fil.length; i++) {
        if (fil[i].size > 0) {
            filename = fil[i].name;
            var period = filename.lastIndexOf('.');
            if (period == -1) {
                filename = "Error: File extension must be 'ppt' or 'pptx'";
                document.getElementById('file_UploadFile').value = null;
                break;
            }
            else {
                var ext = filename.substring(period + 1);
                if (validFileExtensions.includes(ext.toLocaleLowerCase())) {
                    selectedFiles.push(filename);
                }
                else {
                    filename = "Error: File extension must be 'ppt' or 'pptx'";
                    selectedFiles = [];
                    document.getElementById('file_UploadFile').value = null;
                    break;
                }
            }
        }
    }

    lbl.style.color = (selectedFiles.length<1) ? "red" : "black";
    lbl.innerHTML = "";
    
    if (selectedFiles.length < 1) {
        soSubmit.innerHTML = "";
    }
    else {
        filename = selectedFiles.join(',');
    }
    lbl.innerHTML = filename;
}
function file_UploadQuiz_Onchange() {
    console.log("here");
    var fil = file_UploadQuiz.files;
    var filename = fil[0].name;
    var arrFN = filename.split(".");
    var err = (arrFN.length == 1) ? true : false;
    err = (arrFN.length == 1) ? true : (arrFN[arrFN.length - 1].toLowerCase() != "xlsx") ? true : false;

    filename = (err) ? "Error: File extension must be 'xlsx'" : filename;

    lbl_file_UploadQuiz.style.color = (err) ? "red" : "black";

    lbl_file_UploadQuiz.innerHTML = filename;

    soSubmit.innerHTML = "";
    if (!err) {
        section("soSubmit", [
            "label|class=liteblueButton|onclick=CreateQuizGO()|Submit"
        ]);
    }
}

function CreateQuizGO() {
    var fil = file_UploadQuiz.files;
    var pptFiles = document.getElementById('file_UploadFile').files;
    var excel_file_names = [];
    var ppt_file_names = [];

    if (pptFiles.length > 0) {
        for (var i = 0; i < pptFiles.length; i++) {
            ppt_file_names.push(pptFiles[i].name.substring(0, pptFiles[i].name.lastIndexOf('.')));
        }
    }
    
    try {
        //read and process excel file
        var reader = new FileReader();
        reader.readAsBinaryString(fil[0]);
        reader.onload = function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type: 'binary'
            });
            
            var sheet = workbook.Sheets[workbook.SheetNames[0]];
            var json = XLSX.utils.sheet_to_json(sheet);

            //check if excel file has data
            if (json.length > 0) {

                var valid_column_names = ["Quiz Name", "Question", "Answer 1", "Answer 2", "Answer 3", "Answer 4", "Correct Answer (1, 2, 3, 4)", "StepByStep Section Name", "Material (Link / Explanation per Question or Section)", "FileName"];
                var excel_column_names = Object.keys(json[0]);
                var diff = excel_column_names.filter(x => !valid_column_names.includes(x));

                //is excel file well-formatted
                if (diff.length > 0) {
                    disableInputFilesOnError();
                    xconfirm("Excel file might not be well-formatted. Download the template provided from the link provided in instruction 1.");
                }
                else {
                     //check for mandatory fields
                    var err_count = 0;
                    for (var j = 0; j < json.length; j++) {
                        if (json[j]["Quiz Name"] == undefined || json[j]["Question"] == undefined || json[j]["Answer 1"] == undefined || json[j]["Answer 2"] == undefined || json[j]["Correct Answer (1, 2, 3, 4)"] == undefined) {
                            err_count++;
                        }
                    }
                    //if a mandatory field is left empty...else..process file further
                    if (err_count > 0) {
                        xconfirm("At least one mandatory field is empty!");
                        disableInputFilesOnError();
                    }
                    else {

                        for (var i = 0; i < json.length; i++) {
                            excel_file_names.push(json[i]["FileName"]);
                        }
                        //filter null/empty files
                        excel_file_names = excel_file_names.filter(function (el) {
                            return el != null;
                        });

                        var difference = excel_file_names.filter(x => !ppt_file_names.includes(x));
                        //check if files have been uploaded/correct file names if necessary
                        if (difference.length > 0) {
                            var file_s = difference.length > 1 ? "files" : "file";
                            var is_are = difference.length > 1 ? "are" : "is";
                            var has_have = difference.length > 1 ? "have" : "has";
                            disableInputFilesOnError();
                            xconfirm("Either " + file_s + " [ " + difference.join(",") + " ] " + is_are + " mispelt in the Excel sheet or " + has_have + " not been selected!");
                        }
                        else {
                            //upload excel and ppt files
                            var data = new FormData();
                            data.append("fil", fil[0]);
                            if (pptFiles.length > 0) {
                                for (var i = 0; i < pptFiles.length; i++) {
                                    data.append('pptFiles', pptFiles[i]);
                                }
                            }
                            getData("Quiz/UploadQuiz", data, function (vr) {
                                loading.style.display = "none";
                                setTimeout(function () { document.location.reload(); }, 1500);
                            });
                        }
                    }
                }
            }
            else {
                disableInputFilesOnError();
                xconfirm("Excel file does not contain data.");
            }
        }
    }
    catch (e) {
        console.error(e);
    }
}

function disableInputFilesOnError() {
    document.getElementById('file_UploadFile').value = null;
    document.getElementById('file_UploadQuiz').value = null;
    document.getElementById('lbl_file_UploadFile').innerHTML = "";
    document.getElementById('lbl_file_UploadQuiz').innerHTML = "";
    soSubmit.innerHTML = "";
}

//********************************* TAKE QUIZ
function QuizSubmitAnswers() {
    var js = jsCurrentSection;
    var SectionNo = js[0]["SectionNo"];
    var TryID = jsCurrentQuiz[0]["TryID"];

    var jsSend = [];
    for (var i = 0; i < js.length; i++) {
        var QuestionID = js[i]["QuestionID"];
        var tmpAnswer = "";
        var arrAnswers = document.getElementsByName("tq_" + QuestionID);
        for (var ii = 0; ii < arrAnswers.length; ii++) {
            tmpAnswer = (arrAnswers[ii].checked) ? arrAnswers[ii].value : tmpAnswer;
        }
        var Answer = js[i]["Answer" + tmpAnswer];

        jsSend.push({ TryID: TryID, QuestionID: QuestionID, Answer: Answer, SectionNo:SectionNo });
    }

    var data = newFormData("SubmitAnswers", jsSend);
    getData("#adHocArray", data, function (vr) {
        var data = newFormData("QuizScoreSET", { QuizID: QuizID, SectionNo: SectionNo, TryID: TryID });
        getData(null, data, function (js) {
            var passedFailed = js[0]["PassedFailed"];
            console.log(js);

            if (passedFailed) {
                js = jsCurrentQuiz.filter(d => d.SectionNo == SectionNo + 1);
                if (js.length > 0) {
                    //passed section, move to next section
                    opts(false);
                    showOpts("Quiz", QuizID + "|" + (SectionNo + 1), js[0]["QuizName"], true, "ReloadPage()");
                } else {
                    //passed exam, no more sections
                    xconfirm("Congratulations!  You have passed the exam.");
                    ReloadPage();
                }
            } else {
                if (js[0]["QuizType"] == "Standard") {
                    //standard exam, failed
                    xconfirm(null, ["div|Sorry!  You have not answered all the questions correctly.", "p", "div|You will need to retake the exam."]);
                    opts(false);
                } else {
                    //stepbystep exam failed section
                    xconfirm(null, ["div|Sorry!  You have not answered all the questions correctly.", "p", "div|You will need to retake this section."]);
                    opts(false);
                    showOpts("Quiz", QuizID + "|" + SectionNo, jsCurrentSection[0]["QuizName"], true, "ReloadPage()");
                }
            }
        }, true);
    });
}

function QuizAnswers_Onchange() {
    var js = jsCurrentSection;

    var unchecked = false;
    for (var i = 0; i < js.length; i++) {
        var QuestionID = js[i]["QuestionID"];
        var tmpAnswer = "";
        var arrAnswers = document.getElementsByName("tq_" + QuestionID);
        for (var ii = 0; ii < arrAnswers.length; ii++) {
            tmpAnswer = (arrAnswers[ii].checked) ? arrAnswers[ii].value : tmpAnswer;
        }
        if (tmpAnswer == "") {
            unchecked = true;
            break;
        }
    }
    if (!unchecked) {
        section("soSubmit", ["label|class=padLeft10", "label|class=liteblueButton|onclick=QuizSubmitAnswers()|Submit"]);
    }
}
function closeMaterial() {
    VideoViewer.src = "";
    divVideoViewer.style.display = "none";
    if (pptFileName) {
        FileViewer.src = "materials/" + pptFileName + ".pdf";
        divFileViewer.style.display = "block";
        dragElement(divFileViewer);
    }
}

function closeFileMaterial() {
    divFileViewer.style.display = "none";
    if (testFileName.length > 0) {
        var data = new FormData();
        data.append('fileName', testFileName);
        getData("Quiz/DeleteTestFile", data, function (vr) {
            if (vr.length > 0) {
                
            }
        });
    }
}

function quizShowMaterial(Material, MaterialType) {
    dragElement(divVideoViewer);

    if (MaterialType == "URL") {
        console.log("Material", Material);

        if (Material.toLowerCase().replace(/\./g, "").indexOf("youtube") > 0) {
            if (Material.split("?v=").length > 1) {
                var arrMaterial = Material.split("?v=");
                Material = "https://www.youtube.com/embed/" + arrMaterial[arrMaterial.length - 1];
            } else {
                var arrMaterial = Material.split("/");
                Material = "https://www.youtube.com/embed/" + arrMaterial[arrMaterial.length - 1];
            }
        }

        console.log("Changed to", Material);

        VideoViewer.src = Material;
        divVideoViewer.style.display = "";
    }
    else {
        if (pptFileName) {
            FileViewer.src = "materials/" + pptFileName + ".pdf";
            divFileViewer.style.display = "block";
            dragElement(divFileViewer);
        }
    }
}

function Quiz(main, dat) {
    dat = dat + "|1";
    QuizID = dat.split("|")[0] * 1;
    SectionNo = dat.split("|")[1] * 1;    

    optWindow_hdr.appendChild(dyn("div", "id=examLoading|style=position:absolute; top:5px; left:45%", dyn("img", "src=loading.gif")));

    var func = function (js) {
        examLoading.style.display = "none";

        jsCurrentQuiz = js;
        jsCurrentSection = js.filter(d => d.SectionNo == SectionNo);
        js = jsCurrentSection;

        var jsMaterial = jsCurrentSection.filter(d => d.Material != null && d.Material != "");
        var file_names = jsCurrentSection.filter(d => d.Files != null && d.Files != "");
        if (file_names.length > 0) {
            pptFileName = file_names[0]["Files"];
        }
        if (jsMaterial.length > 0) {
            quizShowMaterial(js[0]["Material"], js[0]["MaterialType"]);
            soSubmit.appendChild(
                dyn("label",
                    "class=liteblueButton|onclick=quizShowMaterial('" + js[0]["Material"] + "','" + js[0]["MaterialType"] + "')|" +
                    "Show Material"
                )
            );
        }

        var SectionName = js[0]["SectionName"];

        if (SectionName != "") {
            section("optMain", ["div|class=smhdr dim|Section: " + SectionName, "hr"]);
            js = js.filter(d => d.SectionName == SectionName);
        }

        for (var i = 0; i < js.length; i++) {
            var QuestionID = js[i]["QuestionID"];
            var Question = js[i]["Question"];
            var Answer1 = js[i]["Answer1"];
            var Answer2 = js[i]["Answer2"];
            var Answer3 = js[i]["Answer3"];
            var Answer4 = js[i]["Answer4"];
            section("optMain", [
                ((i > 0) ? "hr" : ""),
                "div|class=dim|" + Question,
                ((js[i]["Answer1"] != "") ? "div|class=padLeft10|id=ans1_" + i + "|" : ""),
                ((js[i]["Answer2"] != "") ? "div|class=padLeft10|id=ans2_" + i + "|" : ""),
                ((js[i]["Answer3"] != "") ? "div|class=padLeft10|id=ans3_" + i + "|" : ""),
                ((js[i]["Answer4"] != "") ? "div|class=padLeft10|id=ans4_" + i + "|" : "")
            ]);

            if (Answer1 != "") {
                section("ans1_" + i, [
                    "input|type=radio|onchange=QuizAnswers_Onchange()|name=tq_" + QuestionID + "|id=tqa1_" + QuestionID + "|value=1",
                    "label|class=padLeft10|for=tqa1_" + QuestionID + "|" + Answer1
                ]);
            }
            if (Answer2 != "") {
                section("ans2_" + i, [
                    "input|type=radio|onchange=QuizAnswers_Onchange()|name=tq_" + QuestionID + "|id=tqa2_" + QuestionID + "|value=2",
                    "label|class=padLeft10|for=tqa2_" + QuestionID + "|" + Answer2
                ]);
            }
            if (Answer3 != "") {
                section("ans3_" + i, [
                    "input|type=radio|onchange=QuizAnswers_Onchange()|name=tq_" + QuestionID + "|id=tqa3_" + QuestionID + "|value=3",
                    "label|class=padLeft10|for=tqa3_" + QuestionID + "|" + Answer3
                ]);
            }
            if (Answer4 != "") {
                section("ans4_" + i, [
                    "input|type=radio|onchange=QuizAnswers_Onchange()|name=tq_" + QuestionID + "|id=tqa4_" + QuestionID + "|value=4",
                    "label|class=padLeft10|for=tqa4_" + QuestionID + "|" + Answer4
                ]);
            }

        }
    }
    if (SectionNo > 1) {
        func(jsCurrentQuiz);
    } else {
        var data = newFormData("GetQuiz", { quizid: QuizID });
        getData(null, data, func, true);
    }
}

//*******************************  EDIT / DELETE / QUIZ AND MATERIAL
function EditQuiz(main, QuizID) {
    var data = newFormData("GetQuiz", { QuizID: QuizID });
    getData(null, data, function (js) {
        if (js.length > 0) {
            var QuizName = js[0]["QuizName"];
            var QuizType = js[0]["QuizType"];
            if (QuizType == "Standard") {
                showOpts('Edit Questions', QuizID, QuizName, true);
            }
            else {
                section("optMain", [
                    "label|class=padLeft10 alink|onclick=showOpts('Edit Material', " + QuizID + ", '" + QuizName + "', true)|Edit Material",
                    "p",
                    "label|class=padLeft10 alink|onclick=showOpts('Edit Questions'," + QuizID + ",'" + QuizName + "',true)|Edit Questions",
                ])
            }
        }
        else {
            xconfirm("Quiz does not have questions!");
            ReloadPage();
        }
    }, true);
}

function DeleteQuiz(QuizID, gobaby) {
    if (gobaby == null) {
        xconfirm("Are you sure you want to delete this quiz?", null, "DeleteQuiz(" + QuizID + ",true)");
    } else {
        var data = newFormData("DeleteQuiz", { quizid: QuizID });
        getData(null, data, function (vr) {
            xconfirm();
            loading.style.display = "none";
            ReloadPage();
        });
    }
}

function EditMaterialGO() {
    var Quizzes = document.getElementsByName("emQuizID");
    var Sections = document.getElementsByName("emSectionNo");
    var URLs = document.getElementsByName("emURL");
    var FileNames = document.getElementsByName("emFileName");

    var dat = [];
    var data = new FormData();
    var FileName = "";
    for (var i = 0; i < Quizzes.length; i++) {
        if (FileNames[i].files.length > 0) {
            FileName = FileNames[i].files[0].name.substring(0, FileNames[i].files[0].name.lastIndexOf('.'));
        }
        else {
            FileName = '';
        }
        data.append('fil', FileNames[i].files.length === 0 ? '' : FileNames[i].files[0]);
        dat.push({ QuizId: Quizzes[i].value, SectionNo: Sections[i].value, Url: URLs[i].value, FileName: FileName });
    }
    data.append('dat', JSON.stringify(dat));
    console.log(JSON.stringify(dat));
    getData("Quiz/UpdateMaterial", data, function (vr) {
        if (vr > 0) {
            xconfirm("Update Successful!");
        }
        else {
            xconfirm("No Records Updated!");
        }
        opts(false);
    });
   
}
function EditMaterial(main, QuizID) {
    section("soSubmit", ["label|class=liteblueButton|onclick=EditMaterialGO()|Submit"]);

    var data = newFormData("GetUpdateMaterial", { QuizID: QuizID, SectionNo: 0, URL: "" });
    getData(null, data, function (js) {
        sectionTable("optMain", "tblEditMaterial", "tr", null, null, "style=width:100%");
        section("tblEditMaterial", [
            "td|class=smhdr dim|Section Name",
            "td|class=smhdr dim|Material URL"
        ]);

        for (var i = 0; i < js.length; i++) {
            section("tblEditMaterial", [
                "tr",
                "td|" + js[i]["SectionName"],
                "td|id=em_" + i
            ]);
            section("em_" + i, [
                "input|id=emURL_" + i + "|name=emURL|style=width:450px|value=",
                "input|name=emQuizID|type=hidden|style=width:450px|value=" + js[i]["QuizID"],
                "input|name=emSectionNo|type=hidden|style=width:450px|value=" + js[i]["SectionNo"],
                "input|name=emFileName|type=file|id=file_UploadQuiz_"+i+"|style=display:none|onchange=file_UploadEditQuiz_Onchange('"+i+"')",
                "label|class=padLeft10|",
                "label|class=padLeft10 alink|onclick=quizShowMaterial(emURL_" + i + ".value, 'URL')|Test Link",
                "label|class=padLeft10|",
                "label|class=orangeButton|style=font-size:14px|onclick=file_UploadQuiz_" + i + ".click()|Upload File",
                "label|class=padLeft10|id=lbl_file_UploadQuiz_" + i,
                "label|id=lblTest_"+i+"|style=display:none;|class=padLeft10 alink|onclick=testFileLink('" + i + "')|Test Link",
            ]);
            document.getElementById("emURL_" + i).value = js[i]["URL"];
        }
    }, true);
}

function testFileLink(i) {
    var fil_ = document.getElementById('file_UploadQuiz_' + i);
    var fil = fil_.files;
    var data = new FormData();
    data.append('fil', fil[0]);
    getData("Quiz/TestFile", data, function (vr) {
        if (vr.length > 0) {
            testFileName = vr;
            FileViewer.src = "materials/test/" + vr;
            divFileViewer.style.display = "block";
            dragElement(divFileViewer);
        }
    });
}
function file_UploadEditQuiz_Onchange(i) {
    var lbl = document.getElementById('lbl_file_UploadQuiz_' + i);
    var fil_ = document.getElementById('file_UploadQuiz_' + i);
    var fil = fil_.files;
    var filename = fil[0].name;
    var err = false;
    var validFileExtensions = ["ppt", "pptx"];
    var count = 0;

    var period = filename.lastIndexOf('.');
    if (period == -1) {
        filename = "Error: File extension must be 'ppt' or 'pptx'";
        err = true;
    }
    else {
        var ext = filename.substring(period + 1);
        for (var j = 0; j < validFileExtensions.length; j++) {
            var sCurExtension = validFileExtensions[j];
            if (ext.toLowerCase() == sCurExtension.toLowerCase()) {
                count++;
            }
        }
    }
    if (count == 0) {
        filename = "Error: File extension must be 'ppt' or 'pptx'";
        err = true;
    }
    lbl.style.color = (err) ? "red" : "black";
    lbl.innerHTML = filename;
    if (err) {
        soSubmit.innerHTML = "";
    }
    else {
       document.getElementById('lblTest_' + i).style.display="inline";
    }
        
}
//************************   MAIN EDIT QUIZ ********************************
function SetSectionsBelow(ix) {
    var flds = document.getElementsByName("inputQuestions_SectionName");
    var val = flds[ix].value;
    for (var i = ix + 1; i < flds.length; i++) {
        flds[i].value = val;
    }
}

function EditQuestionsUpdate(QuizID) {
    examLoading.style.display = "";

    var js = jsEditQuiz;
    var jsSend = [];
    for (var i = 0; i < js.length; i++) {
        jsSend.push({
            QuizID: QuizID,
            SortNo: (i * 100),
            SectionNo: document.getElementById("inputQuestions_SectionNo_" + i).value,
            SectionName: document.getElementById("inputQuestions_SectionName_" + i).value,
            QuestionID: document.getElementById("inputQuestions_QuestionID_" + i).value,
            Question: document.getElementById("inputQuestions_Question_" + i).value,
            Answer1: document.getElementById("inputQuestions_Answer1_" + i).value,
            Answer2: document.getElementById("inputQuestions_Answer2_" + i).value,
            Answer3: document.getElementById("inputQuestions_Answer3_" + i).value,
            Answer4: document.getElementById("inputQuestions_Answer4_" + i).value,
            CorrectAnswer: document.getElementById("inputQuestions_CorrectAnswer_" + i).value,
            deleteAll: ((i == 0) ? 1 : 0)
        });
    }

    var data = newFormData("QuestionLineAddTmp", jsSend);
    getData("#adHocArray", data, function (js) {
        data = newFormData("UpdateQuiz_Part1", { QuizID: QuizID });
        getData(null, data, function (js) {
            xconfirm("This quiz has been updated");
            ReloadPage();
            //console.log(js);
        }, true);
    }, true);
}

function EditQuestionsRemoveLine(QuizID, sortNo, gobaby) {
    examLoading.style.display = "";

    if (!gobaby) {
        xconfirm("Are you sure you want to remove this line?", null, "EditQuestionsRemoveLine(" + QuizID + "," + sortNo + ",true)");
    } else {
        xconfirm();
        var data = newFormData("QuestionLineRemove", { quizid: QuizID, sortno: sortNo });
        getData(null, data, function (js) {
            jsEditQuiz = js;
            tblQuestions.innerHTML = "";
            EditQuestionsPopulate(js, QuizID);
        }, true);
    }
}
function EditQuestionsAddLine(sortNo, SectionNo, SectionName, QuizID) {
    examLoading.style.display = "";

    var js = jsEditQuiz;
    var jsSend = [];
    for (var i = 0; i < js.length; i++) {
        var tmpSortNo = i * 100;
        if (sortNo <= tmpSortNo) {
            tmpSortNo = (i + 1) * 100;
        }

        jsSend.push({
            QuizID: QuizID,
            SortNo: tmpSortNo,
            SectionNo: document.getElementById("inputQuestions_SectionNo_" + i).value,
            SectionName: document.getElementById("inputQuestions_SectionName_" + i).value,
            QuestionID: document.getElementById("inputQuestions_QuestionID_" + i).value,
            Question: document.getElementById("inputQuestions_Question_" + i).value,
            Answer1: document.getElementById("inputQuestions_Answer1_" + i).value,
            Answer2: document.getElementById("inputQuestions_Answer2_" + i).value,
            Answer3: document.getElementById("inputQuestions_Answer3_" + i).value,
            Answer4: document.getElementById("inputQuestions_Answer4_" + i).value,
            CorrectAnswer: document.getElementById("inputQuestions_CorrectAnswer_" + i).value,
            deleteAll: ((i == 0) ? 1 : 0)
        });
    }
    jsSend.push({
        QuizID: QuizID,
        SortNo: sortNo,
        SectionNo: SectionNo,
        SectionName: SectionName,
        QuestionID: 0,
        Question: '',
        Answer1: '',
        Answer2: '',
        Answer3: '',
        Answer4: '',
        CorrectAnswer: 1,
        deleteAll: 0
    });

    console.log("jsSend", jsSend);

    data = newFormData("QuestionLineAddTmp", jsSend);
    getData("#adHocArray", data, function (js) {
        jsEditQuiz = js;
        tblQuestions.innerHTML = "";
        EditQuestionsPopulate(js, QuizID);
    }, true);
}

function EditQuestionsAddTmpLine(js, QuizID) {
    examLoading.style.display = "";

    var jsSend = [];
    for (var i = 0; i < js.length; i++) {
        jsSend.push({
            QuizID: QuizID,
            SortNo: (i * 100),
            SectionNo: js[i]["SectionNo"],
            SectionName: js[i]["SectionName"],
            QuestionID: js[i]["QuestionID"],
            Question: js[i]["Question"],
            Answer1: js[i]["Answer1"],
            Answer2: js[i]["Answer2"],
            Answer3: js[i]["Answer3"],
            Answer4: js[i]["Answer4"],
            CorrectAnswer: js[i]["CorrectAnswer"],
            deleteAll: ((i == 0) ? 1 : 0)
        });
    }

    console.log("jsSend", jsSend);

    data = newFormData("QuestionLineAddTmp", jsSend);
    getData("#adHocArray", data, function (js) {
        console.log(js);
        jsEditQuiz = js;
        EditQuestionsPopulate(js, QuizID);
    }, true);
}

function EditQuestions(main, QuizID) {
    section("soSubmit", ["label|class=liteblueButton|onclick=EditQuestionsUpdate(" + QuizID + ")|Update"]);
    optWindow_hdr.appendChild(dyn("div","id=examLoading|style=position:absolute; top:5px; left:45%", dyn("img", "src=loading.gif")));
    
    main.appendChild(dyn("div", "id=EditQuestionsInner"));
    sectionTable("EditQuestionsInner", "tblQuestions", "tr", null, null, "style=width:100%");

    var question_data = newFormData("GetQuiz", { QuizID: QuizID });
    getData(null, question_data, function (js) {
        if (js.length > 0) {
            jsEditQuiz = js;
            EditQuestionsAddTmpLine(js, QuizID);
        }
    }, true);
}

function EditQuestionsPopulate(js, QuizID) {
    examLoading.style.display = "none";

    EditQuestionsElems = [];
    for (var i = 0; i < js.length; i++) {
        var sortNo = i * 100;

        var elems = [
            "tr",
            "td|colspan=2|id=tdQuestions_AddRemoveLine_" + i,
            "tr",
            "td|class=smhdr|Section Name:",
            "td|id=tdQuestions_Section_" + i,
            "td|class=alink|onclick=SetSectionsBelow(" + i + ")|Set all Sections Below to this value",
            "tr",
            "td|class=smhdr|Question:",
            "td|id=tdQuestions_Question_" + i,
            "tr",
            "td|class=smhdr|Answer 1:",
            "td|id=tdQuestions_Answer1_" + i,
            "tr",
            "td|class=smhdr|Answer 2:",
            "td|id=tdQuestions_Answer2_" + i,
            "tr",
            "td|class=smhdr|Answer 3:",
            "td|id=tdQuestions_Answer3_" + i,
            "tr",
            "td|class=smhdr|Answer 4:",
            "td|id=tdQuestions_Answer4_" + i,
            "tr",
            "td|class=smhdr|Correct Answer:",
            "td|id=tdQuestions_CorrectAnswer_" + i
        ]

        section("tblQuestions", elems);

        section("tdQuestions_AddRemoveLine_" + i, [
            "label|class=greenButton|onclick=EditQuestionsAddLine(" + sortNo + "," + js[i]["SectionNo"] + ",'" + js[i]["SectionName"] + "','" + QuizID + "', true)|Add Line Above",
            "label|class=padLeft10",
            "label|class=greenButton|onclick=EditQuestionsAddLine(" + (sortNo + 100) + "," + js[i]["SectionNo"] + ",'" + js[i]["SectionName"] + "','" + QuizID + "', true)|Add Line Below",
            "label|class=padLeft10",
            "label|class=redButton|onclick=EditQuestionsRemoveLine(" + QuizID + "," + sortNo + "," + false + ")|Remove Line"
        ]);
        section("tdQuestions_Section_" + i, [
            "label|class=padLeft10",
            "input|name=inputQuestions_SectionName|id=inputQuestions_SectionName_" + i + "|style=width:600px|value=" + js[i]["SectionName"],
            "input|id=inputQuestions_SectionNo_" + i + "|type=hidden|value=" + js[i]["SectionNo"],
            "input|name=inputQuestions_SortNo|id=inputQuestions_SortNo_" + i + "|type=hidden|value=" + sortNo
        ]);

        section("tdQuestions_Question_" + i, [
            "label|class=padLeft10",
            "input|id=inputQuestions_Question_" + i + "|style=width:600px|value=" + js[i]["Question"],
            "input|id=inputQuestions_QuestionID_" + i + "|type=hidden|value=" + js[i]["QuestionID"]
        ]);

        section("tdQuestions_Answer1_" + i, [
            "label|class=padLeft10",
            "input|id=inputQuestions_Answer1_" + i + "|style=width:600px|value=" + js[i]["Answer1"]
        ]);

        section("tdQuestions_Answer2_" + i, [
            "label|class=padLeft10",
            "input|id=inputQuestions_Answer2_" + i + "|style=width:600px|value=" + js[i]["Answer2"]
        ]);

        section("tdQuestions_Answer3_" + i, [
            "label|class=padLeft10",
            "input|id=inputQuestions_Answer3_" + i + "|style=width:600px|value=" + js[i]["Answer3"]
        ]);

        section("tdQuestions_Answer4_" + i, [
            "label|class=padLeft10",
            "input|id=inputQuestions_Answer4_" + i + "|style=width:600px|value=" + js[i]["Answer4"]
        ]);

        section("tdQuestions_CorrectAnswer_" + i, [
            "label|class=padLeft10",
            "select|id=inputQuestions_CorrectAnswer_" + i
        ]);

        for (ii = 1; ii < 5; ii++) {
            section("inputQuestions_CorrectAnswer_" + i, ["option|value=" + ii + "|" + ii]);
        }
        document.getElementById("inputQuestions_CorrectAnswer_" + i).selectedIndex = js[i]["CorrectAnswer"] - 1

        sectionTable("", "tblQuestions", "tr");
        sectionTable("", "tblQuestions", "td", "<hr>");
    }
}