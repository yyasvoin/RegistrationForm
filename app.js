// Form Blur Event Listeners
document.getElementById('name').addEventListener('blur', validateName);
document.getElementById('tz').addEventListener('blur', validateTz);
document.getElementById('email').addEventListener('blur', validateEmail);
document.getElementById('date').addEventListener('blur', validateDate);

const deleteAllBtn = document.querySelector('.footer button');
const userList = document.querySelector('.userList');
const form = document.querySelector('#user-form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const tzInput = document.querySelector('#tz');
const dateInput = document.querySelector('#date');
const passwordInput = document.querySelector('#password');
showUsers();
loadEventListeners();
let dublicateUser = false;

function loadEventListeners() {
	// Add User event
	form.addEventListener('submit', addUser);
}

function validateName() {
	const name = document.getElementById('name');
	const re = /^[a-zA-Z]+$/;

	if (!re.test(name.value)) {
		name.classList.add('is-invalid');
	} else {
		name.classList.remove('is-invalid');
	}
}

function validateTz() {
	const tz = document.getElementById('tz');
	const re = /^[0-9]{9}$/;

	if (!re.test(tz.value)) {
		tz.classList.add('is-invalid');
	} else {
		tz.classList.remove('is-invalid');
	}
}

function validateEmail() {
	const email = document.getElementById('email');
	const re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

	if (!re.test(email.value)) {
		email.classList.add('is-invalid');
	} else {
		email.classList.remove('is-invalid');
	}
}

function validateDate() {
	const date = document.getElementById('date');
	const re = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

	if (!re.test(date.value)) {
		date.classList.add('is-invalid');
	} else {
		date.classList.remove('is-invalid');
	}
}

function addUser(e) {
	while (nameInput.value !== '') {
		const hashPass = hash(passwordInput.value)
			.then(console.log)
			.catch(console.error);
		console.log(hashPass);
		const maskPass = maskPassword(passwordInput.value);

		let userEnteredValue = `${nameInput.value}, ${emailInput.value}, ${tzInput.value}, ${date.value}, ${maskPass} `; //getting input field value
		let getLocalStorageData = localStorage.getItem('New User'); //getting localstorage
		if (getLocalStorageData == null) {
			//if localstorage has no data
			listArray = []; //create a blank array
		} else {
			listArray = JSON.parse(getLocalStorageData); //transforming json string into a js object
		}

		for (let i = 0; i < listArray.length; i++) {
			if (listArray[i].indexOf(tzInput.value) !== -1) {
				dublicateUser = true;
			}
		}
		if (dublicateUser) alert('Dublicate user found! Plase re-submit your form');

		if (!dublicateUser) {
			listArray.push(userEnteredValue); //pushing or adding new value in array
			localStorage.setItem('New User', JSON.stringify(listArray)); //transforming js object into a json string
			alert('The user has been added successfully');
			showUsers();
		}

		// Clear input
		clearForm();
		dublicateUser = false;
		e.preventDefault();
	}
}

function showUsers() {
	let getLocalStorageData = localStorage.getItem('New User');
	if (getLocalStorageData == null) {
		listArray = [];
	} else {
		listArray = JSON.parse(getLocalStorageData);
	}

	let newLiTag = '';
	listArray.forEach((element, index) => {
		newLiTag += `<li>${element}<span class="icon" onclick="deleteUser(${index})"> <i class="fas fa-trash"></i></span></li>`;
	});
	userList.innerHTML = newLiTag; //adding new li tag inside ul tag
	if (listArray.length > 0) {
		//if array length is greater than 0
		deleteAllBtn.classList.add('active'); //active the delete button
	} else {
		deleteAllBtn.classList.remove('active'); //unactive the delete button
	}
}

function deleteUser(index) {
	if (confirm('Are You Sure?')) {
		let getLocalStorageData = localStorage.getItem('New User');
		listArray = JSON.parse(getLocalStorageData);
		listArray.splice(index, 1); //delete or remove the li
		localStorage.setItem('New User', JSON.stringify(listArray));
		showUsers(); //call the show function
	}
}

// delete all users function
deleteAllBtn.onclick = () => {
	if (confirm('Are You Sure?')) {
		listArray = []; //empty the array
		localStorage.setItem('New User', JSON.stringify(listArray)); //set the item in localstorage
		showUsers(); //call the show function
	}
};

// Clear Form
function clearForm() {
	nameInput.value = '';
	emailInput.value = '';
	tzInput.value = '';
	dateInput.value = '';
	passwordInput.value = '';
}

function maskPassword(password) {
	const str = password + '';
	const last = str.slice(-4);
	return last.padStart(str.length, '*');
}

async function hash(string) {
	const utf8 = new TextEncoder().encode(string);
	const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray
		.map((bytes) => bytes.toString(16).padStart(2, '0'))
		.join('');
	return hashHex;
}
