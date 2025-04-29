let listProductos = []
let listProveedores = []
const gallery = document.querySelector('#gallery')
const tipoAccion = document.querySelector("#actType")

obtenerProductos();
cargarProveedores();


function action(){
    switch(tipoAccion.value){
        case "crear":
            crearProducto()
            break;
        case "editar":
            modificarProducto()
            break;
        default:
            closeModal('deleteModal')
            eliminarProducto(idProducto.value)
            break;
    }
}

function validacionFormulario(){
    if(nombreProducto.value === "" || pIva.value === "" || precioInicial.value === "" || tipoPrenda.value === "" || tallaPrenda.value === "" || colorPrenda.value === "" || stockPrenda.value === "" || descripcionPrenda.value === ""){
        alert("Por favor, completa todos los campos  antes de enviar el formulario.")
    }   
    else if(urlImg.files[0].size >= 5242880){
        alert("El archivo es demasiado grande. El tamaño máximo permitido es 5MB.");
        urlImg.value = "";
    }
    else{
        action();
    }
}


function cargarProveedores(){
    const selectProveedor = document.querySelector("#selectProveedor");
    selectProveedor.innerHTML = `<option value="">Seleccione un proveedor</option>`
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };
    
    fetch("http://localhost:8080/api/proveedores/todos", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            listProveedores = result;
                result.forEach(element => {
                    selectProveedor.innerHTML += `<option value="${element.id}">${element.nombreEmpresa}</option>`
                })
        })
        .catch((error) => console.error(error));
}

function obtenerProductos() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
        };
        fetch("http://localhost:8080/api/productos/todos", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            listProductos = result
                result.forEach(element => {
                    fetch(`http://localhost:8080/api/prediccion/valor_venta?precio=${element.precioFinal}`, requestOptions)
                    .then((response) => response.json())
                    .then((xSells) => {
                        const xSellsFixed = parseFloat(xSells).toFixed(2);
                        const precioFixed = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP",  maximumFractionDigits: 0 }).format(element.precioFinal);
                        gallery.innerHTML += 
                        `
                        <clothe-card 
                        urlImg="${element.imgPrenda}"
                        nombrePrenda="${element.nombre}"
                        descripcionPrenda="${element.descripcion}"
                        color="${element.color}"
                        talla="${element.talla}"
                        stock="${element.stock}"
                        precio="${precioFixed}"
                        xSells="${xSellsFixed}"
                        >
                        </clothe-card>
                        `
                        tBody.innerHTML +=
                        `
                        <tr class="odd:bg-white even:bg-gray-50 border-b  dark:bg-gray-800 whitespace-nowrap">
                            <th scope="row" class="flex items-center px-5 py-2 text-gray-900 dark:text-gray-300">
                                <img class="w-9 h-9 rounded-full object-contain" src="${element.imgPrenda}" alt="${element.nombre}">
                                <div class="ps-1 whitespace-nowrap">
                                    <div class="text-base font-semibold">${element.nombre}</div>
                                    <div class="font-normal text-gray-500 dark:text-gray-300"><strong>Talla: </strong>${element.talla} | <strong>Ventas esperadas: </strong>${xSellsFixed}</div>
                                    <div class="font-normal text-gray-500 dark:text-gray-300"><strong></div>
                                </div> 
                            </th>
                            <td class="px-5 py-2 dark:text-gray-50">${precioFixed}</td>
                            <td class="px-5 py-2 dark:text-gray-300">${element.stock}</td>
                            <td class="px-5 py-2 dark:text-gray-300">${element.tipo}</td>
                            <td class="px-5 py-2 dark:text-gray-300">${element.color}</td>
                            <td class="px-5 py-2 text-sm dark:text-gray-300 max-w-xs break-words whitespace-normal">${element.descripcion}</td>
                            <td class="px-5 py-2 dark:text-gray-300">${element.proveedor.nombreEmpresa}</td>
                            <td class="px-5 py-2 -ml-5 flex space-x-2">
                                <i class="fa-solid fa-pen-circle text-green-600 dark:text-green-400 text-3xl cursor-pointer" onclick="editarProducto('modalProduct', ${element.id})"></i>
                                <i class="fa-solid fa-circle-trash text-red-600 dark:text-red-400 text-3xl cursor-pointer" onclick="confirmarEliminacion('deleteModal',${element.id})"></i>
                            </td>
                        </tr>
                        `
                        ;
                    })
                    .catch((error) => console.error(error));
                    
                });
        })
        .catch((error) => console.error(error));
}



function crearProducto(){
    const nombreProducto = document.querySelector("#nombreProducto");
    const urlImg = document.querySelector("#urlImg");
    const pIva = document.querySelector("#pIva");
    const precioInicial  = document.querySelector("#precioInicial");
    const tipoPrenda = document.querySelector("#tipoPrenda");
    const tallaPrenda = document.querySelector("#tallaPrenda");
    const colorPrenda = document.querySelector("#colorPrenda");
    const stockPrenda = document.querySelector("#stockPrenda");
    const descripcionPrenda = document.querySelector("#descripcionPrenda");

    const idProveedor = selectProveedor.value;

    const productoData = {
        "nombre": nombreProducto.value.trim(),
        "color": colorPrenda.value.trim(),
        "descripcion": descripcionPrenda.value,
        "precio": Number(precioInicial.value) ,
        "piva": Number(pIva.value),
        "stock": Number(stockPrenda.value),
        "tipo": tipoPrenda.value.trim(),
        "talla": tallaPrenda.value.trim()
    };

    const producto = new Blob([JSON.stringify(productoData)], {type: 'application/json'});
    const formdata = new FormData();
    formdata.append("producto", producto);
    formdata.append("file", urlImg.files[0]);
    
    const requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow"
    };

    fetch(`http://localhost:8080/api/productos/crear?id_proveedor=${idProveedor}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
            result.forEach(element => {
                fetch(`http://localhost:8080/api/prediccion/valor_venta?precio=${element.precioFinal}`, requestOptions)
                .then((response) => response.json())
                .then((xSells) => {
                    const xSellsFixed = parseFloat(xSells).toFixed(2);
                    const precioFixed = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP",  maximumFractionDigits: 0 }).format(element.precioFinal);
                    gallery.innerHTML += 
                    `
                    <clothe-card 
                    urlImg="${element.imgPrenda}"
                    nombrePrenda="${element.nombre}"
                    descripcionPrenda="${element.descripcion}"
                    color="${element.color}"
                    talla="${element.talla}"
                    stock="${element.stock}"
                    precio="${precioFixed}"
                    xSells="${xSellsFixed}"
                    >
                    </clothe-card>
                    `
                    tBody.innerHTML +=
                    `
                    <tr class="odd:bg-white even:bg-gray-50 border-b  dark:bg-gray-800 whitespace-nowrap">
                        <th scope="row" class="flex items-center px-5 py-2 text-gray-900 dark:text-gray-300">
                            <img class="w-9 h-9 rounded-full" src="${element.imgPrenda}" alt="${element.nombre}">
                            <div class="ps-1 whitespace-nowrap">
                                <div class="text-base font-semibold">${element.nombre}</div>
                                <div class="font-normal text-gray-500 dark:text-gray-300"><strong>Talla: </strong>${element.talla} | <strong>Ventas esperadas: </strong>${xSellsFixed}</div>
                                <div class="font-normal text-gray-500 dark:text-gray-300"><strong></div>
                            </div> 
                        </th>
                        <td class="px-5 py-2 dark:text-gray-50">${precioFixed}</td>
                        <td class="px-5 py-2 dark:text-gray-300">${element.stock}</td>
                        <td class="px-5 py-2 dark:text-gray-300">${element.tipo}</td>
                        <td class="px-5 py-2 dark:text-gray-300">${element.color}</td>
                        <td class="px-5 py-2 text-sm dark:text-gray-300">${element.descripcion}</td>
                        <td class="px-5 py-2 dark:text-gray-300">${element.proveedor.nombreEmpresa}</td>
                        <td class="px-5 py-2 -ml-5 flex space-x-2">
                            <i class="fa-solid fa-pen-circle text-green-600 dark:text-green-400 text-3xl cursor-pointer" onclick="editarProducto('modalProduct', ${element.id})"></i>
                            <i class="fa-solid fa-circle-trash text-red-600 dark:text-red-400 text-3xl cursor-pointer" onclick="confirmarEliminacion('deleteModal',${element.id})"></i>
                        </td>
                    </tr>
                    `
                    ;
                    listProductos.push(element);

                })
                .catch((error) => console.error(error));
                
            });
    })
    .catch((error) => console.error(error));

}


function agregarProducto(modalId){
    openModal(modalId); 
    nombreProducto.value = '';
    urlImg.value = '';
    pIva.value = '';
    precioInicial.value = '';
    tipoPrenda.value = '';
    tallaPrenda.value = '';
    colorPrenda.value = '';
    stockPrenda.value = '';
    descripcionPrenda.value = '';
    tipoAccion.value = "crear"
}

function modificarProducto(){
    
    const productoData = {
        "id": idProducto.value,
        "nombre": nombreProducto.value.trim(),
        "color": colorPrenda.value.trim(),
        "descripcion": descripcionPrenda.value,
        "precio": Number(precioInicial.value) ,
        "piva": Number(pIva.value),
        "stock": Number(stockPrenda.value),
        "tipo": tipoPrenda.value.trim(),
        "talla": tallaPrenda.value.trim()
    };

    const producto = new Blob([JSON.stringify(productoData)], {type: 'application/json'});
    const formdata = new FormData();

    formdata.append("producto", producto);
    formdata.append("file", urlImg.files[0]);
    
    const idProveedor = selectProveedor.value;

    const requestOptions = {
    method: "PUT",
    body: formdata,
    redirect: "follow"
    };

fetch(`http://localhost:8080/api/productos/actualizar?id_proveedor=${idProveedor}`, requestOptions)
    .then((response) => response.json())
    .then(() => {
        listProductos = [];
        tBody.innerHTML = '';
        obtenerProductos();
    })
    .catch((error) => console.error(error));
}

function editarProducto(modalId, id){
    openModal(modalId); 
    const producto = listProductos.find(element => element.id === id);
    idProducto.value = id;
    nombreProducto.value = producto.nombre;
    pIva.value = producto.piva;
    precioInicial.value = producto.precio;
    tipoPrenda.value = producto.tipo;
    tallaPrenda.value = producto.talla;
    colorPrenda.value = producto.color;
    stockPrenda.value = producto.stock;
    descripcionPrenda.value = producto.descripcion;
    selectProveedor.innerHTML = `<option value="${producto.proveedor.id}">${producto.proveedor.nombreEmpresa}</option>`
    tipoAccion.value = "editar"
}

function confirmarEliminacion(modalId, id){
    openModal(modalId); 
    listProductos.find(element => element.id === id);
    idProducto.value = id;
    tipoAccion.value = "borrar";
}

function eliminarProducto(id){
    const requestOptions = {
        method: "DELETE",
        redirect: "follow"
    };
    
    fetch(`http://localhost:8080/api/productos/borrar/${id}`, requestOptions)
        .then((response) => response.text())
        .then(() => {
            listProductos = [];
            tBody.innerHTML = '';
            obtenerProductos();
        })
        .catch((error) => console.error(error));
}

