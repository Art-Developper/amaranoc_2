"use client"

import React, { useState, useEffect, useRef } from "react"
import {
    Search, Plus, MoreVertical, Send, Mic, Phone, Video, Trash2,
    X, CheckCircle2, ChevronLeft, MicOff, PhoneOff
} from "lucide-react";
import { io } from "socket.io-client";
import Peer from "peerjs";
import { useRouter } from "next/navigation";

const ENDPOINT = "http://localhost:5000";
let socket;

export default function ChatPage() {
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    // --- CALL STATES ---
    const [callModal, setCallModal] = useState(false);
    const [receivingCall, setReceivingCall] = useState(false);
    const [callAccepted, setCallAccepted] = useState(false);
    const [callerSignal, setCallerSignal] = useState(null);
    const [callerName, setCallerName] = useState("");
    const [stream, setStream] = useState(null);

    const myVideo = useRef();
    const userVideo = useRef();
    const peerInstance = useRef(null);

    // --- ՓՈՓՈԽՈՒԹՅՈՒՆ: ՈՐՈՆՄԱՆ ՄՈԴԱԼԻ ՍԹԵՅԹԵՐ ---
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [usersList, setUsersList] = useState([]);
    const [userSearch, setUserSearch] = useState("");

    // 1. Login & Socket Setup
    useEffect(() => {
        fetch("http://localhost:5000/api/profile", { credentials: "include" })
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => {
                setUser(data);
                socket = io(ENDPOINT);
                socket.emit("setup", data);

                const peer = new Peer();
                peerInstance.current = peer;

                fetchChats();
            })
            .catch(() => router.push("/login"));

        return () => socket?.disconnect();
    }, []);

    // 2. Socket Listeners
    useEffect(() => {
        if (!socket) return;

        const handleMessage = (newMessageReceived) => {
            if (selectedChat && selectedChat._id === newMessageReceived.chat._id) {
                setMessages((prev) => [...prev, newMessageReceived]);
            }
            fetchChats();
        };

        const handleIncomingCall = (data) => {
            setReceivingCall(true);
            setCallerName(data.name);
            setCallerSignal(data.signal);
            setCallModal(true);
        };

        socket.on("message received", handleMessage);
        socket.on("call incoming", handleIncomingCall);

        return () => {
            socket.off("message received", handleMessage);
            socket.off("call incoming", handleIncomingCall);
        };
    }, [selectedChat, socket]);

    const fetchChats = async () => {
        const res = await fetch(`${ENDPOINT}/api/chat`, { credentials: "include" });
        const data = await res.json();
        setChats(data);
    };

    const fetchMessages = async () => {
        if (!selectedChat) return;
        const res = await fetch(`${ENDPOINT}/api/message/${selectedChat._id}`, { credentials: "include" });
        const data = await res.json();
        setMessages(data);
    };

    useEffect(() => {
        if (selectedChat) {
            fetchMessages();
            socket.emit("join chat", selectedChat._id);
        }
    }, [selectedChat]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        const res = await fetch(`${ENDPOINT}/api/message`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: newMessage, chatId: selectedChat._id }),
            credentials: "include"
        });
        const data = await res.json();
        setMessages([...messages, data]);
        socket.emit("new message", data);
        setNewMessage("");
    };

    // --- ՓՈՓՈԽՈՒԹՅՈՒՆ: ՕԳՏԱՏԵՐԵՐԻ ՈՐՈՆՄԱՆ ՖՈՒՆԿՑԻԱՆԵՐ ---
    const handleSearchUsers = async (query) => {
        setUserSearch(query);
        if (!query) return setUsersList([]);
        const res = await fetch(`${ENDPOINT}/api/users?search=${query}`, { credentials: "include" });
        const data = await res.json();
        setUsersList(data);
    };

    const accessChat = async (userId) => {
        const res = await fetch(`${ENDPOINT}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
            credentials: "include"
        });
        const data = await res.json();
        setSelectedChat(data);
        setIsSearchOpen(false);
        setUserSearch("");
        setUsersList([]);
        fetchChats();
    };

    // --- VOICE & CALL LOGIC (Նույնն է մնացել) ---
    const toggleRecording = async () => {
        if (!recording) {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            let chunks = [];
            recorder.ondataavailable = (e) => chunks.push(e.data);
            recorder.onstop = async () => {
                const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = async () => {
                    const res = await fetch(`${ENDPOINT}/api/message`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            content: "🎤 Ձայնային հաղորդագրություն",
                            chatId: selectedChat._id,
                            messageType: "voice",
                            fileUrl: reader.result
                        }),
                        credentials: "include"
                    });
                    const data = await res.json();
                    setMessages([...messages, data]);
                    socket.emit("new message", data);
                };
            };
            recorder.start();
            setMediaRecorder(recorder);
            setRecording(true);
        } else {
            mediaRecorder.stop();
            setRecording(false);
        }
    };

    const callUser = async (type) => {
        setCallModal(true);
        const userToCall = selectedChat.users.find(u => u._id !== user._id)._id;
        const localStream = await navigator.mediaDevices.getUserMedia({ video: type === 'video', audio: true });
        setStream(localStream);
        if (myVideo.current) myVideo.current.srcObject = localStream;
        const peer = peerInstance.current;
        const call = peer.call(userToCall, localStream);
        socket.emit("call user", { userToCall, signalData: peer.id, from: user._id, name: user.name, type });
        call.on('stream', (remoteStream) => { if (userVideo.current) userVideo.current.srcObject = remoteStream; });
        setCallAccepted(true);
    };

    const answerCall = async () => {
        setCallAccepted(true);
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(localStream);
        if (myVideo.current) myVideo.current.srcObject = localStream;
        peerInstance.current.on('call', (call) => {
            call.answer(localStream);
            call.on('stream', (remoteStream) => { if (userVideo.current) userVideo.current.srcObject = remoteStream; });
        });
        setReceivingCall(false);
    };

    const clearChat = async () => {
        if (window.confirm("Արդյո՞ք ուզում եք մաքրել ամբողջ պատմությունը")) {
            await fetch(`${ENDPOINT}/api/message/clear/${selectedChat._id}`, { method: "DELETE", credentials: "include" });
            setMessages([]);
        }
    };

    const filteredChats = chats.filter(c => {
        const chatName = c.isGroupChat ? c.chatName : c.users.find(u => u._id !== user?._id)?.name;
        return chatName?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="flex h-screen bg-[#f3f4f6] p-4 md:p-10 gap-0 overflow-hidden font-sans">

            {/* SIDEBAR */}
            <aside className={`w-full md:w-[400px] bg-white border-r flex flex-col rounded-l-[40px] shadow-sm ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-8 flex justify-between items-center">
                    <h2 className="text-3xl font-black italic tracking-tighter text-gray-800">Messages</h2>
                    {/* --- ՓՈՓՈԽՈՒԹՅՈՒՆ: Plus կոճակը հիմա բացում է որոնումը --- */}
                    <button onClick={() => setIsSearchOpen(true)} className="p-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition shadow-lg shadow-orange-100">
                        <Plus size={22} />
                    </button>
                </div>

                <div className="px-8 mb-8 relative">
                    <input type="text" placeholder="Search contact..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-gray-50 p-4 pl-12 rounded-[20px] outline-none border border-transparent focus:border-orange-200" />
                    <Search className="absolute left-12 top-4.5 text-gray-400" size={20} />
                </div>

                <div className="flex-1 overflow-y-auto px-4 space-y-3 no-scrollbar">
                    {filteredChats.map((chat) => (
                        <div key={chat._id} onClick={() => setSelectedChat(chat)} className={`flex items-center gap-4 p-5 rounded-[30px] transition-all ${selectedChat?._id === chat._id ? 'bg-orange-500 text-white shadow-xl' : 'hover:bg-gray-50 bg-white'}`}>
                            <div className="w-14 h-14 bg-gray-200 rounded-full flex-shrink-0 border-2 border-white overflow-hidden shadow-sm">
                                <img src={`https://ui-avatars.com/api/?name=${chat.isGroupChat ? chat.chatName : chat.users.find(u => u._id !== user?._id)?.name}&background=random`} alt="avatar" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-base truncate">{chat.isGroupChat ? chat.chatName : chat.users.find(u => u._id !== user?._id)?.name}</h4>
                                <p className="text-xs truncate opacity-70">{chat.latestMessage ? chat.latestMessage.content : "No messages..."}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* CHAT WINDOW */}
            <main className={`flex-1 bg-white rounded-r-[40px] flex flex-col relative ${!selectedChat ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
                {selectedChat ? (
                    <>
                        <div className="p-6 md:p-8 border-b flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <button className="md:hidden p-2" onClick={() => setSelectedChat(null)}><ChevronLeft /></button>
                                <div className="w-12 h-12 bg-green-500 rounded-full border-4 border-white shadow-md" />
                                <div>
                                    <h3 className="font-black text-gray-800 text-lg uppercase tracking-tighter">
                                        {selectedChat.isGroupChat ? selectedChat.chatName : selectedChat.users.find(u => u._id !== user?._id)?.name}
                                    </h3>
                                    <span className="text-[10px] text-green-500 font-black uppercase tracking-[0.2em]">Online</span>
                                </div>
                            </div>
                            <div className="flex gap-2 md:gap-4">
                                <button onClick={() => callUser('audio')} className="p-3 hover:bg-orange-50 text-gray-400 hover:text-orange-500 rounded-full transition"><Phone size={20} /></button>
                                <button onClick={() => callUser('video')} className="p-3 hover:bg-orange-50 text-gray-400 hover:text-orange-500 rounded-full transition"><Video size={20} /></button>
                                <button onClick={clearChat} className="p-3 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-full transition"><Trash2 size={20} /></button>
                            </div>
                        </div>

                        <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-[#fafafa] space-y-6 no-scrollbar">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.sender._id === user?._id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] p-4 rounded-[25px] font-medium text-[15px] shadow-sm
                                        ${m.sender._id === user?._id ? 'bg-[#1d2331] text-white rounded-br-none' : 'bg-white text-gray-700 rounded-bl-none border border-gray-100'}`}
                                    >
                                        {m.messageType === "voice" ? <audio controls src={m.fileUrl} className="h-8 w-40" /> : m.content}
                                        <div className="text-[9px] mt-1 opacity-50 text-right uppercase font-black">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-8 bg-white border-t rounded-br-[40px]">
                            <div className="flex items-center gap-4 bg-gray-50 p-2 pl-6 rounded-full border border-gray-100 shadow-inner">
                                <button className="p-2 bg-white rounded-full shadow-sm text-gray-400">+</button>
                                <input type="text" placeholder="Write a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} className="flex-1 bg-transparent outline-none font-bold text-gray-700" />
                                <button onClick={toggleRecording} className={`p-3 transition-all rounded-full ${recording ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:text-orange-500'}`}>{recording ? <MicOff size={22} /> : <Mic size={22} />}</button>
                                <button onClick={sendMessage} className="p-4 bg-orange-500 text-white rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all"><Send size={20} /></button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center space-y-4">
                        <div className="bg-orange-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto"><Send size={40} className="text-orange-500 opacity-50" /></div>
                        <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">Select a chat to start</h3>
                    </div>
                )}
            </main>

            {/* --- CALL MODAL --- */}
            {callModal && (
                <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-10 text-white">
                    <h2 className="text-2xl font-black mb-10 tracking-tighter uppercase">{receivingCall && !callAccepted ? `${callerName} զանգում է...` : 'Զանգ'}</h2>
                    <div className="flex gap-10 w-full max-w-5xl h-[60vh]">
                        <div className="flex-1 bg-gray-900 rounded-[40px] overflow-hidden relative border-2 border-white/10 shadow-2xl">
                            <video playsInline muted ref={myVideo} autoPlay className="w-full h-full object-cover" />
                            <span className="absolute bottom-5 left-5 bg-black/50 px-4 py-1 rounded-full text-xs font-bold uppercase">Դուք</span>
                        </div>
                        {callAccepted && (
                            <div className="flex-1 bg-gray-900 rounded-[40px] overflow-hidden relative border-2 border-white/10 shadow-2xl">
                                <video playsInline ref={userVideo} autoPlay className="w-full h-full object-cover" />
                                <span className="absolute bottom-5 left-5 bg-black/50 px-4 py-1 rounded-full text-xs font-bold uppercase">{callerName || "Մյուս կողմը"}</span>
                            </div>
                        )}
                    </div>
                    <div className="mt-20 flex gap-10">
                        {receivingCall && !callAccepted ? (
                            <button onClick={answerCall} className="bg-green-500 p-8 rounded-full shadow-2xl hover:scale-110 transition animate-bounce"><Phone size={30} /></button>
                        ) : null}
                        <button onClick={() => window.location.reload()} className="bg-red-500 p-8 rounded-full shadow-2xl hover:scale-110 transition"><PhoneOff size={30} /></button>
                    </div>
                </div>
            )}

            {/* --- ՓՈՓՈԽՈՒԹՅՈՒՆ: ՕԳՏԱՏԵՐԵՐԻ ՈՐՈՆՄԱՆ ՄՈԴԱԼ --- */}
            {isSearchOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[40px] w-full max-w-md shadow-2xl p-10 animate-in zoom-in-95 duration-200 border border-gray-100">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter">New Chat</h3>
                            <button onClick={() => setIsSearchOpen(false)} className="text-gray-400 hover:text-black transition-colors"><X size={28} /></button>
                        </div>

                        <div className="relative mb-8">
                            <input
                                type="text"
                                placeholder="Type name or email..."
                                className="w-full bg-gray-50 p-5 rounded-[20px] outline-none border-2 border-transparent focus:border-orange-400 font-bold transition-all"
                                value={userSearch}
                                onChange={(e) => handleSearchUsers(e.target.value)}
                            />
                        </div>

                        <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 no-scrollbar">
                            {usersList.map((u) => (
                                <div
                                    key={u._id}
                                    onClick={() => accessChat(u._id)}
                                    className="flex items-center gap-4 p-4 hover:bg-orange-50 rounded-[25px] cursor-pointer border border-transparent hover:border-orange-200 transition-all group"
                                >
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center font-black text-orange-500 border-2 border-white shadow-sm group-hover:bg-white transition-all">
                                        {u.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-lg">{u.name}</h4>
                                        <p className="text-xs text-gray-400 font-medium">{u.email}</p>
                                    </div>
                                </div>
                            ))}
                            {usersList.length === 0 && userSearch && <p className="text-center text-gray-400 italic py-10 font-bold">User not found</p>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}