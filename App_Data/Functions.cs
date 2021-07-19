using ControlDeUnidades.Controllers;
using System;
using System.Collections.Generic;
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
        public void obtenerProyectos()
        {
            try
            {
                string queryObtProy = "SELECT top 5 T0.\"DocEntry\", T0.\"DocNum\", T0.\"CardName\" from \"LOCALIZACION\".\"OINV\" T0";
                OdbcCommand command = new OdbcCommand(queryObtProy, con.ConectaHANA());
                OdbcDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    Console.WriteLine("DocEntry={0}", reader[0]);
                    string docEntry = reader[0].ToString();
                    string docNum = reader[1].ToString();
                    string cardName = reader[2].ToString();
                }
                con.DesconectarHANA();
            }
            catch (Exception ex)
            {
                string error = ex.Message;
                con.DesconectarHANA();
            }
            finally
            {
                con.DesconectarHANA();
            }

        }
    }
}
