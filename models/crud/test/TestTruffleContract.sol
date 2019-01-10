pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Crud.sol";

contract TestCrud {
    Crud crud = Crud(DeployedAddresses.Crud());
    
    // Testing the cantidadUsuarios() function
    function testCantidadUsuarios() public {
        uint returnedCantidad = crud.cantidadUsuarios();

        uint expected = 0;

        Assert.equal(returnedCantidad, expected, "La cantidad debe ser 0.");
    }
    // Testing again the cantidadUsuarios() function with an insertion
    function testInsertarUsuario() public {
        // Expected owner is this contract
        address a = this;
        uint c = 30;

        crud.insertarUsuario(a,"Ruben",c);

        uint returnedCantidad = crud.cantidadUsuarios();

        uint expected = 1;

        Assert.equal(returnedCantidad, expected, "La cantidad debe ser 1.");
    }
    // Testing obtenerUsuarioPorIndice() function
    function testObtenerUsuarioPorIndice() public {
        // Expected owner is this contract
        address expected = this;

        // Store user
        address cuenta = crud.obtenerUsuarioPorIndice(0);

        Assert.equal(cuenta, expected, "La cuenta debe ser la de este contrato.");
    }
}
