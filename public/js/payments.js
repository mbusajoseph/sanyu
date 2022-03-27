class Payments {
    constructor(settings = { publicKey: "", buttonText: "" }, fullName = "", email = "", amount = 0, isChecked = !1, phoneNumber = 0) {
        this.apiScript(), (this.settings = settings), this.paymentForm(), (this.fullName = fullName), (this.email = email), (this.isChecked = isChecked), (this.phoneNumber = phoneNumber), (this.amount = amount), this.initPaymentDetails();
    }
    initPaymentDetails = () => {
        document.getElementById("amount").addEventListener("blur", (e) => {
            this.amount = e.target.value;
        }),
            document.getElementById("email").addEventListener("blur", (e) => {
                this.email = e.target.value;
            }),
            document.getElementById("fullName").addEventListener("blur", (e) => {
                this.fullName = e.target.value;
            }),
            document.getElementById("phoneNumber").addEventListener("blur", (e) => {
                this.phoneNumber = e.target.value;
            });
    };
    paymentForm = () => {
        let form = document.createElement("form");
        form.setAttribute("class", "mt-3");
        let emailInput = this.inputLabel({ for: "email", labelText: "Email Address", input: this.formInput({ name: "email", type: "email", id: "email" }) }),
            nameInput = this.inputLabel({ for: "fullName", labelText: "Full Name", input: this.formInput({ name: "fullName", type: "text", id: "fullName" }) }),
            amountInput = this.inputLabel({ for: "amount", labelText: "Amount", input: this.formInput({ name: "amount", type: "number", id: "amount" }) }),
            phoneNumberInput = this.inputLabel({ for: "phoneNumber", labelText: "Phone Number", input: this.formInput({ name: "phoneNumber", type: "tel", id: "phoneNumber" }) }),
            checkBoxInput = this.checkBox({ id: "consent", checkBoxText: this.settings.checkBoxText });
        form.appendChild(emailInput),
            form.appendChild(nameInput),
            form.appendChild(phoneNumberInput),
            form.appendChild(amountInput),
            form.appendChild(checkBoxInput),
            form.appendChild(this.submitButton(this.settings)),
            document.getElementById(this.settings.formId).appendChild(form);
    };
    formInput = (attributes = { name: "", type: "text", id: "" }) => {
        let input = document.createElement("input");
        return input.setAttribute("type", attributes.type), input.setAttribute("name", attributes.name), input.setAttribute("id", attributes.id), input.setAttribute("class", "form-control"), input.setAttribute("autocomplete", "off"), input;
    };
    submitButton = (attributes = {}) => {
        let button = document.createElement("button");
        button.setAttribute("type", "button"), button.setAttribute("id", "pay-btn"), button.setAttribute("class", "btn btn-success");
        let buttonText = document.createTextNode(attributes.buttonText);
        button.appendChild(buttonText), button.addEventListener("click", this.makePayment);
        let container = document.createElement("div");
        return container.setAttribute("class", "mb-3"), container.appendChild(button), container;
    };
    checkBox = (settings = { id: "" }) => {
        let checkBox = document.createElement("input");
        checkBox.setAttribute("type", "checkbox"), checkBox.setAttribute("class", "custom-checkbox"), checkBox.setAttribute("id", settings.id);
        let span = document.createElement("span"),
            errorDiv = document.createElement("div");
        span.appendChild(document.createTextNode(settings.checkBoxText)), span.setAttribute("class", "ml-3"), errorDiv.setAttribute("class", "text-danger"), errorDiv.setAttribute("id", "errorDiv");
        let div = document.createElement("div");
        return div.setAttribute("class", "mb-3"), div.appendChild(checkBox), div.appendChild(span), div.appendChild(errorDiv), div;
    };
    inputLabel = (attributes = {}) => {
        let label = document.createElement("label");
        label.setAttribute("for", attributes.for), label.setAttribute("class", "w-100"), label.appendChild(document.createTextNode(attributes.labelText)), label.appendChild(attributes.input);
        let container = document.createElement("div");
        return container.setAttribute("class", "mb-3"), container.appendChild(label), container;
    };
    apiScript = () => {
        let scrpit = document.createElement("script"),
            headTag;
        scrpit.setAttribute("src", "https://checkout.flutterwave.com/v3.js"), document.querySelector("head").appendChild(scrpit);
    };
    paymentId = () => Math.floor(-9999999997 * Math.random()) + 1;
    validate = () => {
        let isValid = !0,
            emailInput = document.getElementById("email"),
            nameInput = document.getElementById("fullName"),
            amountInput = document.getElementById("amount"),
            phoneNumberInput = document.getElementById("phoneNumber"),
            errorDiv = document.getElementById("errorDiv"),
            regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            regexFullName = /^[a-zA-Z]+ [a-zA-Z]+$/,
            phoneNumberRegex = /^[0-9]+$/;
        return (
            emailInput.value.match(regexEmail) ? (emailInput.style.border = "2px solid green") : ((emailInput.style.border = "2px solid red"), (isValid = !1), errorDiv.appendChild(document.createTextNode("invalid email address"))),
            nameInput.value.match(regexFullName)
                ? (nameInput.style.border = "2px solid green")
                : ((nameInput.style.border = "2px solid red"), (isValid = !1), errorDiv.appendChild(document.createTextNode(", incorrect format of the full name"))),
            phoneNumberInput.value.match(phoneNumberRegex)
                ? (phoneNumberInput.style.border = "2px solid green")
                : ((phoneNumberInput.style.border = "2px solid red"), (isValid = !1), errorDiv.appendChild(document.createTextNode(", incorrect format of the phone number"))),
            amountInput.value.match(/^\d/)
                ? amountInput.value < 500 && "UGX" === this.settings.payment.currency
                    ? ((amountInput.style.border = "2px solid red"), errorDiv.appendChild(document.createTextNode(", the amount should not be less than 500 ugx")), (isValid = !1))
                    : (amountInput.style.border = "2px solid green")
                : ((amountInput.style.border = "2px solid red"), errorDiv.appendChild(document.createTextNode(", invalid amount!")), (isValid = !1)),
            this.settings.hasOwnProperty("checkBoxRequired") && (document.getElementById("consent").checked || (errorDiv.appendChild(document.createTextNode(", you must check the above checkbox to proceed.")), (isValid = !1))),
            isValid
        );
    };
    sendPaymentDetails = () => {
        let paymentData = new FormData();
        paymentData.append("email", this.email),
            paymentData.append("fullName", this.fullName),
            paymentData.append("phoneNumber", this.phoneNumber),
            paymentData.append("amount", this.amount),
            paymentData.append("isChecked", this.isChecked),
            this.settings.hasOwnProperty("csrf") && paymentData.append("_token", this.settings.csrf),
            document.getElementById('pay-btn').innerHTML = "<span class='spinner-border spinner-border-sm'></span> initializing...",
            document.getElementById('pay-btn').setAttribute('disabled', true),
            fetch(window.location.origin + this.settings.payment.initUrl, { method: "POST", body: paymentData })
                .then((response) => response.json())
                .then((data) => {
                    document.getElementById('pay-btn').innerHTML = "<span class='spinner-border spinner-border-sm'></span> Launching Payment Modal.."
                    if (200 !== data.status) return window.alert(data.message);
                    FlutterwaveCheckout({
                        public_key: this.settings.publicKey,
                        tx_ref: this.paymentId(),
                        amount: this.amount,
                        currency: this.settings.payment.currency,
                        country: this.settings.payment.country,
                        payment_options: " ",
                        redirect_url: this.settings.payment.callback,
                        meta: { consumer_id: Math.floor(-99997 * Math.random()) + 1, consumer_mac: "92a3-912ba-1192a" },
                        customer: { email: this.email, phone_number: this.phoneNumber, name: this.fullName },
                        callback: function (data) {
                            console.log(data);
                        },
                        onclose: function () {
                            alert("The payment process has been terminated!")
                            document.getElementById('pay-btn').innerHTML = "Donate Now"
                            document.getElementById('pay-btn').removeAttribute('disabled')
                        },
                        customizations: { title: this.settings.app.title, description: this.settings.app.description, logo: window.location.origin + this.settings.app.logo },
                    });
                })
                .catch((err) => {
                    console.log(err);
                    document.getElementById('pay-btn').removeAttribute('disabled')
                });
    };
    makePayment = () => {
        if (this.validate()) return document.getElementById("consent").checked && (this.isChecked = 1), this.sendPaymentDetails();
    };
    prifill(data = {}) {
        Object.entries(data).forEach(([key, value]) => (document.getElementById(key).value = value));
    }
}
