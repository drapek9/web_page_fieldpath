let the_timeout = null

document.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault()
    let email_username_inf = document.querySelector("#user_email_input").value
    let password_inf = document.querySelector("#user_password_input").value

    if (email_username_inf.trim() != "" && password_inf.trim() != ""){
        let [success, enabled_2fa, email_2FA] = await control_password_enab_2fa(password_inf, email_username_inf)
        if (success){
            if (enabled_2fa){
                window.location.href = "/verify_code/verify_code.html?type=delete&email=" + encodeURIComponent(email_2FA)
            } else{
                window.location.href = "/delete_part/success_deletion/index.html"
            }
        } else {
            set_error_text("Information doesn't match")
        }
    } else {
        set_error_text("You've not entered all information!")
    }
})

control_password_enab_2fa = async (the_password, email_username) => {
    let response_result = null
    let enabled_2fa = null
    let email_for_2FA = null
    await fetch('https://send-server-field-path-2.onrender.com/control_emailusername_password_2fa_for_delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',  // Odesíláme JSON
        },
        body: JSON.stringify({"username_email": email_username, "password": the_password}),  // Posíláme data jako JSON
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        response_result = data.correct
        enabled_2fa = data.the_2FA
        if (enabled_2fa){
            email_for_2FA = data.email
        }
    })
    .catch(error => {
        console.error('Error:', error)
    });

    return [response_result, enabled_2fa, email_for_2FA]
}

set_error_text = (the_text) => {
    document.querySelector("#error_text").textContent = the_text
    if (the_timeout !== null){
        clearTimeout(the_timeout)
        the_timeout = null
    }
    the_timeout = setTimeout(() => {
        document.querySelector("#error_text").textContent = ""
        the_timeout = null
    }, 3000)
}