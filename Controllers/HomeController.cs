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

namespace CMS_LearningCenterMVC.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public JObject SET_TESTING(bool onOff, string passport)
        {
            var jo = new JObject { ["passport"] = passport, ["db"] = "CMSSuite" };
            if (onOff)
            {
                DataTable dat = DB.GetDB("exec a_Suite_LC_OpenApplication @uid", 11, "{}", "test");
                jo["passport"] = dat.Rows[0]["passport"].ToString();
                jo["db"] = "test";
            }
            return jo;
        }
        //ROUTE LOGIN
        public IActionResult Index(string passport = "1234")
        {
            bool doLogin = false;
            DataTable dat;

            //set testing to TRUE when testing directly with CMS DB ... else FALSE for production
            //BARASA - don't use this section
            JObject CMS_Settings = SET_TESTING(false, passport);
            string CMSDB = CMS_Settings["db"].ToString();
            passport = CMS_Settings["passport"].ToString();


            ViewBag.Error = "";

            if (passport != "")
            {
                dat = DB.GetCMS_();
                //dat = DB.GetDB("exec a_Suite_LC_GetUser @passport", 0, "{\"passport\":\"" + passport + "\"}", CMSDB);
                try
                {
                    if (dat.Rows[0]["err"].ToString() != "")
                    {
                        ViewBag.Error = dat.Rows[0]["err"].ToString();
                        doLogin = false;
                    }
                }
                catch (Exception ex)
                {

                }
                if (dat.Rows.Count > 0)
                {

                    int uid = Int32.Parse(dat.Rows[0]["uid"].ToString());
                    string cid = dat.Rows[0]["CMS_CID"].ToString();

                    setSes("uid", uid.ToString());
                    setSes("cid", cid);
                    setSes("UserName", dat.Rows[0]["Fname"].ToString() + " " + dat.Rows[0]["Lname"].ToString() + "@" + dat.Rows[0]["Company_Name"].ToString());
                    setSes("UserRole", dat.Rows[0]["userrole"].ToString());
                    setSes("csrf", dat.Rows[0]["SecureCode"].ToString());
                    setSes("LoggedIn", "yes");
                    doLogin = true;

                    var js = new JObject
                    {
                        ["cid"] = cid,
                        ["UserName"] = dat.Rows[0]["Fname"].ToString() + " " + dat.Rows[0]["Lname"].ToString() + "@" + dat.Rows[0]["Company_Name"].ToString(),
                        ["UserRole"] = dat.Rows[0]["userrole"].ToString()
                    };
                    var strjs = JsonConvert.SerializeObject(js);
                    dat = DB.GetDB("exec LC_LogUser @uid, @cid, @username, @userrole", uid, strjs);
                    var dc = dat.Rows.Count;
                }
            }

            if (doLogin)
            {
                return Redirect("Dashboard");
            }
            else
            {
                return View();
            }
        }

        [Route("Heartbeat")]
        public string Heartbeat()
        {
            var UID = xUID();

            if (UID == 0)
            {
                //session has died
                HttpContext.Session.Clear();
                return "Logout";
            }
            else
            {
                DataTable dat = DB.GetDB("exec LC_GetHeartbeat @uid", UID, "{}");
                if (dat.Rows.Count > 0)
                {
                    RenewHeartbeat(dat);
                    return "Heartbeat is strong";
                }
                else
                {
                    return "Heartbeat is weak";
                }
            }
        }

        public void RenewHeartbeat(DataTable dat)
        {
            if (ses("LoggedIn") != "no")
            {
                string csrf = ses("csrf");
                setSes("uid", dat.Rows[0]["uid"].ToString());
                setSes("cid", dat.Rows[0]["cid"].ToString());
                setSes("UserName", dat.Rows[0]["UserName"].ToString());
                setSes("UserRole", dat.Rows[0]["UserRole"].ToString());
                setSes("csrf", csrf);
                setSes("LoggedIn", "yes");
            }
        }

        [Route("Logout")]
        public IActionResult Logout()
        {
            setSes("uid", "0");
            setSes("LoggedIn", "no");
            HttpContext.Session.Clear();
            var uid = xUID();
            return View();
        }

        [Route("Dashboard")]
        public IActionResult Dashboard()
        {
            int UID = xUID();
            if (xUID() == 0)
            {
                return Redirect("Logout");
            }
            else
            {
                ViewBag.CSRF = ses("csrf");
                ViewBag.UserName = ses("UserName");
                ViewBag.UserRole = ses("UserRole");
                return View();
            }
        }

        //*********************************************************************  UTILITIES
        public string setSes(string fld, string val)
        {
            if (fld != null)
            {
                HttpContext.Session.SetString(fld, val);
                return val;
            }
            else
            {
                return "error";
            }
        }
        public string ses(string fld)
        {
            string rtn = HttpContext.Session.GetString(fld);
            return rtn;
        }
        public bool isSecure(string csrf)
        {
            bool rtn = true;
            if (csrf != ses("csrf")) { rtn = false; }
            return rtn;
        }
        public bool isNumeric(string val)
        {
            int xVal;
            bool result = int.TryParse(val, out xVal);
            return result;
        }
        public int xUID()
        {
            //set INT xUID
            string UID = ses("uid");
            int xUID = 0;
            if (isNumeric(UID)) { xUID = Int32.Parse(UID); }
            return xUID;
        }

        //*********************************************************************  AD HOC METHODS

        [Route("main/adHocMulti")]
        public string adHocMulti(string action, string strjson, string csrf)
        {
            string rtn = "[";
            var js = JArray.Parse(strjson);
            string[] arrAction = action.Split(",");

            for (var i = 0; i < js.Count; i++)
            {
                string str = JsonConvert.SerializeObject(js[i]);
                rtn = rtn + ((i > 0) ? "," : "");
                rtn = rtn + adHoc(arrAction[i], str, csrf);
            }
            rtn = rtn + "]";

            return rtn;
        }

        [Route("main/adHocArray")]
        public string adHocArray(string action, string strjson, string csrf)
        {
            if (!isSecure(csrf))
            {
                return "Logout";
            }
            else
            {
                var rtn = "[]";
                var json = JArray.Parse(strjson);
                for (var i = 0; i < json.Count; i++)
                {
                    strjson = JsonConvert.SerializeObject(json[i]);
                    rtn = adHoc(action, strjson, csrf);
                }
                return rtn;
            }
        }

        [Route("main/adHoc")]
        public string adHoc(string action, string strjson, string csrf)
        {
            //csrf = "1234";
            if (!isSecure(csrf))
            {
                return "Logout";
            }
            else
            {
                var json = JObject.Parse(strjson);
                string strParams = " @uid";

                int ix = 0;
                foreach (var key in json)
                {
                    strParams = strParams + ", @" + key.Key;

                    //This allows the client to specify another variable to be set as own UID
                    //Specifically used in sp a_Suite_GetTries
                    //a_Suite_GetTries can now be used as an admin method for getting quiz trys by other users
                    if (key.Value.ToString() == "GETUID")
                    {
                        json[key.Key] = xUID();
                    }
                }
                strjson = JsonConvert.SerializeObject(json);

                if (xUID() == 0)
                {
                    return "[]";
                }
                else
                {
                    string sql = "exec LC_" + action + strParams;
                    DataTable dat = DB.GetDB(sql, xUID(), strjson);
                    string rtn = JsonConvert.SerializeObject(dat);

                    return rtn;
                }
            }
        }

        [Route("main/adHocAttach")]
        public string adHocAttach(string action, string strjson, string csrf)
        {
            //csrf = "1234";
            if (!isSecure(csrf))
            {
                return "Logout";
            }
            else
            {
                var json = JObject.Parse(strjson);
                string rtn = "[]";

                if (Request.Form.Files.Count > 0)
                {
                    var files = Request.Form.Files;
                    for (var i = 0; i < files.Count; i++)   //loop through files
                    {
                        var file = files[i];
                        string filename = file.FileName;
                        long filesize = file.Length;
                        byte[] filedata;

                        //GET STREAM
                        using (Stream fs = file.OpenReadStream())
                        {
                            using (BinaryReader br = new BinaryReader(fs))
                            {
                                filedata = br.ReadBytes((Int32)fs.Length);
                            }
                        }

                        if (filedata != null)       //when filedata exists
                        {
                            //INSERT THE FILE
                            DataTable xdat = new DataTable();
                            string strParams = "";

                            int ix = 0;
                            foreach (var key in json)
                            {
                                strParams = strParams + ", @" + key.Key;    //get parameters
                            }

                            var da = new SqlDataAdapter("exec LC_" + action + " @UID, @filename, @filedata" + strParams, DB.connstr);
                            da.SelectCommand.CommandTimeout = 180;

                            da.SelectCommand.Parameters.AddWithValue("@UID", xUID());
                            da.SelectCommand.Parameters.AddWithValue("@filename", filename);
                            da.SelectCommand.Parameters.AddWithValue("@filedata", filedata);

                            foreach (var key in json)
                            {
                                DateTime dt;
                                if (key.Value.ToString().IndexOf(",") > 0)
                                {
                                    da.SelectCommand.Parameters.AddWithValue("@" + key.Key, key.Value.ToString());
                                }
                                else if (DateTime.TryParse(key.Value.ToString(), out dt))
                                {
                                    da.SelectCommand.Parameters.AddWithValue("@" + key.Key, DateTime.Parse(key.Value.ToString()));
                                }
                                else
                                {
                                    da.SelectCommand.Parameters.AddWithValue("@" + key.Key, key.Value.ToString());
                                }
                            }

                            da.Fill(xdat);
                            rtn = JsonConvert.SerializeObject(xdat);
                        }
                    }
                }

                return rtn;
            }
        }

        //[Route("UploadQuiz")]
        //public string UploadQuiz(IFormFile fil)
        //{
        //    Quiz.UploadQuiz(fil, xUID());

        //    return "[{msg:Quiz is loading}]";
        //}




        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
