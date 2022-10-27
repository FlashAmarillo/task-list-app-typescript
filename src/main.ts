import { v4 } from 'uuid';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import './style.css'

/* Automatizacion para los console.log */
//let c = console.log.bind(document);

// formulario
const taskForm = document.querySelector<HTMLFormElement>('#taskForm');

// seleccionamos nuestro div que mostrara los tasks
const tasksList = document.querySelector<HTMLDivElement>('#tasksList');

interface Task {
    title: string,
    description: string,
    id: String
}
// arreglo con la lista de tareas
let tasks: Task[] = [];

taskForm?.addEventListener('submit', e => {
    e.preventDefault();
    
    const title = taskForm['title'] as unknown as HTMLInputElement;
    const description = taskForm['description'] as unknown as HTMLTextAreaElement;

    tasks.push({
        title: title.value,
        description: description.value,
        id : v4()
    })

    localStorage.setItem('tasks', JSON.stringify(tasks)); 

    // dispara la alerta
    Toastify({

        text: "Tarea Guardada",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        duration: 2000
        
    }).showToast();


    // renderizamos las tareas en el DOM
    renderTasks(tasks);
    
    //reseteamos el formulario 
    taskForm.reset();

    //enfocamos el input del titulo una vez reiniciado el form
    title.focus();


    
})

document.addEventListener('DOMContentLoaded', e => {
    e.preventDefault();

    // al cargarse la pagina se obtienen los tasks de LS
    tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

    renderTasks(tasks);
})

// funcion para mostrar tareas
function renderTasks(tasks: Task[]) {

    tasksList!.innerHTML = '';

    tasks.forEach(tarea => {

        const taskElement = document.createElement('DIV');
        taskElement.className = 'bg-zinc-800 mb-2 rounded-lg hover:bg-zinc-700 hover:pointer transition-colors p-4';
        
        const header = document.createElement('HEADER');
        header.className = 'flex justify-between'

        // creacion del titulo
        const title = document.createElement('SPAN');
        title.innerText = tarea.title;

        //creación del boton eliminar
        const btnEliminar = document.createElement('BUTTON');
        btnEliminar.className = 'px-2 py-1 bg-red-500 text-white text-center font-bold text-sm rounded-md hover:bg-red-700 transition-colors'
        btnEliminar.innerText = 'Delete'
        btnEliminar.id = 'btnEliminar'

        //funcion para el boton eliminar
        btnEliminar.addEventListener('click', e => {
            e.preventDefault();
            const index = tasks.findIndex( task => task.id === tarea.id);
            tasks.splice(index, 1);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks(tasks);

            //evento de toastyify para mostrar alerta
            Toastify({

                text: "Tarea Eliminada",
                
                duration: 2000
                
            }).showToast();
        })

        //creacion del parrafo
        const parrafo = document.createElement('P');
        parrafo.className = 'text-gray-400 text-xs'
        parrafo.innerText = tarea.description;

        // Insertamos el titulo y el boton al header
        header.appendChild(title);
        header.appendChild(btnEliminar);

        //insertamos el header y el parrafo dentro del taskElement y este dentro del taskList
        taskElement.appendChild(header);
        taskElement.appendChild(parrafo);

        tasksList?.appendChild(taskElement);

    })
}