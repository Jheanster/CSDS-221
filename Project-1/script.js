let elementIds = [
    'username',
    'first_name',
    'last_name',
    'phone_number',
    'fax_number',
    'email',
    'days',
    'adults',
    'cost',
    'message',
    'range',
    'low',
    'med',
    'high',
    'submit',
    'reset',
    'checkIn',
    'checkOut',
];

let elements = {};

elementIds.forEach(id => {
    elements[id] = document.getElementById(id);
})

const today = moment().format('YYYY-MM-DD');
elements.checkIn.min = today;
    
const inputs = [elements.username, elements.first_name, elements.last_name, elements.phone_number, elements.fax_number, elements.email, 
                checkIn, checkOut, elements.days, elements.cost, elements.message];
const fieldNames = ['Username', 'First Name', 'Last Name', 'Phone Number', 'Fax Number', 'Email Address', 'Check-In Date', 'Check-Out Date',
                    'Days', 'Cost'];

function handleCheckInChange() {
    // Parse the checkIn and checkOut values
    const checkInDate = moment(elements.checkIn.value, 'YYYY-MM-DD');
    const checkOutDate = moment(elements.checkOut.value, 'YYYY-MM-DD');

    // Set the min day for check out to be one plus the check in day
    const nextDay = checkInDate.clone().add(1, 'days');
    elements.checkOut.min = nextDay.format('YYYY-MM-DD');

    // Reset checkOut if checkIn value is greater
    if (checkInDate.isAfter(checkOutDate) || checkInDate.isSame(checkOutDate)) {
        elements.checkOut.value = "";
    }

    // Set the days to be the difference between checkIn and checkOut
    if (checkOut.value !== "") {
        const daysDifference = checkOutDate.diff(checkInDate, 'days');
        elements.days.value = daysDifference;
    } else {
        elements.days.value = "";
        elements.cost.value = "";
    }
    if (elements.days.value !== "") {
        elements.cost.value = elements.days.value * elements.adults.value * 150;
    }
}

function calculateDaysAndCost() {
    if (elements.checkIn.value !== "" && elements.checkOut.value !== "") {
        const checkInDate = moment(elements.checkIn.value, 'YYYY-MM-DD');
        const checkOutDate = moment(elements.checkOut.value, 'YYYY-MM-DD');
        
        // Calculate the difference in days between checkIn and checkOut
        const daysDifference = checkOutDate.diff(checkInDate, 'days');
        elements.days.value = daysDifference;
        const adults = parseInt(elements.adults.value);
        
        // Calculate the cost based on days and adults
        elements.cost.value = daysDifference * adults * 150;
    } else {
        elements.days.value = "";
        elements.cost.value = "";
    }
}

$('input#checkIn').on('change', handleCheckInChange);
$('input#checkOut').on('change', function(){
    console.log('Number of days:', elements.days.value);
    calculateDaysAndCost();
});
$('select#adults').on('change', function(){
    console.log('Number of adults:', elements.adults.value);
    calculateDaysAndCost();
});


$('#reset').on('click', function() {

    // Go through every input and reset them original parameters
    for(let i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
        inputs[i].parentElement.classList.remove('has-error');
    }
    elements.adults.value = 1;
    elements.range.value = 5;
    elements.low.checked = true;
    elements.med.checked = false;
    elements.high.checked = false;
    elements.message.textContent = '';
    toastr.info('Form has now been reset.');
});

$('#submit').on('click', function() {
    const requiredFields = ['username', 'first_name', 'last_name', 'phone_number', 'fax_number', 'email', 'checkIn', 'checkOut'];
    let valid = true;

    // Go through every input and check if its a required input
    for (let x = 0; x < inputs.length; x++) {
        const input = inputs[x];
        const fieldName = fieldNames[x];
        const isEmpty = input.value.trim() === '';
        
        // If it is a required input, display error
        if (requiredFields.includes(input.id) && isEmpty) {
            input.parentElement.classList.add('has-error');
            toastr.error(`Error: ${fieldName} is required. Please fill it in.`);
            valid = false;
        } else {
            input.parentElement.classList.remove('has-error');
        }
    }

    // Check to see if cost is negative or if it was even calculated
    const costValue = parseFloat(elements.cost.value);

    // This in theory should never be negative because of the way I set the datepicker for checkIn and checkOut.
    if (costValue <= 0) {
        toastr.error('Error: Price must be positive.');
        valid = false;
    } else if(isNaN(costValue)){
        toastr.error('Error: Cost was not calculated.')
        valid = false;
    }

    if (valid) {
        toastr.success('Form has been submitted.');
    }
});
