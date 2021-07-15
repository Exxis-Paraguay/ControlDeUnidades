using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using RestSharp;
using System.Data;

namespace ControlDeUnidades.Controllers
{
    public class Connection
    {
        String Url = "Https://192.168.0.5:50000/b1s/v1";
        IRestClient Request = new RestClient();
        public Boolean Login()
        {
            Boolean result;
            
            try
            {
                string UrlLogin = Url + "/Login" ;
                IRestClient Client = new RestClient(UrlLogin);
                IRestRequest Request = new RestRequest("Auth/SignIn");

                Request.Method = Method.POST;
                Request.Parameters.Clear();

                Request.AddParameter("application/json", "{\"CompanyDB\": \"LOCALIZACION\",\"UserName\": \"manager5\",\"Password\": \"12345\"}", ParameterType.RequestBody);
                ServicePointManager.ServerCertificateValidationCallback += (sender, cert, chain, sslPolicyErrors) => true;
                var response = Client.Post(Request);

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
        public DataTable Get(String Parametro)
        {
            DataTable Tabla = new DataTable();
            try
            {
                IRestClient client = new RestClient();
                IRestRequest Request = new RestRequest(Url);
                var pruebas = client.Get(Request);
            }
            catch (Exception ex)
            { 
            
            }
            return Tabla;
        }
    }
}
