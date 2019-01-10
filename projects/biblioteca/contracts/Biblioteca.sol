pragma solidity ^0.4.24;

import "./Libro.sol";

contract Biblioteca is Libro {

    constructor(string nombre)
        public
    {
        insertarUsuario(msg.sender, nombre);
        asignarBibliotecario(msg.sender);
    }

    function transferirBiblioteca(address nuevoPoseedor)
        public
    {
        transferOwnership(nuevoPoseedor);
    }
}