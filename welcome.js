function cargaNombre(event)
{
    localStorage.clear();
    // event.preventDefault();
    let nombre = document.getElementById("loadName").value;
    localStorage.setItem("nombre",nombre);
}