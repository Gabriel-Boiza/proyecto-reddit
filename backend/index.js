import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./config/db.js"
import {Server as SocketServer} from "socket.io"
import http from "http"
import usersRouter from "./routes/user.route.js"
import postsRouter from "./routes/post.route.js"
import authRouter from "./routes/auth.routes.js"
import commentRouter from "./routes/comment.routes.js"  
import searchRouter from "./routes/search.routes.js"  


dotenv.config()
connectDB()

const app = express()
const server = http.createServer(app)

const io = new SocketServer(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  }
});


app.use(express.json()) //lee el body de las request y las transforma en un objeto json
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
app.use(cookieParser()) //middleware para recibir las cookies en cada request
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.send("g")
})

app.use("/", usersRouter)
app.use("/", postsRouter)
app.use("/", authRouter)
app.use("/", commentRouter)
app.use("/", searchRouter)


const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log("Servidor " + PORT)
})

// Map para gestionar usuarios conectados
// Estructura: userId -> { socketID, sendTo }
const connectedUsers = new Map();

// Gestión de conexiones de Socket.IO
io.on('connection', socket => {
    console.log(`Usuario conectado: ${socket.id}`);

    // Registrar usuario en el mapa de conexiones
    socket.on("register", ({ currentUserId, otherUserId }) => {
        console.log(`Usuario ${currentUserId} registrado, quiere hablar con ${otherUserId}`);
        
        // Guardar la relación userId -> socket.id y otherUserId
        connectedUsers.set(currentUserId, { socketID: socket.id, sendTo: otherUserId });
        
        // Log de usuarios conectados (para depuración)
        console.log("Usuarios conectados:", Array.from(connectedUsers.entries()));
    });

    // Recibir y reenviar mensajes
    socket.on("message", (messageContent) => {
        // Encontrar el usuario que envía el mensaje basado en su socket.id
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
        
        // Crear objeto de mensaje
        const messageObj = {
            from: senderUserId,
            to: receiverUserId,
            content: messageContent,
            timestamp: new Date()
        };
        
        console.log("Mensaje a enviar:", messageObj);

        // Verificar si el destinatario está conectado
        if (connectedUsers.has(receiverUserId)) {
            const receiverInfo = connectedUsers.get(receiverUserId);
            
            // Enviar mensaje al destinatario
            io.to(receiverInfo.socketID).emit("new_message", messageObj);
            
            // Confirmar al remitente que se entregó el mensaje
            socket.emit("message_delivered", messageObj);
        } else {
            // El destinatario no está conectado
            console.log(`Usuario ${receiverUserId} no está conectado. Mensaje en espera.`);
            
            // Aquí se debe guardar el mensaje en la base de datos
            // para entregarlo cuando el usuario se conecte
            
            /*
            // Código para guardar en base de datos (a implementar)
            try {
                // Importar el modelo de mensajes
                // const Message = require('./models/Message');
                
                // Crear nuevo mensaje
                // const newMessage = new Message({
                //     sender: senderUserId,
                //     receiver: receiverUserId,
                //     content: messageContent,
                //     read: false,
                //     timestamp: new Date()
                // });
                
                // Guardar mensaje
                // await newMessage.save();
                
                // Confirmar al remitente que se guardó el mensaje
                // socket.emit("message_stored", messageObj);
            } catch (error) {
                console.error("Error al guardar mensaje:", error);
                socket.emit("message_error", { error: "No se pudo guardar el mensaje" });
            }
            */
            
            // Mientras tanto, notificar al remitente que el mensaje está pendiente
            socket.emit("message_pending", messageObj);
        }
    });

    // Gestionar desconexión
    socket.on("disconnect", () => {
        console.log(`Usuario desconectado: ${socket.id}`);
        
        // Encontrar y eliminar el usuario que se desconectó
        for (let [userId, userInfo] of connectedUsers.entries()) {
            if (userInfo.socketID === socket.id) {
                connectedUsers.delete(userId);
                console.log(`Usuario ${userId} eliminado del mapa de conexiones`);
                break;
            }
        }
        
        // Log de usuarios conectados después de la desconexión
        console.log("Usuarios conectados tras desconexión:", Array.from(connectedUsers.entries()));
    });
});