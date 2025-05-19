import { useEffect, useState, useRef } from "react";
import { domain } from "../../context/domain";
import axios from "axios";
import io from "socket.io-client";
import { useAuth } from "../../context/authContext";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Send, User, Phone, Video, Info, MoreHorizontal } from "lucide-react";

const socket = io(domain);

const Chat = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const { user_id } = useAuth();
    const { username } = useParams();
    const [myUser, setMyUser] = useState();
    const [otherUser, setOtherUser] = useState();
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    
    useEffect(() => {
        getOtherUser();
        getMyUser();
        
        socket.on("new_message", (newMessage) => {
            setMessages(prev => [...prev, newMessage]);
        });
        
        return () => {
            socket.off("new_message");
        };
    }, [user_id]);
    
    useEffect(() => {
        if (!otherUser || !myUser) return;
        
        socket.emit("register", { currentUserId: user_id, otherUserId: otherUser.id });
        setIsConnected(true);
        setLoading(false);
        
        getMessages()
        
    }, [otherUser, myUser]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const getMessages = async () => {
        const response = await axios.get(`${domain}getChatHistory/${otherUser.id}`, {withCredentials: true})
        setMessages(response.data.chats)
    }
    
    const getOtherUser = async () => {
        try {
            const response = await axios.get(`${domain}getUserByUsername/${username}`, {withCredentials: true});
            setOtherUser(response.data.user);
        } catch (error) {
            console.error("Error al obtener usuario destinatario:", error);
        }
    };
    
    const getMyUser = async () => {
        try {
            const response = await axios.get(`${domain}getUserByCookie`, {withCredentials: true});
            setMyUser(response.data.user);
        } catch (error) {
            console.error("Error al obtener usuario actual:", error);
        }
    };
    
    const handleMessage = (e) => {
        setMessage(e.target.value);
    };
    
    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        
        if (!message.trim()) return;
        
        const newMessage = {
            content: message,
            from: user_id,
            to: otherUser.id,
            timestamp: new Date().toISOString()
        };
        
        // Añadimos el mensaje a la UI
        setMessages(prev => [...prev, newMessage]);
        
        // Enviamos por socket
        socket.emit("message", message);
        
        setMessage("");
    };

    const formatMessageDate = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    };

    const getUserColor = (username) => {
        const colors = [
            "bg-orange-500", "bg-blue-500", "bg-green-500", 
            "bg-red-500", "bg-purple-500", "bg-pink-500"
        ];
        
        const charSum = username?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
        return colors[charSum % colors.length];
    };
    
    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white">
            <header className="bg-gray-800 border-b border-gray-700 p-3 flex items-center justify-between">
                <div className="flex items-center">
                    <Link to="/" className="mr-4 text-gray-400 hover:text-white">
                        <ArrowLeft size={20} />
                    </Link>
                    
                    <div className="flex items-center">
                        <div className={`w-10 h-10 ${getUserColor(otherUser?.username)} rounded-full flex items-center justify-center text-white font-bold mr-3`}>
                            {otherUser?.username?.charAt(0)?.toUpperCase() || <User size={20} />}
                        </div>
                        
                        <div>
                            <h1 className="font-medium text-lg">{otherUser?.username || "..."}</h1>
                            <p className="text-xs text-gray-400">
                                {isConnected ? "Online" : "Connecting..."}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="flex space-x-4">
                    <button className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700"><Phone size={18} /></button>
                    <button className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700"><Video size={18} /></button>
                    <button className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700"><Info size={18} /></button>
                    <button className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700"><MoreHorizontal size={18} /></button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-900" style={{backgroundImage: "url('/pattern-bg.png')", backgroundBlendMode: "overlay"}}>
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                ) : (
                    messages.length > 0 ? (
                        <div className="space-y-3">
                            {messages.map((msg, index) => (
                                <div key={`${msg.timestamp}-${index}`} className={`flex ${msg.from === user_id ? 'justify-end' : 'justify-start'}`}>
                                    {msg.from !== user_id && (
                                        <div className={`${getUserColor(otherUser?.username)} w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-2 flex-shrink-0 self-end`}>
                                            {otherUser?.username?.charAt(0)?.toUpperCase() || "?"}
                                        </div>
                                    )}
                                    
                                    <div className={`max-w-xs md:max-w-md lg:max-w-lg ${msg.from === user_id ? 'order-1' : 'order-2'}`}>
                                        <div className={`px-4 py-2 rounded-2xl shadow ${
                                            msg.from === user_id 
                                                ? 'bg-orange-600 text-white rounded-br-none' 
                                                : 'bg-gray-700 text-white rounded-bl-none'
                                        }`}>
                                            <p className="break-words">{msg.content}</p>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {formatMessageDate(msg.timestamp)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <div className={`w-16 h-16 ${getUserColor(otherUser?.username)} rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3`}>
                                {otherUser?.username?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                            <p className="text-lg mb-1">{otherUser?.username}</p>
                            <p className="text-sm">No hay mensajes aún. ¡Comienza la conversación!</p>
                        </div>
                    )
                )}
            </div>

            <div className="border-t border-gray-700 p-3 bg-gray-800">
                <div className="flex items-center">
                    <input 
                        type="text" 
                        value={message}
                        onChange={handleMessage} 
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSubmit();
                            }
                        }}
                        placeholder="Escribe un mensaje..." 
                        className="flex-1 bg-gray-700 text-white rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button 
                        onClick={handleSubmit}
                        disabled={!message.trim()}
                        className={`ml-3 ${message.trim() ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-600'} text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors`}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Chat;