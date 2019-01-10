pragma solidity ^0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/access/Roles.sol";
import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Bibliotecario is Ownable {

    using Roles for Roles.Role;

    Roles.Role private bibliotecarios;

    event LogBibliotecarioAgregado(address indexed cuenta/*, string nombre*/);
    event LogBibliotecarioEliminado(address indexed cuenta/*, string nombreBibliotecarioEliminado*/);

    function asignarBibliotecario(address bibliotecario)
        public onlyOwner
        returns(bool exito)
    {
        //if(!existenciaUsuario(bibliotecario)) revert("Usuario no existe");
        require(!bibliotecarios.has(bibliotecario), "Cuenta ya posee el rol bibliotecario");
        bibliotecarios.add(bibliotecario);
        emit LogBibliotecarioAgregado(bibliotecario/*, mapeoEstructuraUsuario[bibliotecario].nombre*/);
        return true;
    }

    function comprobarBibliotecario(address cuenta)
        public view
        returns(bool existencia)
    {
        return bibliotecarios.has(cuenta);
    }

    function removerBibliotecario(address bibliotecario)
        public onlyOwner
        returns(bool exito)
    {
        require(bibliotecarios.has(bibliotecario), "Cuenta no posee el rol bibliotecario");
        //string memory nombreBibliotecarioEliminado = mapeoEstructuraUsuario[bibliotecario].nombre;
        bibliotecarios.remove(bibliotecario);
        emit LogBibliotecarioEliminado(bibliotecario/*, nombreBibliotecarioEliminado*/);
        return true;
    }
}