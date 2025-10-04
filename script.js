"use sctrict"
// menu //

function setLanguage(lang) {
    document.querySelectorAll('[data-cs]').forEach(el => {
      el.textContent = el.dataset[lang];
    });
    document.documentElement.lang = lang === 'cs' ? 'cs' : 'en';
    localStorage.setItem('lang', lang); // uloží volbu uživatele
  }

fetch('https://ipwhois.app/json/')
  .then(res => res.json())
  .then(data => {
    const country = data.country_code;
    if(["CZ", "SK"].includes(country)) setLanguage('cs');
    else setLanguage('en');
  })
  .catch(err => console.error(err));

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