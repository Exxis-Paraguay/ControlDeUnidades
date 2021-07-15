using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using RestSharp;

namespace ControlDeUnidades.Controllers
{
    public class Connection
    {
        public Boolean Login()
        {
            Boolean result;
            String Url= "Https://192.168.0.5:50000/b1s/v1/Login";
            try
            {
                
                IRestClient Client = new RestClient(Url);
                IRestRequest Request = new RestRequest("Auth/SignIn");

                Request.Method = Method.POST;
                Request.AddHeader("Content-Type", "application/json");
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
    }
}
