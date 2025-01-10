document.querySelector("#ver_form").addEventListener("submit", (event) => {
    event.preventDefault()
    send_user_input_verify_code(event.target.elements.code_input.value)
})
const urlParams = new URLSearchParams(window.location.search)
let email_inf = urlParams.get("email")

const send_user_input_verify_code = (code) => {
    // let email_inf = "drapalsimon.second@gmail.com"
    let emailData = {email: email_inf, code: Number(code)}
    fetch('https://send-server-field-path-2.onrender.com/verify_code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',  // Odesíláme JSON
        },
        body: JSON.stringify(emailData),  // Posíláme data jako JSON
    })
    .then(response => response.json())
    .then(data => {
        if (data.response === 2011){ // platnost vypršela
            set_error_text("Verify token expired")
        } else if (data.response === 1421){ // přidáno
            window.location.href = "/user_saved_screen/user_saved.html"
        } else if (data.response === 1921){ // špatný kód
            set_error_text("Invalid verify code")
        } else {
            set_error_text("Your account propably exists")
        }
        console.log(data)
    })
    .catch(error => console.error('Error:', error));
}

document.querySelector("#my_code_input").addEventListener("input", (event) => {
    event.target.value = event.target.value.replace(/[^0-9]/g, '')
    if (event.target.value.length > 6){
        event.target.value = event.target.value.slice(0, 6)
    } else if (event.target.value.length === 6) {
        document.querySelector("#submit_button").disabled = false
        document.querySelector("#submit_button").style.backgroundColor = "black"
        document.querySelector("#submit_button").style.borderWidth = "2px"
    } else {
        document.querySelector("#submit_button").disabled = true
        document.querySelector("#submit_button").style.backgroundColor = "rgb(180, 180, 180)"
        document.querySelector("#submit_button").style.borderWidth = "0"
    }
})

let theTimeoutError2 = null
const set_error_text = (text) => {
    document.querySelector("#error_text").textContent = text
    if (theTimeoutError2 !== null){
        clearTimeout(theTimeoutError2)
        theTimeoutError2 = null
    }
    theTimeoutError2 = setTimeout(() => {
        document.querySelector("#error_text").textContent = ""
    }, 3000)
}