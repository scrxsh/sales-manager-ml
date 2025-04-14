
// Mostrar y ocultar sibdebar

const menuBtn = document.querySelector('#menu-btn');
const closeBtn = document.querySelector('#close-btn');
const sidebar = document.querySelector('aside');

menuBtn.addEventListener('click', () => {
    sidebar.style.display = 'block';
})

closeBtn.addEventListener('click', () => {
    sidebar.style.display = 'none';
})


function openModal(modalId) {
    const modalElement = document.getElementById(modalId);
    const modal = new Modal(modalElement); 
    modal.show(); 
}
function closeModal(modalId) {
    const modalElement = document.getElementById(modalId);
    const modal = new Modal(modalElement); 
    modal.hide(); 
}
