﻿using ControlDeUnidades.Models;
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

        /*
         * Control de logueo al cargar pagina
         */
        public IActionResult Index()
        {
            string sesion = HttpContext.Session.GetString("Session");
            if(sesion != null) {
                return View();
            } else return RedirectToAction("Index", "Login");

        }

        /*
         * Obtengo todos los proyectos
         */
        [HttpGet]
        public IActionResult obtenerProyectos()
        {
            try
            {
                var funciones = new Functions();
                // Obtengo los valores
                var res = funciones.obtenerProyectos();
                // Envio de valores en formato JSON
                var json = Json(new
                {
                    success = true,
                    responseText = res
                });
                return json;
            }
            catch (Exception ex)
            {
                string error = ex.Message;
                // En caso de error se envia el texto por JSON
                var json = Json(new
                {
                    success = false,
                    responseText = error
                });
                return json;
            }
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
