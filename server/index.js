import http from 'http'
import express from 'express'
import cors from 'cors'
import { Server } from "socket.io";

const app = express();
app.use(cors())


const users=[{}];

const port = process.env.PORT || 8080;


app.get("/",(req,res)=>{
    res.send("this is working")
})


const server =http.createServer(app);
const io = new Server(server);
// const io = socketIo(server);

io.on("connection",(socket)=>{

    console.log("new connection");


    socket.on('joined',({user})=>{
        users[socket.id]=user;
        console.log(`${user} has joined the chat.`);
        socket.broadcast.emit('userJoined',{user:"Admin",message:` ${users[socket.id]} has joined`});
        socket.emit('welcome',{user:"Admin",message:`Welcome to the chat,${users[socket.id]} `})
    })

    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user:users[id],message,id});
    })


    socket.on('disconnect',()=>{
        socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]}  has left`});
      console.log(`user left`);
  })


})

server.listen(port,()=>{
    console.log("server is running")
})

