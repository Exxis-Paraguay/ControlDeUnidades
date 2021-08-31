// Variables Globales
var _nombreProy, _nombreTorre = "";
var _idProy, _idTorre = "0";
var filtrosSeleccionados = "";
$(document).ready(function () {
    /*
     * LLAMADA A FUNCIONES ===============================================================================
     */
    obtenerProyectos();
    
    
    /*
     * CSS ===============================================================================
     */

    
    // Ocultar modal
    $("#dialogInfoUnidad").css("display", "none");
    // Ocultar Sector Unidades
    $("#sector-unidades").css("display", "none");
    // Ocultar todas las torres
    $(".torre").css("display", "none");
    // Crear breadcrumb
    breadcrumb('home');

    /*
     * EVENTOS ===============================================================================
     */

    var ratonParado = null;
    var milisegundosLimite = 900000;// 15 minutos //1800000; //30 minutos
    // Controla el vencimiento de la sesion
    $(document).on('mousemove', function () {
        clearTimeout(ratonParado);

        ratonParado = setTimeout(function () {
            //refrescar()
            logout();
        }, milisegundosLimite);
    });
    // ------------------------------------- click ----------------------------------------------------
    // Ocultar menu lateral
    $("#mobile-collapse").click();
    //Evento click sobre los proyectos desde dashboard principal y menu
    $('body').on('click', '.item, .liProyNom a', function () {
        obtenerEstados();
        var idProy = $(this).attr('id').split('-')[1];
        _nombreProy = $("#" + $(this).attr('id') + " .nombres").text();
        _idProy = idProy;

        $(".torre").css("display", "none");
        $(".seccion-buscar-torre").css("display", "inline");
        $("#sector-unidades").css("display", "inline");
        $("#sector-proyectos").css("display", "none");

        $(".buscador").val("");
        // Obtengo las torres del proyecto seleccionado
        obtenerTorres(idProy);
        // Crear breadcrumb
        breadcrumb('proyecto');
    });
    //Evento click sobre las torres
    $('body').on('click', '.item-torre', function () {
        var idTorre = $(this).attr('id').split('-')[1];
        _nombreTorre = $("#" + $(this).attr('id') + " .nombres-torre").text();
        _idTorre = idTorre;
        // Asignar el nombre al titulo de las unidades
        $("#tituloUnidades").text("Proyecto: " + _nombreProy + " - Torre: " + _nombreTorre);
        // Asignar el titulo al modal
        $("#tituloModalUnidad").text(_nombreProy + " - " + _nombreTorre);

        $("#torre1").css("display", "inline");
        $(".seccion-buscar-torre").css("display", "none");
        $("#buscador-torre").val("");
        obtenerUnidades(idTorre);
        // Crear breadcrumb
        breadcrumb('unidad');
    });
    // Click sobre unidad aparece modal
    $('body').on('click', '.pointDash', function () {

        //var idUnidad = $("#idUni-" + $.trim($(this).attr("id")) + " input").val();
        var idUnidad = $("#idUni-" + $.trim($(this).attr("id")).split('und-')[1]).val();
        var estado = $("#estado-" + $.trim($(this).attr("id").split('und-')[1])).val();
        obtenerInfoUnidades(idUnidad, estado);
        $("#dialogInfoUnidad").dialog();
    });
    // Evento click de cerrar modal
    $("#btnCerrarModalInfo").click(function () {
        $("#dialogInfoUnidad").dialog('close');
        return false;
    });
    // Evento click del boton volver de la pantalla filtro por torre
    $("#btnVolverProyectos").click(function () {
        _idProy = "0";
        _idTorre = "0";
        $("#sector-unidades").css("display", "none");
        $("#sector-proyectos").css("display", "inline");
        $(".buscador").val("");
        // Crear breadcrumb
        breadcrumb('home');
    });
    $("#buscadorLat").click(function () {
        return false;
    });
    // Evento click del boton volver de la pantalla unidades
    $("#btnVolverFiltroTorres").click(function () {
        _idTorre = "0";
        macroproyectosDatos(_idProy, _idTorre);
        $(".torre").css("display", "none");
        $(".seccion-buscar-torre").css("display", "inline");
        // Crear breadcrumb
        breadcrumb('proyecto');
        return false;
    });

    /*
     * BUSCADORES ===============================================================================
     */
    // Buscador Proyecto
    $('.buscador').keyup(function () {
        $(".torre").css("display", "none");
        $(".seccion-buscar-torre").css("display", "inline");
        $("#sector-unidades").css("display", "none");
        $("#sector-proyectos").css("display", "inline");

        // Crear breadcrumb
        breadcrumb('home');
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
    
    var conSel = parseInt(0);
    // Filtro Pisos/Cocheras/Bauleras
    $('.filtro-articulo-tipo input.form-check-input').click(function () {
        // recorro filtro de pisos
        var cont = parseInt(0);
        var cont2 = parseInt(0);
        //oculto todo
        $(".Departamentos , .Cocheras, .Bauleras, .motos").css("display", "none");
        $(".Libre, .Asignado, .Reservado, .Formalizado, .Protocolizado, .Entregado, .Arrendados, .Hipotecado").css("display", "none");
        var classw = "";

        filtrosSeleccionados = "";
        conSel = 0;
        //por cada filtro seleccionado se muestra
        $(".cbPCB :checkbox:checked").each(function () {
            if (conSel == 0) filtrosSeleccionados += $(this).val();
            else filtrosSeleccionados += "," + $(this).val();

            macroproyectosDatos(_idProy, _idTorre);// Agregado

            conSel++;
            //alert("classw 0 " + $(this).val() + " filtrosSeleccionados " + filtrosSeleccionados);
            classw = $(this).val();
            $("." + $(this).val()).removeAttr("style");
            
            cont++;
            $(".cbEstados :checkbox:checked").each(function () {
                $("." + $(this).val().split('/')[0] + "." + classw).removeAttr("style");
                cont2++;
            });
            if (cont2 == 0) $("." + classw).removeAttr("style");
            //alert("filtrosSeleccionados " + filtrosSeleccionados);
        });
        // Si no se selecciono ningun filtro, se muestra todo

        var cntFlag = parseInt(0);
        // Si no se selecciono ningun filtro, se muestra todo
        if (cont == 0) {
            $(".cbEstados :checkbox:checked").each(function () {
                $("." + $(this).val().split('/')[0]).removeAttr("style");
                cntFlag++;
            });
            if (cntFlag == 0) $(".Departamentos , .Cocheras, .Bauleras, .motos").removeAttr("style");
        }
    });

    // Filtro Estado
    $('body').on('click', '.filtro-estado input.form-check-input', function () {
        // recorro filtro de estados
        var cont = parseInt(0);
        var cont2 = parseInt(0);
        //oculto todo
        $(".Departamentos , .Cocheras, .Bauleras, .motos").css("display", "none");
        $(".Libre, .Asignado, .Reservado, .Formalizado, .Protocolizado, .Entregado, .Arrendados, .Hipotecado").css("display", "none");
        var classw = "";
        //por cada filtro seleccionado se muestra
        $(".cbEstados :checkbox:checked").each(function () {
            //$("." + $(this).val().split('/')[0]).removeAttr("style");
            classw = $(this).val();
            cont++;
            $(".cbPCB :checkbox:checked").each(function () {
                $("." + $(this).val().split('/')[0] + "." + classw).removeAttr("style");
                alert("classw 1 " + $(this).val());
                //filtrosSeleccionados += $(this).val();
                cont2++;
            });
            if (cont2 == 0) $("." + classw).removeAttr("style");
            //alert("filtrosSeleccionados " + filtrosSeleccionados);
        });
        var cntFlag = parseInt(0);
        // Si no se selecciono ningun filtro, se muestra todo
        if (cont == 0) {
            $(".cbPCB :checkbox:checked").each(function () {
                $("." + $(this).val().split('/')[0]).removeAttr("style");
                alert("classw 2 " + $(this).val());
                //filtrosSeleccionados += $(this).val();
                cntFlag++;
            });
            //alert("filtrosSeleccionados " + filtrosSeleccionados);
            if (cntFlag == 0) $(".Libre, .Asignado, .Reservado, .Formalizado, .Protocolizado, .Entregado, .Arrendados, .Hipotecado").removeAttr("style");
        }


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

//Recargar pagina
function refrescar() {
    //Actualiza la página
    location.reload();
}

/*
* FUNCIONES ===============================================================================
*/

// Obtiene todos los proyectos activos
function obtenerProyectos() {
    //Llamada al método obtenerProyectos desde el controlador
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: "GET",
        cache: false,
        url: document.location.origin + '/Home/obtenerProyectos',
        data: {},
        success: function (data) {
            if (data.success) {
                // Limpio la lista
                $('#listaProyectos, #menuProyectos').html("");
                // Convierto a JSON
                var proyecto = JSON.parse(data.responseText);
                // Recorro los datos y los voy cargando
                for (var i = 0; i < proyecto.length; i++) {
                    var cod = proyecto[i].Proyecto;
                    var nombre = proyecto[i].Proyecto;
                    var porcentaje = proyecto[i].CantLibre;
                    var htmlProyectoLista = '<div id="proyList-' + cod + '" class="col-md-2 item"><div class="card text-center order-visitor-card"><div class="card-block texto">' +
                        '<h6 class="m-b-0"><label class="nombres">Proyecto ' + nombre + '</label></h6><p></p><h4 class="m-t-15 m-b-15">' +
                        '<i class="fas fa-building m-r-15"></i></h4><p class="m-b-0">' + porcentaje + ' Libres</p></div> </div></div>';
                    var htmlProyectoMenu = '<li class="liProyNom"><a id="proyMenu-' + cod + '" href="#" class="waves-effect waves-dark"><span class="pcoded-micon"><i class="ti-angle-right"></i></span>' +
                        '<span class="pcoded-mtext nombres">Proyecto ' + nombre + '</span><span class="pcoded-mcaret"></span></a></li>';
                    // Cargo la lista con los proyectos obtenidos
                    $('#listaProyectos').append(htmlProyectoLista);
                    // Cargo la lista con los proyectos en el menu
                    $('#menuProyectos').append(htmlProyectoMenu);
                }
            } else {
                notificacion('Ha ocurrido un error inesperado: [' + data.responseText + ']', 'danger');
            }
        },
        error: function (jqXHR, exception) {
            app.ajaxError(jqXHR, exception);
        }
    });
}

// Obtiene todas las torres por proyectos seleccionado
function obtenerTorres(idProyecto) {
    macroproyectosDatos(idProyecto, '0');
    //Llamada al método obtenerTorres desde el controlador
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: "GET",
        cache: false,
        url: document.location.origin + '/Home/obtenerTorres',
        data: { "idProyecto": "'" + idProyecto + "'" },
        success: function (data) {
            if (data.success) {
                // Limpio la lista
                $('#listaTorres').html("");
                // Convierto a JSON
                var proyecto = JSON.parse(data.responseText);
                // Recorro los datos y los voy cargando
                for (var i = 0; i < proyecto.length; i++) {
                    var cod = proyecto[i].Torre;
                    var cantLibre = proyecto[i].CantLibre;
                    var htmlProyectoLista = '<div id="torre-' + cod + '" class="col-md-2 item-torre"><div class="card text-center order-visitor-card">' +
                        '<div class="card-block texto-torre"><h6 class="m-b-0"><label class="nombres-torre">Torre# ' + cod + '</label></h6><p></p>' +
                        '<h4 class="m-t-15 m-b-15"><i class="fas fa-building m-r-15"></i></h4><p class="m-b-0">' + cantLibre + ' Libres</p></div></div></div>';
                    // Cargo la lista con las torres obtenidas
                    $('#listaTorres').append(htmlProyectoLista);
                }
            } else {
                notificacion('Ha ocurrido un error inesperado: [' + data.responseText + ']', 'danger');
            }
        },
        error: function (jqXHR, exception) {
            app.ajaxError(jqXHR, exception);
        }
    });
}

// Obtiene todas las unidades por torre seleccionada
function obtenerUnidades(idTorre) {
    macroproyectosDatos(_idProy, idTorre);
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
        data: { "idTorre": "'" + idTorre + "'", "idProyecto": "'" + _idProy + "'" },
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
                    var estadoCod = proyecto[i].estado;
                    var estado = "";
                    var classEstado = "";
                    var iconEstado = "";
                    var iconVencido = "";
                    var tipoCod = proyecto[i].tipo;
                    var tipoUnidDes = proyecto[i].tipoUnidDes;
                    var vencido = proyecto[i].vencido;
                    var tipo = "";
                    nuevoTr = false;
                    if (vencido == "S") iconVencido = '<i class="fas fa-info text-c-white mat-icon f-24"></i>';
                    // Control case para estados
                    switch (estadoCod) {
                        case '01':
                            estado = "Libre";
                            classEstado = "bg-c-green";
                            break;
                        case '02':
                            estado = "Asignado";
                            classEstado = "bg-c-yellow";
                            iconEstado = '<i class="fas fa-close text-c-red mat-icon f-24"></i>';
                            break;
                        case '03':
                            estado = "Reservado";
                            classEstado = "bg-pink";
                            break;
                        case '04':
                            estado = "Formalizado";
                            classEstado = "bg-c-red";
                            break;
                        case '05':
                            estado = "Protocolizado";
                            classEstado = "bg-c-blue";
                            break;
                        case '06':
                            estado = "Hipotecado";
                            classEstado = "bg-secondary";
                            break;
                        case '07':
                            estado = "Arrendados";
                            classEstado = "bg-naranja";
                            break;
                        case '08':
                            estado = "Entregado";
                            classEstado = "bg-purpura";
                            break;
                        default:
                    }
                    // Control case para tipos
                    switch (tipoCod) {
                        case '101':
                            tipo = "Piso";
                            break;
                        default:
                    }

                    /*switch (tipoUnid) {
                        case '01':
                            tipo = "Piso";
                            break;
                        case '02':
                            tipo = "Piso";
                            break;
                        case '02':
                            tipo = "Piso";
                            break;
                        default:
                    }*/

                    // Si el piso es diferente a la actual, crear html donde se muestra el numero de Piso
                    if (pisoActual != piso) {
                        if (flagNewTr == 0) {
                            htmlPiso = '<tr class="Pisos"><td class="text-center text-white bg-c-purple tipo-unidad">' +
                                '<i class="fas fa-building mat-icon f-24"></i><h6>' + tipo + ' ' + piso.toUpperCase() + '</h6></td>';
                            flagNewTr++;
                        } else {
                            htmlTablaFinal = htmlPiso + htmlUnidades + "</tr>";
                            // Cargo la tabla con las unidades obtenidas
                            $('#tablaUnidades tbody').prepend(htmlTablaFinal);
                            htmlTablaFinal = "";
                            htmlPiso = "";
                            htmlUnidades = "";
                            flagNewTr = 0;
                            nuevoTr = true;
                            pisoActual = "0";
                            // primer depto del nuevo piso
                            htmlUnidades += '<td id="und-' + numero.replace(/ /g, '') + '" class="text-center text-white ' + classEstado + ' ' + estado + ' ' + tipoUnidDes + ' pointDash">' +
                                '<h6>' + numero + '</h6>' + iconEstado + iconVencido+ '<input type="hidden" id="idUni-' + numero.replace(/ /g, '') + '" name="custId" value="' + numero + '"> <input type="hidden" id="estado-' + numero.replace(/ /g, '') + '" value="' + estado + '"></td>';
                        }
                    }
                    if (!nuevoTr) {
                        htmlUnidades += '<td id="und-' + numero.replace(/ /g, '') + '" class="text-center text-white ' + classEstado + ' ' + estado + ' ' + tipoUnidDes + ' pointDash">' +
                            '<h6>' + numero + '</h6>' + iconEstado + iconVencido+'<input type="hidden" id="idUni-' + numero.replace(/ /g, '') + '" name="custId" value="' + numero + '"><input type="hidden" id="estado-' + numero.replace(/ /g, '') + '" value="' + estado + '"></td>';
                        pisoActual = piso;
                        if ((proyecto.length - 1) == i) {
                            htmlTablaFinal = htmlPiso + htmlUnidades + "</tr>";
                            // Cargo la tabla con las unidades obtenidas
                            $('#tablaUnidades tbody').prepend(htmlTablaFinal);
                        }
                    }
                }
            } else {
                notificacion('Ha ocurrido un error inesperado: [' + data.responseText + ']', 'danger');
            }
        },
        error: function (jqXHR, exception) {
            app.ajaxError(jqXHR, exception);
        }
    });
}

// Arma el breadcrumb de l pagina
function breadcrumb(page) {
    $('#breadcrumbPrin').html("");
    var bd0 = '<li class="breadcrumb-item"><a href="index.html"> <i class="fa fa-home"></i> </a></li>';
    var bd1 = '<li class="breadcrumb-item"><a href="#!">' + _nombreProy + '</a></li>';
    var bd2 = '<li class="breadcrumb-item"><a href="#!">' + _nombreTorre + '</a></li>';
    var bd3 = '<li class="breadcrumb-item"><a href="#!">Unidades</a></li>';

    // Control case para estados
    switch (page) {
        case 'home':
            $('#breadcrumbPrin').append(bd0);
            break;
        case 'proyecto':
            $('#breadcrumbPrin').append(bd0 + bd1);
            break;
        case 'torre':
            $('#breadcrumbPrin').append(bd0 + bd1 + bd2);
            break;
        case 'unidad':
            $('#breadcrumbPrin').append(bd0 + bd1 + bd2 + bd3);
            break;
        default:
    }
}

// Obtiene la información de la unidad seleccionada
function obtenerInfoUnidades(idUnidad, estado) {
    //idUnidad = "2 - 11";
    //Llamada al método obtenerProyectos desde el controlador
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: "GET",
        cache: false,
        url: document.location.origin + '/Home/obtenerInfoUnidades',
        data: { "idUnidad": idUnidad },
        success: function (data) {
            if (data.success) {
                var documentos = JSON.parse(data.responseText); // Estado: N Y C
                var ofertaVentaCount = parseInt(0);
                var textoCount = parseInt(0);
                var formalCount = parseInt(0);
                var libreCount = parseInt(0);
                var liInfoLibres = "";
                var docuLibres = "";
                //Vaciar pestañas
                $("#liInfoDes").html("");
                // Titulo modal
                $("#tituloModalUnidad").html("");
                $("#tituloModalUnidad").append("<h5>" + _nombreProy + " - " + _nombreTorre + "</h5>");
                $("#tituloModalUnidad").append("<span><b>Departamento:</b> " + idUnidad + "</span>");
                $(".tab-titulo, .tab-descr").css('display', 'none');
                $('#tblModalDocumentos tbody').html("");
                $(".titDocModal").html("");
                $(".info-estado-modal").html("");
                for (var i = 0; i < documentos.length; i++) {
                    var tipoDoc = documentos[i].TipoDoc;
                    var cliente = documentos[i].Cliente;
                    var vendedor = documentos[i].Vendedor;
                    var fechaVenta = documentos[i].FechaVenta;
                    var montoDpto = documentos[i].MontoDpto;
                    var nroDocumento = documentos[i].NroFactura;
                    var montoTotalFactura = documentos[i].MontoTotalFactura;
                    var moneda = documentos[i].Moneda;
                    var fechaVenci = documentos[i].FechaVenci;
                    var vencido = documentos[i].Vencido;
                    switch (estado) {
                        /*
                        si esta libre: ver las ofertas vinculadas a distintos clientes, el plan de pagos, el vendedor, 
                        monto, fecha, tipologia del departamento(con esto el vendedor ya sabe las caracteristicas)
                        * */
                        case 'Libre': // plan de pago
                            //alert("entro en libres " + tipoDoc);
                            if (tipoDoc == "Ofertas de ventas") {
                                var docu = "Oferta de venta";
                                if (libreCount == 0 && fechaVenta.split(' ')[0].length > 0) {
                                    $(".tab-titulo, .tab-descr").removeAttr('style');//css('display', 'inline');
                                    // Pestaña Informacion
                                    $('.titDocModal').append("<h5>" + tipoDoc + "</h5>");
                                    liInfoLibres = //'<li class="list-group-item"><i class="fas fa-user mat-icon f-14"></i> Cliente: ' + cliente + '</li>'+
                                        '<li class="list-group-item"><i class="fas fa-briefcase mat-icon f-14"></i> Vendedor: ' + vendedor + '</li>' +
                                        '<li class="list-group-item"><i class="fas fa-calendar mat-icon f-14"></i> Fecha: ' + fechaVenta.split(' ')[0] + '</li>' +
                                        '<li class="list-group-item"><i class="fa fa-money mat-icon f-14"></i> Monto: ' + moneda + ' ' + separadorMiles(montoDpto.replace(',', '.')) + '</li>';
                                    libreCount++;
                                }
                                

                                if (separadorMiles(montoTotalFactura.replace(',', '.')) != "0,00") {
                                    // Pestaña Documentos relacionados
                                    docuLibres += '<tr><td><div class="d-inline-block align-middle">' +
                                        '<div class="d-inline-block"><p class="text-muted m-b-0">' + docu + ' Nro: ' + nroDocumento + '</p></div></div></td>' +
                                        '<td class="text-left">' + cliente + '</td>' +
                                        '<td class="text-right">' + moneda + ' ' + separadorMiles(montoTotalFactura.replace(',', '.')) + '</td> </tr>';
                                }

                                // Agregar pestañas al modal
                                $("#liInfoDes").append(liInfoLibres);
                                $(".est-unidad-modal").html("");
                                $(".est-unidad-modal").append('<h6>Unidad Libre</h6>');
                                liInfoLibres = "";
                                ofertaVentaCount++;
                            }
                            break;
                        /*
                         si esta asignado: orden de venta con su doc num, solo 1 doc vinculado ya que una persona lo 
                         compro, con que monto cerro, el vendedor que cerro la venta, la fecha
                         */
                        case 'Asignado':
                            if (tipoDoc == "Orden de venta") {
                                var docuTitu = "Orden de venta";
                                var docu = "";
                                $(".tab-titulo, .tab-descr").removeAttr('style');//css('display', 'inline');
                                // Pestaña Informacion
                                $('.titDocModal').append("<h5>" + tipoDoc + "</h5>");
                                var liInfo = //'<li class="list-group-item"><i class="fas fa-user mat-icon f-14"></i> Cliente: ' + cliente + '</li>'+
                                    '<li class="list-group-item"><i class="fas fa-briefcase mat-icon f-14"></i> Vendedor: ' + vendedor + '</li>' +
                                    '<li class="list-group-item"><i class="fas fa-calendar mat-icon f-14"></i> Fecha: ' + fechaVenta.split(' ')[0] + '</li>' +
                                    '<li class="list-group-item"><i class="fa fa-money mat-icon f-14"></i> Monto: ' + moneda + ' ' + separadorMiles(montoDpto.replace(',', '.')) + '</li>';
                                if (separadorMiles(montoTotalFactura.replace(',', '.')) != "0,00") {
                                    // Pestaña Documentos relacionados
                                    docu = '<tr><td><div class="d-inline-block align-middle"><i class="far fa-file-alt text-c-red f-24"></i>' +
                                        '<div class="d-inline-block"><p class="text-muted m-b-0">' + docuTitu + ' Nro: ' + nroDocumento + '</p></div></div></td>' +
                                        '<td class="text-right"><h6 class="f-w-700">' + moneda + ' '+ separadorMiles(montoTotalFactura.replace(',', '.')) + '</h6> </td> </tr>';
                                }

                                //alert("liInfo " + liInfo);
                                // Agregar pestañas al modal
                                $("#liInfoDes").append(liInfo);
                                $('#tblModalDocumentos tbody').append(docu);
                                $(".est-unidad-modal").html("");
                                $(".est-unidad-modal").append('<h6>Unidad Asignada</h6>');
                            }
                            break;
                        /*
                         si esta formalizado: factura de reserva(acepta la facturacion total del departamento) o acuerdo globar de ventas(pago a cuotas) ver los datos 
                         del cliente, fecha, importe, docnum
                         */
                        case 'Formalizado':
                            if (tipoDoc == "Factura" || tipoDoc == "Acuerdo global de ventas") {
                                var vencidoFch = "";
                                if (tipoDoc == "Factura") {
                                    vencidoFch = '<td></td>';
                                }
                                var docuTitu = "Factura y/o Acuerdo global de ventas";
                                $(".tab-titulo, .tab-descr").removeAttr('style');//css('display', 'inline');
                                var liInfo = "";
                                var docu = "";
                                //alert(documentos[i].Cliente + " -*- " + cliente.length);
                                if (formalCount == 0 && cliente.length > 0) {
                                    // Pestaña Informacion
                                    $('.titDocModal').append("<h5>" + docuTitu + "</h5>");
                                    liInfo = '<li class="list-group-item"><i class="fas fa-user mat-icon f-14"></i> Cliente: ' + cliente + '</li>' +
                                        //'<li class="list-group-item"><i class="fas fa-briefcase mat-icon f-14"></i> Vendedor: ' + vendedor + '</li>' +
                                        '<li class="list-group-item"><i class="fas fa-calendar mat-icon f-14"></i> Fecha: ' + fechaVenta.split(' ')[0] + '</li>' +
                                        '<li class="list-group-item"><i class="fa fa-money mat-icon f-14"></i> Monto: ' + moneda + ' '+ separadorMiles(montoDpto.replace(',', '.')) + '</li>';
                                    formalCount++;
                                }
                                if (separadorMiles(montoTotalFactura.replace(',', '.')) != "0,00") {
                                    // Pestaña Documentos relacionados
                                    docu = '<tr><td><div class="d-inline-block align-middle"><i class="far fa-file-alt text-c-red f-24"></i>' +
                                        '<div class="d-inline-block"><p class="text-muted m-b-0">' + tipoDoc + ' Nro: ' + nroDocumento + '</p></div></div></td>' +
                                        '<td class="text-right"><h6 class="f-w-700">' + moneda + ' ' + separadorMiles(montoTotalFactura.replace(',', '.')) + '</h6> </td> </tr>';
                                }

                                // Agregar pestañas al modal
                                $("#liInfoDes").append(liInfo);
                                $('#tblModalDocumentos tbody').append(docu);
                                $(".est-unidad-modal").html("");
                                $(".est-unidad-modal").append('<h6>Unidad Formalizada</h6>');
                            }
                            break;
                        case 'Reservado':
                            $(".est-unidad-modal").html("");
                            //if (estado.charAt(cadena.length - 1) == 'o') estado = estado.slice(0, -1) + 'a';
                            if (textoCount == 0) $('.contenido-modal').prepend('<h5 class="info-estado-modal text-center">Unidad Reservada</h5>'); //.slice(0, -1)
                            textoCount++;
                            break;
                        case 'Protocolizado':
                            $(".est-unidad-modal").html("");
                            if (textoCount == 0) $('.contenido-modal').prepend('<h5 class="info-estado-modal text-center">Unidad Protocolizada</h5>'); // .slice(0, -1)
                            textoCount++;
                            break;
                        /*
                         si esta status entregado: documento de entrega en base a la factura de reserva, con acuerdo globar el 
                         documento de entrega, se vincula como otro tipo de documento, ya que si es por factura, como es cuota 
                         el monto sera mayor, ver cliente fecha monto y vendedor
                         */
                        case 'Entregado':
                            if (tipoDoc == "Documento de Entrega") {
                                var docuTitu = "Documento de Entrega";
                                $(".tab-titulo, .tab-descr").removeAttr('style');//css('display', 'inline');
                                var liInfo = "";
                                var docu = "";
                                //alert(documentos[i].Cliente + " -*- " + cliente.length);
                                if (formalCount == 0 && cliente.length > 0) {
                                    // Pestaña Informacion
                                    $('.titDocModal').append("<h5>" + docuTitu + "</h5>");
                                    liInfo = '<li class="list-group-item"><i class="fas fa-user mat-icon f-14"></i> Cliente: ' + cliente + '</li>' +
                                        '<li class="list-group-item"><i class="fas fa-briefcase mat-icon f-14"></i> Vendedor: ' + vendedor + '</li>' +
                                        '<li class="list-group-item"><i class="fas fa-calendar mat-icon f-14"></i> Fecha: ' + fechaVenta.split(' ')[0] + '</li>' +
                                        '<li class="list-group-item"><i class="fa fa-money mat-icon f-14"></i> Monto: ' + moneda + ' ' + separadorMiles(montoDpto.replace(',', '.')) + '</li>';
                                    formalCount++;
                                }
                                if (separadorMiles(montoTotalFactura.replace(',', '.')) != "0,00") {
                                    // Pestaña Documentos relacionados
                                    docu = '<tr><td><div class="d-inline-block align-middle"><i class="far fa-file-alt text-c-red f-24"></i>' +
                                        '<div class="d-inline-block"><p class="text-muted m-b-0">' + tipoDoc + ' Nro: ' + nroDocumento + '</p></div></div></td>' +
                                        '<td class="text-right"><h6 class="f-w-700">' + moneda + ' ' + separadorMiles(montoTotalFactura.replace(',', '.')) + '</h6> </td> </tr>';
                                }

                                // Agregar pestañas al modal
                                $("#liInfoDes").append(liInfo);
                                $('#tblModalDocumentos tbody').append(docu);
                                $(".est-unidad-modal").html("");
                                $(".est-unidad-modal").append('<h6>Unidad Entregada</h6>');
                            }
                            break;
                        /*
                         si es alquilado: articulo de tipo servicio, con campos en el detalle de acuerdo al global de ventas, 
                         mostrar docnum del acuerdo global de ventas, monto, cliente, vendedor
                         */
                        case 'Arrendados':
                            if (tipoDoc == "Acuerdo global de ventas") {
                                var docuTitu = tipoDoc;
                                var docu = "";
                                $(".tab-titulo, .tab-descr").removeAttr('style');//css('display', 'inline');
                                // Pestaña Informacion
                                $('.titDocModal').append("<h5>" + tipoDoc + "</h5>");
                                var liInfo = '<li class="list-group-item"><i class="fas fa-user mat-icon f-14"></i> Cliente: ' + cliente + '</li>' +
                                    '<li class="list-group-item"><i class="fas fa-briefcase mat-icon f-14"></i> Vendedor: ' + vendedor + '</li>' +
                                    //'<li class="list-group-item"><i class="fas fa-calendar mat-icon f-14"></i> Fecha: ' + fechaVenta.split(' ')[0] + '</li>' +
                                    '<li class="list-group-item"><i class="fa fa-money mat-icon f-14"></i> Monto: ' + moneda + ' ' + separadorMiles(montoDpto.replace(',', '.')) + '</li>';
                                if (separadorMiles(montoTotalFactura.replace(',', '.')) != "0,00") {
                                    // Pestaña Documentos relacionados
                                    docu = '<tr><td><div class="d-inline-block align-middle"><i class="far fa-file-alt text-c-red f-24"></i>' +
                                        '<div class="d-inline-block"><p class="text-muted m-b-0">' + docuTitu + ' Nro: ' + nroDocumento + '</p></div></div></td>' +
                                        '<td class="text-right"><h6 class="f-w-700">' + moneda + ' ' + separadorMiles(montoTotalFactura.replace(',', '.')) + '</h6> </td> </tr>';
                                }

                                //alert("liInfo " + liInfo);
                                // Agregar pestañas al modal
                                $("#liInfoDes").append(liInfo);
                                $('#tblModalDocumentos tbody').append(docu);
                                $(".est-unidad-modal").html("");
                                $(".est-unidad-modal").append('<h6>Unidad Arrendada</h6>');
                            }
                            break;
                        case 'Hipotecado':
                            $(".est-unidad-modal").html("");
                            if (textoCount == 0) $('.contenido-modal').prepend('<h5 class="info-estado-modal text-center">Unidad Hipotecada</h5>');
                            textoCount++;
                            break;
                        default:
                    }
                }
                // Si existe mas de una Oferta de venta por Cliente en el estado Libre
                if (ofertaVentaCount > 0) $('#tblModalDocumentos tbody').append(docuLibres);
                ofertaVentaCount = 0;
                textoCount = 0;
                formalCount = 0;
                libreCount = 0;
            } else {
                notificacion('Ha ocurrido un error inesperado: [' + data.responseText + ']', 'danger');
            }
        },
        error: function (jqXHR, exception) {
            app.ajaxError(jqXHR, exception);
        }
    });
}

// Arma el macroproyecto
function macroproyectosDatos(idProy, idTorre) {
    // Datos por proyecto .datos-por-proyecto
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: "GET",
        async: false,
        cache: false,
        url: document.location.origin + '/Home/obtenerMacroproyectoAll',
        data: { "idProy": idProy, "idTorre": "0", "idTipoUnidad": filtrosSeleccionados },
        success: function (data) {
            if (data.success) {
                // Limpio la lista
                $('.indiceMacroPorProy, .promediosTotalesProy').html("");
                // Convierto a JSON
                var proyecto = JSON.parse(data.responseText);
                var total = parseInt(0);
                var totalPromPropio = parseInt(0);
                var totalPromTot = parseInt(0);
                var countPromedioM2 = parseInt(0);
                // Recorro los datos y los voy cargando
                for (var i = 0; i < proyecto.length; i++) {
                    var estado = proyecto[i].estado;
                    var cantidad = parseInt(proyecto[i].cantidad);
                    var promVendidoPropio = proyecto[i].promedioVendidoPropio;
                    var promVendidoTotalM2 = proyecto[i].promedioVendidoTotalM2;
                    var porcentaje = (proyecto[i].porcentaje);//.toFixed(2);
                    total += parseInt(cantidad);
                    
                    //if (estado != "Libre" && estado != "Asignado") {


                    if (parseInt(promVendidoTotalM2) > 0) {
                        
                        countPromedioM2 += cantidad;
                        totalPromPropio += parseInt(promVendidoPropio);
                        totalPromTot += parseInt(promVendidoTotalM2);
                    }
                    //}
                    var classEstado = "";
                    // Control case para estados
                    switch (estado) {
                        case 'Libre':
                            classEstado = "text-c-green";
                            break;
                        case 'Asignado':
                            classEstado = "text-c-yellow";
                            break;
                        case 'Formalizado':
                            classEstado = "text-c-red";
                            break;
                        case 'Reservado':
                            classEstado = "text-c-orenge";
                            break;
                        case 'Protocolizado':
                            classEstado = "text-c-blue";
                            break;
                        case 'Entregado':
                            classEstado = "text-purpura";
                            break;
                        case 'Arrendados/Alquilados':
                            classEstado = "text-naranja";
                            break;
                        case 'Hipotecado':
                            classEstado = "text-secondary";
                            break;
                        default:
                    }
                    //alert(estado + " " + classEstado);
                    var htmlMacroPorTorre = '<div class="col-sm-4 b-r-default p-b-20 p-t-20"><div class="row align-items-center text-center">' +
                        '<div class="col-4 p-r-0"><i class="fas fa-building ' + classEstado + ' f-24"></i>' +
                        '</div><div class="col-8 p-l-0"><h6>' + estado + '</h6><h6 class="m-b-30 f-w-700">' +
                        'Nro ' + cantidad + '<span class="' + classEstado + ' m-l-10">' + porcentaje + '%</span></h6></div></div></div>';

                    // Cargo la lista con las torres obtenidas
                    $('.indiceMacroPorProy').append(htmlMacroPorTorre);
                }
                htmlMacroPorTorre = '<div class="col-sm-4 b-r-default p-b-20 p-t-20"> <div class="row align-items-center text-center">' +
                    '<div class="col-12 p-l-0"><h5>Total</h5><h5 class="m-b-30 f-w-700">' + total + '</h5></div></div></div>';

                $('.indiceMacroPorProy').append(htmlMacroPorTorre);
                var totalPromPropioHtml = parseInt(0);
                var totalPromTotHtml = parseInt(0);
                if (countPromedioM2 == 0) {
                    totalPromPropioHtml = 0;
                    totalPromTotHtml = 0;
                } else {
                    totalPromPropioHtml = separadorMiles(totalPromPropio / countPromedioM2);
                    totalPromTotHtml = separadorMiles(totalPromTot / countPromedioM2);
                }
                //alert("venta total " + totalPromPropioHtml + " metros 2 " + totalPromTotHtml);
                htmlMacroPorTorre = '<div class="col-sm-6 b-r-default p-b-20 p-t-20"><div class="row align-items-center text-center">' +
                    '<div class="col-4 p-r-0"><i class="fas fa-signal text-c-red f-24"></i></div>' +
                    '<div class="col-8 p-l-0"><span>Precio Base Promedio Vendido</span><h5>' + totalPromPropioHtml + '</h5> </div></div> </div>' +
                    '<div class="col-sm-6 b-r-default p-b-20 p-t-20"><div class="row align-items-center text-center">' +
                    '<div class="col-4 p-r-0"><i class="fas fa-signal text-c-red f-24"></i></div>' +
                    '<div class="col-8 p-l-0"><span>Precio Base Promedio Vendido Metros</span><h5>' + totalPromTotHtml + '</h5> </div></div> </div>';

                //$('.promediosTotalesProy').append(htmlMacroPorTorre);
                htmlMacroPorTorre = "";
            } else {
                notificacion('Ha ocurrido un error inesperado: [' + data.responseText + ']', 'danger');
            }
        },
        error: function (jqXHR, exception) {
            app.ajaxError(jqXHR, exception);
        }
    });

    // Datos por torre .datos-por-proyecto
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: "GET",
        async: false,
        cache: false,
        url: document.location.origin + '/Home/obtenerMacroproyecto',
        data: { "idProy": idProy, "idTorre": idTorre, "idTipoUnidad": "01" },
        success: function (data) {
            if (data.success) {
                // Limpio la lista
                $('.indiceMacroPorTorre, .promediosTotalesTorres').html("");
                // Convierto a JSON
                var proyecto = JSON.parse(data.responseText);
                var total = parseInt(0);
                var totalPromPropio = parseInt(0);
                var totalPromTot = parseInt(0);
                var countPromedioM2 = parseInt(0);
                // Recorro los datos y los voy cargando
                for (var i = 0; i < proyecto.length; i++) {
                    
                    var estado = proyecto[i].estado;
                    var cantidad = parseInt(proyecto[i].cantidad);
                    var promVendidoPropio = proyecto[i].promedioVendidoPropio;
                    var promVendidoTotalM2 = proyecto[i].promedioVendidoTotalM2;
                    var porcentaje = (proyecto[i].porcentaje);
                    
                    total += parseInt(cantidad);
                    
                    if (parseInt(promVendidoTotalM2) > 0) {

                        countPromedioM2 += cantidad;
                        totalPromPropio += parseInt(promVendidoPropio);
                        totalPromTot += parseInt(promVendidoTotalM2);
                    }
                    var classEstado = "";
                    // Control case para estados
                    switch (estado) {
                        case 'Libre':
                            classEstado = "text-c-green";
                            break;
                        case 'Asignado':
                            classEstado = "text-c-yellow";
                            break;
                        case 'Formalizado':
                            classEstado = "text-c-red";
                            break;
                        case 'Reservado':
                            classEstado = "text-c-orenge";
                            break;
                        case 'Protocolizado':
                            classEstado = "text-c-blue";
                            break;
                        case 'Entregado':
                            classEstado = "text-purpura";
                            break;
                        case 'Arrendados/Alquilados':
                            classEstado = "text-naranja";
                            break;
                        case 'Hipotecado':
                            classEstado = "text-secondary";
                            break;
                        default:
                    }
                    var htmlMacroPorTorre = '<div class="col-sm-4 b-r-default p-b-20 p-t-20"><div class="row align-items-center text-center">' +
                        '<div class="col-4 p-r-0"><i class="fas fa-building ' + classEstado + ' f-24"></i>' +
                        '</div><div class="col-8 p-l-0"><h6>' + estado + '</h6><h6 class="m-b-30 f-w-700">' +
                        'Nro ' + cantidad + '<span class="' + classEstado + ' m-l-10">' + porcentaje + '%</span></h6></div></div></div>';

                    // Cargo la lista con las torres obtenidas
                    $('.indiceMacroPorTorre').append(htmlMacroPorTorre);
                }
                htmlMacroPorTorre = '<div class="col-sm-4 b-r-default p-b-20 p-t-20"> <div class="row align-items-center text-center">' +
                    '<div class="col-12 p-l-0"><h5>Total</h5><h5 class="m-b-30 f-w-700">' + total + '</h5></div></div></div>';

                $('.indiceMacroPorTorre').append(htmlMacroPorTorre);
                var totalPromPropioHtml = parseInt(0);
                var totalPromTotHtml = parseInt(0);
                if (countPromedioM2 == 0) {
                    totalPromPropioHtml = 0;
                    totalPromTotHtml = 0;
                } else {
                    totalPromPropioHtml = separadorMiles(totalPromPropio / countPromedioM2);
                    totalPromTotHtml = separadorMiles(totalPromTot / countPromedioM2);
                }
                htmlMacroPorTorre = '<div class="col-sm-6 b-r-default p-b-20 p-t-20"><div class="row align-items-center text-center">' +
                    '<div class="col-4 p-r-0"><i class="fas fa-signal text-c-red f-24"></i></div>' +
                    '<div class="col-8 p-l-0"><span>Precio Base Promedio Vendido</span><h5>' + totalPromPropioHtml + '</h5> </div></div> </div>' +
                    '<div class="col-sm-6 b-r-default p-b-20 p-t-20"><div class="row align-items-center text-center">' +
                    '<div class="col-4 p-r-0"><i class="fas fa-signal text-c-red f-24"></i></div>' +
                    '<div class="col-8 p-l-0"><span>Precio Base Promedio Vendido Metros</span><h5>' + totalPromTotHtml + '</h5> </div></div> </div>';

                //$('.promediosTotalesTorres').append(htmlMacroPorTorre);
                htmlMacroPorTorre = "";
            } else {
                notificacion('Ha ocurrido un error inesperado: [' + data.responseText + ']', 'danger');
            }
        },
        error: function (jqXHR, exception) {
            app.ajaxError(jqXHR, exception);
        }
    });


    // ALL ============================================================================================================================================


    $.ajax({
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: "GET",
        async: false,
        cache: false,
        url: document.location.origin + '/Home/obtenerMacroproyectoAll',
        data: { "idProy": idProy, "idTorre": "0", "idTipoUnidad": "01" },
        success: function (data) {
            if (data.success) {
                // Limpio la lista
                //$('.indiceMacroPorProy').html("");
                // Convierto a JSON
                var proyecto = JSON.parse(data.responseText);
                var total = parseInt(0);
                var totalPromPropio = parseInt(0);
                var totalPromTot = parseInt(0);
                var countPromedioM2 = parseInt(0);
                // Recorro los datos y los voy cargando
                for (var i = 0; i < proyecto.length; i++) {
                    var estado = proyecto[i].estado;
                    var cantidad = parseInt(proyecto[i].cantidad);
                    var promVendidoPropio = proyecto[i].promedioVendidoPropio;
                    var promVendidoTotalM2 = proyecto[i].promedioVendidoTotalM2;
                    var porcentaje = (proyecto[i].porcentaje);//.toFixed(2);
                    total += parseInt(cantidad);

                    //if (estado != "Libre" && estado != "Asignado") {


                    if (parseInt(promVendidoTotalM2) > 0) {

                        countPromedioM2 += cantidad;
                        totalPromPropio += parseInt(promVendidoPropio);
                        totalPromTot += parseInt(promVendidoTotalM2);
                    }
                }
                var totalPromPropioHtml = parseInt(0);
                var totalPromTotHtml = parseInt(0);
                if (countPromedioM2 == 0) {
                    totalPromPropioHtml = 0;
                    totalPromTotHtml = 0;
                } else {
                    totalPromPropioHtml = separadorMiles(totalPromPropio / countPromedioM2);
                    totalPromTotHtml = separadorMiles(totalPromTot / countPromedioM2);
                }
                //alert("venta total " + totalPromPropioHtml + " metros 2 " + totalPromTotHtml);
                htmlMacroPorTorre = '<div class="col-sm-6 b-r-default p-b-20 p-t-20"><div class="row align-items-center text-center">' +
                    '<div class="col-4 p-r-0"><i class="fas fa-signal text-c-red f-24"></i></div>' +
                    '<div class="col-8 p-l-0"><span>Precio Base Promedio Vendido</span><h5>' + totalPromPropioHtml + '</h5> </div></div> </div>' +
                    '<div class="col-sm-6 b-r-default p-b-20 p-t-20"><div class="row align-items-center text-center">' +
                    '<div class="col-4 p-r-0"><i class="fas fa-signal text-c-red f-24"></i></div>' +
                    '<div class="col-8 p-l-0"><span>Precio Base Promedio Vendido Metros</span><h5>' + totalPromTotHtml + '</h5> </div></div> </div>';

                $('.promediosTotalesProy').append(htmlMacroPorTorre);
                htmlMacroPorTorre = "";
            } else {
                notificacion('Ha ocurrido un error inesperado: [' + data.responseText + ']', 'danger');
            }
        },
        error: function (jqXHR, exception) {
            app.ajaxError(jqXHR, exception);
        }
    });

    // Datos por torre .datos-por-proyecto
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: "GET",
        async: false,
        cache: false,
        url: document.location.origin + '/Home/obtenerMacroproyectoAll',
        data: { "idProy": idProy, "idTorre": idTorre, "idTipoUnidad": "01" },
        success: function (data) {
            if (data.success) {
                // Limpio la lista
                //$('.indiceMacroPorTorre, .promediosTotalesTorres').html("");
                // Convierto a JSON
                var proyecto = JSON.parse(data.responseText);
                var total = parseInt(0);
                var totalPromPropio = parseInt(0);
                var totalPromTot = parseInt(0);
                var countPromedioM2 = parseInt(0);
                // Recorro los datos y los voy cargando
                for (var i = 0; i < proyecto.length; i++) {

                    var estado = proyecto[i].estado;
                    var cantidad = parseInt(proyecto[i].cantidad);
                    var promVendidoPropio = proyecto[i].promedioVendidoPropio;
                    var promVendidoTotalM2 = proyecto[i].promedioVendidoTotalM2;
                    var porcentaje = (proyecto[i].porcentaje);

                    total += parseInt(cantidad);

                    if (parseInt(promVendidoTotalM2) > 0) {

                        countPromedioM2 += cantidad;
                        totalPromPropio += parseInt(promVendidoPropio);
                        totalPromTot += parseInt(promVendidoTotalM2);
                    }
                    
                }
                var totalPromPropioHtml = parseInt(0);
                var totalPromTotHtml = parseInt(0);
                if (countPromedioM2 == 0) {
                    totalPromPropioHtml = 0;
                    totalPromTotHtml = 0;
                } else {
                    totalPromPropioHtml = separadorMiles(totalPromPropio / countPromedioM2);
                    totalPromTotHtml = separadorMiles(totalPromTot / countPromedioM2);
                }
                htmlMacroPorTorre = '<div class="col-sm-6 b-r-default p-b-20 p-t-20"><div class="row align-items-center text-center">' +
                    '<div class="col-4 p-r-0"><i class="fas fa-signal text-c-red f-24"></i></div>' +
                    '<div class="col-8 p-l-0"><span>Precio Base Promedio Vendido</span><h5>' + totalPromPropioHtml + '</h5> </div></div> </div>' +
                    '<div class="col-sm-6 b-r-default p-b-20 p-t-20"><div class="row align-items-center text-center">' +
                    '<div class="col-4 p-r-0"><i class="fas fa-signal text-c-red f-24"></i></div>' +
                    '<div class="col-8 p-l-0"><span>Precio Base Promedio Vendido Metros</span><h5>' + totalPromTotHtml + '</h5> </div></div> </div>';

                $('.promediosTotalesTorres').append(htmlMacroPorTorre);
                htmlMacroPorTorre = "";
            } else {
                notificacion('Ha ocurrido un error inesperado: [' + data.responseText + ']', 'danger');
            }
        },
        error: function (jqXHR, exception) {
            app.ajaxError(jqXHR, exception);
        }
    });

}

// Obtiene todos los proyectos activos
function obtenerEstados() {
    //Llamada al método obtenerProyectos desde el controlador
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: "GET",
        async: false,
        cache: false,
        url: document.location.origin + '/Home/obtenerEstados',
        data: {},
        success: function (data) {
            if (data.success) {
                // Limpio la lista
                $('.cbEstados').html("");
                // Convierto a JSON
                var _estados = JSON.parse(data.responseText);
                // Recorro los datos y los voy cargando
                for (var i = 0; i < _estados.length; i++) {
                    var estado = _estados[i].nombre;
                    var chkHtml = '<div class="col-sm-2"><div class="form-check form-check-inline">' +
                        '<input class="form-check-input" type="checkbox" id="cb' + _estados[i].nombre.split('/')[0] + '" value="' + estado + '">' +
                        '<label class="form-check-label" for="cb' + _estados[i].nombre.split('/')[0] + '">' + estado + '</label></div></div>';
                    $('.cbEstados').append(chkHtml);
                }
            } else {
                notificacion('Ha ocurrido un error inesperado: [' + data.responseText + ']', 'danger');
            }
        },
        error: function (jqXHR, exception) {
            app.ajaxError(jqXHR, exception);
        }
    });
}

// https://es.stackoverflow.com/questions/82651/separador-de-miles-con-javascript-php-o-jquery
function separadorMiles(num) {
    if (!num || num == 'NaN') return '-';
    if (num == 'Infinity') return '&#x221e;';
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num))
        num = "0";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10)
        cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + '.' + num.substring(num.length - (4 * i + 3));
    return (((sign) ? '' : '-') + num + ',' + cents);
}