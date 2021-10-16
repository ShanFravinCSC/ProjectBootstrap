// Parent element to store cards
const taskContainer = document.querySelector(".task__container");

//Global Store
let globalStore = []; // some values 

const newCard = ({
    id,
    imageUrl,
    taskTitle,
    taskDescription,
    taskType,
    }) =>  `<div class="col-md-6 col-lg-4" id=${id}>
    <div class="card">
        <div class="card-header d-flex justify-content-end gap-2">
            <button type="button" id=${id} class="btn btn-outline-success onclick="editCard.apply(this, arguments)">
                <i class="fas fa-pencil-alt" id=${id} onclick="editCard.apply(this, arguments)"></i>
            </button>
        <button type="button" id=${id} class="btn btn-outline-danger" onclick="deleteCard.apply(this, arguments)">
            <i class="fas fa-trash-alt" id=${id} onclick="deleteCard.apply(this, arguments)"></i>
        </button>
        </div>
        <img
            src=${imageUrl} 
            class="card-img-top" 
            alt="..."
            />

            <div class="card-body">
                <h5 class="card-title">${taskTitle}</h5>
                    <p class="card-text">
                        ${taskDescription}
                    </p>
                <span class="badge bg-primary">${taskType}</span>
            </div>
        <div class="card-footer text-muted">
            <button type="button" id=${id} class="btn btn-outline-primary float-end">
                Open Task
            </button>
        </div>
        </div>
    </div> `;

    const loadInitialTaskCards = () => {
        // localstorage to get tasky data
        const getInitialData = localStorage.getItem("tasky");
        if(!getInitialData) return;

        //convert to normal object
        const { cards } = JSON.parse(getInitialData);

    // loop over those array of task object to create HTML card,
        cards.map((cardObject) => {
        const createNewcard = newCard(cardObject);
        //inject it to dom,
            taskContainer.insertAdjacentHTML("beforeend", createNewcard);
        //update our global store
            globalStore.push(cardObject);
        });
    };

    const updateLocalStorage = () =>
        localStorage.setItem("tasky", JSON.stringify({ cards:globalStore }));

    const saveChanges = () => {
        const taskData = {
            id: `${Date.now()}`, //unique number every second
            imageUrl: document.getElementById("imageurl").value,
            taskTitle: document.getElementById("tasktitle").value,
            taskType: document.getElementById("tasktype").value,
            taskDescription: document.getElementById("taskdescription").value,
        };

    //Html code
        const createNewcard = newCard(taskData);

        taskContainer.insertAdjacentHTML("beforeend", createNewcard);

        globalStore.push(taskData);

        //add to local storage
        updateLocalStorage();
    };


    //Page refresh will cause the data to be deleted => Local Storage = our System 5mb - solved 

    //features

    //delete the card
    const deleteCard = (event) => {
        event = window.event;
        //id
        const targetID = event.target.id;
        const tagName = event.target.tagName;

        // match the id of the element  with the id inside the globalstore
        // if match found remove

        globalStore = globalStore.filter((cardObject) => cardObject.id !== targetID);
    
        updateLocalStorage();

        //let parentElement;
        //access DOM to remove them

        if(tagName === "BUTTON"){
            return taskContainer.removeChild(
                event.target.parentNode.parentNode.parentNode
            );
        };
    
        return taskContainer.removeChild(
            event.target.parentNode.parentNode.parentNode.parentNode
            );
        };
    
 // edit the card

    const editCard = (event) => {
        event = window.event;
        const targetID = event.target.id;
        const tagName = event.target.tagName;

        let parentElement;

        if(tagName === "BUTTON"){
            parentElement = event.target.parentNode.parentNode;
        } else {
            parentElement = event.target.parentNode.parentNode.parentNode;
        }

        let taskTitle = parentElement.childNodes[5].childNodes[1];
        let taskDescription = parentElement.childNodes[5].childNodes[3];
        let taskType = parentElement.childNodes[5].childNodes[5];
        let submitButton = parentElement.childNodes[7].childNodes[1];
     
     /*console.log(taskTitle);
     console.log(taskDescription);
     console.log(taskType);*/

     //setAttributes

        taskTitle.setAttribute("contenteditable", "true");
        taskDescription.setAttribute("contenteditable", "true");
        taskType.setAttribute("contenteditable", "true");
        submitButton.setAttribute(
            "onclick",
            "saveEditchanges.apply(this, arguments)"
        );
        submitButton.innerHTML = "Save Changes";
    };

    const saveEditchanges = (event) => {
        event = window.event;
        const targetID = event.target.id;
        const tagName = event.target.tagName;

        let parentElement;

        if(tagName === "BUTTON"){
            parentElement = event.target.parentNode.parentNode;
        } else {
            parentElement = event.target.parentNode.parentNode.parentNode;
        }

        let taskTitle = parentElement.childNodes[5].childNodes[1];
        let taskDescription = parentElement.childNodes[5].childNodes[3];
        let taskType = parentElement.childNodes[5].childNodes[5];
        let submitButton = parentElement.childNodes[7].childNodes[1];

        const updatedData = {
            taskTitle: taskTitle.innerHTML,
            taskType: taskType.innerHTML,
            taskDescription: taskDescription.innerHTML,
        };
    
        globalStore = globalStore.map((task) => {
            if (task.id === targetID){
                return {
                    id: task.id,
                    imageUrl: task.imageUrl,
                    taskTitle: updatedData.taskTitle,
                    taskType: updatedData.taskType,
                    taskDescription: updatedData.taskDescription,
                };
            }
            return task; //important
        });
        updateLocalStorage();
        console.log(updateLocalStorage);
        taskTitle.setAttribute("contenteditable", "false");
        taskDescription.setAttribute("contenteditable", "false");
        taskType.setAttribute("contenteditable", "false");
        submitButton.removeAttribute("onclick");
        submitButton.innerHTML = "Open Task";
        //updateLocalStorage();
 };