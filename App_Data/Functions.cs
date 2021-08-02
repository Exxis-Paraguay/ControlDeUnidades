using ControlDeUnidades.Controllers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Odbc;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using ControlDeUnidades.App_Data;

namespace ControlDeUnidades.App_Data
{

    /* *
     * 
     * Todas las funciones realizadas sobre la base de datos de HANA
     * 
     * */
    public class Functions
    {
        Connection con = new Connection();
        public static string _dbNew = string.Empty;
        
        /*
         * Obtiene todos los proyectos activos
         */
        public string obtenerProyectos()
        {
            int flag = 0;
            string col = "";
            string strJSON = "";
            try
            {
                string queryObtProy = "CALL " + _dbNew + ".SP_Proyecto();";
                OdbcCommand command = new OdbcCommand(queryObtProy, con.ConectaHANA());
                OdbcDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    string Proyecto = "\"Proyecto\" : \"" + reader[0].ToString() + "\",";
                    string CantLibre = "\"CantLibre\":\"" + reader[1].ToString() + "\"";

                    string row = "{" + Proyecto + CantLibre +"}";

                    if (flag > 0) col += "," + row;
                    else col += row;
                    flag++;
                }
                strJSON = "[" + col + "]";
                con.DesconectarHANA();
                return strJSON;
            }
            catch (Exception ex)
            {
                string error = ex.Message;
                con.DesconectarHANA();
                return error;
            }
        }


        /*
         * Obtiene todos los proyectos activos
         */
        public string obtenerUnidades(string idTorre, string idProyecto)
        {
            int flag = 0;
            string col = "";
            string strJSON = "";
            try
            {
                string queryObtProy = string.Format("CALL " + _dbNew + ".SP_ITEMS({0},{1})", idTorre, idProyecto);
                OdbcCommand command = new OdbcCommand(queryObtProy, con.ConectaHANA());
                OdbcDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    string numero = "\"numero\":\"" + reader[0].ToString() + "\",";
                    string piso = "\"piso\":\"" + reader[1].ToString() + "\",";
                    string estado = "\"estado\":\"" + reader[2].ToString() + "\",";
                    string tipo = "\"tipo\":\"" + reader[3].ToString() + "\"";

                    string row = "{" + numero + piso + estado + tipo + "}";

                    if (flag > 0) col += "," + row;
                    else col += row;
                    flag++;
                }
                strJSON = "[" + col + "]";
                con.DesconectarHANA();
                return strJSON;
            }
            catch (Exception ex)
            {
                string error = ex.Message;
                con.DesconectarHANA();
                return error;
            }
        }


        /*
         * Obtiene todos los datos para crear el MAcroproyecto
         */
        public string obtenerMacroproyecto(string idProy, string idTorre)
        {
            int flag = 0;
            string col = "";
            string strJSON = "";
            try
            {
                string queryObtProy = string.Format("CALL " + _dbNew + ".SP_MacroProyecto({0},{1})", idTorre, idProy);
                OdbcCommand command = new OdbcCommand(queryObtProy, con.ConectaHANA());
                OdbcDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    string estado = "\"estado\":\"" + reader[1].ToString() + "\",";
                    string cantidad = "\"cantidad\":\"" + reader[2].ToString() + "\",";
                    string promedioVendidoPropio = "\"promedioVendidoPropio\":\"" + reader[3].ToString() + "\",";
                    string promedioVendidoTotal = "\"promedioVendidoTotal\":\"" + reader[4].ToString() + "\"";

                    string row = "{" + estado + cantidad + promedioVendidoPropio + promedioVendidoTotal + "}";

                    if (flag > 0) col += "," + row;
                    else col += row;
                    flag++;
                }
                strJSON = "[" + col + "]";
                con.DesconectarHANA();
                return strJSON;
            }
            catch (Exception ex)
            {
                string error = ex.Message;
                con.DesconectarHANA();
                return error;
            }
        }

        /*
         * Obtiene todas las torres
         */
        public string obtenerTorres(string idProy)
        {
            int flag = 0;
            string col = "";
            string strJSON = "";
            try
            {
                /*string queryObtProy = "SELECT DISTINCT o.\"U_Torre\" as \"CodigoTorre\" FROM \"CP\".OITM o WHERE o.\"U_Torre\" > 0";*/
                string queryObtProy = string.Format("CALL " + _dbNew + ".SP_TORRE({0})", idProy);
                OdbcCommand command = new OdbcCommand(queryObtProy, con.ConectaHANA());
                OdbcDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    string codigoTorre = "\"Torre\":\"" + reader[0].ToString() + "\",";
                    string libreTorre = "\"CantLibre\":\"" + reader[1].ToString() + "\"";
                    string row = "{" + codigoTorre + libreTorre + "}";

                    if (flag > 0) col += "," + row;
                    else col += row;
                    flag++;
                }
                strJSON = "[" + col + "]";
                con.DesconectarHANA();
                return strJSON;
            }
            catch (Exception ex)
            {
                string error = ex.Message;
                con.DesconectarHANA();
                return error;
            }
        }

        /*
         * Obtiene la información de la unidad
         */
        public string obtenerInfoUnidades(string idUnidad)
        {
            int flag = 0;
            string col = "";
            string strJSON = "";
            try
            {
                /*string queryObtProy = "SELECT DISTINCT o.\"U_Torre\" as \"CodigoTorre\" FROM \"CP\".OITM o WHERE o.\"U_Torre\" > 0";*/
                string queryObtProy = string.Format("CALL " + _dbNew + ".SP_ObtenerInfoUnidades('{0}')", idUnidad);
                OdbcCommand command = new OdbcCommand(queryObtProy, con.ConectaHANA());
                OdbcDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    string cliente = "\"Cliente\":\"" + reader[0].ToString() + "\",";
                    string vendedor = "\"Vendedor\":\"" + reader[1].ToString() + "\",";
                    string fechaVenta = "\"FechaVenta\":\"" + reader[2].ToString() + "\",";
                    string montoDpto = "\"MontoDpto\":\"" + reader[3].ToString() + "\",";
                    string nroFactura = "\"NroFactura\":\"" + reader[4].ToString() + "\",";
                    string montoTotalFactura = "\"MontoTotalFactura\":\"" + reader[5].ToString() + "\"";
                    string row = "{" + cliente + vendedor + fechaVenta + montoDpto + nroFactura+montoTotalFactura +"}";

                    if (flag > 0) col += "," + row;
                    else col += row;
                    flag++;
                }
                strJSON = "[" + col + "]";
                con.DesconectarHANA();
                return strJSON;
            }
            catch (Exception ex)
            {
                string error = ex.Message;
                con.DesconectarHANA();
                return error;
            }
        }
    }
}
