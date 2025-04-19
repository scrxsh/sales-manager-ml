let listaVentas = []
let listaClientes = []
let listaEmpleados = []
let listaProductos = []
const tBody = document.querySelector("#tBody")

obtenerVentas();
cargarCliente();
cargarEmpleado();
cargarProductos();

function cargarCliente(){
    const selectCliente = document.querySelector("#selectCliente");
    selectCliente.innerHTML = `<option value="">Seleccione un cliente</option>`
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };
    
    fetch("http://localhost:8080/api/clientes/todos", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            listaClientes = result;
                result.forEach(element => {
                    selectCliente.innerHTML += `<option value="${element.id}">${element.nombre}</option>`
                })
        })
        .catch((error) => console.error(error));
}

function cargarEmpleado(){
    const selectEmpleado = document.querySelector("#selectEmpleado");
    selectEmpleado.innerHTML = `<option value="">Seleccione un empleado</option>`
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };
    
    fetch("http://localhost:8080/api/empleados/todos", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            listaEmpleados = result;
                result.forEach(element => {
                    selectEmpleado.innerHTML += `<option value="${element.id}">${element.nombre}</option>`
                })
        })
        .catch((error) => console.error(error));
}
function cargarProductos(){
    const selectProducto = document.querySelector("#selectProducto");
    selectProducto.innerHTML = `<option value="">Seleccione un producto</option>`
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };
    
    fetch("http://localhost:8080/api/productos/todos", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            listaProductos = result;
                result.forEach(element => {
                    selectProducto.innerHTML += `<option value="${element.id}">${element.nombre}</option>`
                })
        })
        .catch((error) => console.error(error));
}
function obtenerVentas(){
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };
    
    fetch("http://localhost:8080/api/ventas/todos", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            listaVentas = result;
            result.forEach(element => {
                let valorFinal = 0;
                element.detalleVenta.forEach(detalle => {
                    valorFinal += detalle.subtotal;
                });
                const fechaVentaFixed = new Date(element.fechaVenta).toLocaleDateString('es-CO', { weekday:"short", year:"numeric", month:"short", day:"numeric",hour: '2-digit', minute: '2-digit', hour12: true});
                const valorFinalFixed = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP",  maximumFractionDigits: 2 }).format(valorFinal);
                tBody.innerHTML +=
                `
                <tr class="odd:bg-white even:bg-gray-50 border-b dark:bg-gray-800">
                    <th scope="row" class="px-2 py-1 text-gray-900 dark:text-gray-50 whitespace-nowrap">V0${element.id}</th>
<<<<<<< HEAD
                    <th scope="row" class="px-2 py-1 dark:text-gray-300">${element.cliente.nombre}</th>
                    <th scope="row" class="px-2 py-1 dark:text-gray-300">${element.empleado.nombre}</th>
                    <td class="px-2 py-1 dark:text-gray-200">${fechaVentaFixed}</td>
                    <td class="px-2 py-1 dark:text-gray-200">${valorFinalFixed}</td>
=======
                    <th scope="row" class="px-2 py-1" dark:text-gray-200>${element.cliente.nombre}</th>
                    <th scope="row" class="px-2 py-1" dark:text-gray-200>${element.empleado.nombre}</th>
                    <td class="px-2 py-1 dark:text-gray-300">${fechaVentaFixed}</td>
                    <td class="px-2 py-1 dark:text-gray-300">${valorFinalFixed}</td>
>>>>>>> f16f3dbd73c5524a4d9cb39f9f6998a384ac06cb
                    <td class="px-2 py-1 -ml-5 flex space-x-2">
                        <i class="fa-solid fa-file-pdf text-yellow-600 dark:text-yellow-400 text-3xl cursor-pointer" onclick="obtenerFactura(${element.id})"></i>
                    </td>
                </tr>
                `
            });
        })
        .catch((error) => console.error(error));
}


function obtenerFactura(id) {
    const fechaActual = new Date().toLocaleDateString('es-CO', {hour: '2-digit', minute: '2-digit', hour12: false});

    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };
    
    fetch(`http://localhost:8080/api/ventas/factura/pdf/${id}`, requestOptions)
    .then((response) => {
        if (!response.ok) {
            throw new Error("Error en la descarga de la factura");
        }
        return response.blob();
    })
    .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `F0${id}-${fechaActual}.pdf`; 
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    })
    .catch((error) => console.error("Error al descargar la factura:", error));
}

function crearVenta(){
    const selectCliente = document.querySelector("#selectCliente");
    const selectEmpleado = document.querySelector("#selectEmpleado");
    
    const idCliente = selectCliente.value;
    const idEmpleado = selectEmpleado.value;

    const productItems = document.querySelectorAll("[id^='producto-item-']");
    const detalles = []

    productItems.forEach(item => {
        const idProducto = item.querySelector("#product-select").value;
        const cantidad = parseInt(item.querySelector("#cantidad-input").value);

        detalles.push({
            "id_producto": idProducto,
            "cantidad": cantidad
        });
    });

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "id_cliente": idCliente,
        "id_empleado": idEmpleado,
        "detalles": detalles
    });

    const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
    };

fetch("http://localhost:8080/api/ventas/crear", requestOptions)
    .then((response) => response.json())
    .then((element) => {
        let valorFinal = 0;
        element.detalleVenta.forEach(detalle => {
            valorFinal += detalle.subtotal;
        });
        const fechaVentaFixed = new Date(element.fechaVenta).toLocaleDateString('es-CO', { weekday:"short", year:"numeric", month:"short", day:"numeric",hour: '2-digit', minute: '2-digit', hour12: true});
        const valorFinalFixed = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP",  maximumFractionDigits: 2 }).format(valorFinal);
        tBody.innerHTML +=
        `
        <tr class="odd:bg-white even:bg-gray-50 border-b dark:bg-gray-800">
<<<<<<< HEAD
            <th scope="row" class="px-2 py-1 text-gray-900 dark:text-gray-50 whitespace-nowrap">V0${element.id}</th>
            <th scope="row" class="px-2 py-1" dark:text-gray-50>${element.cliente.nombre}</th>
            <th scope="row" class="px-2 py-1" dark:text-gray-50>${element.empleado.nombre}</th>
            <td class="px-2 py-1 dark:text-gray-300">${fechaVentaFixed}</td>
            <td class="px-2 py-1 dark:text-gray-300">${valorFinalFixed}</td>
            <td class="px-2 py-1 -ml-5 flex space-x-2">
                <i class="fa-solid fa-file-pdf text-yellow-600 dark:text-yellow-400 text-3xl cursor-pointer" onclick="obtenerFactura(${element.id})"></i>
=======
            <th scope="row" class="px-2 py-1 text-gray-900 whitespace-nowrap">${element.id}</th>
            <th scope="row" class="px-2 py-1">${element.empleado.nombre}</th>
            <td class="px-2 py-1">${element.cliente.nombre}</td>
            <td class="px-2 py-1">${fechaVentaFixed}</td>
            <td class="px-2 py-1">${valorFinalFixed}</td>
            <td class="px-2 py-1 -ml-5 flex space-x-2">
                <i class="fa-solid fa-file-pdf text-yellow-600 text-3xl cursor-pointer" onclick="obtenerFactura(${element.id})"></i>
>>>>>>> f16f3dbd73c5524a4d9cb39f9f6998a384ac06cb
            </td>
        </tr>
        `
        selectCliente.value = "";
        selectEmpleado.value = "";
        document.querySelectorAll("[id^='producto-item-']").forEach(item => item.remove());
        listaVentas.push(element);
    })
    .catch((error) => console.error(error));
}

function agregarProducto(){
    document.querySelector('#infoProductosVenta').classList.remove('hidden');

    const infoVenta = document.querySelector("#infoVenta");
    const selectProducto = document.querySelector("#selectProducto");
    const idProducto = selectProducto.value;
    const unidadesVendidas = document.querySelector("#unidadesVendidas");
    const cantidad = unidadesVendidas.value;
    const productosContainer = document.querySelector("#productosContainer");
    const nuevoProducto = document.createElement("div");
    const tBodyInfoProductos = document.querySelector("#tBodyInfoProductos")

    nuevoProducto.id = "producto-item-" + (document.querySelectorAll("[id^='producto-item-']").length + 1);

    nuevoProducto.innerHTML = `
        <input type="hidden" id="product-select" value="${idProducto}">
        <input type="hidden" id="cantidad-input" value="${cantidad}">
    `;

    productosContainer.appendChild(nuevoProducto);

    const productoSeleccionado = listaProductos.find(producto => producto.id == idProducto);
    
    infoVenta.textContent = `El producto "${productoSeleccionado.nombre}" se agregó satisfactoriamente con ${cantidad} unidades vendidas`;
    setTimeout(() => {
            infoVenta.textContent = "";
    }, 3000); 
    


    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };
    
    fetch(`http://localhost:8080/api/productos/${idProducto}`, requestOptions)
        .then((response) => response.json())
        .then((product) => {
            const precioPagado = product.precioFinal * cantidad
            const precioFormat = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP",  maximumFractionDigits: 0 }).format(precioPagado);
            let imgUrl = product.imgPrenda;
            console.log(imgUrl)
            tBodyInfoProductos.innerHTML += 
            `
            <tr class="bg-white border-b border-gray-200 hover:bg-gray-50 id="producto-row-${idProducto}">
                <td class="p-4"> <img src="${product.imgPrenda}" class="w-16 md:w-32 max-w-full max-h-full" alt="Apple Watch"></td>
                <td class="px-4 py-2 font-semibold text-gray-900">${product.nombre}</td>
                <td class="px-4 py-2 font-semibold text-gray-900">${cantidad}</td>
                <td class="px-4 py-2">${precioFormat}</td>
                <td class="px-4 py-2"><i class="fa-solid fa-do-not-enter text-2xl text-red-600")"></i>
            </tr>
            `
        })
        .catch((error) => console.error(error));

    selectProducto.value = "";
    unidadesVendidas.value = ""
}



function agregarVenta(modalId){
    openModal(modalId); 
}
