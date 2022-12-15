export default class Pedido {
    constructor(monto,direccion,fecha,idUsuario,restaurantes){
        this.monto = monto;
        this.direccion =direccion;
        this.fecha = fecha;
        this.idUsuario = idUsuario;
        this.restaurantes = restaurantes;
    }
}