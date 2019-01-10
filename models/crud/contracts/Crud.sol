pragma solidity ^0.4.24;

contract Crud {

    struct EstructuraUsuario {
        bytes32 correo;
        uint edad;
        uint indice;
    }
  
    mapping(address => EstructuraUsuario) private mapeoEstructura;
    address[] private arregloDeCuentas;

    event LogNuevoUsuario(address indexed cuenta, uint indice, bytes32 correo, uint edad);
    event LogActualizarUsuario(address indexed cuenta, uint indice, bytes32 correo, uint edad);
    event LogEliminarUsuario(address indexed cuenta, uint indice);

    function existencia(address cuenta)
    public 
    view
        returns(bool existe) 
    {
        if(arregloDeCuentas.length == 0) return false;
        return (arregloDeCuentas[mapeoEstructura[cuenta].indice] == cuenta);
    }

    function insertarUsuario(
        address cuenta, 
        bytes32 correo, 
        uint edad) 
    public
        returns(uint indice)
    {
        if(existencia(cuenta)) revert(); 
        mapeoEstructura[cuenta].correo = correo;
        mapeoEstructura[cuenta].edad = edad;
        mapeoEstructura[cuenta].indice = arregloDeCuentas.push(cuenta)-1;
        emit LogNuevoUsuario(
            cuenta, 
            mapeoEstructura[cuenta].indice, 
            correo, 
            edad);
        return arregloDeCuentas.length-1;
    }

    function eliminarUsuario(address cuenta) 
    public
        returns(uint indice)
    {
        if(!existencia(cuenta)) revert(); 
        uint filaAEliminar = mapeoEstructura[cuenta].indice;
        address claveAMover = arregloDeCuentas[arregloDeCuentas.length-1];
        arregloDeCuentas[filaAEliminar] = claveAMover;
        mapeoEstructura[claveAMover].indice = filaAEliminar; 
        arregloDeCuentas.length--;
        emit LogEliminarUsuario(
            cuenta, 
            filaAEliminar);
        emit LogActualizarUsuario(
            claveAMover, 
            filaAEliminar, 
            mapeoEstructura[claveAMover].correo, 
            mapeoEstructura[claveAMover].edad);
        return filaAEliminar;
    }

    function obtenerUsuario(address cuenta)
    public 
    view
    returns(bytes32 correo, uint edad, uint indice)
    {
        if(!existencia(cuenta)) revert(); 
        return(
            mapeoEstructura[cuenta].correo, 
            mapeoEstructura[cuenta].edad, 
            mapeoEstructura[cuenta].indice);
    } 

    function actualizarCorreo(address cuenta, bytes32 correo) 
    public
        returns(bool exito) 
    {
        if(!existencia(cuenta)) revert(); 
        mapeoEstructura[cuenta].correo = correo;
        emit LogActualizarUsuario(
            cuenta, 
            mapeoEstructura[cuenta].indice,
            correo, 
            mapeoEstructura[cuenta].edad);
        return true;
    }

    function actualizarEdad(address cuenta, uint edad) 
    public
        returns(bool exito) 
    {
        if(!existencia(cuenta)) revert(); 
        mapeoEstructura[cuenta].edad = edad;
        emit LogActualizarUsuario(
            cuenta, 
            mapeoEstructura[cuenta].indice,
            mapeoEstructura[cuenta].correo, 
            edad);
        return true;
    }

    function cantidadUsuarios() 
    public
    view
        returns(uint count)
    {
        return arregloDeCuentas.length;
    }

    function obtenerUsuarioPorIndice(uint indice)
    public
    view
        returns(address cuenta)
    {
        return arregloDeCuentas[indice];
    }

    function cuentasUsuarios()
    public
    view
        returns(address[])
    {
        return arregloDeCuentas;
    }

}