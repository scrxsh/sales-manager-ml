ventasEsperadas()


function ventasEsperadas(){
    const requestOptions = {
        method: "POST",
        redirect: "follow"
    };
    fetch("http://localhost:8080/api/prediccion/entrenar", requestOptions)
        .then((response) => response.text())
        .catch((error) => console.error(error));
}