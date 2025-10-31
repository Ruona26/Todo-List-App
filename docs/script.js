const tasks = [];
const form = document.getElementById("form")
const titleInput = document.getElementById("titleInput")
const dateInput = document.getElementById("dateInput")
const descriptionInput = document.getElementById("descriptionInput")
const btn = document.getElementById("btn")
const list = document.getElementById("taskLists")
let taskToEdit = null; 

const addTaskBtn = document.getElementById("add-task-btn")
addTaskBtn.addEventListener('click', ()=> {
    form.classList.toggle('hidden')
    taskLists.classList.add('hidden');
})
     
function saveTasks(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

btn.addEventListener("click", (e)=> {
    e.preventDefault();

    let title = titleInput.value.trim();
        title = title.charAt(0).toUpperCase() + title.slice(1);

    let date = dateInput.value.trim();

    let description = descriptionInput.value.trim();
        description = description.charAt(0).toUpperCase() + description.slice(1);


    let taskDetails = {  
        title: title,
        date: date,
        description: description
    }

    let selectedDate = new Date(date);
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    if(title === '' || date === "") {
        return alert("Please fill out both the task and the date fields.")
    }
    else if (selectedDate < today) {
       return alert("Invalid date: Please choose a date that is today or in the future");
    }
    else if (taskToEdit !== null) {
        tasks[taskToEdit] = {...tasks[taskToEdit],
            task: {...taskDetails}
        };
        taskToEdit = null;
        renderTask();
    }
    else {
    tasks.push({
        id: Date.now(),
        completed: false,
        task: taskDetails
    })}
    
     if(tasks.length === 0) {
        taskLists.classList.toggle('hidden');
    }
   else{taskLists.classList.remove('hidden')}
   
    form.classList.toggle('hidden')
    updateList();

        titleInput.value = "";
        dateInput.value = "";
        descriptionInput.value = "";

    
    updateProgress()
    saveTasks();
})



//Update List Function
function updateList() {
    let title = titleInput.value.trim(); 
      title = title.charAt(0).toUpperCase() + title.slice(1);

    let date = dateInput.value.trim();

    let description = descriptionInput.value.trim()
        description = description.charAt(0).toUpperCase() + description.slice(1);
        // const charCount = document.getElementById("charCount");
        // const maxChars = 100;
        // descriptionInput.addEventListener("input", ()=> {
        //     let val = descriptionInput.value;
        //     if(val.length > maxChars) {
        //         descriptionInput.value = val.slice(0, maxChars);
        //         val = descriptionInput.value;
        //     }
        //     charCount.textContent = `${val.length} / ${maxChars}`;
        // })

    // tasks.sort((a, b) => new Date(a.task.date) - new Date(b.task.date));

    let taskItem = document.createElement('li')
    
    tasks.forEach((task, index) => {   
        taskItem.innerHTML = `<li class="flex justify-between items-center bg-gray-400 hover:bg-gray-500 rounded-sm w-[90%] mx-auto px-3 py-1 my-2">
                <div>
                    <input type="checkbox" class="checkbox peer accent-gray-900 cursor-pointer">
                    <label class="label peer-checked:line-through text-[1.2rem]" for=""> 
                        <p><span class="font-medium">Title:</span> ${title}</p>
                        <p><span class="font-medium">Date:</span> ${date}</p>
                        <p><span class="font-medium block">Description:</span> ${description}</p>
                    </label>
                </div>
                <div class="flex justify-between items-center gap-2"> 
                    <p id=edit title="Edit-Task"><i class="fa-solid fa-pen-to-square cursor-pointer text-[16px]"></i></p>
                    <p id="delete" title="Delete Task"><i class="fa-solid fa-trash cursor-pointer text-[16px]" ></i></p>
                </div>
            </li>`;
    list.appendChild(taskItem);

        //For completed status
    const checkBox = taskItem.querySelector(".checkbox")
    checkBox.addEventListener("change", ()=>{
        task.completed = checkBox.checked;
        updateProgress()
        saveTasks();
    })

        //Delete task
    const deleteBtn = taskItem.querySelector("#delete")
    deleteBtn.addEventListener("click", ()=>{
       if (confirm(`Are you sure you want to delete "${title}"?`))
        {taskItem.remove();
           const index = tasks.findIndex(t => t.id === task.id);
           if (index !== -1) {
            tasks.splice(index, 1);
           }
           if(tasks.length === 0){
            taskLists.classList.add('hidden');
           }
        }
        updateProgress()
        saveTasks();
    })

        //Edit Task
    const editBtn = taskItem.querySelector("#edit")

    editBtn.addEventListener("click", ()=> {
        taskLists.classList.add('hidden');
        titleInput.value = tasks[index].task.title
        dateInput.value = tasks[index].task.date;
        descriptionInput.value = tasks[index].task.description;

        form.classList.remove("hidden")
         taskToEdit = index;
        // btn.textContent = "Update"
    /*const newText = prompt(`Edit your task: ${task.task}`);
        if(newText === null) return;

        const trimmedText = newText.trim();
        if(!trimmedText) return;

        tasks[index].title = trimmedText;
 
        const label = taskItem.querySelector(".label");
        if(label) label.textContent = trimmedText;*/
   })
   saveTasks();
    })

}




//renderTask
  function renderTask () {
    // list.innerHTML = "";

    let title = titleInput.value.trim(); 
      title = title.charAt(0).toUpperCase() + title.slice(1);

    let date = dateInput.value.trim();

    let description = descriptionInput.value.trim()
        description = description.charAt(0).toUpperCase() + description.slice(1);

    let taskItem = document.createElement('li')
     tasks.forEach((task, index) => {   
        taskItem.innerHTML = `<li class="flex justify-between items-center bg-gray-400 hover:bg-gray-500 rounded-sm w-100 px-3 py-1 my-2">
                <div>
                    <input type="checkbox" class="checkbox peer accent-gray-900 cursor-pointer">
                    <label class="label peer-checked:line-through text-[1.2rem]" for=""> 
                        <p><span class="font-medium">Title:</span> ${title}</p>
                        <p><span class="font-medium">Date:</span> ${date}</p>
                        <p><span class="font-medium block">Description:</span> ${description}</p>
                    </label>
                </div>
                <div class="flex justify-between items-center gap-2"> 
                    <p id=edit title="Edit-Task"><i class="fa-solid fa-pen-to-square cursor-pointer" ></i></p>
                    <p id="delete" title="Delete Task"><i class="fa-solid fa-trash cursor-pointer" ></i></p>
                </div>
            </li>`;
            

     })
     }



//Progress Section
function updateProgress() {
    const total = tasks.length;
    const completed = tasks.filter(task =>
        task.completed).length;

    const progress = ( completed/total )*100;
    const progressBar = document.getElementById("progress");
    if (total === 0){
        progressBar.style.width = "0%";
    }
    else {
    progressBar.style.width = `${progress}%`;}

  const fraction = document.getElementById("fraction");
  fraction.textContent = `${completed}/${total}`;
}



// Dialog Box Section
const closeTaskBtn = document.getElementById("closeTaskBtn")
const dialog = document.getElementById("dialog")
    closeTaskBtn.addEventListener('click', ()=> {
        dialog.showModal();
    })

const cancelBtn = document.getElementById("cancelBtn")
    cancelBtn.addEventListener('click', ()=>{
        dialog.close();
})

const discardBtn = document.getElementById("discardBtn")
     discardBtn.addEventListener('click', ()=>{
        dialog.close();
        form.classList.toggle('hidden');

       if(tasks.length >= 1) {taskLists.classList.remove('hidden');}

        titleInput.value = "";
        dateInput.value = "";
        descriptionInput.value = "";
     })


//Flatpickr CDN for Date
flatpickr("#dateInput", {
    dateFormat: "Y-m-d",
    altInput: true,
    disableMobile: true,
    altFormat: "d/m/Y",
    minDate: "today"
});


