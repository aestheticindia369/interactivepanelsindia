document.getElementById("whatsappBtn").onclick = function () {
  window.open("https://wa.me/919711542223", "_blank");
};

window.addEventListener("scroll", function(){

const reveals = document.querySelectorAll(".reveal");

for(let i = 0; i < reveals.length; i++){

let windowHeight = window.innerHeight;
let elementTop = reveals[i].getBoundingClientRect().top;
let elementVisible = 100;

if(elementTop < windowHeight - elementVisible){
reveals[i].classList.add("active");
}

}

});