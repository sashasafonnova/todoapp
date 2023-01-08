'use strict'

const regExpTaskText = /\S/;

const input = document.querySelector('.add-task__input');
const form = document.querySelector('form');

const btnAllDelete = document.querySelector('.tasks__btn-all-delete');
const btnAllDoneDelete= document.querySelector('.tasks__btn-done-delete');

const tasksList = document.querySelector('.tasks__list');
const tasksTitle = document.querySelector('.tasks__title');
const messageEmptyList = document.querySelector('.tasks__message');

const btnInfo = document.querySelector('.header__btn-info');
const infoBlock = document.querySelector("#info");

let tasks = [];


if (localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'));

    tasks.forEach(el => {
        createTask(el);
    })
    
    calcTasks();
    showMessageEmptyList()
    showBtnAllDone();
    showBtnAllDelete();
}    



form.addEventListener('submit', (event) => {

    event.preventDefault();

        if (regExpTaskText.test(input.value)){
                    
            const newTask = {
                id: Date.now(),
                text: input.value,
                done: false,
            }

            tasks.push(newTask);
            saveToLocalStorage();

            createTask(newTask);

            form.reset(); 
            input.focus(); 

            calcTasks();
            showBtnAllDone();
            showMessageEmptyList();
            showBtnAllDelete();
    }    
});



tasksList.addEventListener('click', (event) => {

    if (event.target.classList.contains('tasks__btn-delete')){
        const parentTask = event.target.closest('.tasks__item');
        const parentId = Number(parentTask.id);


        tasks = tasks.filter( (el) => {
            if (el.id !== parentId){
                return true;
            }
        })

        saveToLocalStorage();
        parentTask.remove();

        calcTasks();
        showBtnAllDone();
        showMessageEmptyList();
        showBtnAllDelete();
    }      
});



tasksList.addEventListener('click', (event) => {
    
        if (event.target.classList.contains('tasks__btn-done')){

            const btnTaskDone = event.target;
            btnTaskDone.classList.toggle('tasks__btn-done--active');

            const parentTask = btnTaskDone.closest('.tasks__item');
            parentTask.classList.toggle('tasks__item--done');

            const parentId = Number(parentTask.id);
    
            tasks.find( (el) => {
                if (el.id === parentId){
                    el.done = !el.done
                }
            })
    
            saveToLocalStorage();
            showBtnAllDone();
        }
});



btnAllDoneDelete.addEventListener('click', () => {

        const allDoneTasks = tasksList.querySelectorAll('.tasks__item--done');
    
        allDoneTasks.forEach(el => {
            const elId = el.id;
    
            tasks = tasks.filter(el => {
                if (el.id !== Number(elId)){
                    return true;
                }
            })

            
            el.remove();
        })
    
        btnAllDoneDelete.classList.add('dsp-none');
        calcTasks();
        saveToLocalStorage();
        
        showBtnAllDelete();
        showMessageEmptyList();
        
});




btnAllDelete.addEventListener("click", () => {
    tasks = [];
    saveToLocalStorage();
    const tasksItems = tasksList.querySelectorAll('.tasks__item');
    tasksItems.forEach((el) => {
        el.remove();
    })


    calcTasks();
    showBtnAllDone();
    showMessageEmptyList();
    showBtnAllDelete();
});




btnInfo.addEventListener('click', () => {
    
    infoBlock.classList.remove('dsp-none');

    function showInfoBlock () {
        infoBlock.classList.add('dsp-none'); 
    };

    document.querySelector('.info__btn-close').addEventListener('click', showInfoBlock);

    infoBlock.addEventListener('click', showInfoBlock);

    infoBlock.querySelector('.info__content').addEventListener('click', (event) => {
        event.stopPropagation();
        console.log('клик по контенту');
    })
})




function createTask(el){

    const elClass = el.done ? 'tasks__item tasks__item--done' : 'tasks__item';
    const elBtnClass = el.done ? 'tasks__btn-done tasks__btn-done--active' : 'tasks__btn-done';

    const newTaskHTML =     
            `<li class="${elClass}" id="${el.id}">
                <p class="tasks__item-text">${el.text}</p>
                <div class="tasks__item-btns">
                    <button class="${elBtnClass}"></button>
                    <button class="tasks__btn-delete"></button>
                </div>
            </li>`;

    tasksList.insertAdjacentHTML("afterBegin", newTaskHTML);
}



function saveToLocalStorage(){
    localStorage.setItem('tasks', JSON.stringify(tasks));
}



function calcTasks(){
    if (tasks.length > 0){    
        tasksTitle.innerText = `Your tasks (${tasks.length})`;
    } else {
        tasksTitle.innerText = `Your tasks`;
    }
}


function showBtnAllDone(){
    const allDoneTasks = tasksList.querySelectorAll('.tasks__item--done');
    
    if (allDoneTasks.length > 1 && allDoneTasks.length !== tasks.length){
        btnAllDoneDelete.classList.remove('dsp-none');
    } else {
        btnAllDoneDelete.classList.add('dsp-none');
    }
}



function showBtnAllDelete(){
    if (tasks.length > 1){
        btnAllDelete.classList.remove('dsp-none')
    } else {
        btnAllDelete.classList.add('dsp-none')
    }
    
}



function showMessageEmptyList(){
    if(tasks.length > 0){
        messageEmptyList.classList.add('dsp-none');
    } else {
        messageEmptyList.classList.remove('dsp-none');
    }
}
