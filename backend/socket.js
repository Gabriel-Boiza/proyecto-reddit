import User from "./models/User.js";
const connectedUsers = new Map();

export default function configureSockets(io) {
  io.on('connection', socket => {
    console.log(`Usuario conectado: ${socket.id}`);

    socket.on("register", ({ currentUserId, otherUserId }) => {
      console.log(`Usuario ${currentUserId} registrado, quiere hablar con ${otherUserId}`);
      connectedUsers.set(currentUserId, { socketID: socket.id, sendTo: otherUserId });
      console.log("Usuarios conectados:", Array.from(connectedUsers.entries()));
    });

    socket.on("message", async (messageContent) => {
      try {
        // Identificar al remitente
        let senderUserId = null;
        for (let [userId, userInfo] of connectedUsers.entries()) {
          if (userInfo.socketID === socket.id) {
            senderUserId = userId;
            break;
          }
        }

        if (!senderUserId) {
          console.log("Error: No se pudo identificar al remitente");
          return;
        }

        const senderInfo = connectedUsers.get(senderUserId);
        const receiverUserId = senderInfo.sendTo;

        // Crear objeto de mensaje con los campos requeridos
        const messageObj = {
          content: messageContent,
          from: senderUserId,
          to: receiverUserId,
          timestamp: new Date()
        };

        console.log("Mensaje a enviar:", messageObj);

        // Guardar el mensaje en la base de datos para el remitente
        await User.findByIdAndUpdate(
          senderUserId,
          { $push: { chats: messageObj } },
          { new: true }
        );

        // Guardar el mismo mensaje en la base de datos para el destinatario
        await User.findByIdAndUpdate(
          receiverUserId,
          { $push: { chats: messageObj } },
          { new: true }
        );

        // Enviar el mensaje al destinatario si está conectado
        if (connectedUsers.has(receiverUserId)) {
          const receiverInfo = connectedUsers.get(receiverUserId);
          io.to(receiverInfo.socketID).emit("new_message", messageObj);
        } else {
          console.log(`Usuario ${receiverUserId} no está conectado.`);
        }
      } catch (error) {
        console.error("Error al procesar el mensaje:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`Usuario desconectado: ${socket.id}`);
      for (let [userId, userInfo] of connectedUsers.entries()) {
        if (userInfo.socketID === socket.id) {
          connectedUsers.delete(userId);
          console.log(`Usuario ${userId} eliminado del mapa de conexiones`);
          break;
        }
      }
      console.log("Usuarios conectados tras desconexión:", Array.from(connectedUsers.entries()));
    });
  });
}