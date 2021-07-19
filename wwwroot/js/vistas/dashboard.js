$(document).ready(function () {
    /*
     * LLAMADA A FUNCIONES ===============================================================================
     */
    obtenerProyectos();

    /*
     * CSS ===============================================================================
     */
    //Ocultar todas las torres
    $(".torre").css("display", "none");
    $("#bellNotificacion").css("display", "none");
    // Ocultar modal
    $("#dialogInfoUnidad").css("display", "none");
    // Ocultar Sector Unidades
    $("#sector-unidades").css("display", "none");
    

    /*
     * EVENTOS ===============================================================================
     */
    // ------------------------------------- click ----------------------------------------------------
    // Ocultar menu lateral
    $("#mobile-collapse").click();
    // Click sobre unidad aparece modal
    $(".pointDash").click(function () {
        $("#dialogInfoUnidad").dialog();
    });
    //Evento click sobre los proyectos desde dashboard principal y menu
    $(".item, .liProyNom a").click(function () {
        $("#sector-unidades").css("display", "inline");
        $("#sector-proyectos").css("display", "none");
        $(".buscador").val("");
    });
    //Evento click sobre las torres
    $(".item-torre").click(function () {
        $("#torre1").css("display", "inline");
        $(".seccion-buscar-torre").css("display", "none");
        $("#buscador-torre").val("");
    });
    // Evento click del boton volver de la pantalla filtro por torre
    $("#btnVolverProyectos").click(function () {
        $("#sector-unidades").css("display", "none");
        $("#sector-proyectos").css("display", "inline");
        $(".buscador").val("");
    });
    // Evento click del boton volver de la pantalla unidades
    $("#btnVolverFiltroTorres").click(function () {
        $(".torre").css("display", "none");
        $(".seccion-buscar-torre").css("display", "inline");
    });

    /*
     * BUSCADORES ===============================================================================
     */
    // Buscador Proyecto
    $('.buscador').keyup(function () {
        $("#sector-unidades").css("display", "none");
        $("#sector-proyectos").css("display", "inline");
        var nombres = $('.nombres');
        var buscando = $(this).val();
        var item = '';
        for (var i = 0; i < nombres.length; i++) {
            item = $(nombres[i]).html().toLowerCase();
            for (var x = 0; x < item.length; x++) {
                if (buscando.length == 0 || item.indexOf(buscando) > -1) {
                    $(nombres[i]).parents('.item').show();
                } else {
                    $(nombres[i]).parents('.item').hide();
                }
            }
        }
    });

    // Buscador Torre
    $('#buscador-torre').keyup(function () {
        var nombres = $('.nombres-torre');
        var buscando = $(this).val();
        var item = '';
        for (var i = 0; i < nombres.length; i++) {
            item = $(nombres[i]).html().toLowerCase();
            for (var x = 0; x < item.length; x++) {
                if (buscando.length == 0 || item.indexOf(buscando) > -1) {
                    $(nombres[i]).parents('.item-torre').show();
                } else {
                    $(nombres[i]).parents('.item-torre').hide();
                }
            }
        }
    });

    /*
     * FILTROS ===============================================================================
     */
    // Filtro Pisos/Cocheras/Bauleras
    $('.filtro-estado input.form-check-input').click(function () {
        // recorro filtro de pisos
        var cont = parseInt(0);
        //oculto todo
        $(".Pisos, .Cocheras, .Bauleras").css("display", "none");
        //por cada filtro seleccionado se muestra
        $(".cbPCB :checkbox:checked").each(function () {
            $("." + $(this).val()).removeAttr("style");
            cont++;
        });
        // Si no se selecciono ningun filtro, se muestra todo
        if (cont == 0) $(".Pisos, .Cocheras, .Bauleras").removeAttr("style");

    });

    // Filtro Estado
    $('.filtro-estado input.form-check-input').click(function () {
        // recorro filtro de estados
        var cont = parseInt(0);
        //oculto todo
        $(".Libres, .Asignados, .Reservados, .Formalizados, .Protocolizados").css("display", "none");
        //por cada filtro seleccionado se muestra
        $(".cbEstados :checkbox:checked").each(function () {
            $("." + $(this).val()).removeAttr("style");
            cont++;
        });
        // Si no se selecciono ningun filtro, se muestra todo
        if (cont == 0) $(".Libres, .Asignados, .Reservados, .Formalizados, .Protocolizados").removeAttr("style");
    });
});


/*
* FUNCIONES ===============================================================================
*/

// Obtiene todos los proyectos activos
function obtenerProyectos(){
    //Llamada al método obtenerProyectos desde el controlador
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: "GET",
        cache: false,
        url: document.location.origin + '/Home/obtenerProyectos',
        data: {},//{ "user": $("#txtUser").val(), "pass": $("#txtPass").val() },//JSON.stringify({ "user": $("#txtUser").val(), "pass": $("#txtPass").val() }),//datos,
        success: function (data) {
            if (data.success) {
                //
            }
            //var obj = JSON.parse('{ "DocEntry": "2670", "DocNum": "74", "CardName": "Instituto de Previsión Social" }');
            var obj = JSON.parse(data.responseText);
            //alert(obj[0].DocEntry);

            /*
             {{"DocEntry":"2670","DocNum":"74","CardName":"Instituto de Previsión Social"},{"DocEntry":"2889","DocNum":"10000","CardName":"Instituto de Previsión Social"},{"DocEntry":"2671","DocNum":"75","CardName":"Instituto de Previsión Social"},{"DocEntry":"4212","DocNum":"10190","CardName":"Ministerio de Salud Pública y Bienestar Social"},{"DocEntry":"4213","DocNum":"10191","CardName":"Ministerio de Salud Pública y Bienestar Social"}}
             */
        },
        error: function (jqXHR, exception) {
            app.ajaxError(jqXHR, exception);
        },
        complete: function () {
        }
    });
}