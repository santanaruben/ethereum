function salvarImagenLibro() {
    var idLibro = $('#idLibro').val();
    var canvas = document.getElementById("imagenLibro");
    canvas.toBlob(function(blob) {
        saveAs(blob, idLibro+".jpg");
    }, "image/JPEG");
}

document.getElementById('cuadroImagenLibro').onclick = function() {
    document.getElementById('ingresarImagenLibro').click();
}    

if (document.getElementById('imagenLibro')){
    document.getElementById('imagenLibro').onclick = function() {
        document.getElementById('ingresarImagenLibro').click();
    }
}

document.getElementById('ingresarImagenLibro').onchange = function (e) {
    document.getElementById("no-book").setAttribute("style", "display:none");
    loadImage(
        e.target.files[0],
        function (img) {
            if(document.getElementById("imagenLibro")){
                var imagenCreada = document.getElementById("imagenLibro");
                document.getElementById('cuadroImagenLibro').removeChild(imagenCreada);
            }
            document.getElementById("cuadroImagenLibro").appendChild(img);
            img.setAttribute("id", "imagenLibro");
            img.setAttribute("class", "image img-fluid img-thumbnail");
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

function mostrarImagenLibro(){
    var idLibro = $('#idLibro').val();
    if(!document.getElementById("imagenLibro")){
        document.getElementById("no-book").setAttribute("style", "display:none");
    }
    else{
        var imagenCreada = document.getElementById("imagenLibro");
        document.getElementById('cuadroImagenLibro').removeChild(imagenCreada);
    }
    imgTag = document.createElement("img");
    document.getElementById("cuadroImagenLibro").appendChild(imgTag);
    imgTag.setAttribute("id", "imagenLibro");
    imgTag.setAttribute("class", "image img-fluid img-thumbnail");
    var fuente = "../img/imgs/"+idLibro+".jpg";
    document.getElementById("imagenLibro").src = fuente;
}