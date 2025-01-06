"use sctrict"
document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault()
    let the_email = event.target.elements.email_input_name.value
    if (the_email !== ""){

    } else {
        document.querySelector("#error_text").style.opacity = 1
    }
})