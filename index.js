const taskContainer = document.querySelector(".task__container");

let globalStore = []; // some values 

const generateNewCard = (taskData) =>  `
<div class="col-md-6 col-lg-4">
<div class="card text-center">
    <div class="card-header d-flex justify-content-end gap-2">
        <button type="button" id=${taskData.id} class="btn btn-outline-success onclick="editCard.apply(this, arguments)">
            <i class="fas fa-pencil-alt" id=${taskData.id} onclick="editCard.apply(this, arguments)"></i>
        </button>
        <button type="button" class="btn btn-outline-danger" id=${taskData.id} onclick="deleteCard.apply(this, arguments)">
            <i class="fas fa-trash-alt"></i>
        </button>
        </div>
        <img
            src=${taskData.imageUrl} 
            class="card-img-top" 
            alt="..."
            />

            <div class="card-body">
                <h5 class="card-title">${taskData.taskTitle}</h5>
                    <p class="card-text">
                        ${taskData.taskDescription}
                    </p>
                    <a href="#" class="btn btn-primary">${taskData.taskType}</a>
            </div>
        <div class="card-footer">
            <button type="button" class="btn btn-outline-primary float-end">Open Task</button>
        </div>
    </div>
</div> `
;

const loadInitialCardData = () =>{
    // localstorage to get tasky data
    const getCardData = localStorage.getItem("tasky");

    //convert to normal object
    const {cards} = JSON.parse(getCardData);

    // loop over those array of task object to create HTML card,
    cards.map((cardObject) => {
        //inject it to dom,
        taskContainer.insertAdjacentHTML("beforeend", generateNewCard(cardObject));

        //update our global store
        globalStore.push(cardObject);
    })

    
};

const saveChanges = () => {
    const taskData = {
        id: `${Date.now()}`, //unique number every second
        imageUrl: document.getElementById("imageurl").value,
        taskTitle: document.getElementById("tasktitle").value,
        taskType: document.getElementById("tasktype").value,
        taskDescription: document.getElementById("taskdescription").value,
    };

    taskContainer.insertAdjacentHTML("beforeend", generateNewCard(taskData));

    globalStore.push(taskData);

    localStorage.setItem("tasky", JSON.stringify({cards:globalStore}));
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
    localStorage.setItem("tasky", JSON.stringify({cards:globalStore}));

    if(tagName === "BUTTON"){
        return taskContainer.removeChild(event.target.parentNode.parentNode.parentNode);
    }else{
        return taskContainer.removeChild(event.target.parentNode.parentNode.parentNode.parentNode);
    }

    // contact parent

    taskContainer.removeChild(document.getElementById(targetID));


 };

 // edit the card

 const editCard = (event) => {
     event = window.event;
     const targetID = event.target.id;
     const tagName = event.target.tagName;

     let parentElement;

     if(tagName === "BUTTON"){
         parentElement = event.target.parentNode.parentNode;
     }else{
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
     submitButton.innerHTML = "Save Changes";
 };