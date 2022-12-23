let score = 0;
document.getElementById('btn').onclick = function() {
    score++;
    this.textContent = score;
}