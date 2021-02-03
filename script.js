class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.readyToReset = false;
        this.clear();
    }

    clear() {   //Очищает табло
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.readyToReset = false;
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);      //очищает последнее введенное значение
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;  //Дает поставить только одну точку 
        this.currentOperand = this.currentOperand.toString() + number.toString();         
    }

    chooseOperation(operation){  //При нажатии на операцию переводит данные из текущей операции в предудушую
        if (this.currentOperand === '') return; //не дает стереть данные если не введены новые значения 
        if (this.currentOperand !== '' && this.previousOperand !== '') {
            this.compute();                  //если в поле предыдущих значений есть данные, то выполнять введенную операцию с  предыдущими данными 
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;    //переводит значение текущей операции в предыдущую
        this.currentOperand = '';                    //очищает поле текущей операции
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);      //Переводим введенную строку в число 
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;          // Если предыдущее и текущее значение отсутствуют, вычисления не выполнять
        switch (this.operation) {   
            case '+':
                computation = prev + current;               // если введена операция сложения, произвести операцию
                break
            case '-':
                computation = prev - current;              
                break
            case '*':
                computation = prev * current;               
                break
            case '÷':
                computation = prev / current;               
                break
            default:
                return;                                 //если ни одна из операций не введена, выйти из switch
        }
        this.readyToReset = true;
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = 
            this.getDisplayNumber(this.currentOperand);  //Добавляет цифры на текущее табло
        if (this.operation != null) {                    //Добавляет цифры и операции на табло предшествующих операций 
            this.previousOperandTextElement.innerText = 
            `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    };
};


const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

numberButtons.forEach(button => {                 //Выводит цыфры на экран при их нажитии
    button.addEventListener('click', () => {

        if (calculator.previousOperand === '' &&
        calculator.currentOperand !== '' &&
        calculator.readyToReset) {
            calculator.currentOperand = '';
            calculator.readyToReset = false;
        }
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

operationButtons.forEach(button => {             //Выводит знак операции на экран при его нажатии
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener('click', button => {      //выводит вычисления
    calculator.compute();
    calculator.updateDisplay();
});

allClearButton.addEventListener('click', button => {      //очищает текущее табло
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener('click', button => {      //удаляет 1 символ введенного текущего значения
    calculator.delete();
    calculator.updateDisplay();
});
