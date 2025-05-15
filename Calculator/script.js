let display = document.getElementById('display');
let buttons = document.querySelectorAll('button');
let displayValue = '';
let expression = '';

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;

        if (value >= '0' && value <= '9' || value === '.') {
            // For numbers and decimal point
            display.value = display.value === '0' ? value : display.value + value;
            expression = display.value;
        }
        else if (['+', '-', '×', '÷', '%'].includes(value)) {
            // For operators
            display.value += value;
            expression = display.value;
        }
        else if (value === '=') {
            // Replace display operators with JavaScript operators
            let calculationStr = expression.replace(/×/g, '*').replace(/÷/g, '/');
            try {
                const result = eval(calculationStr);
                display.value = result;
                expression = result.toString();
            } catch (error) {
                display.value = 'Error';
                expression = '';
            }
        }
        else if (value === 'C') {
            // Clear everything
            display.value = '';
            expression = '';
        }
        else if (value === '±') {
            // Handle positive/negative toggle
            if (display.value !== '' && display.value !== 'Error') {
                // Find the last number in the expression
                let lastNumber = display.value.match(/-?\d+\.?\d*$/);
                if (lastNumber) {
                    let toggledNumber = parseFloat(lastNumber[0]) * -1;
                    display.value = display.value.slice(0, lastNumber.index) + toggledNumber;
                    expression = display.value;
                }
            }
        }
    });
});
