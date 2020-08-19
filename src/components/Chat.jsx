import React, {useState, useEffect} from "react"

import MDSpinner from "react-md-spinner"
import {CometChat} from "@cometchat-pro/chat"

const MESSAGE_LISTENER_KEY = "listener-key"
const limit=30

const Chat = ({user}) => {
    const [friends, setFriends] = useState([])
    const [selectedFriend, setSelectedFriend] = useState(null)
    const [chat, setChat] = useState([])
    const [chatIsLoading, setChatIsLoading] = useState(false)
    const [friendIsLoading, setFriendIsLoading] = useState(true)
    const [message, setMessage] = useState("")

    useEffect(() => {
        // run on mount
        let usersRequest = new CometChat.UsersRequestBuilder()
            .setLimit(limit)
            .build()
        usersRequest.fetchNext()
            .then(
                userList => {
                    setFriends(userList)
                    setFriendIsLoading(false)
                    console.log("User list fetched: ", userList)
                },
                error => {
                    console.log("User list fetching failed: ", error)
                }
            )
        
        // run on unmount
        return () => {
            CometChat.removeMessageListener(MESSAGE_LISTENER_KEY)
            CometChat.logout()
        }

    }, []// only once
    )

    useEffect(() => {
        if (selectedFriend) {
            let messagesRequest = new CometChat.MessagesRequestBuilder()
                .setUID(selectedFriend)
                .setLimit(limit)
                .build()
        
            // fetch previous messages
            messagesRequest.fetchPrevious()
                .then(
                    messages => {
                        setChat(messages)
                        setChatIsLoading(false)
                        scrollToBottom()
                    },
                    error => {
                        console.log('Message fetching failed:', error)
                    }
                )

            //remove listener if any
            CometChat.removeMessageListener(MESSAGE_LISTENER_KEY);

            // create new listener for incoming message
            CometChat.addMessageListener(
                MESSAGE_LISTENER_KEY,
                new CometChat.MessageListener({
                    onTextMessageReceived: message => {
                        console.log('Incoming Message Log', {message})
                        if (selectedFriend === message.sender.uid) {
                            setChat(prevState => [...prevState, message])
                        }
                    }
                })
            )
        }
    }, 
    [selectedFriend] // run when selectedFriend variable value is updated
    )

    const handleSubmit = (event) => {
        event.preventDefault()

        let textMessage = new CometChat.TextMessage(
            selectedFriend,
            message,
            CometChat.MESSAGE_TYPE.TEXT,
            CometChat.RECEIVER_TYPE.USER
        )

        CometChat.sendMessage(textMessage)
            .then(
                message => {
                    setChat([...chat, message])
                    console.log('Message sent successfully:', message)           
                },
                error => {
                    console.log('Message sending failed:', error)
                }
            )
        setMessage("")
    }

    const selectFriend = (uid) => {
        setSelectedFriend(uid)
        setChat([])
        setChatIsLoading(true)
    }

    const scrollToBottom = () => {
        let node = document.getElementById('ccChatBoxEnd');
        node.scrollIntoView()
    }

    return (
        <div className="container-fluid">
            <div className='row'>
                <div className='col-md-2' />
                <div className='col-md-8 h-100pr border rounded'>
                    <div className='row'>
                        <div className='col-lg-4 col-xs-12 bg-light' style={{height: 658}}>
                            <div className='row p-3'>
                                <h2>Friend List</h2>
                            </div>
                            <div 
                                className = "row ml-0 mr-0 h-75 bg-white border rounded"
                                style = {{height:"100%", overflow: "auto"}}
                            >
                                <FriendList
                                    friends={friends}
                                    friendIsLoading={friendIsLoading}
                                    selectedFriend={selectedFriend}
                                    selectFriend={selectFriend}
                                />
                            </div> 
                        </div>
                        <div className='col-lg-8 col-xs-12 bg-light' style={{height: 658}}>
                            <div className='row p-3 bg-white'>
                                <h2>Select friend to chat</h2>
                            </div>
                            <div className='row pt-5 bg-white' style={{height: 530, overflow: 'auto'}}>
                                <ChatBox 
                                    chat={chat}
                                    chatIsLoading={chatIsLoading}
                                    user={user}
                                />
                            </div>
                            <div className='row bg-light' style={{bottom: 0, width: '100%'}}>
                                <form className='row m-0 p-0 w-100' onSubmit={handleSubmit}>
                                    <div className='col-9 m-0 p-1'>
                                        <input
                                            id='text'
                                            className='mw-100 border rounded form-control'
                                            type='text'
                                            onChange={event => {
                                                setMessage(event.target.value);
                                            }}
                                            value={message}
                                            placeholder='Type a message...'
                                        />
                                    </div>
                                    <div className='col-3 m-0 p-1'>
                                        <button
                                            className='btn btn-outline-secondary rounded border w-100'
                                            title='Send'
                                            style={{paddingRight: 16}}
                                        >
                                            Send
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const FriendList = (props) => {
    const {friends, friendIsLoading, selectedFriend} = props
    if(friendIsLoading){
        return(
            <div className='col-xl-12 my-auto text-center'>
                <MDSpinner size='72' />
            </div>
        )
    } else {
        return(
            <ul className='list-group list-group-flush w-100'>
                {friends.map(friend => (
                    <li
                        key={friend.uid}
                        className={`list-group-item ${friend.uid === selectedFriend ? 'active' : ''}`}
                        onClick={() => props.selectFriend(friend.uid)}
                    >
                        {friend.name}
                    </li>
                ))}
            </ul> 
        )
    }
}

const ChatBox = (props) => {
    const {chat, chatIsLoading, user} = props
    
    if (chatIsLoading) {
        return (
            <div className='col-xl-12 my-auto text-center'>
                <MDSpinner size='72' />
            </div>
        )
    } else {
        return (
            <div className='col-xl-12'>
                {chat.map(chat => (
                    <div key={chat.id} className="message">
                        <div className={`${chat.receiver !== user.uid ? 'balon1' : 'balon2'} p-3 m-1`}>
                            {chat.text}
                        </div>
                    </div>
                ))}
                <div id='ccChatBoxEnd' />
            </div>
        )
    }
}

export default Chat