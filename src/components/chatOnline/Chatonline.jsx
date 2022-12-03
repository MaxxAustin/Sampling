import axios from 'axios'
import React, { useState, useEffect } from 'react'
import './Chatonline.css'
export default function Chatonline({ onlineUsers, currentId, setCurrentChat }) {
    const [friends, setFriends] = useState([]);
    const [onlineFriends, setOnlineFriends] = useState([]);

    useEffect(() => {
        const getFriends = async () => {
            const res = await axios.get("/users/friends/" + currentId);
            setFriends(res.data);
        };

        getFriends();
    }, [currentId]);

    useEffect(() => {
        setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
    }, [friends, onlineUsers]);

    const handleClick = async (user) => {
        try {
            const res = await axios.get(
                `/conversations/find/${currentId}/${user._id}`
            );
            setCurrentChat(res.data);
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div className="chatOnline">
            {onlineFriends.map(o => (
                <div className="chatOnlineFriend" onClick={() => handleClick(o)}>
                    <div className="chatOnlineImgContainer">
                        <img className="chatOnileImage" src="https://www.w3schools.com/howto/img_avatar.png" alt="" />
                        <div className="chatOnlineBadge">

                        </div>
                    </div>
                    <span className="chatOnlineName">
                        {o.username}
                    </span>
                </div>
            ))}
        </div>
    )
}
