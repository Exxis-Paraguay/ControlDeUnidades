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
                bool success = false;
                // Obtengo los valores
                var res = funciones.obtenerProyectos();
                if (res.Contains("[")) success = true;
                // Envio de valores en formato JSON
                var json = Json(new
                {
                    success = success,
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

        /*
         * Obtengo las torres por proyecto seleccionado
         */
        [HttpGet]
        public IActionResult obtenerTorres(string idProyecto)
        {
            try
            {
                var funciones = new Functions();
                bool success = false;
                // Obtengo los valores
                var res = funciones.obtenerTorres(idProyecto);
                if (res.Contains("[")) success = true;
                // Envio de valores en formato JSON
                var json = Json(new
                {
                    success = success,
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

        /*
         * Obtengo las unidades por torre seleccionada
         */
        [HttpGet]
        public IActionResult obtenerUnidades(string idTorre, string idProyecto)
        {
            try
            {
                var funciones = new Functions();
                bool success = false;
                // Obtengo los valores
                var res = funciones.obtenerUnidades(idTorre, idProyecto);
                if (res.Contains("[")) success = true;
                // Envio de valores en formato JSON
                var json = Json(new
                {
                    success = success,
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

        /*
         * Obtengo las unidades por torre seleccionada
         */
        [HttpGet]
        public IActionResult obtenerMacroproyecto(string idProy, string idTorre, string idTipoUnidad)
        {
            try
            {
                var funciones = new Functions();
                bool success = false;
                // Obtengo los valores
                var res = funciones.obtenerMacroproyecto(idProy, idTorre, idTipoUnidad);
                if (res.Contains("[")) success = true;
                // Envio de valores en formato JSON
                var json = Json(new
                {
                    success = success,
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

        /*
         * Obtengo las unidades por torre seleccionada
         */
        [HttpGet]
        public IActionResult obtenerInfoUnidades(string idUnidad)
        {
            try
            {
                var funciones = new Functions();
                bool success = false;
                // Obtengo los valores
                var res = funciones.obtenerInfoUnidades(idUnidad);
                if (res.Contains("[")) success = true;
                // Envio de valores en formato JSON
                var json = Json(new
                {
                    success = success,
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

        /*
         * Obtengo las unidades por torre seleccionada
         */
        [HttpGet]
        public IActionResult obtenerEstados()
        {
            try
            {
                var funciones = new Functions();
                bool success = false;
                // Obtengo los valores
                var res = funciones.obtenerEstados();
                if (res.Contains("[")) success = true;
                // Envio de valores en formato JSON
                var json = Json(new
                {
                    success = success,
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
