var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};



socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrarChat', usuario, function(resp) {
        // console.log('Usuarios conectados', resp);
        renderizarUsuarios(resp);
        renderizarModal(resp);
    });

});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});

// Escuchar información
socket.on('crearMensaje', function(mensaje) {
    renderizarMensaje(mensaje, false, false);
    scrollBottom();
});

socket.on('mensajePrivado', function(mensaje) {

    $('#popup' + mensaje.persona).modal('show');

    enviarForm(mensaje.persona);

    renderizarMensaje(mensaje, false, true);

    var divChatboxPrivado2 = '#divChatboxPrivado' + mensaje.persona;
    scrollBottomPrivado(divChatboxPrivado2);

});

// Escuchar cambios de usuarios
// cuando un usuario entra o sale del chat
socket.on('listaPersona', function(personas) {
    renderizarUsuarios(personas);
    renderizarModal(personas);
});

/*// Mensajes privados
socket.on('mensajePrivado', function(mensaje) {

    console.log('Mensaje Privado:', mensaje);

});*/