import { Server, Socket } from 'Socket.IO'
import getMessages from './messages/getMessages'
import insertMessage from './messages/InsertMessage'

const SocketHandler = (req: any, res: any) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on("connection", (socket: Socket) => {   
      
      socket.join(socket.handshake.query["teamID"] || "")
      
      socket.on("send-message", (async (data: any) => {    
        await insertMessage(data);  
        io.in(socket.handshake.query["teamID"] as any).emit("update-messages", await getMessages(data))
      }))
      socket.on("get-messages", async (data: any) => { 
        socket.emit("update-messages", await getMessages(data))
      })
    })
  }
  res.end()
}

export default SocketHandler