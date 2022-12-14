const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Middlewares
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Settings
app.set('port', process.env.PORT || 8000);

// Starting Server
const server = app.listen(app.get('port'), () =>
  console.log('Servidor escuchando el puerto', app.get('port'))
);

// Web Sockets
const socketIO = require('socket.io');
const io = socketIO(server, {
  cors: {
    origin: '*',
  },
});

const maxPlayers = 4;
let connectedPlayers = 0;
let players = [];
let playerIds = [];
let playerStatus = {
  choosing: true,
  waiting: false,
  ready: false,
};
let gameStarted = false;
let turn = 1;
let tickets = [];

io.on('connection', (socket) => {
  console.log(socket.id);
  socket.on('add player', (playername) => {
    if (playername === '') {
      return socket.emit('error on add player', '¡Debes ingresar un nombre!');
    }
    if (connectedPlayers === maxPlayers) {
      return socket.emit(
        'player cannot enter',
        '¡No puedes ingresar, partida en curso!'
      );
    }
    socket.data.player = {
      id: socket.id,
      name: playername,
    };
    socket.emit('player added');
    players.push(socket.data.player);
    playerIds.push(socket.id);
    connectedPlayers++;
  });

  socket.on('remaining players', () => {
    const remainingPlayers = maxPlayers - connectedPlayers;
    io.emit('send remaining players', remainingPlayers);
  });

  socket.on('disconnect', () => {
    tickets = [];
    gameStarted = false;
    if (socket.data.player) {
      io.emit(
        'on player disconnect',
        `${socket.data.player.name} se ha desconectado.`
      );
      io.emit('reset timer');
      if (connectedPlayers === 1 || connectedPlayers > maxPlayers) return;
      connectedPlayers--;
    }
  });

  socket.on('starting game', () => {
    gameStarted = connectedPlayers === maxPlayers ? true : false;

    socket.on('start turn', () => {
      if (gameStarted) {
        io.emit('game started');
        io.emit('start timer');
        if (tickets.length === 0) {
          createTickets(tickets);
          io.emit('tickets created', tickets);
        }

        if (turn === 1) {
          setTurn();
        }
      }
      socket.on('assing ticket', (ticketId) => {
        players.forEach((player) => {
          if (socket.id === player.id) player.ticket = ticketId;
        });

        io.emit('ticket selected', ticketId);
      });
      socket.on('turn confirmed', () => {
        console.log(turn);
        if (turn > maxPlayers) {
          io.emit('calculated results');
        }
        io.emit('reset timer');
        setTurn();
      });
    });
  });

  socket.on('game over', async () => {
    socket.disconnect();
    connectedPlayers = 0;
    players = [];
    playerIds = [];
    playerStatus = {
      choosing: true,
      waiting: false,
      ready: false,
    };
    gameStarted = false;
    turn = 1;
    tickets = [];
    // io.emit('reset data');
  });

  socket.on('results', () => {
    let ticketOfPlayers = [];
    let playerWinner = '';
    const randomTicket = Math.floor(Math.random() * tickets.length);
    const ticketWinner = tickets[randomTicket];

    players.forEach((player) => {
      tickets.forEach((ticket, index) => {
        if (player.ticket === index)
          ticketOfPlayers.push({
            playername: player.name,
            ticket,
          });
      });
    });

    ticketOfPlayers.forEach((item) => {
      if (JSON.stringify(item.ticket) === JSON.stringify(ticketWinner)) {
        playerWinner = item.playername;
      }
    });

    io.emit(
      'all results',
      maxPlayers,
      ticketOfPlayers,
      ticketWinner,
      playerWinner
    );
  });

  const createTickets = (tickets) => {
    for (let i = 1; i <= 6; i++) {
      let numbers = [];
      for (let j = 0; j < 8; j++) {
        numbers[j] = Math.floor(Math.random() * 99);
      }
      tickets.push(numbers);
    }
  };

  const setTurn = () => {
    let randomPosition = Math.floor(Math.random() * playerIds.length);
    let randomId = playerIds[randomPosition];

    socket.on('set player status to ready', () => {
      playerStatus = {
        choosing: false,
        waiting: false,
        ready: true,
      };
      socket.emit('player is ready', playerStatus);
    });

    if (!playerStatus.ready) {
      playerStatus = {
        choosing: false,
        waiting: true,
        ready: false,
      };
      io.emit('set player status waiting their turn', playerStatus);
    }

    if (randomId) {
      playerStatus = {
        choosing: true,
        waiting: false,
        ready: false,
      };
      io.to(randomId).emit('set player status in turn', playerStatus);
    }

    players.forEach((player) => {
      if (player.id === randomId) {
        io.emit('send player name in turn', player.name);
      }
    });

    playerIds = playerIds.filter((playerId) => {
      return playerId !== randomId;
    });
    turn++;
  };
});
