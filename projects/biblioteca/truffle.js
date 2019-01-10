var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "future kiwi wing asset dish ginger intact rack link already that trap";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/431927ce7a854986a283c45cc06e8056"),
      gas: 8000000,
      network_id: 3,
      }
  }
};