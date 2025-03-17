"use sctrict"
// menu //

document.querySelector("#menu_button").addEventListener("click", (event) => {
    event.preventDefault();

    let theDiv = document.querySelector("#root_div_a");

    let theOpacity = getComputedStyle(theDiv).opacity;

    if (theOpacity == 1) {
        theDiv.style.opacity = 0;
        theDiv.style.disabled = 0;
        theDiv.style.pointerEvents = "none";
    } else {
        theDiv.style.opacity = 1;
        theDiv.style.pointerEvents = "all";
    }
    
});