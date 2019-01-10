# biblioteca
Modelo de biblioteca en ethereum, donde los participantes pueden intercambiar libros y 
permitir a la biblioteca que los administre. Utiliza los estándares de https://openzeppelin.org/ 
para asignar un propietario (<strong>Owner</strong>), asignación de roles (<strong>RBAC</strong>) 
para los bibliotecarios, <strong>safemath</strong> para asegurar que no haya desbordamiento de 
algunas variables y utiliza una personalización de Token ERC721 (<strong>ERC721Enumerable</strong>) para 
la gestión del ID de los libros.

Puedes encontrar una implementación en https://claseblockchain.000webhostapp.com/

<strong>Nota:</strong> Hasta ahora el proceso de carga de las imagenes no está actualizado ya que lo utilizaba sólo localmente. 
Prontó haré una implementación del mismo para que pueda guardar las imagenes en <strong>IPFS</strong>.
