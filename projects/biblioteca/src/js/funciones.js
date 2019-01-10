function soloLetras(e){
    key = e.keyCode || e.which;
    tecla = String.fromCharCode(key).toLowerCase();
    letras = " áéíóúabcdefghijklmnñopqrstuvwxyz-";
    especiales = "8-37-39-46";

    tecla_especial = false
    for(var i in especiales){
            if(key == especiales[i]){
                tecla_especial = true;
                break;
            }
        }

        if(letras.indexOf(tecla)==-1 && !tecla_especial){
            return false;
        }
}

function soloNumeros(e){
    key = e.keyCode || e.which;
    tecla = String.fromCharCode(key).toLowerCase();
    letras = "1234567890";
    especiales = "8-37-39-46";

    tecla_especial = false
    for(var i in especiales){
         if(key == especiales[i]){
             tecla_especial = true;
             break;
         }
     }

     if(letras.indexOf(tecla)==-1 && !tecla_especial){
         return false;
     }
}

function soloHexadecimales(e){
    key = e.keyCode || e.which;
    tecla = String.fromCharCode(key).toLowerCase();
    letras = "abcdefx1234567890";
    especiales = "8-37-39-46";

    tecla_especial = false
    for(var i in especiales){
         if(key == especiales[i]){
             tecla_especial = true;
             break;
         }
     }

     if(letras.indexOf(tecla)==-1 && !tecla_especial){
         return false;
     }
 }

function limpiar(){
    document.getElementById("cuenta").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("cuentaBibliotecario").value = "";
    document.getElementById("idLibro").value = "";
    document.getElementById("nombreLibro").value = "";
    document.getElementById("autor").value = "";
    document.getElementById("estado").value = "";
    document.getElementById("poseedor").value = "";
    document.getElementById("idLibroUsar").value = "";
    document.getElementById("estadoLibro").value = "";
    document.getElementById("prestar").value = "";
    document.getElementById("transferir").value = "";
    document.getElementById("cuentaBusqueda").value = "";
    if(document.getElementById("imagenLibro")){
        var imagenCreada = document.getElementById("imagenLibro");
        document.getElementById('cuadroImagenLibro').removeChild(imagenCreada);
        document.getElementById("no-book").setAttribute("style", "display:inline");
    }
    if(document.getElementById("imagenUsuario")){
        var imagenCreada = document.getElementById("imagenUsuario");
        document.getElementById('cuadroImagenUsuario').removeChild(imagenCreada);
        document.getElementById("no-user").setAttribute("style", "display:inline");
    }
    $("#txStatus").empty();
    $("#modal-libros").empty();
    
    limpiarValidaciones();
}
function limpiarValidacion(){
    var limpiarV = document.getElementsByClassName('was-validated');
    Array.prototype.filter.call(limpiarV, function(limpieza) {
        limpieza.classList.remove('was-validated');
    })
}
function limpiarValidaciones(){
    var veces = document.getElementsByClassName('was-validated').length;
        for(var i = 0; i < veces; i++) limpiarValidacion();        
}

function validar(claseAValidar,event){
    limpiarValidaciones();
    var forms = document.getElementsByClassName(claseAValidar);
    Array.prototype.filter.call(forms, function(form) {
        var inputForms = form.getElementsByTagName('input');
        Array.prototype.filter.call(inputForms, function(inputs) {
            if (inputs.checkValidity() === false) {
                event.preventDefault();
            }
            form.classList.add('was-validated');       
        })
    })
}

//Validación de campos de formulario
 (function() {
    'use strict'; 
    document.getElementById('obtenerUsuario').addEventListener('click', function(event){
        validar('claseObtenerUsuario',event)});
    document.getElementById('eliminarUsuario').addEventListener('click', function(event){
        validar('claseObtenerUsuario',event)});
    document.getElementById('insertarUsuario').addEventListener('click', function(event){
        validar('claseInsertarUsuario',event)});
    document.getElementById('editarUsuario').addEventListener('click', function(event){
        validar('claseInsertarUsuario',event)});
    document.getElementById('asignarBibliotecario').addEventListener('click', function(event){
        validar('claseBibliotecario',event)});
    document.getElementById('comprobarBibliotecario').addEventListener('click', function(event){
        validar('claseBibliotecario',event)});
    document.getElementById('removerBibliotecario').addEventListener('click', function(event){
        validar('claseBibliotecario',event)});
    document.getElementById('agregarLibro').addEventListener('click', function(event){
            validar('claseAgregarLibro',event)});
    document.getElementById('obtenerLibro').addEventListener('click', function(event){
        validar('claseObtenerLibro',event)});
    document.getElementById('editarLibro').addEventListener('click', function(event){
        validar('claseEditarLibro',event)});
    document.getElementById('repararLibro').addEventListener('click', function(event){
        validar('claseObtenerLibro',event)});
    document.getElementById('eliminarLibro').addEventListener('click', function(event){
        validar('claseObtenerLibro',event)});
    document.getElementById('prestarLibro').addEventListener('click', function(event){
        validar('clasePrestarLibro',event)});
    document.getElementById('devolverLibro').addEventListener('click', function(event){
        validar('claseDevolverLibro',event)});
    document.getElementById('transferirPropiedadLibro').addEventListener('click', function(event){
        validar('claseTransferirLibro',event)});
  })();

  $(function () {
    $('[data-toggle="tooltip"]').tooltip({ boundary: 'window' })
  })