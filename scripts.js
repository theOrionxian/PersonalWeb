//navbar style on scroll
window.addEventListener("scroll", () => {
    if(this.scrollY > 0){
        document.querySelector("header").style.backgroundColor = "#305252"
        document.querySelector("header").style.boxShadow = "#5e5e5e 0px 0px 10px"
        let links = document.getElementsByClassName("navbar-list-a")
        for (let i = 0; i < links.length; i++) {
            links[i].style.color = "white";
          }
    }else{
        document.querySelector("header").style.backgroundColor = "#00000000"
        document.querySelector("header").style.boxShadow = "none"
        let links = document.getElementsByClassName("navbar-list-a")
        for (let i = 0; i < links.length; i++) {
            links[i].style.color = "black";
          }
    }
}, false)