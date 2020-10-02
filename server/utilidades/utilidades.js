const crearMensaje = (nombre, mensaje) => {

    return {
        nombre,
        mensaje,
        fecha: new Date().getTime()
    };

};

const crearMensajePrivado = (id, nombre, mensaje, persona) => {

    return {
        id,
        nombre,
        mensaje,
        persona,
        fecha: new Date().getTime()
    };

};

module.exports = {
    crearMensaje,
    crearMensajePrivado
}