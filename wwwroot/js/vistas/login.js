$(document).ready(function () {
    // Cuando el foco este sobre el campo user o pass, el texto de error desaparecera
    $("#txtPass, #txtUser").focus(function () {
        $("#lbMsgLogin").text("");
    });
    // Evento click sobre boton login
    $("#btnLogin").click(function () {
        login();
    });
    // Evento click sobre boton login
    $(".logout").click(function () {
        logout();
    });
});

/*
 * Realiza el login para ingresar al Dashboard
 */
function login() {
    //Llamada al metodo Login
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: "GET",
        cache: false,
        url: document.location.origin + '/Login/login',
        data: { "user": $("#txtUser").val(), "pass": $("#txtPass").val() },//JSON.stringify({ "user": $("#txtUser").val(), "pass": $("#txtPass").val() }),//datos,
        success: function (data) {
            if (!data.success) $("#lbMsgLogin").text(data.responseText);
            else window.location.replace(document.location.origin+"/home");
        },
        error: function (jqXHR, exception) {
            app.ajaxError(jqXHR, exception);
        },
        complete: function () {
        }
    });
}

/*
 * Realiza el logout y redirecciona a la pagina de login
 */
function logout() {
    //Llamada al metodo Logout
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: "GET",
        cache: false,
        url: document.location.origin + '/Login/logout',
        data: { },//JSON.stringify({ "user": $("#txtUser").val(), "pass": $("#txtPass").val() }),//datos,
        success: function (data) {
            if (data.success) window.location.replace(document.location.origin + "/login");
        },
        error: function (jqXHR, exception) {
            app.ajaxError(jqXHR, exception);
        },
        complete: function () {
        }
    });
}