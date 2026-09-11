let studentAppForm = document.querySelector("#input-section form"),
    inputFields = studentAppForm.querySelectorAll("input"),
    submitButton = studentAppForm.querySelector("button"),
    clearFormIcon = studentAppForm.querySelector(".reset"),

    pupilsList = [],
    recordId = 0,

    tableBodyArea = document.querySelector("table.table tbody"),
    emptyAlert = document.querySelector("#no-data-msg"),    
    validationRules = {
        firstName: /^[a-zA-Z]+$/,
        lastName: /^[a-zA-Z]+$/,
        email: /^[a-zA-Z0-9_][a-zA-Z0-9_.]+@(gmail|yahoo)\.(com|io)$/,
        age: /^[0-9]{2}$/,
        phone: /^(02)?01(0|1|2|5)[0-9]{8}$/
    },

    searchBar = document.querySelector("#query-input");

if (localStorage.getItem("students") === null) {
    updatingLocalStorage();
} else {
    pupilsList = JSON.parse(localStorage.getItem("students"));
    recordId = pupilsList[pupilsList.length - 1]?.id ?? 0;
    showStudents(pupilsList);
}

studentAppForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let actionType = studentAppForm.dataset.type;
    let isSuccess = false;

    if (actionType == "add") {
        isSuccess = add();
    } else if (actionType == "edit") {
        isSuccess = edit();
    }
    
    if (isSuccess) {
        resetForm();
    }
});

searchBar.addEventListener("keyup", function () {
    search(this.value);
});