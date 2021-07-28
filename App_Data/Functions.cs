using ControlDeUnidades.Controllers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Odbc;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

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
                string queryObtProy = "CALL CP.SP_Proyecto();";
                OdbcCommand command = new OdbcCommand(queryObtProy, con.ConectaHANA());
                OdbcDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    /*string docEntry = "\"DocEntry\":\""+reader[0].ToString() +"\",";
                    string docNum = "\"DocNum\":\"" + reader[1].ToString() + "\",";
                    string cardName = "\"CardName\":\"" + reader[2].ToString() + "\",";
                    string estado = "\"Estado\":\"" + reader[3].ToString() + "\",";
                    string piso = "\"Piso\":\"" + reader[4].ToString() + "\",";
                    string tipoArt = "\"TipoArt\":\"" + reader[5].ToString() + "\"";*/
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
                string queryObtProy = string.Format("CALL CP.SP_ITEMS({0},{1})", idTorre, idProyecto);
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
                string queryObtProy = string.Format("CALL CP.SP_MacroProyecto({0},{1})",idProy, idTorre);
                OdbcCommand command = new OdbcCommand(queryObtProy, con.ConectaHANA());
                OdbcDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    string estado = "\"estado\":\"" + reader[1].ToString() + "\",";
                    string cantidad = "\"cantidad\":\"" + reader[2].ToString() + "\"";
                    string promedioVendidoPropio = "\"promedioVendidoPropio\":\"" + reader[3].ToString() + "\",";
                    string promedioVendidoTotal = "\"promedioVendidoTotal\":\"" + reader[4].ToString() + "\"";

                    string row = "{" + estado + cantidad + "}";

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
                string queryObtProy = string.Format("CALL CP.SP_TORRE({0})", idProy);
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

        public static String json_encode(OdbcDataReader reader, String[] columns)
        {
            return "";
            /*int length = columns.Length;
            String res = "{";
            while (reader.Read())
            {
                
                res += "{";
                for (int i = 0; i < length; i++)                {
                    res += "\"" + columns[i] + "\":\"" + reader[columns[i]].ToString() + "\"";
                    if (i < length - 1)
                        res += ",";
                }
                res += "}";
            }
            res += "}";
            return res;*/
        }
    }
}
