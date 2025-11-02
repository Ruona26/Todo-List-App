const tasks = [];
const form = document.getElementById("form")
const titleInput = document.getElementById("titleInput")
const dateInput = document.getElementById("dateInput")
const btn = document.getElementById("btn")
const list = document.getElementById("taskLists")
let formBackdrop = document.getElementById("formBackdrop")
let taskToEdit = null; 

//Add a task Button
const addTaskBtn = document.getElementById("add-task-btn")
addTaskBtn.addEventListener('click', ()=> {
    addTaskBtn.classList.add("hidden")
    form.classList.toggle('hidden')
    list.classList.add('hidden');
    formBackdrop.classList.remove("hidden")

})
     
//Local Storage
function saveTasks(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

function loadTasks(){
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
        tasks.push(...JSON.parse(savedTasks));
        updateList();
        updateProgress();
    } 
}


// Add/Plus button
btn.addEventListener("click", (e)=> {
    e.preventDefault();

    let title = titleInput.value.trim();
        title = title.charAt(0).toUpperCase() + title.slice(1);

    let date = dateInput.value.trim();


    let taskDetails = {  
        title: title,
        date: date,
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
        list.innerHTML = "";
        updateList();
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
        if(dateInput && dateInput._flatpickr) {
        dateInput._flatpickr.clear();
    }

        dateInput.value = "";
    
    formBackdrop.classList.add("hidden")
     addTaskBtn.classList.remove("hidden")

    updateProgress()
    saveTasks();
})



//Update List Function
function updateList() {
    
    if(tasks.length > 0) {
        list.classList.remove("hidden")     
    }
    else {
        list.classList.add("hidden");
    }
    list.innerHTML = `<h2 class="text-white text-2xl text-center mb-4 mt-3">Task List</h2>`;


    let title = titleInput.value.trim(); 
      title = title.charAt(0).toUpperCase() + title.slice(1);

    let date = dateInput.value.trim();

    
    tasks.forEach((task, index) => { 
        let taskItem = document.createElement('li')  
        taskItem.innerHTML = `<li class="flex justify-between items-center bg-gray-400 hover:bg-gray-500 rounded-sm w-[90%] mx-auto px-3 py-1 my-2">
                <div class="max-w-[65%]">
                    <input type="checkbox" class="checkbox peer accent-gray-900 cursor-pointer">
                    <label class="label peer-checked:line-through text-[1.2rem]" for=""> 
                        <p><span class="font-medium block md:inline lg:inline xl:inline">Task:</span> ${task.task.title}</p>
                        <p><span class="font-medium block md:inline lg:inline xl:inline">Due Date:</span> ${task.task.date}</p>
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
    checkBox.checked = task.completed;
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
            list.classList.add('hidden');
           }
        }
        updateProgress()
        saveTasks();
    })

        //Edit Task
    const editBtn = taskItem.querySelector("#edit")

    editBtn.addEventListener("click", ()=> {
        list.classList.add('hidden');
        formBackdrop.classList.remove("hidden")

        titleInput.value = task.task.title;
        const savedDate = task.task.date || "";
        if(dateInput && dateInput._flatpickr ) {
            dateInput._flatpickr.setDate (savedDate, false);
        }
        else {
        dateInput.value = savedDate;
        }

        form.classList.remove("hidden")
         taskToEdit = index;
   })
   saveTasks();
    })

}


//Progress Bar Section
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
  fraction.innerHTML = `<p class="font-medium">${completed}/${total}</p>`;
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
        formBackdrop.classList.add("hidden")
        addTaskBtn.classList.remove("hidden")

       if(tasks.length >= 1) {list.classList.remove('hidden');}

        titleInput.value = "";
        dateInput.value = "";
     })


//Flatpickr CDN for Date
flatpickr("#dateInput", {
    dateFormat: "Y-m-d",
    altInput: true,
    disableMobile: true,
    altFormat: "d/m/Y",
    minDate: "today"
});



loadTasks();

