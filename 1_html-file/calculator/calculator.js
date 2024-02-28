const calculator = document.querySelector(".calculator");

// Displaying images
const roofInput = $(document.getElementById("roof"));
const roofInputValue = $(document.getElementById("roof")).val();
const oneRoofImages = $(document.querySelector(".one-roof-images"));
const twoRoofImages = $(document.querySelector(".two-roof-images"));
let roof;

function displayImages(value) {
    roof = value;
    if (value === "1") {
        oneRoofImages.show();
        twoRoofImages.hide();
    } else if (value === "2") {
        twoRoofImages.show();
        oneRoofImages.hide();
    }
}

roofInput.on("change", (e) => {
    displayImages(e.target.value);
});

displayImages(roofInputValue);
// End displaying

// Disable button, if inputs are empty
const sumButton = $(document.getElementById("sumButton"));
const othersSizes = document.querySelector(".others-size");
const inputs = [...calculator.querySelectorAll(".form-control")]
const inputsOthers = [...othersSizes.querySelectorAll(".form-control")]

function validate() {
    const isComplete = inputs.some(input => !input.value);
    const phone = $("#phone").val();
    if (isComplete && phone.length < 14) {
        sumButton.attr("disabled", isComplete)
    } else {
        sumButton.attr("disabled", false)
    }
    inputsOthers.some(input => {
        if (!input.value) {
            input.value = 0
        }
    })
}

inputsOthers.forEach(input => {
    $(input).on("focus", (e) => {
        input.value = "";
        input.value = e.target.value
    });
})

calculator.addEventListener("input", validate);
validate();
// End disable

// Walls square
let finalArea;
const wallPricesBasalt = {
    50: 2450,
    100: 26000,
    120: 2850,
    150: 3050,
    200: 3350
}

const roofPricesBasalt = {
    50: 2650,
    100: 2800,
    120: 3100,
    150: 3200,
    200: 3400
}

const wallPricesStyrofoam = {
    50: 1820,
    80: 1850,
    100: 1900,
    120: 2000,
    150: 2100,
    200: 2200
}

const roofPricesStyrofoam = {
    50: 2000,
    80: 2050,
    100: 2100,
    120: 2200,
    150: 2300,
    200: 2400
}


function calculateSquare() {
    let totalSum = 0;
    let roofArea = 0

    for (let i = 1; i <= 4; i++) {
        const width = parseFloat($(`#width-${i}`).val());
        const height = parseFloat($(`#height-${i}`).val());

        if (i === 2 || i === 4) {
            if (roof === "1") {
                $("#width-4").val($("#width-2").val());
                $("#height-4").val($("#height-2").val());
                $("#height-in-skate-4").val($("#height-in-skate-2").val());
            } else if (roof === "2") {
                $("#width-3").val($("#width-1").val());
                $("#height-3").val($("#height-1").val());

                $("#width-4").val($("#width-2").val());
                $("#height-4").val($("#height-2").val());
                $("#height-in-skate-4").val($("#height-in-skate-2").val());
            }
            const heightInSkate = parseFloat($(`#height-in-skate-${i}`).val());
            const result = ((Math.ceil(width / 1.18)) * ((height + heightInSkate) / 2)) * 1.18;
            totalSum += Number(result.toFixed(2));
        }
        if (i === 1 || i === 3) {
            const result = (Math.ceil(width / 1.18)) * height * 1.18;
            totalSum += Number(result.toFixed(2));
        }
        if (i === 1) {
            roofArea = (Math.ceil(width / 0.98)) * (parseFloat($(`#width-2`).val()) + 1) * 0.98;
        }
    }

    const doorWidth = parseFloat($("#doors-width").val()) || 0;
    const doorHeight = parseFloat($("#doors-height").val()) || 0;
    const doorCount = parseInt($("#doors-count").val()) || 0;
    const doorArea = (doorWidth * doorHeight) * doorCount;

    const gateWidth = parseFloat($("#gates-width").val()) || 0;
    const gateHeight = parseFloat($("#gates-height").val()) || 0;
    const gateCount = parseInt($("#gates-count").val()) || 0;
    const gateArea = (gateWidth * gateHeight) * gateCount;

    const windowWidth = parseFloat($("#windows-width").val()) || 0;
    const windowHeight = parseFloat($("#windows-height").val()) || 0;
    const windowCount = parseInt($("#windows-count").val()) || 0;
    const windowArea = (windowWidth * windowHeight) * windowCount;

    finalArea = totalSum - (doorArea + gateArea + windowArea);

    if (finalArea) {
        $(document.querySelector(".wall-square")).text(finalArea.toFixed(2) + "м2");
    }
    if (roofArea) {
        $(document.querySelector(".roof-square")).text(roofArea.toFixed(2) + "м2");
    }
}

const insulation = $(document.getElementById("insulation")).val();
const thicknessValueInput = $(document.getElementById("thickness")).val();
const wallsSumResultElement = $(document.querySelector(".sum-walls"));
const roofSumResultElement = $(document.querySelector(".sum-roof"));
let wallsSumResult;
let roofSumResult;
let thickness;

function calculateSum(thicknessValue = thicknessValueInput) {
    thickness = thicknessValue;

    if (insulation === "basalt") {
         const wallSum = wallPricesBasalt[thickness];
         const roofSum = roofPricesBasalt[thickness];
         wallsSumResult = wallSum  * Math.ceil(finalArea);
         roofSumResult = roofSum  * Math.ceil(finalArea);
     } else {
         const wallSum = wallPricesStyrofoam[thickness];
         const roofSum = roofPricesStyrofoam[thickness];
         wallsSumResult = wallSum  * Math.ceil(finalArea);
         roofSumResult = roofSum  * Math.ceil(finalArea);
     }
}

document.addEventListener("input", () => {
    calculateSquare();
    calculateSum(thickness);
});

$(document.getElementById("insulation")).on("change", () => {
    calculateSquare();
    calculateSum();
})

$(document.getElementById("thickness")).on("change", (e) => {
    calculateSquare();
    calculateSum(e.target.value);
})


function saveToCSV(data) {
    $.ajax({
        type: 'POST',
        url: 'save-to-csv.php',
        data: { data },
        success: function(response) {
            alert('Данные успешно записаны в CSV файл.');
        },
        error: function() {
            alert('Ошибка при записи данных.');
        }
    });
}

document.getElementById("sumButton").addEventListener("click", () => {
    wallsSumResultElement.text(wallsSumResult + "c");
    roofSumResultElement.text(roofSumResult + "c");

    const name = $("#name").val();
    const number = "+996" + $("#phone").val();
    const csvData = '"' + name + '","' + number + '","' + wallsSumResult + '","' + roofSumResult + '"\n';
    saveToCSV(csvData)
})
