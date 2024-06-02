
document.addEventListener("DOMContentLoaded", () => {
    // Function to dynamically create and position background symbols - X and O
    function createBackgroundSymbols() {
        const container = document.getElementById('background-symbols');

        for (let i = 0; i < 10; i++) {
            const xSymbol = document.createElement('div');
            xSymbol.className = 'background-symbol';
            xSymbol.textContent = 'X';
            xSymbol.style.top = `${Math.random() * 100}%`;
            xSymbol.style.left = `${Math.random() * 100}%`;
            xSymbol.style.animationDuration = `${Math.random() * 10 + 5}s`;
            container.appendChild(xSymbol);

            const oSymbol = document.createElement('div');
            oSymbol.className = 'background-symbol o-symbol';
            oSymbol.textContent = 'O';
            oSymbol.style.top = `${Math.random() * 100}%`;
            oSymbol.style.left = `${Math.random() * 100}%`;
            oSymbol.style.animationDuration = `${Math.random() * 10 + 5}s`;
            container.appendChild(oSymbol);
        }
    }

    createBackgroundSymbols();
})

