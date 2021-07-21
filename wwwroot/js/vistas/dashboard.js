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
    $('body').on('click', '.item, .liProyNom a', function () {
        var idProy = $(this).attr('id').split('-')[1];
        $("#sector-unidades").css("display", "inline");
        $("#sector-proyectos").css("display", "none");
        $(".buscador").val("");
        // Obtengo las torres del proyecto seleccionado
        obtenerTorres(idProy)
    });
    //Evento click sobre las torres
    $('body').on('click', '.item-torre', function () {
        var idTorre = $(this).attr('id').split('-')[1];
        $("#torre1").css("display", "inline");
        $(".seccion-buscar-torre").css("display", "none");
        $("#buscador-torre").val("");
        obtenerUnidades(1);
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
* UTIL ===============================================================================
*/
// Notifica algun mensaje
function notificacion(message, type) { // type: danger, success
    $.growl({
        message: message
    }, {
        type: type,
        allow_dismiss: false,
        label: 'Cancel',
        className: 'btn-xs btn-inverse',
        placement: {
            from: 'top',
            align: 'right'
        },
        delay: 5500,
        animate: {
            enter: 'animated fadeInUp',
            exit: 'animated fadeOutUp'
        },
        offset: {
            x: 30,
            y: 30
        },
        icon_type: 'class',
        template: '<div data-growl="container" class="alert" role="alert">' +
            '<button type="button" class="close" data-growl="dismiss">' +
            '<span aria-hidden="true">&times;</span>' +
            '<span class="sr-only">Close</span>' +
            '</button>' +
            '<span data-growl="icon"></span>' +
            '<span data-growl="title"></span>' +
            '<span data-growl="message"></span>' +
            '<a href="#" data-growl="url"></a>' +
            '</div>'
    });
};

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
                // Limpio la lista
                $('#listaProyectos, #menuProyectos').html("");
                // Convierto a JSON
                var proyecto = JSON.parse(data.responseText);
                // Recorro los datos y los voy cargando
                for (var i = 0; i < proyecto.length; i++) {
                    var cod = proyecto[i].DocEntry;
                    var nombre = proyecto[i].CardName;
                    var porcentaje = proyecto[i].DocNum;
                    var htmlProyectoLista = '<div id="proyList-' + cod + '" class="col-md-2 item"><div class="card text-center order-visitor-card"><div class="card-block texto">' +
                        '<h6 class="m-b-0"><label class="nombres">' + nombre + '</label></h6><p></p><h4 class="m-t-15 m-b-15">' +
                        '<i class="fas fa-building m-r-15"></i></h4><p class="m-b-0">' + porcentaje + '% Libres</p></div> </div></div>';
                    var htmlProyectoMenu = '<li class="liProyNom"><a id="proyMenu-' + cod + '" href="#" class="waves-effect waves-dark"><span class="pcoded-micon"><i class="ti-angle-right"></i></span>' +
                        '<span class="pcoded-mtext">' + nombre + '</span><span class="pcoded-mcaret"></span></a></li>';
                    // Cargo la lista con los proyectos obtenidos
                    $('#listaProyectos').append(htmlProyectoLista);
                    // Cargo la lista con los proyectos en el menu
                    $('#menuProyectos').append(htmlProyectoMenu);
                }
            } else {
                notificacion('Ha ocurrido un error inerperado: [' + data.responseText+']', 'danger');
            }
        },
        error: function (jqXHR, exception) {
            app.ajaxError(jqXHR, exception);
        }
    });
}

// Obtiene todas las torres por proyectos seleccionado
function obtenerTorres(idProyecto) {
    //Llamada al método obtenerProyectos desde el controlador
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: "GET",
        cache: false,
        url: document.location.origin + '/Home/obtenerTorres',
        data: { "idProyecto": idProyecto },//{ "user": $("#txtUser").val(), "pass": $("#txtPass").val() },//JSON.stringify({ "user": $("#txtUser").val(), "pass": $("#txtPass").val() }),//datos,
        success: function (data) {
            if (data.success) {
                // Limpio la lista
                $('#listaTorres').html("");
                // Convierto a JSON
                var proyecto = JSON.parse(data.responseText);
                // Recorro los datos y los voy cargando
                for (var i = 0; i < proyecto.length; i++) {
                    var cod = proyecto[i].DocEntry;
                    var nombre = proyecto[i].CardName;
                    var porcentaje = proyecto[i].DocNum;
                    var htmlProyectoLista = '<div id="torre-' + cod+'" class="col-md-2 item-torre"><div class="card text-center order-visitor-card">' +
                        '<div class="card-block texto-torre"><h6 class="m-b-0"><label class="nombres-torre">' + nombre+'</label></h6><p></p>' +
                        '<h4 class="m-t-15 m-b-15"><i class="fas fa-building m-r-15"></i></h4><p class="m-b-0">' + porcentaje+' Libres</p></div></div></div>';
                    // Cargo la lista con las torres obtenidas
                    $('#listaTorres').append(htmlProyectoLista);
                }
            } else {
                notificacion('Ha ocurrido un error inerperado: [' + data.responseText + ']', 'danger');
            }
        },
        error: function (jqXHR, exception) {
            app.ajaxError(jqXHR, exception);
        }
    });
}

// Obtiene todas las unidades por torre seleccionada
function obtenerUnidades(idTorre) {
    var htmlUnidadesLista = "";
    var pisoActual = "0";
    var htmlPiso, htmlUnidades = "";
    var flagNewTr = parseInt(0);
    var htmlTablaFinal = "";
    var nuevoTr = false;
    //Llamada al método obtenerProyectos desde el controlador
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: "GET",
        cache: false,
        url: document.location.origin + '/Home/obtenerUnidades',
        data: { "idTorre": idTorre },
        success: function (data) {
            if (data.success) {
                // Limpio la tabla
                $('#tablaUnidades tbody').html("");
                // Convierto a JSON
                var proyecto = JSON.parse(data.responseText); // Estado: N Y C
                // Recorro los datos y los voy cargando
                for (var i = 0; i < proyecto.length; i++) {
                    var numero = proyecto[i].numero;
                    var piso = proyecto[i].piso;
                    var estado = proyecto[i].estado;
                    var tipo = proyecto[i].tipo;
                    nuevoTr = false;
                    //alert("NO ENTRO " + pisoActual + " --- " + piso);
                    // Si el piso es diferente a la actual, crear html donde se muestra el numero de Piso
                    if (pisoActual != piso) {
                        
                        if (flagNewTr == 0) {
                            //alert("PISO " + piso);
                            htmlPiso = '<tr class="Pisos"><td class="text-center text-white bg-c-purple ">' +
                                '<i class="fas fa-building mat-icon f-24"></i><h6>Piso ' + piso + '</h6></td>';
                        } else {
                            //alert("FIN PISO " + piso);
                            htmlTablaFinal = htmlPiso + htmlUnidades + "</tr>";
                            $('#tablaUnidades tbody').append(htmlTablaFinal);
                            htmlTablaFinal = "";
                            htmlPiso = "";
                            htmlUnidades = "";
                            flagNewTr = 0;
                            nuevoTr = true;
                        }
                        flagNewTr++;
                    }
                    if (!nuevoTr) {
                        //alert("DEPARTAMENTOS DEL PISO " + piso);
                        htmlUnidades += '<td id="und-' + numero+'" class="text-center text-white bg-c-yellow Asignados pointDash">'+
                        '<i class="fas fa-close text-c-red mat-icon f-24"></i><h6>' + numero+'</h6></td>';
                        htmlUnidadesLista = "";
                        pisoActual = piso;
                    }
                }
                // Cargo la lista con las unidades obtenidas
                //$('#tablaUnidades tbody').prepend(htmlUnidadesLista);
                $('#tablaUnidades tbody').append(htmlUnidadesLista);
            } else {
                notificacion('Ha ocurrido un error inerperado: [' + data.responseText + ']', 'danger');
            }
        },
        error: function (jqXHR, exception) {
            app.ajaxError(jqXHR, exception);
        }
    });
}