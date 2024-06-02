class Router {
    constructor({pages, defaultPage}) {
        this.pages = pages;
        this.defaultPage = defaultPage;
        this.currentPage = null;

        this.route(window.location.href);

        // go back
        window.addEventListener('popstate', e => {
            this.route(window.location.href);
        });

        window.addEventListener('click', e => {
            const element = e.target;
            if (element.nodeName === 'A'){
                e.preventDefault();
                this.route(element.href);
                window.history.pushState(null, null, element.href);
            }
        });
    }

    // route to the correct page
    route(urlString) {
        const url = new URL(urlString);
        const page = url.searchParams.get('page');

        if (this.currentPage) {
            this.currentPage.pageHide();
        }

        const page404 = this.pages.find(p => p.key === 404);
        const pageInstanceMatched = this.pages.find(p => p.key === (page ?? this.defaultPage))
        this.currentPage = pageInstanceMatched ?? page404;
        this.currentPage.pageShow();

    }
}

class Page {
    constructor({key, title}) {
        this.pageElement = document.querySelector('#content');
        this.title = title;
        this.key = key;
    }

    render() {
        return ``;
    }

    pageShow(){
        this.pageElement.innerHTML = this.render();
        document.title = this.title;
    }

    pageHide(){
        this.pageElement.innerHTML = ``;
    }
}

class LeaderboardPage extends Page{
    constructor(settings) {
        super(settings);

        this.leaderboard = [];
    }

    render() {
        return `
                    <h2>Leaderboard</h2>

                    <table>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Amount of Wins</th>
                            </tr>
                        </thead>
                        <tbody id="leaderboard-results">
                        </tbody>
                    </table>
                `;
    }

    pageShow() {
        this.removeScrollBar(document.body);
        super.pageShow();

        this.showLeaderboard();
    }

    //show the leaderboard - best 10 descending or all if theres less than 10 entries
    showLeaderboard() {
        const target = document.querySelector('#leaderboard-results');
        const leaderboardEntries = [];

        // Create an array of leaderboard entries
        for (let i = 0; i < localStorage.length; i++) {
            const username = localStorage.key(i);
            const wins = localStorage.getItem(username);
            leaderboardEntries.push({ username, wins });
        }

        // Sort the leaderboard entries based on the number of wins (descending order)
        leaderboardEntries.sort((a, b) => b.wins - a.wins);

        // Display only the top ten entries or the whole list if there are less than ten entries
        const numEntriesToShow = Math.min(leaderboardEntries.length, 10);
        for (let i = 0; i < numEntriesToShow; i++) {
            const entry = leaderboardEntries[i];
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${entry.username}</td>
            <td>${entry.wins}</td>
        `;
            target.appendChild(row);
        }
    }

    removeScrollBar(element) {
        element.style.overflow = 'hidden';
        element.style['-webkit-overflow'] = 'hidden'; // Older versions of Chrome, Safari
        element.style['-moz-overflow'] = 'hidden';    // Older versions of Firefox
        element.style['-ms-overflow'] = 'hidden';     // Older versions of Internet Explorer
    }

    pageHide() {
        super.pageHide();
        this.restoreScrollBar(document.body);
    }

    restoreScrollBar(element) {
        element.style.overflow = ''; // or 'auto'
        element.style['-webkit-overflow'] = ''; // Reset vendor-prefixed property
        element.style['-moz-overflow'] = '';    // Reset vendor-prefixed property
        element.style['-ms-overflow'] = '';     // Reset vendor-prefixed property
    }

}

class GamePage extends Page {
    #usernames_not_entered_event_listener = (event) =>
    {
        // Check if the user has entered both usernames before starting the game
        const cell = event.target;
        if (cell.tagName === 'rect' && !cell.classList.contains('occupied')) {
            if (!username1.value || !username2.value) {
                alert('Please enter both usernames');
            }
        }
    }

    constructor(settings) {
        super(settings);
    }

    render() {
        // console.log('GamePage render')
        // Show the game board for the tic tac toe game
        return `
                    <div id="gameBoardContainer">
                        <svg id="gameBoard" width="300" height="300">
                            <!-- Grid cells -->
                            <rect x="0" y="0" width="100" height="100" class="cell" data-index="0"></rect>
                            <rect x="100" y="0" width="100" height="100" class="cell" data-index="1"></rect>
                            <rect x="200" y="0" width="100" height="100" class="cell" data-index="2"></rect>
                            <rect x="0" y="100" width="100" height="100" class="cell" data-index="3"></rect>
                            <rect x="100" y="100" width="100" height="100" class="cell" data-index="4"></rect>
                            <rect x="200" y="100" width="100" height="100" class="cell" data-index="5"></rect>
                            <rect x="0" y="200" width="100" height="100" class="cell" data-index="6"></rect>
                            <rect x="100" y="200" width="100" height="100" class="cell" data-index="7"></rect>
                            <rect x="200" y="200" width="100" height="100" class="cell" data-index="8"></rect>
                            <!-- Horizontal lines -->
                            <line x1="0" y1="100" x2="300" y2="100" class="grid" />
                            <line x1="0" y1="200" x2="300" y2="200" class="grid" />
                            <!-- Vertical lines -->
                            <line x1="100" y1="0" x2="100" y2="300" class="grid" />
                            <line x1="200" y1="0" x2="200" y2="300" class="grid" />
                        </svg>
                    </div>
        `;
    }


    pageShow() {
        super.pageShow();

        const gameBoard = document.querySelector("#gameBoard");

        // Add event listeners to the game board
        if (gameStarted){
            checkPlayerAction(game, gameBoard)
        }

        document.body.addEventListener('click', this.playGameSound, { once: true });
        document.body.addEventListener('keydown', this.playGameSound, { once: true });

        // make sure the players cant start the game without having their names inputted first
        gameBoard.addEventListener('click', this.#usernames_not_entered_event_listener);
    }

    playGameSound() {
        if (!gameSoundStarted) {
            // if clause because otherwise, the browser returns an error that it can't handle the promise
            gameSound.play()
                .then(() => {
                    gameSoundStarted = true;
                })
                .catch(error => {
                    console.log('Error playing sound:', error);
                });
        }
    }

    pageHide() {
        // the music is played only for when the game is being played
        gameSound.pause();
        super.pageHide();
    }

}


let router = new Router({
    pages:[
        new LeaderboardPage({key:'leaderboard', title: 'Leaderboard'}),
        new GamePage({key: 'game', title: 'Game'})
    ],
    defaultPage: 'game'
});