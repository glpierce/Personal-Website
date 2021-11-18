const form = document.querySelector('#brugesScoreForm');
form.addEventListener('submit', event => {
    event.preventDefault();
    calculateBrugesScore(form);
})

function calculateBrugesScore(form) {
    let valueArray = [form.volumeAmount.value, 
                    form.volumeUnit.value, 
                    form.alcoholContent.value,
                    form.price.value];
    if (checkInputs(valueArray)) {
        valueArray = convertValues(valueArray);
        let brugesScore = (valueArray[0] * (parseFloat(valueArray[2]) / 100)) / parseFloat(valueArray[3]);
        displayResult(brugesScore);
    } else {
        displayError(valueArray);
    }
}

function checkInputs(valueArray) {
    if (! /^\d+\.\d+$|^\d+$/.test(valueArray[0])) {
        return false;
    } else if (!((valueArray[1] === "mL") || (valueArray[1] === "fl oz"))) {
        return false;
    } else if (! /^\d+\.\d+$|^\d+$/.test(valueArray[2])) {
        return false;
    } else if (! /^\d+\.\d+$|^\d+$/.test(valueArray[3])) {
        return false;
    } 
    return true;
}

function convertValues(valueArray) {
    if (valueArray[1] === "fl oz") {
        let mLVolume = parseFloat(valueArray[0]) * 29.5735;
        valueArray[0] = mLVolume;
        valueArray[1] = "mL";
    } else {
        valueArray[0] = parseFloat(valueArray[0]);
    }
    return valueArray;
}

function displayResult(brugesScore) {
    removePriorMessage();
    let resultElement = document.createElement("p");
    resultElement.setAttribute("id", "brugesResult");
    resultElement.textContent = `Bruges Score: ${String(brugesScore.toFixed(2))}`;
    let brugesDisplay = document.getElementById("brugesScore");
    brugesDisplay.append(resultElement);
}

function displayError(valueArray) {
    removePriorMessage();
    let errorElement = document.createElement("p");
    errorElement.setAttribute("id", "brugesError");
    if (! /^\d+\.\d+$|^\d+$/.test(valueArray[0])) {
        errorElement.textContent = `Please enter a valid volume amount.`;
    } else if (!((valueArray[1] === "mL") || (valueArray[1] === "fl oz"))) {
        errorElement.textContent = `Please select a volume unit.`;
    } else if (! /^\d+\.\d+$|^\d+$/.test(valueArray[2])) {
        errorElement.textContent = `Please enter a valid alcohol content (%).`;
    } else if (! /^\d+\.\d+$|^\d+$/.test(valueArray[3])) {
        errorElement.textContent = `Please enter a valid price (e.g. 14.25).`;
    } 
    let brugesDisplay = document.getElementById("brugesScore");
    brugesDisplay.append(errorElement);
}

function removePriorMessage() {
    if (!(document.querySelector("#brugesResult") === null)) {
        document.querySelector("#brugesResult").remove();
    }
    if (!(document.querySelector("#brugesError") === null)) {
        document.querySelector("#brugesError").remove();
    }
}    