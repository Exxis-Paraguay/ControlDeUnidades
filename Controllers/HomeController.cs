using ControlDeUnidades.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Data;
using Microsoft.AspNetCore.Http;
using ControlDeUnidades.Controllers;
using ControlDeUnidades.App_Data;

namespace ControlDeUnidades.Controllers
{
    public class HomeController : Controller
    {

        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            var funciones = new Functions();
            Boolean Prueba;
            DataTable dtPruebas = new DataTable();
            /*
            // Requires: using Microsoft.AspNetCore.Http;
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(SessionKey)))
            {
                HttpContext.Session.SetString(SessionKey, "user");
                HttpContext.Session.SetString(SessionKeyName, "manager5");
            }*/
            //ViewBag.Message = HttpContext.Session.GetString("Test");
            string sesion = HttpContext.Session.GetString("Session");
            if(sesion != null) {
                funciones.obtenerProyectos();
                return View();
            } else return RedirectToAction("Index", "Login");

        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
