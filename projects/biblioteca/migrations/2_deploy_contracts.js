var Biblioteca = artifacts.require("./Biblioteca.sol");

module.exports = function(deployer) {
  deployer.deploy(Biblioteca, "Ruben Santana");
};
