App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Crud.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var CrudArtifact = data;
      App.contracts.Crud = TruffleContract(CrudArtifact);
      App.contracts.Crud.setProvider(App.web3Provider);
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#registrar', App.registrar);
    $(document).on('click', '#informacion', App.infoUsuario);
    $(document).on('click', '#cantidad', App.cantidadDeUsuarios);
    $(document).on('click', '#cuentas', App.cuentasDeUsuarios);
    $(document).on('click', '#cuentaIndice', App.infoUsuarioIndice);
    $(document).on('click', '#actualizarEdad', App.actualizarLaEdad);
    $(document).on('click', '#actualizarCorreo', App.actualizarElCorreo);
    $(document).on('click', '#eliminar', App.eliminarElUsuario);
  },

  registrar: function() {
    if ($('#cuenta').val() == "" || $('#correo').val() == "" || $('#edad').val() == "")
    {
      $("#txStatus").empty();
      $("#txStatus").text("Ingrese la cuenta, el correo y la edad");
    }
    else
    {
      let cuenta = $('#cuenta').val();
      let correo = $('#correo').val();
      let edad = $('#edad').val();
      var crudInstance;
      App.contracts.Crud.deployed().then(function(instance) {
      crudInstance = instance;
      return crudInstance.insertarUsuario(cuenta, correo, edad);
      }).then(function(result) {
        $("#txStatus").empty();
        $("#txStatus").text("Cuenta: " + cuenta + "\nCorreo: " + correo + "\nEdad: " + edad);
      }).catch(function(err) {
        console.log(err.message);
      });
    }
  },

  infoUsuario: function() {
    if ($('#cuenta').val() == "")
    {
      $("#txStatus").empty();
      $("#txStatus").text("Ingrese la cuenta del usuario que desea visualizar");
    }
    else
    {
      var crudInstance;
      App.contracts.Crud.deployed().then(function(instance) {
      crudInstance = instance;
      let cuenta = $('#cuenta').val();
      return crudInstance.obtenerUsuario(cuenta);
      }).then(function(result) {
        let account = $('#cuenta').val();
        let mail = web3.toAscii(result[0]);
        $("#txStatus").empty();
        $("#txStatus").append(`<div class="txStatus">
                <ul>
                  <li>Cuenta: ${account}</li>
                  <li>Correo: ${mail}</li>
                  <li>Edad: ${result[1]}</li>
                  <li>Indice: ${result[2]}</li>
                </ul>
              </div>`);
      }).catch(function(err) {
        console.log(err.message);
        $("#txStatus").empty();
        $("#txStatus").text("Cuenta no existe");
      });
    }
  },

  cantidadDeUsuarios: function() {
    var crudInstance;
    App.contracts.Crud.deployed().then(function(instance) {
    crudInstance = instance;
    return crudInstance.cantidadUsuarios();
    }).then(function(result) {
      $("#txStatus").empty();
      $("#txStatus").text("Actuálmente hay " + result + " usuarios." );
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  cuentasDeUsuarios: function() {
    var crudInstance;
    App.contracts.Crud.deployed().then(function(instance) {
    crudInstance = instance;
    return crudInstance.cuentasUsuarios();
    }).then(function(result) {
      $("#txStatus").empty();
      var i = 1;
      result.forEach(element => {
        $("#txStatus").append("Cuenta número " + i + " " + element + "\n");
        i++;
      });
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  infoUsuarioIndice: function() {
    if ($('#indice').val() == "")
    {
      $("#txStatus").empty();
      $("#txStatus").text("Ingrese el índice de la cuenta que desea visualizar");
    }
    else
    {
      var crudInstance;
      App.contracts.Crud.deployed().then(function(instance) {
      crudInstance = instance;
      let indice = $('#indice').val();
      return crudInstance.obtenerUsuarioPorIndice(indice);
      }).then(function(result) {
        $("#txStatus").empty();
        $("#txStatus").append(`<div class="txStatus">
                <ul>
                  <li>Cuenta: ${result}</li>
                </ul>
              </div>`);
      }).catch(function(err) {
        console.log(err.message);
        $("#txStatus").empty();
        $("#txStatus").text("La cuenta con ese índice no existe");
      });
    }
  },

  actualizarLaEdad: function() {
    if ($('#cuenta').val() == "" || $('#edad').val() == "")
    {
      $("#txStatus").empty();
      $("#txStatus").text("Ingrese la cuenta y coloque la edad a la que desea actualizar");
    }
    else
    {
      let cuenta = $('#cuenta').val();
      let edad = $('#edad').val();
      var crudInstance;
      App.contracts.Crud.deployed().then(function(instance) {
      crudInstance = instance;
      return crudInstance.actualizarEdad(cuenta, edad);
      }).then(function(result) {
        $("#txStatus").empty();
        $("#txStatus").text("La nueva edad de la cuenta " + cuenta + " es: " + edad);
      }).catch(function(err) {
        console.log(err.message);
        $("#txStatus").empty();
        $("#txStatus").text("La cuenta no existe o falta colocar la edad");
      });
    }
  },

  actualizarElCorreo: function() {
    if ($('#cuenta').val() == "" || $('#correo').val() == "")
    {
      $("#txStatus").empty();
      $("#txStatus").text("Ingrese la cuenta y coloque el correo al que desea actualizar");
    }
    else
    {
      let cuenta = $('#cuenta').val();
      let correo = $('#correo').val();
      var crudInstance;
      App.contracts.Crud.deployed().then(function(instance) {
      crudInstance = instance;
      return crudInstance.actualizarCorreo(cuenta, correo);
      }).then(function(result) {
        $("#txStatus").empty();
        $("#txStatus").text("El nuevo correo de la cuenta " + cuenta + " es: " + correo);
      }).catch(function(err) {
        console.log(err.message);
        $("#txStatus").empty();
        $("#txStatus").text("Cuenta no existe o falta colocar el correo");
      });
    }
  },

  eliminarElUsuario: function() {
    if ($('#cuenta').val() == "")
    {
      $("#txStatus").empty();
      $("#txStatus").text("Ingrese la cuenta que desea eliminar");
    }
    else
    {
      let cuenta = $('#cuenta').val();
      var crudInstance;
      App.contracts.Crud.deployed().then(function(instance) {
      crudInstance = instance;
      return crudInstance.eliminarUsuario(cuenta);
      }).then(function(result) {
        $("#txStatus").empty();
        $("#txStatus").text("Usuario eliminado");
      }).catch(function(err) {
        console.log(err.message);
        $("#txStatus").empty();
        $("#txStatus").text("Cuenta a eliminar no existe");
      });
    }
  },

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
