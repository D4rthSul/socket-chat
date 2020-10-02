const { io } = require('../server');

const { Usuarios } = require('../classes/usuarios');

const usuarios = new Usuarios();

const { crearMensaje, crearMensajePrivado } = require('../utilidades/utilidades');


io.on('connection', (client) => {

    client.on('entrarChat', (usuario, callback) => {

        if (!usuario.nombre || !usuario.sala) {
            return callback({
                error: true,
                message: 'El nombre y la sala son necesarios.'
            });
        }

        client.join(usuario.sala);

        let personas = usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala);

        client.broadcast.to(usuario.sala).emit('listaPersona', usuarios.getPersonaPorSala(usuario.sala));

        client.broadcast.to(usuario.sala).emit('crearMensaje', crearMensaje('Administrador', `${usuario.nombre} entró al chat.`));

        callback(usuarios.getPersonaPorSala(usuario.sala));

    });

    client.on('crearMensaje', (data, callback) => {

        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

        callback(mensaje);

    });

    client.on('disconnect', () => {

        let personaBorrada = usuarios.borrarPersona(client.id);

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} abandonó el chat.`));

        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonaPorSala(personaBorrada.sala));

    });

    client.on('mensajePrivado', (data, callback) => {

        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensajePrivado(data.id, persona.nombre, data.mensaje, client.id);

        client.broadcast.to(data.id).emit('mensajePrivado', mensaje);

        callback(mensaje);

    });

});