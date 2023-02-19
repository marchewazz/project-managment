import { Server, Socket } from 'Socket.IO'
import acceptInvitation from './friends-invitations/acceptInvitation'
import cancelInvitation from './friends-invitations/cancelInvitation'

import getInvitations from './friends-invitations/getInvitations'
import rejectInvitation from './friends-invitations/rejectInvitation'
import sendInvitation from './friends-invitations/sendInvitation'
import deleteFriend from './friends/deleteFriend'
import getMessages from './messages/getMessages'
import insertMessage from './messages/InsertMessage'
import createTask from './tasks/createTask'
import deleteTask from './tasks/deleteTask'
import editTask from './tasks/editTask'
import getTasks from './tasks/getTasks'
import getUpcomingUserTasks from './tasks/getUpcomingUserTasks'

const SocketHandler = (req: any, res: any) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on("connection", (socket: Socket) => {   
      // MESSAGES
      socket.on("send-message", (async (data: any) => {    
        await insertMessage(data);  
        io.in(socket.handshake.query["teamID"] as any).emit("update-messages", await getMessages(data))
      }))
      socket.on("get-messages", async (data: any) => { 
        socket.join(socket.handshake.query["teamID"] || "")
        socket.emit("update-messages", await getMessages(data))
      })
      // TASKS
      socket.on("create-task", async (data: any) => { 
        await createTask(data)        
        io.in(socket.handshake.query["teamID"] as any).emit("update-tasks", await getTasks(socket.handshake.query["teamID"]))
      })
      socket.on("edit-task", async (data: any) => { 
        await editTask(data)        
        io.in(socket.handshake.query["teamID"] as any).emit("update-tasks", await getTasks(socket.handshake.query["teamID"]))
      })
      socket.on("get-tasks", async (data: any) => { 
        socket.emit("update-tasks", await getTasks(socket.handshake.query["teamID"]))
      })
      socket.on("delete-task", async (data: any) => { 
        await deleteTask(data.taskID);
        io.in(socket.handshake.query["teamID"] as any).emit("update-tasks", await getTasks(socket.handshake.query["teamID"]))
      })
      socket.on("get-upcoming-user-tasks", async (data: any) => { 
        socket.emit("update-upcoming-user-tasks", await getUpcomingUserTasks(data));
      })
      // INVITATIONS
      socket.on("get-invitations", async (data: any) => {
        socket.emit("update-invitations", await getInvitations(data))
      })
      socket.on("send-invitation", async (data: any) => {
        await sendInvitation(data)
        socket.emit("update-invitations", await getInvitations(data))
      })
      socket.on("cancel-invitation", async (data: any) => {
        await cancelInvitation(data)
        socket.emit("update-invitations", await getInvitations(data))
      })
      socket.on("reject-invitation", async (data: any) => {
        await rejectInvitation(data)
        socket.emit("update-invitations", await getInvitations(data))
      })
      socket.on("accept-invitation", async (data: any) => {
        await acceptInvitation(data)
        socket.emit("update-invitations", await getInvitations(data))
      })
      // FRIENDS
      socket.on("delete-friend", async (data: any) => {
        await deleteFriend(data)
        // socket.emit("update-userdata", await getInvitations(data))
      })
    })
  }
  res.end()
}

export default SocketHandler