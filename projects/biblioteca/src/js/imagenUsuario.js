function salvarImagenUsuario() {
    var cuenta = $('#cuenta').val();
    var canvas = document.getElementById("imagenUsuario");
    canvas.toBlob(function(blob) {
        saveAs(blob, cuenta+".jpg");
    }, "image/JPEG");
}

document.getElementById('cuadroImagenUsuario').onclick = function() {
    document.getElementById('ingresarImagenUsuario').click();
}    

if (document.getElementById('imagenUsuario')){
    document.getElementById('imagenUsuario').onclick = function() {
        document.getElementById('ingresarImagenUsuario').click();
    }
}

document.getElementById('ingresarImagenUsuario').onchange = function (e) {
    document.getElementById("no-user").setAttribute("style", "display:none");
    loadImage(
        e.target.files[0],
        function (img) {
            if(document.getElementById("imagenUsuario")){
                var imagenCreada = document.getElementById("imagenUsuario");
                document.getElementById('cuadroImagenUsuario').removeChild(imagenCreada);
            }
            document.getElementById("cuadroImagenUsuario").appendChild(img);
            img.setAttribute("id", "imagenUsuario");
            img.setAttribute("class", "image img-fluid img-thumbnail rounded-circle");
        },
        {   
            canvas: true,
            maxWidth: 100,
            maxHeight: 100,
            minWidth: 100,
            minHeight: 100,
            cover: true,
            crop: true
            //orientation: 2,
        } // Options
    );
};

function mostrarImagenUsuario(){
    var cuenta = $('#cuenta').val();
    if(!document.getElementById("imagenUsuario")){
        document.getElementById("no-user").setAttribute("style", "display:none");
    }
    else{
        var imagenCreada = document.getElementById("imagenUsuario");
        document.getElementById('cuadroImagenUsuario').removeChild(imagenCreada);
    }
    imgTag = document.createElement("img");
    document.getElementById("cuadroImagenUsuario").appendChild(imgTag);
    imgTag.setAttribute("id", "imagenUsuario");
    imgTag.setAttribute("class", "image img-fluid img-thumbnail rounded-circle");
    var fuente = "../img/imgs/"+cuenta+".jpg";
    document.getElementById("imagenUsuario").src = fuente;
}