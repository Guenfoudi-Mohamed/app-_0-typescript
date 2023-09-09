"use strict";
// start ***app To Do List***
// === set pattern for input task 
const inpTask = document.querySelector('body .container .form .head .inps input.inpTask');
inpTask.addEventListener('keyup', () => {
    const regEx = /^\W*[a-zA-Z0-9]+\s*\W*/;
    inpTask.value = inpTask.value.trimLeft();
    const inpTestValue = regEx.test(inpTask.value);
    if (inpTestValue === false) {
        inpTask.classList.remove('valid');
        inpTask.classList.add('invalid');
    }
    else if (inpTestValue) {
        inpTask.classList.remove('invalid');
        inpTask.classList.add('valid');
    }
});
// === event for button add Task
const btnAddTask = document.querySelector('body .container .form .head .inps input.btnAdd');
btnAddTask.onclick = function () {
    if (inpTask.classList.contains('valid') === true) {
        const obj = new Task(inpTask.value);
        inpTask.value = ``;
        inpTask.focus();
        inpTask.classList.remove('valid');
    }
    else {
        inpTask.classList.add('invalid');
        inpTask.value = ``;
        inpTask.focus();
    }
};
// === class Task
class Task {
    constructor(valueTask) {
        this.id = Task.idTask(valueTask);
        this.valueTask = valueTask;
        this.createTask();
    }
    // function for CREATE TASK 
    createTask() {
        let arrayObjTasks;
        if (localStorage.getItem('arrayObjTasks') != null) {
            arrayObjTasks = localStorage.getItem('arrayObjTasks');
        }
        else if (localStorage.getItem('arrayObjTasks') === null) {
            localStorage.setItem('arrayObjTasks', JSON.stringify([]));
            arrayObjTasks = localStorage.getItem('arrayObjTasks');
        }
        // UPLOAD OBJ tASKS IN LOCAL STORAGE
        Task.arrayObjTasks = JSON.parse(arrayObjTasks);
        Task.arrayObjTasks.push({ id: this.id, value: this.valueTask });
        localStorage.removeItem('arrayObjTasks');
        localStorage.setItem('arrayObjTasks', JSON.stringify(Task.arrayObjTasks));
        // Create ELEMENT
        const list = document.querySelector('body .container .form .content .list');
        const li = document.createElement('li');
        li.className = `item`;
        li.setAttribute('data-idTask', this.id);
        li.innerHTML = `<a class="task">${this.valueTask}</a><a class="icon icon_edite btn btnEdite" title="Edite"><i class="fa-solid fa-pen"></i></a><a class="icon icon_delete btn btnDelete" title="Delete"><i class="fa-solid fa-trash"></i></a>`;
        list.insertBefore(li, list.children[0]);
        Task.btnEditeTask(li.querySelector('a.btnEdite'), { id: this.id, value: this.valueTask }); //add event for button edite
        Task.btnDeleteTask(li.querySelector('a.btnDelete'), this.id); //add event for button delete
    }
    // display Tasks
    static displayTasks() {
        let arrayObjTasks;
        if (localStorage.getItem('arrayObjTasks') != null) {
            arrayObjTasks = localStorage.getItem('arrayObjTasks');
        }
        Task.arrayObjTasks = JSON.parse(arrayObjTasks);
        const list = document.querySelector('body .container .form .content .list');
        for (let i = 0; i < Task.arrayObjTasks.length; i++) {
            const li = document.createElement('li');
            li.className = `item`;
            li.setAttribute('data-idTask', Task.arrayObjTasks[i].id);
            li.innerHTML = `<a class="task">${Task.arrayObjTasks[i].value}</a><a class="icon icon_edite btn btnEdite" title="Edite"><i class="fa-solid fa-pen"></i></a><a class="icon icon_delete btn btnDelete" title="Delete"><i class="fa-solid fa-trash"></i></a>`;
            list.insertBefore(li, list.children[0]);
            Task.btnEditeTask(li.querySelector('.btnEdite'), Task.arrayObjTasks[i]);
            Task.btnDeleteTask(li.querySelector('.btnDelete'), Task.arrayObjTasks[i].id);
        }
        ;
    }
}
Task.arrayTasksId = [];
Task.idResult = '';
Task.arrayObjTasks = [];
// FUNCTION FOR SET Id to TASK
Task.idTask = function (value) {
    // create id for tasks
    Task.idResult = `${value[0]}${value[value.length - 1]}`;
    for (let i = 0; i < 7; i++) {
        Task.idResult += `${Math.floor(Math.random() * 10)}`;
    }
    // check if include in array 'arrayTasksId' double id or same id for tasks
    let bool = false;
    const arrItems = localStorage.getItem('arrayTasksId') != null ? localStorage.getItem('arrayTasksId') : undefined;
    if (typeof arrItems === 'string' && arrItems != undefined) {
        Task.arrayTasksId = JSON.parse(arrItems);
        for (let i = 0; i < Task.arrayTasksId.length; i++) {
            if (Task.idResult === Task.arrayTasksId[i]) {
                bool = true;
                break;
            }
        }
        bool === true ? Task.idTask(value) : false;
    }
    if (bool === false) {
        Task.arrayTasksId.push(Task.idResult);
        localStorage.removeItem('arrayTasksId');
        localStorage.setItem('arrayTasksId', JSON.stringify(Task.arrayTasksId));
    }
    console.log(Task.idResult);
    return Task.idResult;
};
// add event for button delete
Task.btnDeleteTask = function (btnDelete, objId) {
    btnDelete.addEventListener('click', function () {
        console.log(btnDelete, objId);
        // remove obj from localStorage 'arrayObjTasks'
        const arrayObjTasks = localStorage.getItem('arrayObjTasks');
        Task.arrayObjTasks = typeof arrayObjTasks != null ? JSON.parse(arrayObjTasks) : new Error('arrayObjTasks is null');
        for (let i = 0; i < Task.arrayObjTasks.length; i++) {
            if (Task.arrayObjTasks[i].id === objId) {
                Task.arrayObjTasks.splice(i, 1);
                localStorage.removeItem('arrayObjTasks');
                localStorage.setItem('arrayObjTasks', JSON.stringify(Task.arrayObjTasks));
                break;
            }
        }
        // remove id obj from localStorage 'arrayTasksId'
        const arrayTasksId = localStorage.getItem('arrayTasksId');
        Task.arrayTasksId = typeof arrayTasksId != null ? JSON.parse(arrayTasksId) : new Error('arrayTasksId is null');
        for (let i = 0; i < Task.arrayTasksId.length; i++) {
            if (Task.arrayTasksId[i] === objId) {
                Task.arrayTasksId.splice(i, 1);
                localStorage.removeItem('arrayTasksId');
                localStorage.setItem('arrayTasksId', JSON.stringify(Task.arrayTasksId));
                break;
            }
        }
        // remove element from list element
        const list = document.querySelector('body .container .form .content .list');
        for (let i = 0; i < list.childElementCount; i++) {
            if (list.children[i].getAttribute('data-idTask') === objId) {
                list.removeChild(list.children[i]);
                break;
            }
        }
    });
};
// add event for button edite
Task.btnEditeTask = function (btnEdite, objTask) {
    btnEdite.addEventListener('click', function () {
        const inpTask = document.querySelector('body .container .form .head .inps input.inpTask');
        inpTask.classList.remove('invalid');
        inpTask.classList.remove('valid');
        inpTask.value = ``;
        // get valueTask of objTask from localStorage'arrayObjTasks'
        let valueTask;
        Task.arrayObjTasks = JSON.parse(localStorage.getItem('arrayObjTasks'));
        for (let i = 0; i < Task.arrayObjTasks.length; i++) {
            if (Task.arrayObjTasks[i].id === objTask.id) {
                valueTask = Task.arrayObjTasks[i].value;
                break;
            }
        }
        // display popUp Edite Task
        const div = document.createElement('div');
        div.className = 'popUpEditeTask';
        div.innerHTML = `<div class="formEditeTask" >
                                <textarea class="textarea valid" maxlength="100" autofocus="" focus="">${valueTask}</textarea>
                                <div class="inpButtons" >
                                    <input type="button" class="btn btnCancel" value="Cancel" title="cancel"><input type="button" class="btn btnSave" value="save" title="save">
                                </div>
                            </div>`;
        document.body.children[0].append(div);
        // add event for button cancel 
        const btnCancel = div.querySelector('.formEditeTask .inpButtons .btn.btnCancel');
        btnCancel.addEventListener('click', function () {
            inpTask.focus();
            div.remove();
        });
        // add event for textarea check value 
        const textarea = div.querySelector('.formEditeTask textarea.textarea'); //textArea html element
        textarea.focus();
        textarea.addEventListener('keyup', () => {
            const regEx = /^\W*[a-zA-Z0-9]+\s*\W*/;
            textarea.value = textarea.value.trimLeft();
            const textareaTestValue = regEx.test(textarea.value);
            if (textareaTestValue === false) {
                textarea.classList.remove('valid');
                textarea.classList.add('invalid');
            }
            else if (textareaTestValue) {
                textarea.classList.remove('invalid');
                textarea.classList.add('valid');
            }
        });
        // add event for btnSave 
        const btnSave = div.querySelector('.formEditeTask .inpButtons .btn.btnSave');
        btnSave.addEventListener('click', function () {
            const stockValue = textarea.value;
            if (textarea.classList.contains('valid') === true && textarea.value.trim() === valueTask) { // if the textarea has same value
                console.error('wtf Change the value !!');
                textarea.focus();
                textarea.value = 'Change the value !!';
                textarea.classList.remove('valid');
                textarea.classList.add('invalid');
                setTimeout(function () {
                    textarea.value = stockValue;
                }, 500);
            }
            else if (textarea.classList.contains('invalid') == true && textarea.value.length === 0) { // if the textarea is empty
                textarea.value = 'Fill in the input field';
                setTimeout(function () {
                    textarea.value = stockValue;
                    textarea.focus();
                }, 500);
            }
            else if (textarea.classList.contains('valid') === true && textarea.value.trim() !== valueTask) {
                // upDate data 'value' => obj in localStorage
                Task.arrayObjTasks = JSON.parse(localStorage.getItem('arrayObjTasks'));
                for (let i = 0; i < Task.arrayObjTasks.length; i++) {
                    if (objTask.id === Task.arrayObjTasks[i].id) {
                        Task.arrayObjTasks[i].value = textarea.value;
                        localStorage.removeItem('arrayObjTasks');
                        localStorage.setItem('arrayObjTasks', JSON.stringify(Task.arrayObjTasks));
                        break;
                    }
                }
                // upDate data in element task Obj 'list.Item' Element
                const list = document.querySelector('body .container .form .content .list');
                for (let i = 0; i < list.childElementCount; i++) {
                    if (list.children[i].getAttribute('data-idtask') === objTask.id) {
                        const a = list.children[i].querySelector('.task');
                        a.textContent = textarea.value;
                        break;
                    }
                }
                div.remove();
            }
        });
    });
};
window.addEventListener('DOMContentLoaded', function () {
    Task.displayTasks();
    inpTask.value = ``;
    inpTask.classList.remove('valid');
    inpTask.classList.remove('invalid');
    inpTask.focus();
});
