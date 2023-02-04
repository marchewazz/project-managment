import { Server, Socket } from 'Socket.IO'

import getMessages from './messages/getMessages'
import insertMessage from './messages/InsertMessage'
import createTask from './tasks/createTask'
import deleteTask from './tasks/deleteTask'
import getTasks from './tasks/getTasks'

const SocketHandler = (req: any, res: any) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on("connection", (socket: Socket) => {   
      socket.on("send-message", (async (data: any) => {    
        await insertMessage(data);  
        io.in(socket.handshake.query["teamID"] as any).emit("update-messages", await getMessages(data))
      }))
      socket.on("get-messages", async (data: any) => { 
        socket.join(socket.handshake.query["teamID"] || "")
        socket.emit("update-messages", await getMessages(data))
      })
      socket.on("create-task", async (data: any) => { 
        await createTask(data)        
        io.in(socket.handshake.query["teamID"] as any).emit("update-tasks", await getTasks(socket.handshake.query["teamID"]))
      })
      socket.on("get-tasks", async (data: any) => { 
        socket.emit("update-tasks", await getTasks(socket.handshake.query["teamID"]))
      })
      socket.on("delete-task", async (data: any) => { 
        await deleteTask(data.taskID);
        io.in(socket.handshake.query["teamID"] as any).emit("update-tasks", await getTasks(socket.handshake.query["teamID"]))
      })
    })
  }
  res.end()
}

export default SocketHandler