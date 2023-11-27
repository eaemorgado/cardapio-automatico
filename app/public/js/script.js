// configuração das notificações 

const notbutton = document.getElementById("user-bell");
const notbar = document.getElementById("seller-not");
const notclose = document.getElementById("backrow");

notbutton.addEventListener("click", ()=>{
    notbar.classList.add("show");
})