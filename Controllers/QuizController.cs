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
            int UID = xUID();

            GemBox.Spreadsheet.SpreadsheetInfo.SetLicense("EDWH-6KJO-D7SA-92EZ");
            string rootFolder = Directory.GetCurrentDirectory();
            string subPath = rootFolder + @"\wwwroot\export\" + UID + @"\";
            string materialPath = rootFolder + @"\wwwroot\materials\";
            GemBox.Presentation.ComponentInfo.SetLicense("FREE-LIMITED-KEY");

            string FN = fil.FileName;
            //load power point files
            if (!System.IO.Directory.Exists(materialPath))
            {
                System.IO.Directory.CreateDirectory(materialPath);
            }

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
           
            return results;
        }
    }
}
