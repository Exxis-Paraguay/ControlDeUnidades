using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using RestSharp;
using System.Data;
using RestSharp.Authenticators;
using Newtonsoft.Json.Linq;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Http;
using System.Data.Common;
using System.Data.Odbc;
using System.Data.SqlClient;

namespace ControlDeUnidades.Controllers
{
    // hana c#
    // https://blogs.sap.com/2014/10/16/bridging-the-gap-between-net-and-hana-using-c/
    public class Connection
    {
        String Url = "https://172.16.20.3:50000/b1s/v1";
        String tokenString = "";
        public static OdbcConnection hanaConn;

        /*
         * Realiza el logueo por SL
         */
        public Boolean Login(string user, string pass)
        {
            Boolean result;
            
            try
            {
                string UrlLogin = Url + "/Login" ;
                IRestClient Client = new RestClient(UrlLogin);
                IRestRequest Request = new RestRequest("Auth/SignIn");
                Request.Method = Method.POST;
                Request.Parameters.Clear();
                Request.AddParameter("application/json", "{\"CompanyDB\": \"CP\",\"UserName\": \""+user+"\",\"Password\": \""+pass+"\"}", ParameterType.RequestBody);
                ServicePointManager.ServerCertificateValidationCallback += (sender, cert, chain, sslPolicyErrors) => true;
                var response = Client.Post(Request);
                // Obtengo el token
                tokenString = response.Content.Replace("\n","").Replace("\"", "").Replace("{", "").Replace("}", "").Split(',')[1].Split(':')[1].Replace(" ", String.Empty);
                 if (response.StatusCode.ToString() == "OK")
                {
                    
                    result = true;
                }
                else
                { 
                    result = false;
                }
            }
            catch(Exception ex)
            {
                result = false;
            }
            return result;
        }

        /*
         * Abre una conexion a SAP HANA
         */
        public OdbcConnection ConectaHANA()
        {
            const string _strServerName = "172.16.20.3:30015";
            const string _strLoginName = "SYSTEM";
            const string _strPassword = "R3t41l.20";
            string strConnectionString = string.Empty;
            try
            {
                if (IntPtr.Size == 8)
                {
                    // 64-bit stuff
                    strConnectionString = string.Concat(strConnectionString, "Driver={HDBODBC};");
                }
                else
                {
                    // 32-bit
                    strConnectionString = string.Concat(strConnectionString, "Driver={HDBODBC32};");
                }
                strConnectionString = string.Concat(strConnectionString, "ServerNode=", _strServerName, ";");
                strConnectionString = string.Concat(strConnectionString, "UID=", _strLoginName, ";");
                strConnectionString = string.Concat(strConnectionString, "PWD=", _strPassword, ";");
                hanaConn = new OdbcConnection(strConnectionString.ToString());
                hanaConn.Open();
                return hanaConn;
            }
            catch (Exception ex)
            {
                string error = ex.Message;
                return hanaConn;
            }
            finally
            {
                //hanaConn.Dispose();
            }
        }

        /*
         * Cierra la conexion
         */
        public void DesconectarHANA()
        {
            hanaConn.Close();
        }

    }
}  
