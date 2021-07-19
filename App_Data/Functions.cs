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
                string queryObtProy = "SELECT top 5 T0.\"DocEntry\", T0.\"DocNum\", T0.\"CardName\" from \"LOCALIZACION\".\"OINV\" T0";
                OdbcCommand command = new OdbcCommand(queryObtProy, con.ConectaHANA());
                OdbcDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    string docEntry = "\"DocEntry\":\""+reader[0].ToString() +"\",";
                    string docNum = "\"DocNum\":\"" + reader[1].ToString() + "\",";
                    string cardName = "\"CardName\":\"" + reader[2].ToString() + "\"";
                    string row = "{" + docEntry + docNum + cardName + "}";

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
                return strJSON;
            }
            finally
            {
                con.DesconectarHANA();
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
