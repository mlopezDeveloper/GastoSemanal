//Variable y Selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');



//Eventos
eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
}




//Clases





//Funciones
function preguntarPresupuesto(){
    const preguntarUsuario = prompt('¿Cual es tu presupuesto?');
    if(preguntarUsuario)
}