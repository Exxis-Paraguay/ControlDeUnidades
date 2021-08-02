using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Net;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RestSharp;

namespace ControlDeUnidades.Controllers
{
    // https://benjii.me/2016/07/using-sessions-and-httpcontext-in-aspnetcore-and-mvc-core/
    public class LoginController : Controller
    {
        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        /*
         * Realiza la apertura sesion para el Dashboard
         */
        [HttpGet]
        public ActionResult login(string user, string pass, string db) //JsonResult
         {
            Connection con = new Connection();
            Boolean res = con.Login(user, pass, db);
            string resultado = "";
            bool logCorrecto = false;
            try { 
                if (res)
                {
                    logCorrecto = true;
                    HttpContext.Session.SetString("Session", user);
                }
                else resultado = "Usuario y/o contraseña incorrectos";
                
            
                var json = Json(new
                {
                    success = logCorrecto,
                    responseText = resultado
                });
                return json;
            }
            catch (Exception ex)
            {
                logCorrecto = false;
                resultado = "Ocurrio un error inesperado.";
                var json = Json(new
                {
                    success = logCorrecto,
                    responseText = resultado
                });
                return json;
            }
        }
        /*
         * Realiza el cierre sesion para el Dashboard
         */
        [HttpGet]
        public ActionResult logout()
        {
            bool logCorrecto = false;
            try
            {
                HttpContext.Session.Clear();
                string sesion = HttpContext.Session.GetString("Session");
                if (sesion == null) logCorrecto = true;
                var json = Json(new
                {
                    success = logCorrecto
                });
                return json;
            }
            catch (Exception ex)
            {
                logCorrecto = false;
                var json = Json(new
                {
                    success = logCorrecto
                });
                return json;
            }
        }
    }
}
