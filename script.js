const taskElement = document.querySelector(".task-element");
const datePicker = document.querySelector(".date-picker");
const timePicker = document.querySelector(".time-picker");
const createTaskElement = document.querySelector(".create-task-element");
const savedTaskContainer = document.querySelector('.saved-tasks');
const saveButton = document.querySelector('.save-button');
let toDoListDataObject = {};

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];



// Set default date and time
const currMonth = (new Date().getMonth())>8? `${new Date().getMonth()+1}` : `0${new Date().getMonth()+1}`;
const currDay = (new Date().getDate())>8? `${new Date().getDate()+1}` : `0${new Date().getDate()+1}`;
const currDate = `${new Date().getFullYear()}-${currMonth}-${currDay}`;
const currMinutes = new Date().getMinutes() < 10 ? `0${new Date().getMinutes()}` : `${new Date().getMinutes()}`;
const currHours = parseInt(new Date().getHours()) < 10 ? `0${new Date().getHours()}` : `${new Date().getHours()}`;

datePicker.value = currDate;
timePicker.value = `${currHours}:${currMinutes}`;


//creating object of task details
const createObjectOfTasks = () => {
  if (!taskElement.value || !datePicker.value || !timePicker.value) {
    alert("Please add all the details of the task");
    return;
  }

  const taskValue = taskElement.value;
  // console.log(taskValue);
  const dateValue = new Date(datePicker.value);
  // console.log(datePicker.value);
  const date = dateValue.getDate();
  const monthIndex = dateValue.getMonth();
  const year = dateValue.getFullYear();
  const timeValue = timePicker.value;
    // console.log(parseInt(timeValue));
  let isChecked = false;

  const dateKey = `c_${date}_${monthIndex}_${year}`;
  // console.log("object created")

  addTask(dateKey, timeValue, taskValue, monthIndex, date, isChecked);
  localStorage.setItem('allSavedTasks', JSON.stringify(toDoListDataObject));
  // console.log("saving toDoListDataObject to local storage", toDoListDataObject);
  // console.log("task added");

  taskElement.value = "";
  datePicker.value = currDate;
  timePicker.value = `${currHours}:${currMinutes}`;
  saveButton.style.display = "none";
}


const addTask = (dateKey, timeValue, taskValue, monthIndex, date, isChecked) => {
  // console.log("addTask called", dateKey, timeValue, taskValue, monthIndex, date, toDoListDataObject);
  let newDateElement;
  if (!Object.keys(toDoListDataObject).includes(dateKey)) {
    toDoListDataObject[dateKey] = [{ timeValue, taskValue }];
    newDateElement = document.createElement('div');
    newDateElement.classList.add(dateKey);
    newDateElement.classList.add("saved-task-date");

    const expandReduceButton = document.createElement('button');
    expandReduceButton.classList.add('expand-reduce-button');
    expandReduceButton.classList.add('title-date');
    expandReduceButton.innerHTML = `<h3 style="font-size: 20px"><i class="fa-solid fa-chevron-down fa-rotate-180"></i>&nbsp;&nbsp;&nbsp; ${monthNames[monthIndex]} ${date}</h3>`

    newDateElement.appendChild(expandReduceButton);
    savedTaskContainer.appendChild(newDateElement);

    expandReduceButton.addEventListener('click', () => {
      const childrenArray = Array.from(newDateElement.children);
      childrenArray.forEach((child, index) => {
        if (index > 0) {
          if (child.style.display === "none") {
            child.style.display = "block";
            expandReduceButton.innerHTML = `<h3 style="font-size: 20px"><i class="fa-solid fa-chevron-down fa-rotate-180"></i>&nbsp;&nbsp;&nbsp; ${monthNames[monthIndex]} ${date}</h3>`;
          } else {
            child.style.display = "none";
            expandReduceButton.innerHTML = `<h3 style="font-size: 20px"><i class="fa-solid fa-chevron-down fa-rotate-0"></i>&nbsp;&nbsp;&nbsp; ${monthNames[monthIndex]} ${date}</h3>`;
          }
        }
      })
    })
  }
  else {
    toDoListDataObject[dateKey].push({ timeValue, taskValue });
    newDateElement = document.querySelector(`.${dateKey}`);
  }

  const div = document.createElement('div');
  div.classList.add("saved-task-entry");

  const taskDetails = document.createElement('div');
  taskDetails.classList.add("task-details");
  const taskContent = document.createElement('div');
  taskContent.classList.add("task-content");
  const checkbox = document.createElement('input');
  checkbox.type = "checkbox";
  const taskText = document.createElement('input');
  taskText.type = "text";
  taskText.value = taskValue;

  taskContent.appendChild(checkbox);
  taskContent.appendChild(taskText);

  const timeAndEditBlock = document.createElement('div');
  timeAndEditBlock.classList.add('time-and-edit-block');

  const taskTime = document.createElement('p');
  taskTime.classList.add('task-time');
  // const taskTime = timeValue
  console.log(Number(timeValue.split(0,2)));
  const time = (Number(timeValue.slice(0,2))>=12)? `${Number(timeValue.slice(0,2))-12}${timeValue.slice(2)}PM`:`${timeValue}AM`;
  taskTime.innerHTML = `<i class="fa-regular fa-clock"></i> ${time}`;
  taskText.disabled = true;
  taskText.style.color = "black";
  taskText.style.outline = "none";
  taskText.style.borderBottom = "none";
  const optionButton = document.createElement('button');
  optionButton.textContent = "..."

  timeAndEditBlock.appendChild(taskTime);
  timeAndEditBlock.appendChild(optionButton);

  taskDetails.appendChild(taskContent);
  taskDetails.appendChild(timeAndEditBlock);
  // console.log(checkbox);

  if (isChecked) {
    checkbox.checked = true;
    taskText.style.textDecoration = "line-through";
    taskText.style.color = "gray";
  }

  div.appendChild(taskDetails);

  checkbox.addEventListener('change', (e) => {
    toDoListDataObject[dateKey].forEach(task => {

      if (taskTime.innerHTML.split(" ")[3] === task.timeValue) {
        if (e.target.checked) {
          taskText.style.textDecoration = "line-through";
          taskText.style.color = "gray";
          task.isChecked = true;
        } else {
          taskText.style.textDecoration = "none";
          taskText.style.color = "black";
          task.isChecked = false;
        }
      }
    });

    localStorage.setItem('allSavedTasks', JSON.stringify(toDoListDataObject));
  });

  // it's the block of buttons that becomes visible when we click on "..."
  const editAndDeleteButton = document.createElement('div');
  editAndDeleteButton.classList.add("edit-and-delete-button");
  const editButton = document.createElement('button');
  editButton.classList.add("edit-button");
  editButton.innerText = "Edit"
  const deleteButton = document.createElement('button');
  deleteButton.classList.add("delete-button");
  deleteButton.innerText = "Delete";

  // save button inside the three dots
  const save2Button = document.createElement('button');
  save2Button.classList.add("save-2-button");
  save2Button.innerText = "Save";

  editAndDeleteButton.appendChild(editButton);
  editAndDeleteButton.appendChild(document.createElement('hr'));
  editAndDeleteButton.appendChild(save2Button);
  editAndDeleteButton.appendChild(document.createElement('hr'));
  editAndDeleteButton.appendChild(deleteButton);
  div.appendChild(editAndDeleteButton);

  // the three dot "..." button
  optionButton.addEventListener('click', () => optionButtonFunction(editAndDeleteButton));

  editButton.addEventListener('click', () => editButtonFunction(taskText));

  save2Button.addEventListener('click', () => {

    toDoListDataObject[dateKey].forEach(task => {
      if (taskTime.innerHTML.split(" ")[3] === task.timeValue) {
        task.taskValue = taskText.value;
        taskText.style.borderBottom = "none";
        taskText.disabled = true;
      }
    })
    editAndDeleteButton.style.display = "none";

    localStorage.setItem('allSavedTasks', JSON.stringify(toDoListDataObject));
  })

  deleteButton.addEventListener('click', () => {
    console.log("delete");

    div.remove();
    toDoListDataObject[dateKey].forEach((task, index) => {
      // console.log("task time",taskTime.innerHTML.split(" ")[3]);
      // console.log("taskTime2", task.timeValue);
      if (taskTime.innerHTML.split(" ")[3] === task.timeValue) {
        toDoListDataObject[dateKey].splice(index, 1);
        console.log("to do list object", toDoListDataObject);
      }
    })

    if (newDateElement.children.length === 1) {
      newDateElement.remove();
      delete toDoListDataObject[dateKey];

      // removing expandReduceButton event
      expandReduceButton.removeEventListener('click', () => {
        const childrenArray = Array.from(newDateElement.children);
        childrenArray.forEach((child, index) => {
          if (index > 0) {
            if (child.style.display === "none") {
              child.style.display = "block";
            } else {
              child.style.display = "none";
              expandReduceButton.innerHTML = `<h3 style="font-size: 20px"><i class="fa-solid fa-chevron-down fa-rotate-0"></i>&nbsp;&nbsp;&nbsp; ${monthNames[monthIndex]} ${date}</h3>`
            }
          }
        })
      })
    }

    localStorage.setItem('allSavedTasks', JSON.stringify(toDoListDataObject));
    editAndDeleteButton.style.display = "none";

    // removing optionButton("...") event listener
    optionButton.removeEventListener('click', () => optionButtonFunction(editAndDeleteButton));

    //removing editButton event listener
    editButton.removeEventListener('click', () => editButtonFunction(taskText));

    //removing save2button event listener
    save2Button.removeEventListener('click', () => {

      toDoListDataObject[dateKey].forEach(task => {
        if (taskTime.innerHTML.split(" ")[3] === task.timeValue) {
          task.taskValue = taskText.value;
          taskText.style.borderBottom = "none";
          taskText.disabled = true;
        }
      })
      editAndDeleteButton.style.display = "none";

      localStorage.setItem('allSavedTasks', JSON.stringify(toDoListDataObject));
    })

    //removing checkbox event
    checkbox.removeEventListener('change', (e) => {
      toDoListDataObject[dateKey].forEach(task => {

        if (taskTime.innerHTML.split(" ")[3] === task.timeValue) {
          if (e.target.checked) {
            taskText.style.textDecoration = "line-through";
            taskText.style.color = "gray";
            task.isChecked = true;
          } else {
            taskText.style.textDecoration = "none";
            taskText.style.color = "black";
            task.isChecked = false;
          }
        }
      });

      localStorage.setItem('allSavedTasks', JSON.stringify(toDoListDataObject));
    });
  });

  newDateElement.appendChild(div);


}
//addtask ends 

const optionButtonFunction = (editAndDeleteButton) => {
  if (editAndDeleteButton.style.display == "block") {
    editAndDeleteButton.style.display = "none";
  }
  else {
    editAndDeleteButton.style.display = "block";
  }
}

const editButtonFunction = (taskText) => {
  console.log("Edit");
  taskText.style.borderBottom = "1px solid";
  taskText.disabled = false;
}


// loading data from localStorage
const loadStoredTasks = () => {
  const getTasks = localStorage.getItem("allSavedTasks") ? JSON.parse(localStorage.getItem("allSavedTasks")) : {};
  Object.entries(getTasks).forEach(entry => {
    const [date, monthIndex, _] = entry[0].slice(2).split("_");
    entry[1].forEach(task => {
      const { timeValue, taskValue, isChecked } = task;
      addTask(entry[0], timeValue, taskValue, monthIndex, date, isChecked);
    })
  })

}


taskElement.addEventListener('input', () => {

  if (taskElement.value) {
    saveButton.style.display = "block";
  }
  else {
    saveButton.style.display = "none";
  }

})

saveButton.addEventListener('click', createObjectOfTasks);

loadStoredTasks();

