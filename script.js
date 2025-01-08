"use sctrict"
// informace zda existuje email nebo ne
document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault()
    let the_email = event.target.elements.email_input_name.value
    if (the_email !== ""){
        const emailData = { email_data: the_email };

        fetch('https://send-server-field-path-2.onrender.com/control_valid_email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  // Odesíláme JSON
            },
            body: JSON.stringify(emailData),  // Posíláme data jako JSON
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server response:', data);
            let response_code = data.response
            console.log(response_code)
            if (response_code === 981){
                error_text("Email allready exists")
            } else if (response_code === 992){
                error_text("Invalid email structure")
            } else if (response_code === 999){
                send_verify_code(the_email)
            } else if (response_code === 1002){
                error_text("There is a mistake")
            }
        })
        .catch(error => console.error('Error:', error));
    } else {
        error_text("Enter your email!")
    }
})

let error_text = (text) => {
    document.querySelector("#error_text").textContent = text
    setTimeout(() => {
        document.querySelector("#error_text").textContent = ""
    }, 3000)
}

let send_verify_code = (email_inf) => {
    console.log("send code!")
    console.log(email_inf)
    let emailData = {email: email_inf}
    fetch('https://send-server-field-path-2.onrender.com/send_verification_code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',  // Odesíláme JSON
        },
        body: JSON.stringify(emailData),  // Posíláme data jako JSON
    })
    .then(response => response.json())
    .then(data => {
        console.log('Server response:', data.response_code);
    })
    .catch(error => console.error('Error:', error));
}