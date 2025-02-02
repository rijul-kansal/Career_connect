// configure files
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

// error handling
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

// importing modules
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const morgan = require('morgan');
const mongoose = require('mongoose');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
var hpp = require('hpp');
// var bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const functions = require('firebase-functions');
// importing in app modules
const ErrorHandler = require('./Utils/ErrorHandler');
const ErrorClass = require('./Utils/ErrorClass');
const AuthRouter = require('./Router/AuthRouter');
const UserRouter = require('./Router/UserRouter');
const JobRouter = require('./Router/JobRouter');
const ChatRouter = require('./Router/ChatRouter');
const ExtRouter = require('./Router/ExtRouter');
const QuestionsRouter = require('./Router/QuestionRouter');
const ChatController = require('./Controller/ChatController');

const app = express();

// creating servers
const server = http.createServer(app);
const io = new Server(server);

// middleware
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // 100 requests per IP
});
app.use(limiter);
app.use(morgan('dev'));
app.use(express.json());
app.use(helmet());
app.use(mongoSanitize());
// app.use(bodyParser.urlencoded());
app.use(hpp());
app.use(xssClean());

// Serve static files from the 'public' directory
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// getting db url
const url = "mongodb+srv://kansalrijul:<password>@cluster0.qoqfi.mongodb.net/CareerConnect?retryWrites=true&w=majority&appName=Cluster0"
const DB_URL = url.replace('<password>', 'kansalrijul123');

// trying to connect to db
mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log('successfully connected to mongoDB');
  })
  .catch((err) => {
    console.log(err);
  });

// routers
app.use('/v1/authentication', AuthRouter);
app.use('/v1/user', UserRouter);
app.use('/v1/jobs', JobRouter);
app.use('/v1/chats', ChatRouter);
app.use('/v1/questions', QuestionsRouter);
app.use('/v1/external', ExtRouter);

// if no router matches then return error
app.all('*', (req, res, next) => {
  return next(
    new ErrorClass(
      'This route is not defined please check the end url once',
      404
    )
  );
});
const users = new Map();

// web socket connection
io.on('connection', (socket) => {
  console.log('a user connected');
  const { userId } = socket.handshake.query;
  console.log(userId,socket.id)
  // storing socket id to array

  users.set(userId, socket.id);
  ChatController.sendAndReceiveMessage(io, socket, users);
  ChatController.disconnectAlert(socket, users);
});

// listening to server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('listening on *:3000');
  console.log('rk');
});

// middle ware
app.use(ErrorHandler);

// error message
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
