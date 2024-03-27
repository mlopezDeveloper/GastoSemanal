//Variable y Selectores

const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

//Eventos

eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);
}

//Clases

class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    //metodo
    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0 );
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter( gasto => gasto.id !== id);
        this.calcularRestante();
    }
}

class UI{
    insertarPresupuesto(cantidad){//medodo y cantidad es un objeto

        //Extrayendo los valores
        const { presupuesto, restante } = cantidad;

        //Agregar al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    } 

    imprimirAlerta(mensaje, tipo){
        //crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success');
        }

        //Mensaje de error
        divMensaje.textContent = mensaje;

        //Insertamos en el HTML
        //insertBefore toma dos argumentos, lo que vamos a insertar en este caso el mensaje y el segundo en que parte lo vamos a colocar
        document.querySelector('.primario').insertBefore( divMensaje, formulario);

        //Quitar del HTML
        setTimeout(() => {
            divMensaje.remove();
        },3000);
    }
    
    mostrarGastos(gastos){

        this.limpiarHTML(); //Elimina el html previo

        //iterar sobre los gastos
        gastos.forEach( gasto => {//gastos es un arreglo de objetos
            const { cantidad, nombre, id} = gasto;
            //Crear un LI
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = "list-group-item d-flex justify-content-between align-items-center";
            //nuevoGasto.setAttribute('data-id', id);//agrega atributos es lo mismo que abajo
            nuevoGasto.dataset.id = id;
            //Agregar el HTML del gasto
            nuevoGasto.innerHTML = `${nombre}<span class="badge badge-primary badge-pill">$${cantidad}</span>`;
            //Boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn','btn-danger','borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times;'
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);
            //Agregar al HTML
            gastoListado.appendChild(nuevoGasto);
        })
    }

    limpiarHTML(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestObj){
        const { presupuesto, restante} = presupuestObj;
        const restanteDiv = document.querySelector('.restante');

        //Comprobar 25%
        if( ( presupuesto / 4 ) > restante ){//gastamos mas del 75%
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        }else if( ( presupuesto / 2 ) > restante ){//50%
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        }else{
            restanteDiv.classList.remove('alert-danger','alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        //Si el total es 0 o menor
        if(restante <= 0){
            ui.imprimirAlerta('El presupuesto se ha agotado','error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}

// Instanciar

const ui = new UI();//forma global porque vamos acceder desde varias funciones
let presupuesto;


//Funciones

function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?');
    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        window.location.reload();//se recarga la pagina 
    }

    //Presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);
    
    ui.insertarPresupuesto(presupuesto);
}

//Añade gastos
function agregarGasto(e){
    e.preventDefault();

    //Leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    //Validar
    if(nombre === '' || cantidad === ''){
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    }else if( cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no valida','error');
        return;
    }

    /*
        diferencias
        const {nombre, cantidad} = gasto -> extrae nombre y cantidad de gasto
        const gasto = {nombre, cantidad} -> une nombre y cantidad a gasto
    
    */

    //Generar un objeto con el gasto
    const gasto = { nombre, cantidad, id: Date.now() }
    /*
    tambien se pued escribir 
    const gasto = { 
        nombre: nombre, pero como son iguales podemos poner directamente como arriba solo nombre
        cantidad: cantidad, 
        id: Date.now() 
    }
    */
    //Añade un nuevo gasto
    presupuesto.nuevoGasto(gasto);

    //Mensaje de todo bien
    ui.imprimirAlerta('Gasto agregado Correctamente');

    //Imprimir los gastos
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    //Reinicia el formulario
    formulario.reset();
}

function eliminarGasto(id){
    //Elimina del objeto
    presupuesto.eliminarGasto(id);
    //Elimina los gastos del HTML
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}