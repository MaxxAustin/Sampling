import React, { useContext, useEffect, useRef, useState } from 'react'
import './messenger.css'
import TopBar from '../../components/topbar/Topbar'
import Conversation from '../../components/converstion/Conversation'
import Message from '../../components/message/Message'
import ChatOnline from '../../components/chatOnline/Chatonline'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios';
import io from 'socket.io-client'
const MessengerChat = () => {
    const [conversation, setconversation] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState([])
    const [newmessage, setNewmessage] = useState('')
    const [arrivalMessage, setArrivalMessage] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const socket = useRef()
    const { user } = useContext(AuthContext)
    const scrollRef = useRef()
    /////////////////////////////////////////////////////////////////
    useEffect(() => {
        socket.current = io("https://socketio-v3-chat.herokuapp.com/")
        socket.current.on("getMessage", data => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now()
            })
        })
    }, [])
    useEffect(() => {
        arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) && setMessages((prev) => [...prev, arrivalMessage])
    }, [arrivalMessage, currentChat])
    useEffect(() => {
        socket.current.emit("addUser", user._id)
        socket.current.on("getUsers", users => {
            setOnlineUsers(
                user.followings.filter((f) => users.some((u) => u.userId === f))
            );
        })
    }, [user])


    useEffect(() => {
        const getConversation = async () => {
            try {
                const res = await axios.get(`/conversation/` + user._id)
                setconversation(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        getConversation();
    }, [user._id])
    useEffect(() => {
        const getMessage = async () => {
            try {
                const res = await axios.get("/message/" + currentChat?._id);
                setMessages(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getMessage();
    }, [currentChat]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            sender: user._id,
            text: newmessage,
            conversationId: currentChat._id,
        };

        const receiverId = currentChat.members.find(m => m !== user._id)
        socket.current.emit("sendMessage", {
            senderId: user._id,
            receiverId,
            text: newmessage
        })

        try {
            const res = await axios.post("/message", message);
            setMessages([...messages, res.data]);
            setNewmessage("")
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    return (
        <>
            <TopBar />
            <div className="messenger">
                <div className="chatMenu">
                    <div className="chatMenuwrapper">
                        <input placeholder="Search for friends" className="chatMenuInput" />
                        {conversation.map(c => (
                            <div onClick={() => setCurrentChat(c)}>
                                <Conversation conversation={c} currentUser={user} />
                            </div>
                        ))

                        }
                    </div>
                </div>
                <div className="chatBox">
                    <div className="chatBoxWrapper">
                        {
                            currentChat ?
                                <>
                                    <div className="chatBoxTop">
                                        {
                                            messages.map((m) => (
                                                <div ref={scrollRef}>
                                                    <Message message={m} own={m.sender === user._id} />
                                                </div>
                                            ))
                                        }

                                    </div>
                                    <div className="chatBoxBottom">
                                        <textarea
                                            onChange={(e) => setNewmessage(e.target.value)}
                                            value={newmessage}
                                            className="chatBoxBottomInput" placeholder="write something..." ></textarea>
                                        <button onClick={handleSubmit} className="chatBoxBottomButton">Send</button>
                                    </div> </> : <span className="noConversationText">Open a conversation to start chat</span>}
                    </div>
                </div>
                <div className="chatOnline">
                    <div className="chatOnlineWrapper">
                        <ChatOnline onlineUsers={onlineUsers} currentId={user._id} setCurrentChat={setCurrentChat} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default MessengerChat
