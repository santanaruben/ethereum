pragma solidity ^0.4.24;

import "./Usuario.sol";
import "./ERC721Enumerable.sol";

contract Libro is Usuario, ERC721Enumerable {

    struct EstructuraLibro {
        string nombre;
        string autor;
        uint8 estado;
        address poseedor;
        bool prestado;
        address ultimaPersonaConElLibro;
        uint indice;
    }
  
    mapping(uint => EstructuraLibro) private mapeoEstructuraLibro;
    uint[] private arregloDeCuentasLibro;

    event LogLibroCreado(uint indexed id, address indexed cuentaBibliotecario, string bibliotecario, string nombre, string autor, uint8 estado, address indexed poseedor, string nombrePoseedor);
    event LogLibroEditado(uint indexed id, address indexed cuentaBibliotecario, string bibliotecario, string nombreAnterior, string nombreNuevo, string autorAnterior,  string autorNuevo, uint8 estadoAnterior, uint8 estadoNuevo);
    event LogLibroEliminado(uint indexed id, address indexed cuentaBibliotecario, string bibliotecario, string nombreLibroEliminado);
    
    event LogPropiedadLibro(uint indexed id, address indexed poseedorAnterior, address indexed poseedorNuevo, string nombrePoseedorAnterior, string nombrePoseedorNuevo);
    event LogLibroPrestado(uint indexed id, address indexed cuentaBibliotecario, address indexed cuenta, string bibliotecario, string nombre, string autor, string ultimaPersonaConElLibro, uint8 estado);
    event LogLibroDevuelto(uint indexed id, address indexed cuentaBibliotecario, string bibliotecario, uint8 estadoAnterior, uint8 estadoNuevo);
    event LogLibroDanado(uint indexed id, address indexed cuentaBibliotecario, string bibliotecario, uint8 estadoAnterior, uint8 estadoNuevo);
    event LogLibroReparado(uint indexed id, address indexed cuentaBibliotecario, string bibliotecario, uint8 estadoAnterior, uint8 estadoNuevo);

    function existenciaLibro(uint id)
        public view
        returns(bool existencia) 
    {
        if(arregloDeCuentasLibro.length == 0) return false;
        return (arregloDeCuentasLibro[mapeoEstructuraLibro[id].indice] == id);
    }

    function agregarLibro(
        uint id, 
        string nombre,
        string autor,
        uint8 estado,
        address poseedor) 
        public
        returns (bool exito)
    {
        require(comprobarBibliotecario(msg.sender), "Usted no posee el rol bibliotecario");
        require(poseedor != 0, "Poseedor no puede ser igual a 0");
        require(!existenciaLibro(id),"Libro ya existe");
        mapeoEstructuraLibro[id].nombre = nombre;
        mapeoEstructuraLibro[id].autor = autor;
        mapeoEstructuraLibro[id].estado = estado;
        mapeoEstructuraLibro[id].poseedor = poseedor;
        mapeoEstructuraLibro[id].prestado = false;
        mapeoEstructuraLibro[id].indice = arregloDeCuentasLibro.push(id)-1;
        
        string memory nombrePoseedor = obtenerUsuario(poseedor);
        address poseedorAnterior = 0;
        string memory nombrePoseedorAnterior = "";
        
        _mint(id);
        _addTokenTo(poseedor, id);

        emit LogPropiedadLibro(id, poseedorAnterior, poseedor, nombrePoseedorAnterior, nombrePoseedor);
        emit LogLibroCreado(id, msg.sender, obtenerUsuario(msg.sender), nombre, autor, estado, poseedor, obtenerUsuario(poseedor));
        return true;
    }

    function obtenerLibro(uint id)
        public view
        returns(string nombre, string autor, uint8 estado, string poseedor, string ultimaPersona, bool prestado)
    {
        require(existenciaLibro(id),"Libro no existe");
        if (mapeoEstructuraLibro[id].ultimaPersonaConElLibro == 0)
        ultimaPersona = "";
        else
        ultimaPersona = obtenerUsuario(mapeoEstructuraLibro[id].ultimaPersonaConElLibro);

        return(
                mapeoEstructuraLibro[id].nombre, 
                mapeoEstructuraLibro[id].autor, 
                mapeoEstructuraLibro[id].estado,
                obtenerUsuario(mapeoEstructuraLibro[id].poseedor),
                ultimaPersona,
                mapeoEstructuraLibro[id].prestado);
    }

    function funcionLibroEstadoNuevo(uint id)
        private view
        returns (bool nuevoReparado)
    {
        if ((mapeoEstructuraLibro[id].estado == 1)
            || (mapeoEstructuraLibro[id].estado == 2))
            return true;
    }
    
    function funcionLibroEstadoDanado(uint8 _estadoDanado)
        private pure
        returns (bool nuevoReparado)
    {
        if ((_estadoDanado == 3) || (_estadoDanado == 4))
            return true;
    }

    function editarLibro(
        uint id, 
        string nombreNuevo,
        string autorNuevo,
        uint8 estadoNuevo) 
        public
        returns(bool exito)
    {
        require(comprobarBibliotecario(msg.sender), "Usted no posee el rol bibliotecario");
        require(existenciaLibro(id),"Libro no existe");
        string memory nombreAnterior = mapeoEstructuraLibro[id].nombre;
        mapeoEstructuraLibro[id].nombre = nombreNuevo;
        string memory autorAnterior = mapeoEstructuraLibro[id].autor;
        mapeoEstructuraLibro[id].autor = autorNuevo;
        uint8 estadoAnterior = mapeoEstructuraLibro[id].estado;
        mapeoEstructuraLibro[id].estado = estadoNuevo;
        if(funcionLibroEstadoNuevo(id))
            if(funcionLibroEstadoDanado(estadoNuevo))
                emit LogLibroDanado(id, msg.sender, obtenerUsuario(msg.sender), estadoAnterior, estadoNuevo);
        emit LogLibroEditado(id, msg.sender, obtenerUsuario(msg.sender), nombreAnterior, nombreNuevo, autorAnterior, autorNuevo, estadoAnterior,estadoNuevo);
        return true;
    }

    function eliminarLibro(uint id) 
        public
        returns(bool exito)
    {
        require(comprobarBibliotecario(msg.sender), "Usted no posee el rol bibliotecario");
        require(existenciaLibro(id),"Libro no existe");
        uint filaAEliminar = mapeoEstructuraLibro[id].indice;
        address poseedor = mapeoEstructuraLibro[id].poseedor;
        string memory nombreLibroEliminado = mapeoEstructuraLibro[id].nombre;
        uint claveAMover = arregloDeCuentasLibro[arregloDeCuentasLibro.length-1];
        arregloDeCuentasLibro[filaAEliminar] = claveAMover;
        mapeoEstructuraLibro[claveAMover].indice = filaAEliminar; 
        arregloDeCuentasLibro.length--;

        _burn(id);
        _removeTokenFrom(poseedor, id);

        emit LogLibroEliminado(id, msg.sender, obtenerUsuario(msg.sender), nombreLibroEliminado);
        return true;
    }

    function transferirPropiedadLibro(uint id, address poseedorNuevo)
        public
        returns(bool exito)
    {
        if(!existenciaLibro(id)) revert("Libro no existe");
        require(msg.sender == mapeoEstructuraLibro[id].poseedor, "Usted no es el dueño del libro");
        require(poseedorNuevo != 0, "Poseedor no puede ser igual a 0");
        address poseedorAnterior = mapeoEstructuraLibro[id].poseedor;
        string memory nombrePoseedorAnterior = obtenerUsuario(poseedorAnterior);
        mapeoEstructuraLibro[id].poseedor = poseedorNuevo;
        string memory nombrePoseedorNuevo = obtenerUsuario(poseedorNuevo);

        _removeTokenFrom(poseedorAnterior, id);
        _addTokenTo(poseedorNuevo, id);

        emit LogPropiedadLibro(id, poseedorAnterior, poseedorNuevo, nombrePoseedorAnterior, nombrePoseedorNuevo);
        return true;
    }

    function prestarLibro(uint id, address cuenta)
        public
        returns(bool exito)
    {
        require(comprobarBibliotecario(msg.sender), "Usted no posee el rol bibliotecario");
        require(existenciaLibro(id),"Libro no existe");
        require(mapeoEstructuraLibro[id].prestado == false, "El libro ya está prestado");
        require(cuenta != 0, "Cuenta no puede ser igual a 0");
        mapeoEstructuraLibro[id].prestado = true;
        mapeoEstructuraLibro[id].ultimaPersonaConElLibro = cuenta;
        emit LogLibroPrestado(id, cuenta, msg.sender, obtenerUsuario(msg.sender), mapeoEstructuraLibro[id].nombre, mapeoEstructuraLibro[id].autor, obtenerUsuario(cuenta), mapeoEstructuraLibro[id].estado);
        return true;
    }

    function devolverLibro(uint id, uint8 estadoNuevo)
        public
        returns(bool exito)
    {
        require(comprobarBibliotecario(msg.sender), "Usted no posee el rol bibliotecario");
        require(existenciaLibro(id),"Libro no existe");
        require(mapeoEstructuraLibro[id].prestado == true, "El libro no está prestado");
        mapeoEstructuraLibro[id].prestado = false;
        uint8 estadoAnterior = mapeoEstructuraLibro[id].estado;
        mapeoEstructuraLibro[id].estado = estadoNuevo;
        if(funcionLibroEstadoNuevo(id))
            if(funcionLibroEstadoDanado(estadoNuevo))
                emit LogLibroDanado(id, msg.sender, obtenerUsuario(msg.sender), estadoAnterior, estadoNuevo);
        emit LogLibroDevuelto(id, msg.sender, obtenerUsuario(msg.sender), estadoAnterior, estadoNuevo);
        return true;
    }

    function repararLibro(uint id)
        public
        returns(bool exito)
    {
        require(comprobarBibliotecario(msg.sender), "Usted no posee el rol bibliotecario");
        require(existenciaLibro(id),"Libro no existe");
        require(!funcionLibroEstadoNuevo(id), "Estado debe ser diferente de Nuevo o Reparado para poder reparar");
        uint8 estadoAnterior = mapeoEstructuraLibro[id].estado;
        mapeoEstructuraLibro[id].estado = 2;
        emit LogLibroReparado(id, msg.sender, obtenerUsuario(msg.sender), estadoAnterior, mapeoEstructuraLibro[id].estado);
        return true;
    }

    function mostrarLibrosPoseedor(address cuenta)
        public view
        returns(uint[])
    {
        return _ownedTokens[cuenta];
    }
}