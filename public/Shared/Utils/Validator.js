class Validator {
    constructor(config, formID) {
        this.elementsConfig = config;
        this.formID = formID;
        this.errors = {};

        this.initializeErrors();
        this.addInputListeners();
    }

    initializeErrors() {
        Object.keys(this.elementsConfig).forEach(field => {
            this.errors[field] = [];
        });
    }

    addInputListeners() {
        Object.keys(this.elementsConfig).forEach(field => {
            const inputElement = document.querySelector(`${this.formID} input[name="${field}"]`);
            if (inputElement) {
                inputElement.addEventListener('input', this.validate.bind(this));
            }
        });
    }

    validate(event) {
        const field = event.target;
        const fieldName = field.getAttribute('name');
        const fieldValue = field.value.trim();

        this.errors[fieldName] = [];

        const config = this.elementsConfig[fieldName];

        if (config.required && !fieldValue) {
            this.errors[fieldName].push('Field is empty!');
        }

        if (config.email && !this.validateEmail(fieldValue)) {
            this.errors[fieldName].push('Invalid email address!');
        }

        if (
            (config.minlength && fieldValue.length < config.minlength) ||
            (config.maxlength && fieldValue.length > config.maxlength)
        ) {
            this.errors[fieldName].push(
                `The field must have between ${config.minlength} and ${config.maxlength} characters!`
            );
        }

        if (config.matching) {
            const matchingField = document.querySelector(`${this.formID} input[name="${config.matching}"]`);
            if (matchingField && fieldValue !== matchingField.value.trim()) {
                this.errors[fieldName].push('Passwords do not match!');
            }

            if (this.errors[fieldName].length === 0) {
                this.errors[config.matching] = [];
            }
        }

        this.displayErrors();
    }

    validationPassed() {
        return Object.values(this.errors).every(errorList => errorList.length === 0);
    }

    displayErrors() {
        document.querySelectorAll('ul').forEach(elem => elem.remove());

        Object.entries(this.errors).forEach(([fieldName, errorList]) => {
            const inputElement = document.querySelector(`${this.formID} input[name="${fieldName}"]`);
            if (inputElement) {
                const parentElement = inputElement.parentElement;
                const errorsElement = document.createElement('ul');

                errorList.forEach(error => {
                    const errorItem = document.createElement('li');
                    errorItem.innerText = error;
                    errorsElement.appendChild(errorItem);
                });

                parentElement.appendChild(errorsElement);
            }
        });
    }

    validateEmail(email) {
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return emailRegex.test(email);
    }
}
