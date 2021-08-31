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
                    string tipo = "\"tipo\":\"" + reader[3].ToString() + "\",";
                    string tipoUnidad = "\"tipoUnidad\":\"" + reader[4].ToString() + "\",";
                    string tipoUnidDes = "\"tipoUnidDes\":\"" + reader[5].ToString() + "\",";
                    string vencido = "\"vencido\":\"" + reader[7].ToString() + "\"";


                    string row = "{" + numero + piso + estado + tipo + tipoUnidad + tipoUnidDes + vencido + "}";

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
        public string obtenerMacroproyecto(string idProy, string idTorre, string idTipoUnidad)// 01 - depto
        {
            int flag = 0;
            string col = "";
            string strJSON = "";
            try
            {
                string queryObtProy = string.Format("CALL " + _dbNew + ".SP_MacroProyecto('{0}','{1}','{2}')", idTorre, idProy, idTipoUnidad);
                OdbcCommand command = new OdbcCommand(queryObtProy, con.ConectaHANA());
                OdbcDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    string estado = "\"estado\":\"" + reader[1].ToString() + "\",";
                    string cantidad = "\"cantidad\":\"" + reader[2].ToString() + "\",";
                    string promedioVendidoPropio = "\"promedioVendidoTotalM2\":\"" + reader[3].ToString() + "\",";
                    string promedioVendidoTotal = "\"promedioVendidoPropio\":\"" + reader[4].ToString() + "\",";
                    string porcentaje = "\"porcentaje\":\"" + (decimal.Round(Convert.ToDecimal(reader[5].ToString()), 2)).ToString()  + "\"";
                    

                    string row = "{" + estado + cantidad + promedioVendidoPropio + promedioVendidoTotal + porcentaje + "}";

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
        public string obtenerMacroproyectoAll(string idProy, string idTorre, string idTipoUnidad)// 01 - depto
        {
            int flag = 0;
            string col = "";
            string strJSON = "";
            try
            {
                string queryObtProy = string.Format("CALL " + _dbNew + ".SP_MacroProyecto_All('{0}','{1}','{2}')", idTorre, idProy, idTipoUnidad);
                OdbcCommand command = new OdbcCommand(queryObtProy, con.ConectaHANA());
                OdbcDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    string estado = "\"estado\":\"" + reader[1].ToString() + "\",";
                    string cantidad = "\"cantidad\":\"" + reader[2].ToString() + "\",";
                    string promedioVendidoPropio = "\"promedioVendidoTotalM2\":\"" + reader[3].ToString() + "\",";
                    string promedioVendidoTotal = "\"promedioVendidoPropio\":\"" + reader[4].ToString() + "\",";
                    string porcentaje = "\"porcentaje\":\"" + (decimal.Round(Convert.ToDecimal(reader[5].ToString()), 2)).ToString() + "\"";


                    string row = "{" + estado + cantidad + promedioVendidoPropio + promedioVendidoTotal + porcentaje + "}";

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
                    string tipoDoc = "\"TipoDoc\":\"" + reader[0].ToString() + "\",";
                    string cliente = "\"Cliente\":\"" + reader[1].ToString() + "\",";
                    string vendedor = "\"Vendedor\":\"" + reader[2].ToString() + "\",";
                    string fechaVenta = "\"FechaVenta\":\"" + reader[3].ToString() + "\",";
                    string montoDpto = "\"MontoDpto\":\"" + reader[4].ToString() + "\",";
                    string nroFactura = "\"NroFactura\":\"" + reader[5].ToString() + "\",";
                    string montoTotalFactura = "\"MontoTotalFactura\":\"" + reader[6].ToString() + "\",";
                    string moneda = "\"Moneda\":\"" + reader[7].ToString() + "\",";
                    string fechaVenci = "\"FechaVenci\":\"" + reader[8].ToString() + "\",";
                    string vencido = "\"Vencido\":\"" + reader[10].ToString() + "\"";
                    string row = "{" + tipoDoc + cliente + vendedor + fechaVenta + montoDpto + nroFactura + montoTotalFactura + moneda + fechaVenci + vencido + "}";

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
        public string obtenerEstados()
        {
            int flag = 0;
            string col = "";
            string strJSON = "";
            try
            {
                /*string queryObtProy = "SELECT DISTINCT o.\"U_Torre\" as \"CodigoTorre\" FROM \"CP\".OITM o WHERE o.\"U_Torre\" > 0";*/
                string queryObtProy = "SELECT a.\"Code\" AS \"codigo\", a.\"Name\" AS \"nombre\" FROM " + _dbNew + ".\"@EXX_ESTATUS\" AS a";
                OdbcCommand command = new OdbcCommand(queryObtProy, con.ConectaHANA());
                OdbcDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    string codigo = "\"codigo\":\"" + reader[0].ToString() + "\",";
                    string nombre = "\"nombre\":\"" + reader[1].ToString() + "\"";
                    string row = "{" + codigo + nombre +  "}";

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
