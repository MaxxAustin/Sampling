import axios from 'axios'
import React, { useEffect, useState } from 'react'
import './conversation.css'
export default function Conversation({ conversation, currentUser }) {
    const [user, setUser] = useState(null)
    useEffect(() => {
        const friendId = conversation.members.find((m) => m !== currentUser._id);

        const getUser = async () => {
            try {
                const res = await axios("/users?userId=" + friendId);
                setUser(res.data);
                console.log(user, "User Given User Data")
            } catch (err) {
                console.log(err);
            }
        };
        getUser();
        getUser()
    }, [currentUser, conversation])
    return (
        <div className="conversation">
            <img className="conversationImg"
                src={"https://firebasestorage.googleapis.com/v0/b/wiizzy-fb70b.appspot.com/o/ProfilePicture%2F619e155eba0a1f78c511c450?alt=media&token=82e91dcf-adb8-41f9-af2b-c90bc7b3ad1f"}
                alt="" />
            <span className="conversationName">{user?.username}</span>
        </div>
    )
}
