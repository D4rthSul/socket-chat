var params = new URLSearchParams(window.location.search);

var nombre = params.get('nombre');
var sala = params.get('sala');

// referencias de jQuery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');
var modales = $('#modales');

// Funciones para renderizar usuarios
function renderizarUsuarios(personas) {

    console.log(personas);

    var html = '';

    html += '<li>';
    html += '<a href="javascript:void(0)" class="active"> Chat de <span> ' + params.get('sala') + '</span></a>';
    html += '</li>';

    for (var i = 0; i < personas.length; i++) {

        html += '<li>';
        if (personas[i].nombre === nombre) {
            html += '<a href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + '<small class="text-success">online</small></span></a>';
        } else {
            html += '<a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + '<small class="text-success">online</small></span></a>';
        }
        html += '</li>';

    }

    divUsuarios.html(html);

}

// Funciones para renderizar modal
function renderizarModal(personas) {

    console.log(personas);

    var html = '';

    for (var i = 0; i < personas.length; i++) {

        html += '    <div class="modal fade" id="popup' + personas[i].id + '" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="popup' + personas[i].id + 'Label" aria-hidden="true">';
        html += '    <div class="modal-dialog modal-sm modal-lg modal-xl">';
        html += '        <div class="modal-content">';
        html += '            <div class="modal-header">';
        html += '                <h5 class="modal-title" id="popup' + personas[i].id + 'Label">' + personas[i].nombre + '</h5>';
        html += '                <button type="button" class="close" data-dismiss="modal" aria-label="Close">';
        html += '            <span aria-hidden="true">&times;</span>';
        html += '          </button>';
        html += '            </div>';
        html += '            <div class="modal-body">';
        html += '                <ul class="chat-list p-20" id="divChatboxPrivado' + personas[i].id + '">';

        html += '                </ul>';
        html += '            </div>';
        html += '            <div class="modal-footer">';
        html += '                <div class="card-body b-t">';
        html += '                    <form id="formEnviarPrivado' + personas[i].id + '" class="formEnviarPrivado">';
        html += '                        <div class="row">';
        html += '                            <div class="col-8">';
        html += '                                <input data-id="' + personas[i].id + '" autocomplete="off" type="text" placeholder="Escribe tu mensaje aquí" class="txtMensajePrivado form-control b-0" autofocus>';
        html += '                            </div>';
        html += '                            <div class="col-4 text-right">';
        html += '                                <button id="enviar' + personas[i].id + '" type="submit" class="btn btn-info btn-circle btn-lg"><i class="fa fa-paper-plane-o"></i> </button>';
        html += '                            </div>';
        html += '                        </div>';
        html += '                    </form>';
        html += '                </div>';
        html += '            </div>';
        html += '        </div>';
        html += '    </div>';
        html += '</div>';

    }

    modales.html(html);

}

function renderizarMensaje(mensaje, yo, privado) {

    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();

    var adminClass = 'info';

    if (mensaje.nombre === 'Administrador') {
        adminClass = 'danger';
    }

    var html = '';

    if (yo) {

        html += '<li class="reverse">';
        html += '<div class="chat-content">';
        html += '<h5>' + mensaje.nombre + '</h5>';
        html += '<div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '</div>';
        html += '<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '<div class="chat-time">' + hora + '</div>';
        html += '</li>';

    } else {

        html += '<li class="animated fadeIn">';

        if (mensaje.nombre !== 'Administrador') {
            html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }

        html += '<div class="chat-content">';
        html += '<h5>' + mensaje.nombre + '</h5>';
        html += '<div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '</div>';
        html += '<div class="chat-time">' + hora + '</div>';
        html += '</li>';

    }

    if (privado) {
        if (yo) {
            var divChatboxPrivado2 = $('#divChatboxPrivado' + mensaje.id);
            divChatboxPrivado2.append(html);
        } else {
            var divChatboxPrivado = $('#divChatboxPrivado' + mensaje.persona);
            divChatboxPrivado.append(html);
        }

    } else {
        divChatbox.append(html);
    }

}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

function scrollBottomPrivado(divChatboxPrivado) {

    // selectors
    var newMessage = $(divChatboxPrivado).children('li:last-child');

    // heights
    var clientHeight = $(divChatboxPrivado).prop('clientHeight');
    var scrollTop = $(divChatboxPrivado).prop('scrollTop');
    var scrollHeight = $(divChatboxPrivado).prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        $(divChatboxPrivado).scrollTop(scrollHeight);
    }
}

function enviarForm(id) {

    var formEnviarPrivado = $('#formEnviarPrivado' + id);

    formEnviarPrivado.on('submit', function(e) {

        e.preventDefault();


        var txtMensajePrivado = $(this).find('.txtMensajePrivado');
        var id = txtMensajePrivado.data('id');

        // console.log(id);

        if (txtMensajePrivado.val().trim().length === 0) {
            return;
        }

        // Enviar información
        socket.emit('mensajePrivado', {
            id: id,
            nombre: nombre,
            mensaje: txtMensajePrivado.val()

        }, function(mensaje) {
            txtMensajePrivado.val('').focus();
            renderizarMensaje(mensaje, true, true);

            var divChatboxPrivado = '#divChatboxPrivado' + mensaje.id;
            scrollBottomPrivado(divChatboxPrivado);

        });

        $(this).die();

    });

}

// Escuchas de jQuery
divUsuarios.on('click', 'a', function(e) {

    var id = $(this).data('id');

    if (id) {
        $('#popup' + id).modal('show');

        enviarForm(id);
    }

});

formEnviar.on('submit', function(e) {

    e.preventDefault();

    if (txtMensaje.val().trim().length === 0) {
        return;
    }

    // Enviar información
    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMensaje.val()

    }, function(mensaje) {
        txtMensaje.val('').focus();
        renderizarMensaje(mensaje, true, false);
        scrollBottom();
    });


});