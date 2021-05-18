// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAA-fjn9wS_bSU7CXtBDsZ1Zw0eRcwf91A",
    authDomain: "first-firebase-project-ab583.firebaseapp.com",
    projectId: "first-firebase-project-ab583",
    storageBucket: "first-firebase-project-ab583.appspot.com",
    messagingSenderId: "686430688052",
    appId: "1:686430688052:web:8951ce814acb8402334b61",
    measurementId: "G-Y5M85XN6JG"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
// Implement the Add Function.
const addForm = document.querySelector(".add");
const list = document.querySelector(".todos");


//add form data
addForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const now = new Date(); //timestamp

    const todo = {
        todo_item: addForm.toAdd.value,
        date_created: firebase.firestore.Timestamp.fromDate(now) //timestamp object based on firestore requirement
    }

    db.collection("Todo's")
        .add(todo)
        .then(() => {
            console.log("Todo added");
        })
        .catch((err) => console.log(err));

})

//Implement a function that creates an HTML template that we can add to the DOM.
const addTodo = (todo, id) => {
    const html = `
      <li class="list-group-item" data-id=${id}>
        <span class ="item-text">${todo.todo_item}</span>
        <div class ="icons">
            <i class="far fa-trash-alt delete"></i>
            <i class="fas fa-check-circle complete"></i>
        </div>

        </li>
        `;
    list.innerHTML += html;
};

// Delete documents from firestore.
list.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
        const id = e.target.parentElement.parentElement.getAttribute("data-id");
        db.collection("Todo's")
            .doc(id)
            .delete()
            .then(() => {
                console.log("todo deleted");
            });
    }
});

// Delete documents from firestore.
list.addEventListener("click", (e) => {
    console.log(e)
    if (e.target.classList.contains("complete")) {
        const itemText = document.querySelector(".item-text");
        const complete = document.querySelector(".complete");
        console.log(complete)
        complete.style.color = "green"
        complete.style.disabled = "none";
        itemText.style.textDecoration = "line-through"



    }
});




const deleteTodo = (id) => {
    const todos = document.querySelectorAll("li");
    todos.forEach((todo) => {
        if (todo.getAttribute("data-id") === id) {
            todo.remove();
        }
    });
};

// Real Time UI Updates.
// By attaching a real-time updates listener that firestore provides us.
db.collection("Todo's").onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
        const doc = change.doc;
        if (change.type === "added") {
            addTodo(doc.data(), doc.id);
        } else if (change.type === "removed") {
            deleteTodo(doc.id);
        }
    });
});

// Implement the Searching & Filtering Function.
const search = document.querySelector(".search input");

search.addEventListener("keyup", () => {
    const term = search.value.trim().toLowerCase();
    filteredTodos(term);
});

// Implement a function that takes the term and matches with the todo item list.
const filteredTodos = (term) => {
    Array.from(list.children)
        .filter((todo) => !todo.textContent.toLowerCase().includes(term))
        .forEach((todo) => todo.classList.add("filtered"));

    Array.from(list.children)
        .filter((todo) => todo.textContent.toLowerCase().includes(term))
        .forEach((todo) => todo.classList.remove("filtered"));
};