const submitButton = document.getElementById('submit-button');
const username1 = document.getElementById('username1');
const username2 = document.getElementById('username2');
const errorMessage = document.getElementById('error-message');

submitButton.addEventListener('click', () => {
    errorMessage.style.display = 'none';

    const user1 = username1.value.trim();
    const user2 = username2.value.trim();

    if (!user1 || !user2) {
        errorMessage.textContent = 'Both usernames are required!';
        errorMessage.style.display = 'block';
        return;
    } else if (user1 === user2) {
        errorMessage.textContent = 'Usernames must be different!';
        errorMessage.style.display = 'block';
        return;
    }

    const sanitizedUser1 = sanitizeInput(user1);
    const sanitizedUser2 = sanitizeInput(user2);

    console.log('User 1:', sanitizedUser1);
    console.log('User 2:', sanitizedUser2);

    game = new Game(sanitizedUser1, sanitizedUser2);
    gameStarted = true;
    console.log("Game started:", gameStarted);
    // write out that the game has started so the players are notified
    document.getElementById('start-game-message').style.display = 'block';
    checkPlayerAction(game, gameBoard);
});

function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}
