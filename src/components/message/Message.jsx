import React from 'react'
import './Message.css'
import { format } from 'timeago.js'
export default function Message({ message, own }) {
    return (
        <div className={own ? "messages own" : "messages"}>
            <div className="messageTop">
                <img className="messageImage"
                    src={"https://cdn1.vectorstock.com/i/1000x1000/51/05/male-profile-avatar-with-brown-hair-vector-12055105.jpg"}
                    alt="" />
                <p className="messageText">{message.text}</p>
            </div>
            <div className="messageBottom">{format(message.createdAt)}</div>
        </div>
    )
}
