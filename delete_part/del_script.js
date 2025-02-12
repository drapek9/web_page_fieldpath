let the_timeout = null

document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault()
    let email_username_inf = document.querySelector("#user_email_input").value
    let password_inf = document.querySelector("#user_email_input").value

    if (email_username_inf.trim() != "" && password_inf.trim() != ""){
        let [success, enabled_2fa] = control_password_enab_2fa(password_inf, email_username_inf)
        if (success){
            if (enabled_2fa){
                
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

control_password_enab_2fa = (the_password, email_username) => {
    response_result = true
    enabled_2fa = false
    return [response_result, enabled_2fa]
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