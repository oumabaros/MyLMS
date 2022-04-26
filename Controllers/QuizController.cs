using CMS_LearningCenterMVC.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using GemBox.Spreadsheet;
using GemBox.Presentation;
using ClosedXML.Excel;

namespace CMS_LearningCenterMVC.Controllers
{
    public class QuizController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public QuizController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public int xUID()
        {
            //set INT xUID
            string UID = HttpContext.Session.GetString("uid");
            int xUID = 0;
            if (isNumeric(UID)) { xUID = Int32.Parse(UID); }
            return xUID;
        }
        public bool isNumeric(string val)
        {
            int xVal;
            bool result = int.TryParse(val, out xVal);
            return result;
        }
        [Route("Quiz/ExportByUser")]
        public void ExportByUser()
        {
            int UID = xUID();
            var js = new JObject();
            var strjs = JsonConvert.SerializeObject(js);
            DataTable dt_exam = DB.GetDB("exec LC_GetQuizzes @uid", UID, strjs);
            DataTable dt_users = DB.GetDB("exec LC_GetUsers @uid", UID, strjs);
            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Quiz Scores By User");
                var currentRow = 1;
                foreach (DataRow dr_users in dt_users.Rows)
                {
                    currentRow++;
                    var UserName = dr_users["UserName"].ToString();
                    int u_id = (Int32)dr_users["UID"];

                    worksheet.Cell(currentRow, 1).Value = UserName;
                    worksheet.Columns("A").AdjustToContents();
                    worksheet.Cell(currentRow, 1).Style.Fill.BackgroundColor = XLColor.Orange;
                    worksheet.Cell(currentRow, 1).Style.Font.FontColor = XLColor.White;
                    worksheet.Cell(currentRow, 1).Style.Font.SetBold(true);
                    currentRow++;

                    foreach (DataRow dr_exam in dt_exam.Rows)
                    {
                        currentRow++;
                        var QuizName = dr_exam["QuizName"].ToString();
                        int QuizID = (Int32)dr_exam["QuizID"];
                        worksheet.Cell(currentRow, 1).Value = QuizName;
                        worksheet.Columns("A").AdjustToContents();
                        worksheet.Cell(currentRow, 1).Style.Fill.BackgroundColor = XLColor.SteelBlue;
                        worksheet.Cell(currentRow, 1).Style.Font.FontColor = XLColor.White;
                        worksheet.Cell(currentRow, 1).Style.Font.SetBold(true);

                        var js_exam = new JObject();
                        js_exam.Add("quizid", new JValue(QuizID));
                        js_exam.Add("xUID", new JValue(u_id));
                        var strjs_exam = JsonConvert.SerializeObject(js_exam);

                        DataTable dt = DB.GetDB("exec LC_GetTries @uid,@xUID,@QuizID", u_id, strjs_exam);
                        var tmpTryID = "";

                        foreach (DataRow dr in dt.Rows)
                        {
                            QuizName = dr["QuizName"].ToString();
                            var SectionName = dr["SectionName"].ToString();
                            var TryID = dr["TryID"].ToString();
                            var TryDate = dr["TryDate"].ToString();
                            var SectionStatus = dr["SectionStatus"].ToString();
                            var QuizStatus = dr["QuizStatus"].ToString();

                            if (tmpTryID != TryID)
                            {
                                currentRow++;
                                worksheet.Cell(currentRow, 1).Value = TryDate + "(" + QuizStatus + ")";
                                worksheet.Columns("A").AdjustToContents();
                                worksheet.Cell(currentRow, 1).Style.Fill.BackgroundColor = XLColor.SteelBlue;
                                worksheet.Cell(currentRow, 1).Style.Font.FontColor = XLColor.White;
                                worksheet.Cell(currentRow, 1).Style.Font.SetBold(true);

                                currentRow++;
                                worksheet.Cell(currentRow, 1).Value = "Section";
                                worksheet.Cell(currentRow, 1).Style.Fill.BackgroundColor = XLColor.SteelBlue;
                                worksheet.Cell(currentRow, 1).Style.Font.FontColor = XLColor.White;
                                worksheet.Cell(currentRow, 1).Style.Font.SetBold(true);
                                worksheet.Cell(currentRow, 2).Value = "Date Taken";
                                worksheet.Columns("B").AdjustToContents();
                                worksheet.Cell(currentRow, 2).Style.Fill.BackgroundColor = XLColor.SteelBlue;
                                worksheet.Cell(currentRow, 2).Style.Font.FontColor = XLColor.White;
                                worksheet.Cell(currentRow, 2).Style.Font.SetBold(true);
                                worksheet.Cell(currentRow, 3).Value = "Status";
                                worksheet.Columns("C").AdjustToContents();
                                worksheet.Cell(currentRow, 3).Style.Fill.BackgroundColor = XLColor.SteelBlue;
                                worksheet.Cell(currentRow, 3).Style.Font.FontColor = XLColor.White;
                                worksheet.Cell(currentRow, 3).Style.Font.SetBold(true);
                            }

                            currentRow++;
                            worksheet.Cell(currentRow, 1).Value = SectionName;
                            worksheet.Cell(currentRow, 2).Value = TryDate;
                            worksheet.Cell(currentRow, 3).Value = SectionStatus;
                            tmpTryID = TryID;
                        }
                        currentRow++;
                    }
                }

                using var stream = new MemoryStream();
                workbook.SaveAs(stream);
                var content = stream.ToArray();
                Response.Clear();
                Response.Headers.Add("content-disposition", "attachment;filename=Quiz Scores By User.xls");
                Response.ContentType = "application/xls";
                Response.Body.WriteAsync(content);
                Response.Body.Flush();
            }
        }

        [Route("Quiz/ExportByExam")]
        public void ExportByExam()
        {
            int UID = xUID();
            var js = new JObject();
            var strjs = JsonConvert.SerializeObject(js);
            DataTable dt_exam = DB.GetDB("exec LC_GetQuizzes @uid", UID, strjs);
            DataTable dt_users = DB.GetDB("exec LC_GetUsers @uid", UID, strjs);

            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Quiz Scores By Exam");
                var currentRow = 1;
                foreach (DataRow dr_exam in dt_exam.Rows)
                {
                    currentRow++;
                    var QuizName = dr_exam["QuizName"].ToString();
                    int QuizID = (Int32)dr_exam["QuizID"];
                    worksheet.Cell(currentRow, 1).Value = QuizName;
                    worksheet.Columns("A").AdjustToContents();
                    worksheet.Cell(currentRow, 1).Style.Fill.BackgroundColor = XLColor.Orange;
                    worksheet.Cell(currentRow, 1).Style.Font.FontColor = XLColor.White;
                    worksheet.Cell(currentRow, 1).Style.Font.SetBold(true);
                    currentRow++;

                    foreach (DataRow dr_users in dt_users.Rows)
                    {
                        var UserName = dr_users["UserName"].ToString();
                        int u_id =(Int32) dr_users["UID"];

                        worksheet.Cell(currentRow, 1).Value = UserName;
                        worksheet.Columns("A").AdjustToContents();
                        worksheet.Cell(currentRow, 1).Style.Fill.BackgroundColor = XLColor.SteelBlue;
                        worksheet.Cell(currentRow, 1).Style.Font.FontColor = XLColor.White;
                        worksheet.Cell(currentRow, 1).Style.Font.SetBold(true);
                        
                        var js_exam = new JObject();
                        js_exam.Add("quizid", new JValue(QuizID));
                        js_exam.Add("xUID", new JValue(u_id));
                        var strjs_exam = JsonConvert.SerializeObject(js_exam);
                        
                        DataTable dt = DB.GetDB("exec LC_GetTries @uid,@xUID,@QuizID", u_id, strjs_exam);
                        var tmpTryID = "";

                        foreach (DataRow dr in dt.Rows)
                        {
                            QuizName = dr["QuizName"].ToString();
                            var SectionName = dr["SectionName"].ToString();
                            var TryID = dr["TryID"].ToString();
                            var TryDate = dr["TryDate"].ToString();
                            var SectionStatus = dr["SectionStatus"].ToString();
                            var QuizStatus = dr["QuizStatus"].ToString();

                            if (tmpTryID != TryID)
                            {
                                currentRow++;
                                worksheet.Cell(currentRow, 1).Value = TryDate + "(" + QuizStatus + ")";
                                worksheet.Columns("A").AdjustToContents();
                                worksheet.Cell(currentRow, 1).Style.Fill.BackgroundColor = XLColor.SteelBlue;
                                worksheet.Cell(currentRow, 1).Style.Font.FontColor = XLColor.White;
                                worksheet.Cell(currentRow, 1).Style.Font.SetBold(true);

                                currentRow++;
                                worksheet.Cell(currentRow, 1).Value = "Section";
                                worksheet.Cell(currentRow, 1).Style.Fill.BackgroundColor = XLColor.SteelBlue;
                                worksheet.Cell(currentRow, 1).Style.Font.FontColor = XLColor.White;
                                worksheet.Cell(currentRow, 1).Style.Font.SetBold(true);
                                worksheet.Cell(currentRow, 2).Value = "Date Taken";
                                worksheet.Columns("B").AdjustToContents();
                                worksheet.Cell(currentRow, 2).Style.Fill.BackgroundColor = XLColor.SteelBlue;
                                worksheet.Cell(currentRow, 2).Style.Font.FontColor = XLColor.White;
                                worksheet.Cell(currentRow, 2).Style.Font.SetBold(true);
                                worksheet.Cell(currentRow, 3).Value = "Status";
                                worksheet.Columns("C").AdjustToContents();
                                worksheet.Cell(currentRow, 3).Style.Fill.BackgroundColor = XLColor.SteelBlue;
                                worksheet.Cell(currentRow, 3).Style.Font.FontColor = XLColor.White;
                                worksheet.Cell(currentRow, 3).Style.Font.SetBold(true);
                            }

                            currentRow++;
                            worksheet.Cell(currentRow, 1).Value = SectionName;
                            worksheet.Cell(currentRow, 2).Value = TryDate;
                            worksheet.Cell(currentRow, 3).Value = SectionStatus;
                            tmpTryID = TryID;
                        }
                        currentRow++;
                    }
                }
                using var stream = new MemoryStream();
                workbook.SaveAs(stream);
                var content = stream.ToArray();
                Response.Clear();
                Response.Headers.Add("content-disposition", "attachment;filename=Quiz Scores By Exam.xls");
                Response.ContentType = "application/xls";
                Response.Body.WriteAsync(content);
                Response.Body.Flush();
            }
        }

        [Route("Quiz/ExportMyScore")]
        public void ExportMyScore(int QuizID)
        {
            int UID = xUID();
            var js = new JObject();
            js.Add("quizid", new JValue(QuizID));
            js.Add("xUID", new JValue(UID));
            var strjs = JsonConvert.SerializeObject(js);
            var QuizName = "";

            DataTable dt = DB.GetDB("exec LC_GetTries @uid,@xUID,@QuizID", UID, strjs);
            using (var workbook = new XLWorkbook())
            {
                var tmpTryID = "";
                var worksheet = workbook.Worksheets.Add("Quiz Scores");
                var currentRow = 1;
                
                foreach (DataRow dr in dt.Rows)
                {
                    QuizName = dr["QuizName"].ToString();
                    var SectionName = dr["SectionName"].ToString();
                    var TryID = dr["TryID"].ToString();
                    var TryDate = dr["TryDate"].ToString();
                    var SectionStatus = dr["SectionStatus"].ToString();
                    var QuizStatus = dr["QuizStatus"].ToString();
                                        
                    if (tmpTryID != TryID)
                    {
                        currentRow++;
                        currentRow++;
                        worksheet.Cell(currentRow, 1).Value = TryDate + "(" + QuizStatus + ")";
                        worksheet.Columns("A").AdjustToContents();
                        worksheet.Cell(currentRow, 1).Style.Fill.BackgroundColor = XLColor.SteelBlue;
                        worksheet.Cell(currentRow, 1).Style.Font.FontColor = XLColor.White;
                        worksheet.Cell(currentRow, 1).Style.Font.SetBold(true);

                        currentRow++;
                        worksheet.Cell(currentRow, 1).Value = "Section";
                        worksheet.Cell(currentRow, 1).Style.Fill.BackgroundColor = XLColor.SteelBlue;
                        worksheet.Cell(currentRow, 1).Style.Font.FontColor = XLColor.White;
                        worksheet.Cell(currentRow, 1).Style.Font.SetBold(true);
                        worksheet.Cell(currentRow, 2).Value = "Date Taken";
                        worksheet.Columns("B").AdjustToContents();
                        worksheet.Cell(currentRow, 2).Style.Fill.BackgroundColor = XLColor.SteelBlue;
                        worksheet.Cell(currentRow, 2).Style.Font.FontColor = XLColor.White;
                        worksheet.Cell(currentRow, 2).Style.Font.SetBold(true);
                        worksheet.Cell(currentRow, 3).Value = "Status";
                        worksheet.Columns("C").AdjustToContents();
                        worksheet.Cell(currentRow, 3).Style.Fill.BackgroundColor = XLColor.SteelBlue;
                        worksheet.Cell(currentRow, 3).Style.Font.FontColor = XLColor.White;
                        worksheet.Cell(currentRow, 3).Style.Font.SetBold(true);
                    }

                    currentRow++;
                    worksheet.Cell(currentRow, 1).Value = SectionName;
                    worksheet.Cell(currentRow, 2).Value = TryDate;
                    worksheet.Cell(currentRow, 3).Value = SectionStatus;
                    tmpTryID = TryID;
                }
                worksheet.Cell(1, 1).Value = QuizName;
                worksheet.Columns("A").AdjustToContents();
                worksheet.Cell(1, 1).Style.Fill.BackgroundColor = XLColor.SteelBlue;
                worksheet.Cell(1, 1).Style.Font.FontColor = XLColor.White;
                worksheet.Cell(1, 1).Style.Font.SetBold(true);

                using var stream = new MemoryStream();
                workbook.SaveAs(stream);
                var content = stream.ToArray();
                Response.Clear();
                Response.Headers.Add("content-disposition", "attachment;filename="+QuizName+".xls");
                Response.ContentType = "application/xls";
                Response.Body.WriteAsync(content);
                Response.Body.Flush();
            }
            
        }
        [Route("Quiz/DeleteTestFile")]
        public void DeleteTestFile(string fileName)
        {
            string rootFolder = Directory.GetCurrentDirectory();
            string testPath = rootFolder + @"\wwwroot\materials\test\";
            if (fileName != null)
            {
                if (System.IO.File.Exists(testPath + fileName))
                {
                    System.IO.File.Delete(testPath + fileName);
                }
            }
        }
        [Route("Quiz/TestFile")]
        public async Task<string> TestFile(IFormFile fil)
        {
            string rootFolder = Directory.GetCurrentDirectory();
            string testPath = rootFolder + @"\wwwroot\materials\test\";
            string filename = "";
            GemBox.Presentation.ComponentInfo.SetLicense("FREE-LIMITED-KEY");
            if (!System.IO.Directory.Exists(testPath))
            {
                System.IO.Directory.CreateDirectory(testPath);
            }

            if (fil.Length > 0)
            {
                var extension = Path.GetExtension(fil.FileName);
                if (System.IO.File.Exists(testPath + fil.FileName))
                {
                    System.IO.File.Delete(testPath + fil.FileName);
                }

                using (var stream = new FileStream(testPath + fil.FileName, FileMode.Create))
                {
                    await fil.CopyToAsync(stream);
                }
                var presentation = PresentationDocument.Load(Path.Combine(testPath, fil.FileName));
                presentation.Save(testPath + "\\" + fil.FileName.Split('.').First() + ".pdf");
                System.IO.File.Delete(testPath + fil.FileName.Split('.').First() + extension);
                filename = fil.FileName.Split('.').First() + ".pdf";
            }
            return filename;
        }
        [Route("Quiz/UploadQuiz")]
        public async void UploadQuiz(IFormFile fil,List<IFormFile> pptFiles)
        {
            
            GemBox.Presentation.ComponentInfo.SetLicense("FREE-LIMITED-KEY");
            GemBox.Spreadsheet.SpreadsheetInfo.SetLicense("EDWH-6KJO-D7SA-92EZ");
            int UID = xUID();
            string rootFolder = Directory.GetCurrentDirectory();
            string subPath = rootFolder + @"\wwwroot\export\" + UID + @"\";
            string materialPath = rootFolder + @"\wwwroot\materials\";
            
            string FN = fil.FileName;
            //load power point files
            if (!System.IO.Directory.Exists(materialPath))
            {
                System.IO.Directory.CreateDirectory(materialPath);
            }

            if (pptFiles.Count > 0)
            {

                foreach (IFormFile iff in pptFiles)
                {
                    var extension = Path.GetExtension(iff.FileName);
                    if (System.IO.File.Exists(materialPath + iff.FileName))
                    {
                        System.IO.File.Delete(materialPath + iff.FileName);
                    }

                    using (var stream = new FileStream(materialPath + iff.FileName, FileMode.Create))
                    {
                        iff.CopyTo(stream);
                    }
                    var presentation = PresentationDocument.Load(Path.Combine(materialPath, iff.FileName));
                    presentation.Save(materialPath + "\\" + iff.FileName.Split('.').First() + ".pdf");
                    System.IO.File.Delete(materialPath + iff.FileName.Split('.').First() + extension);
                }
            }

            //load main excel file
            if (!System.IO.Directory.Exists(subPath))
            {
                System.IO.Directory.CreateDirectory(subPath);
            }
            if (System.IO.File.Exists(subPath + FN))
            {
                System.IO.File.Delete(subPath + FN);
            }

            using (var stream = System.IO.File.Create(subPath + FN))
            {
                // The formFile is the method parameter which type is IFormFile
                // Saves the files to the local file system using a file name generated by the app.
                await fil.CopyToAsync(stream);
            }


            var workbook = ExcelFile.Load(subPath + FN);
            //delete file once loaded in workbook
            System.IO.File.Delete(subPath + FN);

            int NUMBER_OF_COLUMNS = 10;

            // Select the first worksheet from the file.
            var worksheet = workbook.Worksheets[0];

            // Create DataTable from an Excel worksheet.
            var dataTable = worksheet.CreateDataTable(new CreateDataTableOptions()
            {
                ColumnHeaders = true,
                StartRow = 0,
                NumberOfColumns = NUMBER_OF_COLUMNS,
                NumberOfRows = worksheet.Rows.Count,
                Resolution = ColumnTypeResolution.AutoPreferStringCurrentCulture
            });

            // Write DataTable columns.
            foreach (DataColumn column in dataTable.Columns)
                Console.Write(column.ColumnName.PadRight(20));
            Console.WriteLine();
            foreach (DataColumn column in dataTable.Columns)
                Console.Write($"[{column.DataType}]".PadRight(20));
            Console.WriteLine();
            foreach (DataColumn column in dataTable.Columns)
                Console.Write(new string('-', column.ColumnName.Length).PadRight(20));
            Console.WriteLine();

            // Write DataTable rows.
            foreach (DataRow row in dataTable.Rows)
            {
                foreach (object item in row.ItemArray)
                {
                    string value = item.ToString();
                    value = value.Length > 20 ? value.Remove(19) + "…" : value;
                    Console.Write(value.PadRight(20));
                }
                Console.WriteLine();
            }

            //LOOP THROUGH DATATABLE AND INSERT TO DATABASE
            int QuizID = 0;
            var qm = new List<KeyValuePair<string, int>>();

            for (var i = 0; i < dataTable.Rows.Count; i++)
            {
                
                if (!qm.Any(a =>a.Key == dataTable.Rows[i]["Quiz Name"].ToString()))
                {
                    QuizID = 0;
                }
                else
                {
                   QuizID= qm.Where(n => n.Key == dataTable.Rows[i]["Quiz Name"].ToString())
                          .OrderByDescending(i=>i.Value).Select(q => q.Value).FirstOrDefault();
                }
                                
                var arr = ("quizname,question,answer1,answer2,answer3,answer4,correct,section,material,filename").Split(",");
                var js = new JObject();
                js.Add("ix", new JValue(i));
                for (var x = 0; x < NUMBER_OF_COLUMNS; x++)
                {
                    js.Add(arr[x], new JValue(dataTable.Rows[i][x].ToString()));
                }
                js.Add("quizid", new JValue(QuizID));
                
                var strjs = JsonConvert.SerializeObject(js);
                
                DataTable dat = DB.GetDB("exec LC_UploadQuiz @uid, @ix, @quizname, @question, " +
                    "@answer1, @answer2, @answer3, @answer4," +
                    "@correct, @section, @material,@filename, @quizid", UID, strjs);

                QuizID = (Int32)dat.Rows[0]["QuizID"];
                qm.Add(new KeyValuePair<string, int>(dataTable.Rows[i]["Quiz Name"].ToString(), QuizID));
            }
            qm.Clear();
        }

        [Route("Quiz/UpdateMaterial")]
        public async Task<int> UpdateMaterail(List<IFormFile> fil, string dat)
        {
            string rootFolder = Directory.GetCurrentDirectory();
            string materialPath = rootFolder + @"\wwwroot\materials\";
            int UID = xUID();
            int results = 0;
            var table = JsonConvert.DeserializeObject<DataTable>(dat);
            GemBox.Presentation.ComponentInfo.SetLicense("FREE-LIMITED-KEY");
            
            if (!System.IO.Directory.Exists(materialPath))
            {
                System.IO.Directory.CreateDirectory(materialPath);
            }
            if (fil.Count > 0)
            {
                foreach(IFormFile iff in fil)
                {
                    if (iff != null)
                    {
                        var extension = Path.GetExtension(iff.FileName);
                        using (var stream = new FileStream(materialPath + iff.FileName, FileMode.Create))
                        {
                            await iff.CopyToAsync(stream);
                        }
                        var presentation = PresentationDocument.Load(Path.Combine(materialPath, iff.FileName));
                        presentation.Save(materialPath + "\\" + iff.FileName.Split('.').First() + ".pdf");
                        System.IO.File.Delete(materialPath + iff.FileName.Split('.').First() + extension);
                    }
                }
                
            }

            if (dat!=null){
                for (var i = 0; i < table.Rows.Count; i++)
                {
                    var arr = ("QuizID,SectionNo,URL,FileName").Split(",");
                    var js = new JObject();
                    for (var x = 0; x < table.Columns.Count; x++)
                    {
                        js.Add(arr[x], new JValue(table.Rows[i][x].ToString()));
                    }

                    var strjs = JsonConvert.SerializeObject(js);

                    DataTable dt = DB.GetDB("exec LC_GetUpdateMaterial @uid,@QuizID, @SectionNo,@URL, @FileName", UID, strjs);
                    results = (Int32)dt.Rows[0]["AffectedRecords"];

                }
            }
           
            return results;
        }
    }
}
