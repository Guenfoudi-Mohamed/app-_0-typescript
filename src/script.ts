// start ***app To Do List***

// === set pattern for input task 
const inpTask = document.querySelector('body .container .form .head .inps input.inpTask') as HTMLInputElement;
inpTask.addEventListener('keyup',() : void =>  {
    const regEx : RegExp = /^\W*[a-zA-Z0-9]+\s*\W*/;
    inpTask.value = inpTask.value.trimLeft();
    const inpTestValue : boolean = regEx.test(inpTask.value);
    if(inpTestValue === false){
        inpTask.classList.remove('valid');
        inpTask.classList.add('invalid');
    }
    else if(inpTestValue){
        inpTask.classList.remove('invalid');
        inpTask.classList.add('valid');
    }
});


// === event for button add Task
const btnAddTask = document.querySelector('body .container .form .head .inps input.btnAdd') as HTMLButtonElement;
btnAddTask.onclick = function(){
    if(inpTask.classList.contains('valid') === true){
        const obj = new Task(inpTask.value);
        inpTask.value = ``;
        inpTask.focus();
        inpTask.classList.remove('valid');
    }else{
        inpTask.classList.add('invalid');
        inpTask.value = ``;
        inpTask.focus();
    }    
};

// === class Task
class Task{
    private static arrayTasksId : string[] = [];
    private static idResult : string = '';
    private static arrayObjTasks : {id:string,value:string}[] = [];

    private id: string;
    private valueTask : string;

    constructor(valueTask:string){
        this.id = Task.idTask(valueTask);
        this.valueTask = valueTask;
        this.createTask();
    }

    // FUNCTION FOR SET Id to TASK
    private static idTask = function(value:string) : string{
        // create id for tasks
        Task.idResult = `${value[0]}${value[value.length-1]}`;
        for(let i : number = 0;i<7;i++){
            Task.idResult += `${Math.floor(Math.random() * 10)}`;
        }
        // check if include in array 'arrayTasksId' double id or same id for tasks
        let bool : boolean = false;
        const arrItems : (string|null|undefined) = localStorage.getItem('arrayTasksId') != null? localStorage.getItem('arrayTasksId'):undefined;
        if(typeof arrItems === 'string' && arrItems != undefined){
            Task.arrayTasksId = JSON.parse(arrItems);
            for(let i : number = 0;i<Task.arrayTasksId.length;i++){
                if(Task.idResult === Task.arrayTasksId[i]){
                    bool = true;
                    break;
                }
            }
            bool === true? Task.idTask(value) :  false;
        } 
        if(bool === false){
            Task.arrayTasksId.push(Task.idResult);
            localStorage.removeItem('arrayTasksId');
            localStorage.setItem('arrayTasksId',JSON.stringify(Task.arrayTasksId));
        }
        console.log(Task.idResult);
        return Task.idResult;
    }

    // function for CREATE TASK 
    private createTask() : void{
        let arrayObjTasks : string|undefined|null;
        if(localStorage.getItem('arrayObjTasks') != null){
            arrayObjTasks = localStorage.getItem('arrayObjTasks');
        }
        else if(localStorage.getItem('arrayObjTasks') === null){
            localStorage.setItem('arrayObjTasks',JSON.stringify([]))
            arrayObjTasks = localStorage.getItem('arrayObjTasks');
        }
            // UPLOAD OBJ tASKS IN LOCAL STORAGE
            Task.arrayObjTasks = JSON.parse(arrayObjTasks as string);
            Task.arrayObjTasks.push({id:this.id,value:this.valueTask});
            localStorage.removeItem('arrayObjTasks');
            localStorage.setItem('arrayObjTasks',JSON.stringify(Task.arrayObjTasks));
            
            // Create ELEMENT
            const list = document.querySelector('body .container .form .content .list') as HTMLUListElement;
            const li = document.createElement('li') as HTMLLIElement;
            li.className = `item`;
            li.setAttribute('data-idTask',this.id);
            li.innerHTML = `<a class="task">${this.valueTask}</a><a class="icon icon_edite btn btnEdite" title="Edite"><i class="fa-solid fa-pen"></i></a><a class="icon icon_delete btn btnDelete" title="Delete"><i class="fa-solid fa-trash"></i></a>`;
            list.insertBefore(li,list.children[0]);
            Task.btnEditeTask(li.querySelector('a.btnEdite') as HTMLAnchorElement,{id:this.id,value:this.valueTask});    //add event for button edite
            Task.btnDeleteTask(li.querySelector('a.btnDelete') as HTMLAnchorElement,this.id);    //add event for button delete
    }

    // display Tasks
    static displayTasks() : void {
        let arrayObjTasks : string|undefined|null;
        if(localStorage.getItem('arrayObjTasks') != null){
            arrayObjTasks = localStorage.getItem('arrayObjTasks');
        }
        Task.arrayObjTasks = JSON.parse(arrayObjTasks as string);
        const list = document.querySelector('body .container .form .content .list') as HTMLUListElement;
        for(let i : number = 0;i<Task.arrayObjTasks.length;i++){
            const li = document.createElement('li') as HTMLLIElement;
            li.className = `item`;
            li.setAttribute('data-idTask',Task.arrayObjTasks[i].id);
            li.innerHTML = `<a class="task">${Task.arrayObjTasks[i].value}</a><a class="icon icon_edite btn btnEdite" title="Edite"><i class="fa-solid fa-pen"></i></a><a class="icon icon_delete btn btnDelete" title="Delete"><i class="fa-solid fa-trash"></i></a>`;
            list.insertBefore(li,list.children[0]);
            Task.btnEditeTask(li.querySelector('.btnEdite') as HTMLAnchorElement,Task.arrayObjTasks[i]);
            Task.btnDeleteTask(li.querySelector('.btnDelete') as HTMLAnchorElement,Task.arrayObjTasks[i].id);
        };
    }

    // add event for button delete
    private static btnDeleteTask = function(btnDelete:HTMLAnchorElement,objId:string) : void {
        btnDelete.addEventListener('click',function(){
            console.log(btnDelete,objId);
            // remove obj from localStorage 'arrayObjTasks'
            const arrayObjTasks : string|null = localStorage.getItem('arrayObjTasks');
            Task.arrayObjTasks  = typeof arrayObjTasks != null ?  JSON.parse(arrayObjTasks as string) : new Error('arrayObjTasks is null');
            for(let i : number = 0;i<Task.arrayObjTasks.length;i++){
                if(Task.arrayObjTasks[i].id === objId){
                    Task.arrayObjTasks.splice(i,1);
                    localStorage.removeItem('arrayObjTasks');
                    localStorage.setItem('arrayObjTasks',JSON.stringify(Task.arrayObjTasks));
                    break;
                }
            }
            // remove id obj from localStorage 'arrayTasksId'
            const arrayTasksId : string|null = localStorage.getItem('arrayTasksId');
            Task.arrayTasksId  = typeof arrayTasksId != null ?  JSON.parse(arrayTasksId as string) : new Error('arrayTasksId is null');
            for(let i : number = 0;i<Task.arrayTasksId.length;i++){
                if(Task.arrayTasksId[i] === objId){
                    Task.arrayTasksId.splice(i,1);
                    localStorage.removeItem('arrayTasksId');
                    localStorage.setItem('arrayTasksId',JSON.stringify(Task.arrayTasksId));
                    break;
                }
            }
            // remove element from list element
            const list = document.querySelector('body .container .form .content .list') as HTMLUListElement;
            for(let i : number = 0;i<list.childElementCount;i++){
                if(list.children[i].getAttribute('data-idTask') === objId){
                    list.removeChild(list.children[i]);
                    break;
                }
            }
        });
    }

    // add event for button edite
    private static btnEditeTask = function(btnEdite:HTMLAnchorElement,objTask:{id:string,value:string}) : void{
        btnEdite.addEventListener('click',function(){
            const inpTask = document.querySelector('body .container .form .head .inps input.inpTask') as HTMLInputElement; 
            inpTask.classList.remove('invalid');
            inpTask.classList.remove('valid');
            inpTask.value = ``;
            // get valueTask of objTask from localStorage'arrayObjTasks'
            let valueTask : string|undefined;
            Task.arrayObjTasks = JSON.parse(localStorage.getItem('arrayObjTasks') as string);
            for(let i : number = 0;i<Task.arrayObjTasks.length;i++){
                if(Task.arrayObjTasks[i].id === objTask.id){
                    valueTask = Task.arrayObjTasks[i].value;
                    break;
                }
            }
            // display popUp Edite Task
            const div = document.createElement('div') as HTMLDivElement;
            div.className = 'popUpEditeTask';
            div.innerHTML = `<div class="formEditeTask" >
                                <textarea class="textarea valid" maxlength="100" autofocus="" focus="">${valueTask}</textarea>
                                <div class="inpButtons" >
                                    <input type="button" class="btn btnCancel" value="Cancel" title="cancel"><input type="button" class="btn btnSave" value="save" title="save">
                                </div>
                            </div>`;
            document.body.children[0].append(div);
            // add event for button cancel 
            const btnCancel = div.querySelector('.formEditeTask .inpButtons .btn.btnCancel') as HTMLInputElement;
            btnCancel.addEventListener('click',function(){
                inpTask.focus();
                div.remove();
            });
            // add event for textarea check value 
            const textarea = div.querySelector('.formEditeTask textarea.textarea') as HTMLTextAreaElement;  //textArea html element
            textarea.focus();
            textarea.addEventListener('keyup',() : void =>  {
                const regEx : RegExp = /^\W*[a-zA-Z0-9]+\s*\W*/;
                textarea.value = textarea.value.trimLeft();
                const textareaTestValue : boolean = regEx.test(textarea.value);
                if(textareaTestValue === false){
                    textarea.classList.remove('valid');
                    textarea.classList.add('invalid');
                }
                else if(textareaTestValue){
                    textarea.classList.remove('invalid');
                    textarea.classList.add('valid');
                }
            });
            // add event for btnSave 
            const btnSave = div.querySelector('.formEditeTask .inpButtons .btn.btnSave') as HTMLInputElement;
            btnSave.addEventListener('click',function(){
                const stockValue : string = textarea.value;
                if(textarea.classList.contains('valid') === true && textarea.value.trim() === valueTask){ // if the textarea has same value
                    console.error('wtf Change the value !!');
                    textarea.focus();
                    textarea.value = 'Change the value !!';
                    textarea.classList.remove('valid')
                    textarea.classList.add('invalid')
                    setTimeout(function(){
                        textarea.value = stockValue;
                    },500);
                }
                else if(textarea.classList.contains('invalid') == true && textarea.value.length === 0){ // if the textarea is empty
                    textarea.value = 'Fill in the input field';
                    setTimeout(function(){
                        textarea.value = stockValue;
                        textarea.focus();
                    },500);
                }
                else if(textarea.classList.contains('valid') === true && textarea.value.trim() !== valueTask){
                    // upDate data 'value' => obj in localStorage
                    Task.arrayObjTasks = JSON.parse(localStorage.getItem('arrayObjTasks') as string);   
                    for(let i :number = 0;i<Task.arrayObjTasks.length;i++){
                        if(objTask.id === Task.arrayObjTasks[i].id){
                            Task.arrayObjTasks[i].value = textarea.value;
                            localStorage.removeItem('arrayObjTasks');
                            localStorage.setItem('arrayObjTasks',JSON.stringify(Task.arrayObjTasks));
                            break;
                        }
                    }
                    // upDate data in element task Obj 'list.Item' Element
                    const list = document.querySelector('body .container .form .content .list') as HTMLUListElement;
                    for(let i : number = 0;i<list.childElementCount;i++){
                        if(list.children[i].getAttribute('data-idtask') === objTask.id){
                            const a = list.children[i].querySelector('.task') as HTMLAnchorElement;
                            a.textContent = textarea.value;
                            break;
                        }
                    }
                    div.remove();
                }
            });
        });
    }
}

window.addEventListener('DOMContentLoaded',function() : void {
    Task.displayTasks();
    inpTask.value = ``;
    inpTask.classList.remove('valid');
    inpTask.classList.remove('invalid');
    inpTask.focus();
});
