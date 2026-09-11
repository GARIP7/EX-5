function getStudent(id) {
    let student = { id: id }
    inputFields.forEach(function (inputItem) {
        let key = inputItem.name,
            value = inputItem.value;
        student[key] = value;
    });
    return student;
}

function getStudentIndex(id) {
    return pupilsList.findIndex((student) => student.id == id);
}

function add() {
    let focusInput = studentAppForm.querySelector("input:focus");
    focusInput?.blur();

    let invalid = studentAppForm.querySelector('input[data-valid="false"]');
    let invalidInput = studentAppForm.querySelector("input.is-invalid");

    if (invalidInput !== null || invalid !== null) {
        alert("Sorry, there is an error! Make sure to enter names in English, a valid email address, a two-digit age, and an Egyptian phone number.");
        return false; 
    }

    let student = getStudent(++recordId);
    pupilsList.push(student);
    updatingLocalStorage();

    showStudent(student);
    showTableAlert(pupilsList);
    return true; 
}

function edit() {
    let studentId = studentAppForm.dataset.studentId,
        student = getStudent(studentId),
        studentIndex = getStudentIndex(studentId),
        trEle = tableBodyArea.querySelector(`tr[data-student-id="${studentId}"]`);

    pupilsList[studentIndex] = student;
    updatingLocalStorage();

    trEle.innerHTML = (`
        <th>${student.id}</th>
        <td>${student.firstName}</td>
        <td>${student.lastName}</td>
        <td>${student.email}</td>
        <td>${student.age}</td>
        <td>${student.phone}</td>
        <td class="buttons">
            <button class="btn btn-info text-light" onclick="editStudent(${student.id})">Edit</button>
            <button class="btn btn-danger" onclick="deleteStudent(${student.id} , this)" >Delete</button>
        </td>
    `);

    clearFormIcon.classList.add("d-none");
    return true; 
}

function showStudent(student) {
    tableBodyArea.innerHTML += (`
        <tr data-student-id="${student.id}">
            <th>${student.id}</th>
            <td>${student.firstName}</td>
            <td>${student.lastName}</td>
            <td>${student.email}</td>
            <td>${student.age}</td>
            <td>${student.phone}</td>
            <td class="buttons">
                <button class="btn btn-info text-light" onclick="editStudent(${student.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteStudent(${student.id} , this)" >Delete</button>
            </td>
        </tr>
    `);
}

function showStudents(data) {
    tableBodyArea.innerHTML = "";

    data.forEach(function (student) {
        showStudent(student);
    });

    showTableAlert(data);
}


function chickInput(input) {
    let inputName = input.name,
        inputValue = input.value,
        isEmpty = inputValue == "",
        errorElm = studentAppForm.querySelector(`p[data-error-name="${inputName}"]`),
        isInvalid = !validationRules[inputName].test(inputValue),
        errorMsg = "";

    if (isEmpty) {
        errorMsg = "This field is required";
    } else if (isInvalid) {
        errorMsg = "Invalid field";
    }

    if (isEmpty || isInvalid) {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
        errorElm.classList.remove("d-none");
        errorElm.textContent = errorMsg;
        input.dataset.valid = false;
    } else {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
        errorElm.classList.add("d-none");
        input.dataset.valid = true;
    }
}

function resetForm() {
    studentAppForm.reset();

    inputFields.forEach(function (input) {
        input.classList.remove("is-valid");
        input.classList.remove("is-invalid");
        input.dataset.valid = "false";
        studentAppForm.querySelector(`p[data-error-name="${input.name}"]`).classList.add("d-none");
    });

    studentAppForm.setAttribute("data-type", "add");
    submitButton.classList.remove("btn-info");
    submitButton.classList.add("btn-success");
    submitButton.textContent = "Add";
    clearFormIcon.classList.add("d-none");
}

function updatingLocalStorage() {
    localStorage.setItem("students", JSON.stringify(pupilsList));
}

function deleteStudent(id, that) {
    if (!confirm("Are You Sure ?")) {
        return;
    }
    let studentIndexId = getStudentIndex(id),
        trEle = that.closest("tr");

    pupilsList.splice(studentIndexId, 1);
    trEle.remove();
    updatingLocalStorage();
    showTableAlert(pupilsList);
}

function editStudent(id) {
    resetForm();
    let studentIndexId = pupilsList.find((student) => student.id == id);

    for (let input of inputFields) {
        input.value = studentIndexId[input.name];
    }

    submitButton.classList.add("btn-info");
    submitButton.classList.add("text-light");
    submitButton.classList.remove("btn-success");
    submitButton.textContent = "Edit";

    studentAppForm.setAttribute("data-type", "edit");
    studentAppForm.setAttribute("data-student-id", id);
    clearFormIcon.classList.remove("d-none");
}

function showTableAlert(data) {
    let alertMessage = document.querySelector("#no-data-msg");

    if (!alertMessage) return;

    if (data.length === 0) {
        alertMessage.classList.remove("d-none");
    } else {
        alertMessage.classList.add("d-none");
    }
}

function search(searchValue) {
    let filterStudents = pupilsList.filter(function (student) {
        return student.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
            student.lastName.toLowerCase().includes(searchValue.toLowerCase()) ||
            student.email.toLowerCase().includes(searchValue.toLowerCase()) ||
            String(student.age).toLowerCase().includes(searchValue.toLowerCase()) ||
            student.phone.toLowerCase().includes(searchValue.toLowerCase());
    });
    showStudents(filterStudents);
}