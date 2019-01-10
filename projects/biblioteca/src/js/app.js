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
    $.getJSON('Biblioteca.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var BibliotecaArtifact = data;
      App.contracts.Biblioteca = TruffleContract(BibliotecaArtifact);
      App.contracts.Biblioteca.setProvider(App.web3Provider);
      //Obtener el nombre de usuario de la cuenta actual
      App.cuentaActual();
      })
    return App.bindEvents();
  },

  cuentaActual: function() {
    callback();
    //web3.currentProvider.publicConfigStore.on('update', callback);

    var account = web3.eth.accounts[0];
    var accountInterval = setInterval(function() {
      if (web3.eth.accounts[0] !== account) {
        account = web3.eth.accounts[0];
        callback();
      }
    }, 100);

    function callback(){
      App.comprobarRolBibliotecario();
      var usuarioCuenta = web3.eth.accounts[0];
      document.getElementById('imageBox').src = '../img/imgs/' + usuarioCuenta + '.jpg';
      var BibliotecaInstance;
      App.contracts.Biblioteca.deployed().then(function(instance) {
        BibliotecaInstance = instance;
        return BibliotecaInstance.obtenerUsuario(usuarioCuenta)
      }).then(function(result) {
        document.getElementById("botonUsuario").innerHTML = result;
        limpiar();
      })
    }
  },

  librosPoseedor: function() {
    $("#modal-body").empty();
    var usuarioCuenta = web3.eth.accounts[0];
    var BibliotecaInstance;
    App.contracts.Biblioteca.deployed().then(function(instance) {
      BibliotecaInstance = instance;
      return BibliotecaInstance.mostrarLibrosPoseedor(usuarioCuenta)
    }).then(function(result) {
      console.log(result[0].c[0]);

      for (var i = 0; i < result.length; i++){
        var indice = result[i].c[0];
        mostrarLibrosPropiedad(indice);
      }

      function mostrarLibrosPropiedad(elementoID){
        
        var BibliotecaInstance;
        var idValue = elementoID;
        App.contracts.Biblioteca.deployed().then(function(instance) {
        BibliotecaInstance = instance;
        return BibliotecaInstance.obtenerLibro(elementoID)
        }).then(function(libroInfo) {
          console.log(libroInfo);
          var prestado = libroInfo[5] == true ? "Si" : "No";
          var caso = libroInfo[2].c[0];
          var estado = App.estadoLibro(caso);
                    
          console.log(estado);
          $("#modal-body").append(`
            <div class="col">
            <div class="card" style="width:200px; height:460px;">
                <img class="card-img-top" src="../img/imgs/${idValue}.jpg" alt="Card image cap">
                <div class="card-body">
                  <h5 class="card-title">Libro ID: ${idValue}</h5>
                  <p class="card-text">
                    <strong>${libroInfo[0]}</strong><br>
                    Autor: ${libroInfo[1]}<br>
                    Estado: ${estado}<br>
                    Prestado: ${prestado}
                  </p>
                  <div class="card-footer row align-items-center">
                  <a href="#" class="btn btn-primary">Mirar</a>
                  </div>
                </div>
              </div>
            </div>
          `);
        });
      }          
    });
  },

  comprobarRolBibliotecario: function() {
    var usuarioCuenta = web3.eth.accounts[0];
    var BibliotecaInstance;
      App.contracts.Biblioteca.deployed().then(function(instance) {
        BibliotecaInstance = instance;
        return BibliotecaInstance.comprobarBibliotecario(usuarioCuenta)
      }).then(function(result) {
        
        if (result){
          document.getElementById('nav-bibliotecario-tab').setAttribute("style", "display:none");
          document.getElementById('nav-libro-tab').setAttribute("style", "display:inline");
          document.getElementById('nav-prestarLibro-tab').setAttribute("style", "display:inline");
          document.getElementById('nav-eventos-tab').setAttribute("style", "display:inline");
          App.comprobarOwner();
        }
        else {
          document.getElementById('nav-bibliotecario-tab').setAttribute("style", "display:none");
          document.getElementById('nav-libro-tab').setAttribute("style", "display:none");
          document.getElementById('nav-prestarLibro-tab').setAttribute("style", "display:none");
          document.getElementById('nav-eventos-tab').setAttribute("style", "display:none");
        }
      });
  },

  comprobarOwner: function() {
    var BibliotecaInstance;
      App.contracts.Biblioteca.deployed().then(function(instance) {
        BibliotecaInstance = instance;
        return BibliotecaInstance.isOwner()
      }).then(function(result) {
        
        if (result){
          document.getElementById('nav-bibliotecario-tab').setAttribute("style", "display:inline");
        }
      });
  },

  bindEvents: function() {
    $(document).on('click', '#botonDeUsuario', App.librosPoseedor);
    
    $(document).on('click', '#insertarUsuario', App.insertarUsuario);
    $(document).on('click', '#obtenerUsuario', App.obtenerUsuario);
    $(document).on('click', '#editarUsuario', App.editarUsuario);
    $(document).on('click', '#eliminarUsuario', App.eliminarUsuario);

    $(document).on('click', '#asignarBibliotecario', App.asignarBibliotecario);
    $(document).on('click', '#comprobarBibliotecario', App.comprobarBibliotecario);
    $(document).on('click', '#removerBibliotecario', App.removerBibliotecario);

    $(document).on('click', '#agregarLibro', App.agregarLibro);
    $(document).on('click', '#obtenerLibro', App.obtenerLibro);
    $(document).on('click', '#editarLibro', App.editarLibro);
    $(document).on('click', '#eliminarLibro', App.eliminarLibro);

    $(document).on('click', '#transferirPropiedadLibro', App.transferirPropiedadLibro);

    $(document).on('click', '#prestarLibro', App.prestarLibro);
    $(document).on('click', '#devolverLibro', App.devolverLibro);
    $(document).on('click', '#repararLibro', App.repararLibro);    

    $(document).on('click', '#eventoNuevoUsuario', App.eventoNuevoUsuario);
    $(document).on('click', '#eventoNuevoLibro', App.eventoNuevoLibro);
  },

  insertarUsuario: function() {
    var imagen = document.getElementById('imagenUsuario');
    if ($('#cuenta').val() == "" || $('#cuenta').val() == 0 || $('#nombre').val() == "" || !imagen)
    {
      $("#txStatus").empty();
      $("#txStatus").text("Ingrese la cuenta, el nombre y la imagen");
     
    }
    else
    {
      let cuenta = $('#cuenta').val();
      let nombre = $('#nombre').val();
      var BibliotecaInstance;
      App.contracts.Biblioteca.deployed().then(function(instance) {
      BibliotecaInstance = instance;
      return BibliotecaInstance.comprobarBibliotecario(web3.eth.accounts[0]);
      }).then(function(result) {
        if(result == true){
          
      App.contracts.Biblioteca.deployed().then(function(instance) {
      BibliotecaInstance = instance;
      return BibliotecaInstance.insertarUsuario(cuenta, nombre);
      }).then(function(result) {
        
        let campos = result.logs[0].args;
        $("#txStatus").empty();
        $("#txStatus").append(`
        <h3>Usuario Creado</h3>
        <ul>
          <li>Nombre: ${campos.nombre}</li>
          <li>Cuenta: ${campos.cuenta}</li>
        </ul>
      `);
      salvarImagenUsuario();
      console.log(campos);
      }).catch(function(err) {
        console.log(err.message);
        console.log("Cuenta ya existe");
        $("#txStatus").empty();
        $("#txStatus").text("Probablemente la cuenta ya existe");
        //alert("ERROR! " + err.message);
      });
    }
    else{
      $("#txStatus").empty();
        $("#txStatus").text("Usted no posee el Rol Bibliotecario");
    }
  });
    }
  },

  obtenerUsuario: function() {
    if ($('#cuenta').val() == "")
    {
      $("#txStatus").empty();
      $("#txStatus").text("Ingrese la cuenta del usuario que desea visualizar");
    }
    else
    {
      var BibliotecaInstance;
      App.contracts.Biblioteca.deployed().then(function(instance) {
      BibliotecaInstance = instance;

      var cuenta = $('#cuenta').val();
      return BibliotecaInstance.existenciaUsuario(cuenta);
      }).then(function(resultado) {
        if(resultado == true){
          App.contracts.Biblioteca.deployed().then(function(instance) {
            BibliotecaInstance = instance;
            var cuenta = $('#cuenta').val();

      return BibliotecaInstance.obtenerUsuario(cuenta);
      }).then(function(result) {
        
        var account = $('#cuenta').val();
        //let mail = web3.toAscii(result[0]);
        $("#txStatus").empty();
        $("#txStatus").append(`
                <ul>
                  <li>Cuenta: ${account}</li>
                  <li>Nombre: ${result}</li>
                </ul>
              `);
              mostrarImagenUsuario();
              document.getElementById("nombre").value = result;
              console.log(result);
      }).catch(function(err) {
        console.log(err.message);
        $("#txStatus").empty();
      });
    }
    else {
      
        document.getElementById("nombre").value = "";
        if(document.getElementById("imagenUsuario")){
          var imagenCreada = document.getElementById("imagenUsuario");
          document.getElementById('cuadroImagenUsuario').removeChild(imagenCreada);
          document.getElementById("no-user").setAttribute("style", "display:inline");
          }

        $("#txStatus").text("Cuenta no existe");
        }
      });
    }
  },

  editarUsuario: function() {
    if ($('#cuenta').val() == "" || $('#nombre').val() == "")
    {
      $("#txStatus").empty();
      $("#txStatus").text("No deje campos vacíos");
    }
    else
    {
      let cuenta = $('#cuenta').val();
      let nombre = $('#nombre').val();
      var BibliotecaInstance;
      App.contracts.Biblioteca.deployed().then(function(instance) {
      BibliotecaInstance = instance;
      return BibliotecaInstance.editarUsuario(nombre, cuenta);
      }).then(function(result) {
        let campos = result.logs[0].args;
        $("#txStatus").empty();
        $("#txStatus").append(`
          <h3>Usuario Editado</h3>
          <ul>
            <li>Nombre Anterior: ${campos.nombreAnterior}</li>
            <li>Nombre Nuevo: ${campos.nombreNuevo}</li>
            <li>Cuenta: ${campos.cuenta}</li>
          </ul>
        `);
        salvarImagenUsuario();
        console.log(campos);
      }).catch(function(err) {
        console.log(err.message);
        $("#txStatus").empty();
        $("#txStatus").text("La cuenta no existe o falta colocar algún campo");
      });
    }
  },

  eliminarUsuario: function() {
    if ($('#cuenta').val() == "")
    {
      $("#txStatus").empty();
      $("#txStatus").text("Ingrese la cuenta que desea eliminar");
    }
    else
    {
      let cuenta = $('#cuenta').val();
      var BibliotecaInstance;
      App.contracts.Biblioteca.deployed().then(function(instance) {
      BibliotecaInstance = instance;
      return BibliotecaInstance.eliminarUsuario(cuenta);
      }).then(function(result) {
        let campos = result.logs[0].args;
        $("#txStatus").empty();
        $("#txStatus").append(`
          <h3>Usuario Eliminado</h3>
          <ul>
            <li>Nombre: ${campos.nombreEliminado}</li>
            <li>Cuenta: ${campos.cuenta}</li>
          </ul>
        `);
        console.log(campos);
      }).catch(function(err) {
        console.log(err.message);
        $("#txStatus").empty();
        $("#txStatus").text("Cuenta a eliminar no existe");
      });
    }
  },

  asignarBibliotecario: function() {
    if ($('#cuentaBibliotecario').val() == "")
    {
      $("#txStatus").empty();
      $("#txStatus").text("Ingrese la cuenta del usuario al que desea agregar el rol Bibliotecario");
    }
    else
    {
      var BibliotecaInstance;
      App.contracts.Biblioteca.deployed().then(function(instance) {
      BibliotecaInstance = instance;
      let cuentaBibliotecario = $('#cuentaBibliotecario').val();
      return BibliotecaInstance.asignarBibliotecario(cuentaBibliotecario);
      }).then(function(result) {
        let campos = result.logs[0].args;
        $("#txStatus").empty();
        $("#txStatus").append(`
          <h3>Bibliotecario Asignado</h3>
          <ul>
            <li>Nombre: ${campos.nombre}</li>
            <li>Cuenta: ${campos.cuenta}</li>
          </ul>
        `);
        console.log(campos);
      }).catch(function(err) {
        console.log(err.message);
        $("#txStatus").empty();
        $("#txStatus").text(err.message);
      });
    }
  },

  comprobarBibliotecario: function() {
    if ($('#cuentaBibliotecario').val() == "" || $('#cuentaBibliotecario').val() == 0)
    {
      $("#txStatus").empty();
      $("#txStatus").text("Ingrese la cuenta del usuario que desea verificar el rol Bibliotecario");
    }
    else
    {
      var BibliotecaInstance;
      App.contracts.Biblioteca.deployed().then(function(instance) {
      BibliotecaInstance = instance;
      let cuentaBibliotecario = $('#cuentaBibliotecario').val();
      return BibliotecaInstance.comprobarBibliotecario(cuentaBibliotecario);
      }).then(function(result) {
        let account = $('#cuentaBibliotecario').val();
        $("#txStatus").empty();
        var poseeRol = result == true ? "Si" : "No";
          $("#txStatus").append(`
            <h3>Comprobar Bibliotecario</h3>
            <ul>
              <li>La Cuenta: ${account}</li>
              <li><b>${poseeRol}</b> posee el rol bibliotecario</li>
            </ul>
          `);
      }).catch(function(err) {
        console.log(err.message);
        $("#txStatus").empty();
        $("#txStatus").text(err.message);
      });
    }
  },

  removerBibliotecario: function() {
    if ($('#cuentaBibliotecario').val() == ""|| $('#cuentaBibliotecario').val() == 0)
    {
      $("#txStatus").empty();
      $("#txStatus").text("Ingrese la cuenta a la que desea eliminarle el rol Bibliotecario");
    }
    else
    {
      let cuentaBibliotecario = $('#cuentaBibliotecario').val();
      var BibliotecaInstance;
      App.contracts.Biblioteca.deployed().then(function(instance) {
      BibliotecaInstance = instance;
      return BibliotecaInstance.removerBibliotecario(cuentaBibliotecario);
      }).then(function(result) {
        let campos = result.logs[0].args;
        $("#txStatus").empty();
        $("#txStatus").append(`
          <h3>Rol Bibliotecario Eliminado</h3>
          <ul>
            <li>Nombre: ${campos.nombreBibliotecarioEliminado}</li>
            <li>Cuenta: ${campos.cuenta}</li>
          </ul>
        `);
        console.log(campos);
      }).catch(function(err) {
        console.log(err.message);
        $("#txStatus").empty();
        $("#txStatus").text("Cuenta a eliminar no existe");
      });
    }
  },
  
  estadoLibro: function(estadoNumero){
    var caso = estadoNumero;
        switch (caso){
          case(1):
          var estado = "Nuevo";
          break;
          case(2):
          var estado = "Reparado";
          break;
          case(3):
          var estado = "Deteriorado";
          break;
          case(4):
          var estado = "Dañado";
          break;
        }
        return estado;
  },

  agregarLibro: function() {
    if ($('#idLibro').val() == ""  || $('#nombreLibro').val() == ""  || $('#autor').val() == "" 
    || !$('input[id=estado]').is(':checked')
    || $('#poseedor').val() == 0 || $('#poseedor').val() == "")
    {
      $("#txStatus").empty();
      $("#txStatus").text("Ingrese todos los datos del libro");
    }
    else
    {
      let idLibro = $('#idLibro').val();
      let nombreLibro = $('#nombreLibro').val();
      let autor = $('#autor').val();
      let estado = $('input[name="choice"]:checked').val();
      let poseedor = $('#poseedor').val();
      var BibliotecaInstance;
      App.contracts.Biblioteca.deployed().then(function(instance) {
      BibliotecaInstance = instance;
      return BibliotecaInstance.agregarLibro(idLibro,nombreLibro,autor,estado,poseedor);  
      }).then(function(result) {
        let campos = result.logs[1].args;
        var caso = campos.estado.c[0];
        var estadoDevuelto = App.estadoLibro(caso);

        $("#txStatus").empty();
        $("#txStatus").append(`
          <h3>Libro Agregado</h3>
          <ul>
            <li>ID: ${campos.id}</li>
            <li>Libro: ${campos.nombre}</li>
            <li>Autor: ${campos.autor}</li>
            <li>Estado: ${estadoDevuelto}</li>
            <li>Dueño: ${campos.nombrePoseedor}</li>
            <li>Cuenta dueño: ${campos.poseedor}</li>
          </ul>
        `);
        salvarImagenLibro();
      }).catch(function(err) {
        console.log(err.message);
        $("#txStatus").empty();
        $("#txStatus").text("Cuenta a eliminar no existe");
      });
    }
  },

  obtenerLibro: function() {
    if ($('#idLibro').val() == "")
    {
      $("#txStatus").empty();
      $("#txStatus").text("Ingrese el ID del libro que desea visualizar");
    }
    else
    {
      var BibliotecaInstance;
      App.contracts.Biblioteca.deployed().then(function(instance) {
      BibliotecaInstance = instance;
      var idLibro = $('#idLibro').val();
      return BibliotecaInstance.existenciaLibro(idLibro);
      }).then(function(resultado) {
        if(resultado == true){
          App.contracts.Biblioteca.deployed().then(function(instance) {
            BibliotecaInstance = instance;
            var idLibro = $('#idLibro').val();
      return BibliotecaInstance.obtenerLibro(idLibro);
      }).then(function(result) {
        console.log(result);
        //let mail = web3.toAscii(result[0]);
        let idLibro = $('#idLibro').val();
        var prestado = result[5] == true ? "Si" : "No";
        var caso = result[2].c[0];
        var estado = App.estadoLibro(caso);
        $(function() {  
          $('input[id=estado][value='+caso+']').prop('checked', true);
        });
        
        $("#txStatus").empty();
        $("#txStatus").append(`
                <h3>Libro ID: ${idLibro}</h3>
                <ul>
                  <li>Libro: ${result[0]}</li>
                  <li>Autor: ${result[1]}</li>
                  <li>Estado: ${estado}</li>
                  <li>Dueño: ${result[3]}</li>
                  <li>Ultima persona a la que se le prestó el libro: ${result[4]}</li>
                  <li>Prestado: ${prestado}</li>
                </ul>
              `);
              document.getElementById("nombreLibro").value = result[0];
              document.getElementById("autor").value = result[1];
              document.getElementById("estado").value = result[2];
              document.getElementById("poseedor").value = result[3];
              mostrarImagenLibro();
      }).catch(function(err) {
        console.log(err.message);
        $("#txStatus").empty();
    });
    }
    else {
      
      document.getElementById("nombreLibro").value = "";
      document.getElementById("autor").value = "";
      document.getElementById("estado").value = "";
      document.getElementById("poseedor").value = "";
      if(document.getElementById("imagenLibro")){
        var imagenCreada = document.getElementById("imagenLibro");
        document.getElementById('cuadroImagenLibro').removeChild(imagenCreada);
        document.getElementById("no-book").setAttribute("style", "display:inline");
        }
      $("#txStatus").text("ID no existe");
    }
  });
    }
  },
  

  editarLibro: function() {
    if ($('#idLibro').val() == "" || $('#nombreLibro').val() == "" || $('#autor').val() == "" ||
    !$('input[id=estado]').is(':checked'))
    {
      $("#txStatus").empty();
      $("#txStatus").text("No deje campos vacíos");
    }
    else
    {
      let idLibro = $('#idLibro').val();
      let nombreLibroNuevo = $('#nombreLibro').val();
      let autorNuevo = $('#autor').val();
      let estadoNuevo = $('input[name="choice"]:checked').val();
      var BibliotecaInstance;
      App.contracts.Biblioteca.deployed().then(function(instance) {
      BibliotecaInstance = instance;
      return BibliotecaInstance.editarLibro(idLibro, nombreLibroNuevo, autorNuevo, estadoNuevo);
      }).then(function(result) {
        let campos = result.logs[0].args;
        console.log(campos);
        var caso1 = campos.estadoAnterior.c[0];
        console.log(caso1);
        var estadoAnterior = App.estadoLibro(caso1);
        console.log(estadoAnterior);
        var caso2 = campos.estadoNuevo.c[0];
        console.log(caso2);
        var estadoNuevo = App.estadoLibro(caso2);
        console.log(estadoNuevo);

        $("#txStatus").empty();
        $("#txStatus").append(`
          <h3>Libro Editado</h3>
          <table style="width:100%" class="table table-light table-hover table-striped table-bordered rounded">
            <tr>
              <th>Libro ID: <b>${campos.id}</b></th>
            </tr>
            <tr>
              <th></th>
              <th>Antes</th> 
              <th>Ahora</th>
            </tr>
            <tr>
              <td>Nombre</td>
              <td>${campos.nombreAnterior}</td> 
              <td>${campos.nombreNuevo}</td>
            </tr>
            <tr>
              <td>Autor</td>
              <td>${campos.autorAnterior}</td> 
              <td>${campos.autorNuevo}</td>
            </tr>
            <tr>
              <td>Estado</td>
              <td>${estadoAnterior}</td> 
              <td>${estadoNuevo}</td>
            </tr>
          </table>
        `);
        
        if(document.getElementsByTagName('canvas')[0])
        salvarImagenLibro();
        console.log(campos);
      }).catch(function(err) {
        console.log(err.message);
        $("#txStatus").empty();
        $("#txStatus").text("El libro no existe o falta colocar algún campo");
      });
    }
  },

  eliminarLibro: function() {
    if ($('#idLibro').val() == "")
    {
      $("#txStatus").empty();
      $("#txStatus").text("Ingrese el ID del Libro que desea eliminar");
    }
    else
    {
      let idLibro = $('#idLibro').val();
      var BibliotecaInstance;
      App.contracts.Biblioteca.deployed().then(function(instance) {
      BibliotecaInstance = instance;
      return BibliotecaInstance.eliminarLibro(idLibro);
      }).then(function(result) {
        let campos = result.logs[0].args;
        $("#txStatus").empty();
        $("#txStatus").append(`
          <h3>Libro Eliminado</h3>
          <ul>
            <li>Nombre: ${campos.nombreLibroEliminado}</li>
            <li>ID: ${campos.id}</li>
          </ul>
        `);
        console.log(campos);
      }).catch(function(err) {
        console.log(err.message);
        $("#txStatus").empty();
        $("#txStatus").text("Libro a eliminar no existe");
      });
    }
  },

  transferirPropiedadLibro: function() {
    if ($('#idLibroTransferir').val() == "" || $('#transferir').val() == 0 || $('#transferir').val() == "")
    {
      if ($('#transferir').val() == 0) "Cuenta del nuevo poseedor no puede ser 0";
      $("#txStatus").empty();
      $("#txStatus").text("Ingrese el ID del libro y la cuenta a transferirle su propiedad");
    }
    else
    {
      let idLibroTransferir = $('#idLibroTransferir').val();
      let transferir = $('#transferir').val();
      var BibliotecaInstance;
      App.contracts.Biblioteca.deployed().then(function(instance) {
      BibliotecaInstance = instance;
      return BibliotecaInstance.transferirPropiedadLibro(idLibroTransferir,transferir);
      }).then(function(result) {
        let campos = result.logs[0].args;
        $("#txStatus").empty();
        $("#txStatus").append(`
          <h3>Libro Propiedad Transferida</h3>
          <table style="width:100%" class="table table-light table-hover table-striped table-bordered rounded">
            <tr>
              <th>Libro ID: <b>${campos.id}</b></th>
            </tr>
            <tr>
              <th></th>
              <th>Antes</th> 
              <th>Ahora</th>
            </tr>
            <tr>
              <td>Poseedor</td>
              <td>${campos.nombrePoseedorAnterior}</td> 
              <td>${campos.nombrePoseedorNuevo}</td>
            </tr>
            <tr>
              <td>Cuenta</td>
              <td>${campos.poseedorAnterior}</td> 
              <td>${campos.poseedorNuevo}</td>
            </tr>
          </table>
        `);
        console.log(campos);
        $("#txStatus").empty();
        $("#txStatus").text("ID: " + idLibroTransferir + "\nNuevo Poseedor: " + transferir);
      }).catch(function(err) {
        console.log(err.message);
        //alert("ERROR! " + err.message);
      });
    }
  },

  prestarLibro: function() {
    if ($('#idLibroUsar').val() == "" || $('#prestar').val() == 0 || $('#prestar').val() == "")
    {
      if ($('#prestar').val() == 0) "Cuenta de la persona a prestar no puede ser 0";
      $("#txStatus").empty();
      $("#txStatus").text("Ingrese el ID del libro y la cuenta a la que se va a prestar el libro");
    }
    else
    {
      let idLibroUsar = $('#idLibroUsar').val();
      let prestar = $('#prestar').val();
      var BibliotecaInstance;
      App.contracts.Biblioteca.deployed().then(function(instance) {
      BibliotecaInstance = instance;
      return BibliotecaInstance.prestarLibro(idLibroUsar, prestar);
      }).then(function(result) {
        let campos = result.logs[0].args;
        var caso = campos.estado.c[0];
        
        var estado = App.estadoLibro(caso);
        $("#txStatus").empty();
        $("#txStatus").append(`
        <h3>Libro Prestado</h3>
        <ul>
          <li>Libro: ${campos.nombre}</li>
          <li>ID: ${campos.id}</li>
          <li>Autor: ${campos.autor}</li>
          <li>Prestado al usuario: ${campos.ultimaPersonaConElLibro}</li>
          <li>Estado del libro: ${estado}</li>
        </ul>
      `);
      console.log(campos);
      }).catch(function(err) {
        console.log(err.message);
        //alert("ERROR! " + err.message);
      });
    }
  },

  devolverLibro: function() {
    if ($('#idLibroUsar').val() == "" || !$('input[id=estadoLibro]').is(':checked'))
    {
      $("#txStatus").empty();
      $("#txStatus").text("Ingrese el ID del Libro que desea devolver y el estado en el que se está devolviendo");
    }
    else
    {
      let idLibroUsar = $('#idLibroUsar').val();
      let estadoLibro = $('input[name="estadoLibro"]:checked').val();
      var BibliotecaInstance;
      App.contracts.Biblioteca.deployed().then(function(instance) {
      BibliotecaInstance = instance;
      return BibliotecaInstance.devolverLibro(idLibroUsar, estadoLibro);
      }).then(function(result) {

        let campos = result.logs[0].args;
        var caso1 = campos.estadoAnterior.c[0];
        var estadoAnterior = App.estadoLibro(caso1);
        var caso2 = campos.estadoNuevo.c[0];
        var estadoNuevo = App.estadoLibro(caso2);

        $("#txStatus").empty();
        $("#txStatus").append(`
          <h3>Libro Devuelto</h3>
          <table style="width:100%" class="table table-light table-hover table-striped table-bordered rounded">
            <tr>
              <th>Libro ID: <b>${campos.id}</b></th>
            </tr>
            <tr>
              <th></th>
              <th>Antes</th> 
              <th>Ahora</th>
            </tr>
            <tr>
              <td>Estado</td>
              <td>${estadoAnterior}</td> 
              <td>${estadoNuevo}</td>
            </tr>
          </table>
        `);
        console.log(campos);
      }).catch(function(err) {
        console.log(err.message);
        $("#txStatus").empty();
        $("#txStatus").text("Libro a devolver no existe, no está prestado o usted no posee el rol Bibliotecario");
      });
    }
  },

  repararLibro: function() {
    if ($('#idLibro').val() == "")
    {
      $("#txStatus").empty();
      $("#txStatus").text("Ingrese el ID del Libro que desea reparar");
    }
    else
    {
      let idLibro = $('#idLibro').val();
      var BibliotecaInstance;
      App.contracts.Biblioteca.deployed().then(function(instance) {
      BibliotecaInstance = instance;
      return BibliotecaInstance.repararLibro(idLibro);
      }).then(function(result) {
        let campos = result.logs[0].args;
        var caso1 = campos.estadoAnterior.c[0];
        var estadoAnterior = App.estadoLibro(caso1);
        var caso2 = campos.estadoNuevo.c[0];
        var estadoNuevo = App.estadoLibro(caso2);
        $("#txStatus").empty();
        $("#txStatus").append(`
          <h3>Libro Reparado</h3>
          <table style="width:100%" class="table table-light table-hover table-striped table-bordered rounded">
            <tr>
              <th>Libro ID: <b>${campos.id}</b></th>
            </tr>
            <tr>
              <th></th>
              <th>Antes</th> 
              <th>Ahora</th>
            </tr>
            <tr>
              <td>Estado</td>
              <td>${estadoAnterior}</td> 
              <td>${estadoNuevo}</td>
            </tr>
          </table>
        `);
        console.log(campos);
      }).catch(function(err) {
        console.log(err.message);
        $("#txStatus").empty();
        $("#txStatus").text("El estado actual del libro es Nuevo o Reparado. O quizás el libro a reparar no existe");
      });
    }
  },

  eventoNuevoUsuario: function() {
    $("#txStatus").empty();
    var BibliotecaInstance;
    App.contracts.Biblioteca.deployed().then(function(instance) {
    BibliotecaInstance = instance;
    let account = $('#cuentaBusqueda').val();
    if (account == "")
      var eventoMostrar = BibliotecaInstance.LogUsuarioCreado( {}, { fromBlock: 0, toBlock: "latest" } )
    else
      var eventoMostrar = BibliotecaInstance.LogUsuarioCreado( {cuenta: account}, { fromBlock: 0, toBlock: "latest" } )
      eventoMostrar.watch(function(error,result){
        
        if (!error){
        let datosEvento = result.args;
        $("#txStatus").append(`
          <div class="media mb-3">
                  <img height="100" width="100" class="img-fluid align-self-center mr-3 img-thumbnail rounded-circle" alt="Responsive image" src="../img/imgs/${datosEvento.cuenta}.jpg">
                  <div class="media-body text-justify align-self-center">

                    <h5>Cuenta: ${datosEvento.cuenta}</h5>
                    <h5>Nombre: ${datosEvento.nombre}</h5>
                  </div>
              `);
        }
        else {
          $("#txStatus").text("No existe evento nuevo usuario con esa cuenta");
        }
    /*
        }).catch(function(err) {
          console.log(err.message);
          $("#txStatus").empty();
          $("#txStatus").text("El estado actual del libro es Nuevo o Reparado. O quizás el libro a reparar no existe");
        });
      })
    },
    */
      });
    })
  },
  
  eventoNuevoLibro: function() {
    $("#txStatus").empty();
    var BibliotecaInstance;
    App.contracts.Biblioteca.deployed().then(function(instance) {
    BibliotecaInstance = instance;
    let idLibroBuscado = $('#idLibroBuscado').val();
    if (idLibroBuscado == "")
      var eventoMostrar = BibliotecaInstance.LogLibroCreado( {}, { fromBlock: 0, toBlock: "latest" } )
    else
      var eventoMostrar = BibliotecaInstance.LogLibroCreado( {id: idLibroBuscado}, { fromBlock: 0, toBlock: "latest" } )
      eventoMostrar.watch(function(error,result){
        if (!error){
        let datosEvento = result.args;
        $("#txStatus").append(`
          <div class="media" >
                  <img height="100" width="100" class="ml-3 img-fluid align-self-center mr-3 img-thumbnail rounded" alt="Responsive image" src="../img/imgs/${datosEvento.id}.jpg">
                  <div class="media-body text-justify align-self-center">

                    <h6 class="mt-3">Libro: ${datosEvento.id}</h6>
                    <h6>Nombre: ${datosEvento.nombre}</h6>
                    <h6>Autor: ${datosEvento.autor}</h6>
                    <h6>Poseedor: ${datosEvento.poseedor}</h6>
                    <h6 class="mb-3">Nombre Poseedor: ${datosEvento.nombrePoseedor}</h6>
                  </div>
              `);
        }
        else {
          $("#txStatus").text("No existe evento nuevo libro con esa cuenta");
        }
    /*
        }).catch(function(err) {
          console.log(err.message);
          $("#txStatus").empty();
          $("#txStatus").text("El estado actual del libro es Nuevo o Reparado. O quizás el libro a reparar no existe");
        });
      })
    },
    */
      });
    })
  },

};

$(function() {
  $(window).on('load',function() {
    App.init();
  });
});
