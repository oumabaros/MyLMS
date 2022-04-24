using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace CMS_LearningCenterMVC
{
    public class DB
    {
        public static string connstr = @"Server=CFCA\SQLEXPRESS2019;Database=CMS_LC;Trusted_Connection=True;MultipleActiveResultSets=true;";


        public static DataTable GetCMS()
        {
            DataTable Dat = GetDB("select 1001 as uid, 7 as CMS_CID, 'Standard' as Fname, 'User' as Lname, 'Allgate Financial' as Company_Name, 'Standard' as UserRole, '2A66A2DE-3AF1-4CE4-BEDB-B72394D6C25F' as SecureCode", 0, "{}");

            return Dat;
        }
        public static DataTable GetCMS_()
        {
            DataTable Dat = new DataTable();
            Dat.Clear();
            Dat.Columns.Add("id");
            Dat.Columns.Add("uid");
            Dat.Columns.Add("UserID");
            Dat.Columns.Add("userrole");
            Dat.Columns.Add("Fname");
            Dat.Columns.Add("Lname");
            Dat.Columns.Add("CMS_CID");
            Dat.Columns.Add("SecureCode");
            Dat.Columns.Add("CMS_Company");
            Dat.Columns.Add("Active");
            Dat.Columns.Add("Company_Name");
            Dat.Columns.Add("err");

            DataRow dr = Dat.NewRow();
            dr["id"] = 1;
            dr["uid"] = 11;
            dr["UserID"] = "6FA06927-57ED-4C9D-8568-2783AE6A7990";
            dr["userrole"] = "Admin";
            dr["Fname"] = "Admin";
            dr["Lname"] = "User";
            dr["CMS_CID"] = 7;
            dr["SecureCode"] = "2A66A2DE-3AF1-4CE4-BEDB-B72394D6C25F";
            dr["Company_Name"] = "Allgate Financial";
            dr["err"] = "";
            Dat.Rows.Add(dr);

            return Dat;
        }

        public static DataTable GetDB(string sql, int UID, string strParams = "", string DB = "CMS_LC")
        {
            DataTable Dat = new DataTable();

            string errmsg = "";
            if (DB == "CMSSuite")
            //if (DB == "CMS_LC")
            {
                Dat = GetCMS_();
            }
            else
            {
                //BARASA - don't use "test"
                DB = (DB == "test") ? "CMSSuite" : DB;
                try
                {
                    string cs = connstr.Replace("XXXX", DB);
                    var da = new SqlDataAdapter(sql, cs);
                    da.SelectCommand.CommandTimeout = 180;

                    //add UID (not in JSON)
                    da.SelectCommand.Parameters.AddWithValue("@UID", UID);

                    //add passed parameters
                    if (strParams != "")
                    {
                        //add JSON
                        var jsonParams = JObject.Parse(strParams);
                        foreach (var key in jsonParams)
                        {
                            int x;
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
                    }
                    da.Fill(Dat);
                }
                catch (Exception err)
                {
                    errmsg = err.ToString();
                    string xparams = strParams;
                }

                int dc = Dat.Rows.Count;

                if (errmsg != "")
                {
                    Dat = new DataTable();
                    Dat.Columns.Add("err");
                    DataRow workRow = Dat.NewRow();
                    workRow["err"] = errmsg;
                    Dat.Rows.Add(workRow);

                }
            }

            return Dat;
        }

    }
}
