pragma solidity ^0.4.24;

import "./Bibliotecario.sol";

contract Usuario is Bibliotecario {

    struct EstructuraUsuario {
        string nombre;
        uint indice;
    }
  
    mapping(address => EstructuraUsuario) private mapeoEstructuraUsuario;
    address[] private arregloDeCuentasUsuario;

    

    event LogUsuarioCreado(address indexed cuenta, string nombre);
    event LogUsuarioEditado(address indexed cuenta, string nombreAnterior, string nombreNuevo);
    event LogUsuarioEliminado(address indexed cuenta, string nombreEliminado);
    
    
    function existenciaUsuario(address cuenta)
        public view
        returns(bool existencia) 
    {
        if(arregloDeCuentasUsuario.length == 0) return false;
        return (arregloDeCuentasUsuario[mapeoEstructuraUsuario[cuenta].indice] == cuenta);
    }

    function insertarUsuario(
        address cuenta, 
        string nombre) 
        public
        returns(bool exito)
    {
        require(!existenciaUsuario(cuenta),"Usuario ya existe");
        //if(existenciaUsuario(cuenta)) revert("Usuario ya existe"); 
        mapeoEstructuraUsuario[cuenta].nombre = nombre;
        mapeoEstructuraUsuario[cuenta].indice = arregloDeCuentasUsuario.push(cuenta)-1;
        emit LogUsuarioCreado(cuenta, nombre);
        return true;
    }

    function obtenerUsuario(address cuenta)
        public view
        returns(string nombre)
    {
        require(existenciaUsuario(cuenta),"Usuario no existe");
        //if(!existenciaUsuario(cuenta)) revert("Usuario no existe"); 
        return mapeoEstructuraUsuario[cuenta].nombre;
    }

    function editarUsuario(string nombreNuevo, address cuenta)
        public
        returns(bool exito)
    {
        require(existenciaUsuario(cuenta),"Usuario no existe");
        //if(!existenciaUsuario(cuenta)) revert("Usuario no existe");
        require(comprobarBibliotecario(msg.sender), "Usted no posee el rol bibliotecario");
        string memory nombreAnterior = mapeoEstructuraUsuario[cuenta].nombre;
        mapeoEstructuraUsuario[cuenta].nombre = nombreNuevo;
        emit LogUsuarioEditado(cuenta, nombreAnterior, nombreNuevo);
        return true;
    }

    function eliminarUsuario(address cuenta) 
    public
        returns(bool exito)
    {
        require(existenciaUsuario(cuenta),"Usuario no existe");
        //if(!existenciaUsuario(cuenta)) revert("Usuario no existe");
        string memory nombreEliminado = mapeoEstructuraUsuario[cuenta].nombre;
        uint filaAEliminar = mapeoEstructuraUsuario[cuenta].indice;
        address claveAMover = arregloDeCuentasUsuario[arregloDeCuentasUsuario.length-1];
        arregloDeCuentasUsuario[filaAEliminar] = claveAMover;
        mapeoEstructuraUsuario[claveAMover].indice = filaAEliminar; 
        arregloDeCuentasUsuario.length--;
        emit LogUsuarioEliminado(cuenta, nombreEliminado);
        return true;
    }

    
}