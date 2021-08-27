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
using System.IO;
using Newtonsoft.Json;
using ControlDeUnidades.App_Data;

namespace ControlDeUnidades.Controllers
{
    // hana c#
    // https://blogs.sap.com/2014/10/16/bridging-the-gap-between-net-and-hana-using-c/
    public class Connection
    {
        String Url = "";//"https://172.16.20.3:50000/b1s/v1"; // "https://192.168.0.5:50000//b1s/v1";
        String tokenString = "";
        public static OdbcConnection hanaConn;
        //public static string _db { get; set; } = string.Empty;
        public static string _db = string.Empty;
        /*
         * Realiza el logueo por SL
         */
        public Boolean Login(string user, string pass, string database)
        {
            Boolean result;
            
            try
            {
                _db = database;
                Functions._dbNew = database;

                // Leemos el archivo 'databases.json' 
                using (StreamReader archivo = File.OpenText(@"wwwroot/js/vistas/databases.json"))
                {
                    // Leemos los datos del archivo 'databases.json' y reemplazar caracteres
                    string json = archivo.ReadToEnd().Replace("\r\n ", "").Replace(@"\", "");
                    // Deserializamos el archivo 'databases.json' 
                    dynamic miarray = JsonConvert.DeserializeObject(json);
                    // Recorremos el array de datos del JSON 
                    foreach (var item in miarray)
                    {
                        // Cargar los datos de user y pass
                        if (item.nombre == _db)
                        {
                            Url = item.sl;
                        }
                    }
                }

                string UrlLogin = Url + "/Login" ;
                IRestClient Client = new RestClient(UrlLogin);
                IRestRequest Request = new RestRequest("Auth/SignIn");
                Request.Method = Method.POST;
                Request.Parameters.Clear();
                Request.AddParameter("application/json", "{\"CompanyDB\": \""+ database + "\",\"UserName\": \""+user+"\",\"Password\": \""+pass+"\"}", ParameterType.RequestBody);
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
            string _strServerName = "";// "172.16.20.3:30015";
            string _strLoginName = "";//"SYSTEM";
            string _strPassword = "";//"R3t41l.20";
            string strConnectionString = string.Empty;

            
            try
            {
                // Leemos el archivo 'databases.json' 
                using (StreamReader archivo = File.OpenText(@"wwwroot/js/vistas/databases.json"))
                {
                    // Leemos los datos del archivo 'databases.json' y reemplazar caracteres
                    string json = archivo.ReadToEnd().Replace("\r\n ", "").Replace(@"\", "");
                    // Deserializamos el archivo 'databases.json' 
                    dynamic miarray = JsonConvert.DeserializeObject(json);
                    // Recorremos el array de datos del JSON 
                    foreach (var item in miarray)
                    {
                        // Cargar los datos de user y pass
                        if (item.nombre == _db)
                        {
                            _strServerName = item.servidor;
                            _strLoginName = item.usuario;
                            _strPassword = item.pass;
                        }
                    }
                }
                // Conexion
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

        public void Logout()
        {
            try
            {
                string UrlLogin = Url + "/Logout";
                IRestClient Client = new RestClient(UrlLogin);
                IRestRequest Request = new RestRequest("Auth/SignIn");
                Request.Method = Method.POST;
                ServicePointManager.ServerCertificateValidationCallback += (sender, cert, chain, sslPolicyErrors) => true;
                var response = Client.Post(Request);
            }
            catch (Exception ex)
            { 
            
            }

        }

    }
}  
