import { useEffect, useRef, useState } from "react";
import { db, timestamp } from "../utils/firebase";
import Picker from 'emoji-picker-react';
import useStorage from "../hooks/useStorage";
import { TailSpin } from 'react-loader-spinner'

function Chat({ user }) {
    const { upload, loading, url, getPreview } = useStorage('chat_attachment/');
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [pickEmoji, setPickEmoji] = useState(false);
    const [image, setImage] = useState(null);

    const endOfMessage = useRef(null)

    const scrollToBottom = () => {
        if (!endOfMessage.current) return;
        endOfMessage.current.scrollIntoView({ behavior: "smooth" });
    }

    const onEmojiClick = (e, emojiObject) => {
        setMessage(message + emojiObject.emoji)
    };

    useEffect(() => {
        const listener = document.body.addEventListener("click", (e) => {
            setPickEmoji(false)
        })
        return () => {
            document.body.removeEventListener("click", listener)
        }
    }, []);

    useEffect(() => {
        const unsub = db.collection("chats")
            .orderBy('timestamp', 'desc')
            .limit(15)
            .onSnapshot(snapshot => {
                setMessages(
                    snapshot.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id
                    }))
                );
                scrollToBottom()
            })

        return () => {
            unsub()
        }
    }, []);

    const renderChat = (chat) => {
        const byMe = chat.email === user?.email
        if (byMe) return (
            <div key={chat.id} className={`bg-green-200 break-words break-all text-black max-w-[80%] w-fit p-2 rounded mb-2 self-end`}>
                {chat.text}
                {chat?.attachment && <img src={chat?.attachment} alt="" className="w-full rounded-md mt-2" />}
            </div>
        )
        return (
            <div key={chat.id} className={`flex bg-indigo-200 break-words break-all text-black max-w-[80%] w-fit p-2 rounded mb-2`}>
                <img className="w-10 h-10 rounded-full object-cover" src={chat?.image} alt="" />
                <div className="flex-1 pl-2">
                    {chat.text}
                    {chat?.attachment && <img src={chat?.attachment} alt="" className="w-full rounded-md mt-2" />}
                    <div className="text-indigo-600 font-bold text-right mt-1">{chat.name}</div>
                </div>
            </div>
        )
    }

    const sendMessage = (e) => {
        e.preventDefault();
        if (image) return sendPicture()
        if (message) saveOnFirebase();
    }

    const saveOnFirebase = (attachment = null) => {
        const data = {
            text: message?.trim(),
            image: user?.photoURL,
            name: user?.displayName,
            email: user?.email,
            attachment,
            timestamp,
        }
        db.collection("chats").add(data);
        setMessage("")
    }

    const sendPicture = () => {
        if (!image) return
        upload(image)
    }

    useEffect(() => {
        if (url) {
            setImage(null)
            saveOnFirebase(url)
        }
    }, [url])

    const handleChange = (e) => {
        setImage(e.target.files[0]);
    }

    return (
        <div className="relative flex-grow h-[85vh] bg-gray-50 rounded-md flex flex-col">
            <div className="flex-grow flex flex-col-reverse overflow-auto max-h-full p-3">
                <div ref={endOfMessage} />
                {messages?.map(chat => renderChat(chat))}
            </div>
            {image && (
                <div className="absolute shadow-xl z-40 left-0 h-72 overflow-hidden bottom-16 w-full bg-white rounded-md">
                    {loading && (<div className="flex items-center justify-center absolute z-40 self-center w-full h-full bg-gray-600 bg-opacity-60">
                        <TailSpin
                            height="60"
                            width="60"
                            color='white'
                        />
                    </div>)}
                    <span className="absolute top-2 right-2 cursor-pointer" onClick={() => setImage(null)}>❌</span>
                    <img className="w-full h-full object-cover" src={getPreview(image)} alt="Preview" />
                </div>
            )}
            <div className="h-20 relative bg-gray-100 pt-3">
                {loading && loading}
                {pickEmoji && (
                    <div
                        onClick={e => { e.preventDefault(); e.stopPropagation() }}
                        className="absolute w-fit bottom-20 z-50">
                        <Picker onEmojiClick={onEmojiClick} />
                    </div>
                )}
                <div className="flex justify-between items-center">
                    <button
                        onClick={e => { setPickEmoji(true); e.preventDefault(); e.stopPropagation() }}
                        className="ml-3 flex items-center justify-center text-indigo-700 font-semibold p-3 border border-transparent text-sm  rounded-md  bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-opacity-10 hover:bg-opacity-20 mr-2">🙂</button>
                    <form className="flex-1" onSubmit={sendMessage}>
                        <input
                            type="text"
                            readOnly={loading}
                            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                            placeholder="Type a message..."
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                        />
                        <button disabled={loading} type="submit"></button>
                    </form>
                    <label className="ml-3 flex items-center justify-center text-indigo-700 font-semibold p-3 border border-transparent text-sm  rounded-md  bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-opacity-10 hover:bg-opacity-20">
                        📷
                        <input
                            type="file"
                            accept="image/*"
                            id="image"
                            className="w-0 h-0"
                            onChange={handleChange}
                        />
                    </label>

                </div>
            </div>
        </div>
    )
}

export default Chat