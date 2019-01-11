pragma solidity ^0.4.24;
pragma experimental "v0.5.0";

contract Mapeo {
    struct Instructor {
        uint edad;
        string nombre;
        string apellido;
    }
    mapping (address => Instructor) mapeoInstructores;
    address[] public instructoresCuentas;
    function ingresarInstructores(
        address _cuenta,
        uint _edad,
        string _nombre,
        string _apellido
    )
        public
    {
        Instructor storage instructor = mapeoInstructores[_cuenta];
        instructor.edad = _edad;
        instructor.nombre = _nombre;
        instructor.apellido = _apellido;
        instructoresCuentas.push(_cuenta) -1;
    }
    function obtenerInstructores()
        view
        public
        returns (address[])
    {
        return instructoresCuentas;
    }
    function obtenerInstructor(address ins)
        view
        public
        returns (uint, string, string)
    {
        return (
            mapeoInstructores[ins].edad,
            mapeoInstructores[ins].nombre,
            mapeoInstructores[ins].apellido
        );
    }
    function contarInstructores()
        view
        public
        returns (uint)
    {
        return instructoresCuentas.length;
    }
}