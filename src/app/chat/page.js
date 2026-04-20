"use client"

import React, { useState, useEffect, useRef } from "react"
import {
    Search, Plus, Send, Mic, Phone, Video, Trash2,
    X, CheckCircle2, ChevronLeft, MicOff, PhoneOff, Home, User as UserIcon
} from "lucide-react";
import { io } from "socket.io-client";
import Peer from "peerjs";
import { useRouter } from "next/navigation";

const ENDPOINT = "http://localhost:5000";

export default function ChatPage() {
    const router = useRouter();

    // --- ՀԻՄՆԱԿԱՆ ՍԹԵՅԹԵՐ ---
    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // --- Socket & Refs ---
    const socket = useRef(null);
    const messagesEndRef = useRef(null);
    const peerInstance = useRef(null);
    const myVideo = useRef();
    const userVideo = useRef();

    // --- ՁԱՅՆԱՅԻՆԻ & ԶԱՆԳԵՐԻ ՍԹԵՅԹԵՐ ---
    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [callModal, setCallModal] = useState(false);
    const [receivingCall, setReceivingCall] = useState(false);
    const [callAccepted, setCallAccepted] = useState(false);
    const [callerSignal, setCallerSignal] = useState(null);
    const [callerName, setCallerName] = useState("");
    const [stream, setStream] = useState(null);

    // --- ԽՄԲԱՅԻՆ ՉԱՏԻ ՍԹԵՅԹԵՐ ---
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [selectedUsersForGroup, setSelectedUsersForGroup] = useState([]);

    // Ավտոմատ սքրոլ ներքև
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 1. Մուտքի և Socket-ի նախնական կարգավորում
    useEffect(() => {
        fetch(`${ENDPOINT}/api/profile`, { credentials: "include" })
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => {
                setUser(data);

                // Միացնում ենք Socket-ը
                socket.current = io(ENDPOINT);
                socket.current.emit("setup", data);

                // Միացնում ենք PeerJS-ը զանգերի համար
                const peer = new Peer(data._id);
                peerInstance.current = peer;

                peer.on('call', (call) => {
                    setReceivingCall(true);
                    setCallModal(true);
                    setCallerName("Incoming Call...");
                    setCallerSignal(call);
                });

                fetchChats();
                fetchAllUsers();
            })
            .catch(() => router.push("/login"));

        return () => {
            if (socket.current) socket.current.disconnect();
        };
    }, []);

    // 2. Լսել Socket հաղորդագրությունները (Real-time ֆիքս)
    useEffect(() => {
        if (!socket.current) return;

        const handleMessageReceived = (newMessageReceived) => {
            // Եթե նամակը պատկանում է հենց այս պահին բացված չատին
            if (selectedChat && selectedChat._id === newMessageReceived.chat._id) {
                setMessages((prev) => [...prev, newMessageReceived]);
            }
            // Թարմացնել չատերի ցուցակը (վերջին նամակը տեսնելու համար)
            fetchChats();
        };

        socket.current.on("message received", handleMessageReceived);

        return () => {
            socket.current.off("message received", handleMessageReceived);
        };
    }, [selectedChat]); // Կարևոր է, որ selectedChat-ը լինի այստեղ

    // --- ՖՈՒՆԿՑԻԱՆԵՐ ---

    const fetchChats = async () => {
        const res = await fetch(`${ENDPOINT}/api/chat`, { credentials: "include" });
        const data = await res.json();
        setChats(data);
    };

    const fetchAllUsers = async () => {
        const res = await fetch(`${ENDPOINT}/api/users`, { credentials: "include" });
        const data = await res.json();
        setAllUsers(data);
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
            socket.current.emit("join chat", selectedChat._id);
        }
    }, [selectedChat]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        const messageData = { content: newMessage, chatId: selectedChat._id };

        const res = await fetch(`${ENDPOINT}/api/message`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(messageData),
            credentials: "include"
        });
        const data = await res.json();

        setMessages([...messages, data]);
        socket.current.emit("new message", data);
        setNewMessage("");
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
        fetchChats();
    };

    const createGroupChat = async () => {
        if (!groupName || selectedUsersForGroup.length < 2) {
            alert("Մուտքագրեք անուն և ընտրեք առնվազն 2 հոգի");
            return;
        }
        const res = await fetch(`${ENDPOINT}/api/chat/group`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: groupName, users: selectedUsersForGroup }),
            credentials: "include"
        });
        const data = await res.json();
        setChats([data, ...chats]);
        setIsGroupModalOpen(false);
        setGroupName("");
        setSelectedUsersForGroup([]);
    };

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
                            content: "🎤 Voice Message",
                            chatId: selectedChat._id,
                            messageType: "voice",
                            fileUrl: reader.result
                        }),
                        credentials: "include"
                    });
                    const data = await res.json();
                    setMessages([...messages, data]);
                    socket.current.emit("new message", data);
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
        try {
            // Ստուգում ենք՝ արդյոք բրաուզերը աջակցում է մեդիա սարքերին
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                alert("Ձեր բրաուզերը չի աջակցում զանգերի ֆունկցիան:");
                return;
            }

            const constraints = {
                audio: true,
                video: type === 'video'
            };

            // Այստեղ բրաուզերը կհարցնի թույլտվություն (2-րդ կետի պատասխանը)
            const localStream = await navigator.mediaDevices.getUserMedia(constraints);

            setCallModal(true);
            setStream(localStream);
            if (myVideo.current) myVideo.current.srcObject = localStream;

            const userToCall = selectedChat.users.find(u => u._id !== user._id)._id;
            const call = peerInstance.current.call(userToCall, localStream);

            call.on('stream', (remoteStream) => {
                if (userVideo.current) userVideo.current.srcObject = remoteStream;
            });
            setCallAccepted(true);

        } catch (err) {
            // 3-րդ կետ՝ Catch-ը բռնում է սխալը, եթե սարքը չկա
            if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
                alert("Սխալ. Ձեր համակարգչի վրա չի գտնվել միկրոֆոն կամ տեսախցիկ:");
            } else if (err.name === "NotAllowedError") {
                alert("Դուք մերժել եք տեսախցիկի մուտքը։ Խնդրում ենք թույլատրել բրաուզերի կարգավորումներից:");
            } else {
                alert("Տեղի է ունեցել անհայտ սխալ զանգի ժամանակ:");
            }
            console.error(err);
        }
    };

    const answerCall = async () => {
        try {
            // Փորձում ենք միացնել սարքերը պատասխանելու համար
            const localStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            setStream(localStream);
            if (myVideo.current) myVideo.current.srcObject = localStream;
            callerSignal.answer(localStream);

            callerSignal.on('stream', (remoteStream) => {
                if (userVideo.current) userVideo.current.srcObject = remoteStream;
            });

            setCallAccepted(true);
            setReceivingCall(false);
        } catch (err) {
            // Եթե 1-ին համակարգիչը սարք չունի, կմտնի այստեղ
            alert("Դուք չեք կարող պատասխանել զանգին, քանի որ չունեք միկրոֆոն կամ տեսախցիկ:");
            setCallModal(false);
            setReceivingCall(false);
            // Կարող ես նաև անջատել զանգը, որ մյուս կողմը հասկանա
            window.location.reload();
        }
    };

    const clearChat = async () => {
        if (window.confirm("Արդյո՞ք ուզում եք մաքրել ամբողջ պատմությունը")) {
            await fetch(`${ENDPOINT}/api/message/clear/${selectedChat._id}`, { method: "DELETE", credentials: "include" });
            setMessages([]);
        }
    };

    return (
        <div className="flex h-screen bg-[#f3f4f6] p-0 md:p-10 gap-0 overflow-hidden font-sans">

            {/* --- SIDEBAR --- */}
            <aside className={`w-full md:w-[400px] bg-white border-r flex flex-col rounded-none md:rounded-l-[40px] shadow-sm ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-8 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.push("/userPage")} className="p-2 hover:bg-gray-100 rounded-full transition">
                            <Home size={24} className="text-gray-600" />
                        </button>
                        <h2 className="text-3xl font-black italic tracking-tighter text-gray-800">Messages</h2>
                    </div>
                    <button onClick={() => setIsGroupModalOpen(true)} className="p-3 bg-orange-500 text-white rounded-full hover:bg-black transition shadow-lg shadow-orange-100">
                        <Plus size={22} />
                    </button>
                </div>

                <div className="px-8 mb-8 relative">
                    <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-gray-50 p-4 pl-12 rounded-[20px] outline-none border focus:border-orange-200" />
                    <Search className="absolute left-12 top-4.5 text-gray-400" size={20} />
                </div>

                <div className="flex-1 overflow-y-auto px-4 space-y-6 no-scrollbar pb-10">
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4">Active Chats</p>
                        {chats.map((chat) => (
                            <div key={chat._id} onClick={() => setSelectedChat(chat)} className={`flex items-center gap-4 p-5 rounded-[30px] cursor-pointer transition-all ${selectedChat?._id === chat._id ? 'bg-orange-500 text-white shadow-xl' : 'hover:bg-gray-50'}`}>
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-black text-orange-500 border uppercase">
                                    {chat.isGroupChat ? "G" : chat.users.find(u => u._id !== user?._id)?.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold truncate">{chat.isGroupChat ? chat.chatName : chat.users.find(u => u._id !== user?._id)?.name}</h4>
                                    <p className="text-xs truncate opacity-70">{chat.latestMessage?.content || "Click to open"}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4">All Users</p>
                        {allUsers.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())).map((u) => (
                            <div key={u._id} onClick={() => accessChat(u._id)} className="flex items-center gap-4 p-4 hover:bg-orange-50 rounded-[25px] cursor-pointer transition-all">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-400 border uppercase">{u.name.charAt(0)}</div>
                                <h4 className="font-bold text-gray-700 text-sm">{u.name}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>

            {/* --- MAIN CHAT WINDOW --- */}
            <main className={`flex-1 bg-white rounded-none md:rounded-r-[40px] flex flex-col relative ${!selectedChat ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
                {selectedChat ? (
                    <>
                        <div className="p-6 md:p-8 border-b flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <button className="md:hidden p-2" onClick={() => setSelectedChat(null)}><ChevronLeft /></button>
                                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md uppercase">
                                    {selectedChat.isGroupChat ? "G" : selectedChat.users.find(u => u._id !== user?._id)?.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-black text-gray-800 text-lg uppercase tracking-tighter">{selectedChat.isGroupChat ? selectedChat.chatName : selectedChat.users.find(u => u._id !== user?._id)?.name}</h3>
                                    <span className="text-[10px] text-green-500 font-black uppercase tracking-[0.2em]">Active Now</span>
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
                                        ${m.sender._id === user?._id ? 'bg-[#1d2331] text-white rounded-br-none' : 'bg-white text-gray-700 rounded-bl-none border border-gray-100'}`}>
                                        {m.messageType === "voice" ? <audio controls src={m.fileUrl} className="h-8 w-40" /> : m.content}
                                        <div className="text-[9px] mt-1 opacity-50 text-right font-black">
                                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-8 bg-white border-t rounded-br-[40px]">
                            <div className="flex items-center gap-4 bg-gray-50 p-2 pl-6 rounded-full border border-gray-100 shadow-inner group transition-all">
                                <input
                                    type="text"
                                    placeholder="Write a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                    className="flex-1 bg-transparent outline-none font-bold text-gray-700"
                                />
                                <button onClick={toggleRecording} className={`p-3 transition-all rounded-full ${recording ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:text-orange-500'}`}>
                                    {recording ? <MicOff size={22} /> : <Mic size={22} />}
                                </button>
                                <button onClick={sendMessage} className="p-4 bg-orange-500 text-white rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all">
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center space-y-4">
                        <div className="bg-orange-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                            <Send size={40} className="text-orange-500 opacity-50" />
                        </div>
                        <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">Select a chat to start</h3>
                        <p className="text-gray-400 text-sm">Choose from active chats or search for a user</p>
                    </div>
                )}
            </main>

            {/* --- CALL MODAL --- */}
            {callModal && (
                <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-10 text-white">
                    <h2 className="text-2xl font-black mb-10 tracking-tighter uppercase">{receivingCall && !callAccepted ? `${callerName}` : 'In Call'}</h2>
                    <div className="flex flex-col md:flex-row gap-10 w-full max-w-5xl h-[60vh]">
                        <div className="flex-1 bg-gray-900 rounded-[40px] overflow-hidden relative border-2 border-white/10 shadow-2xl">
                            <video playsInline muted ref={myVideo} autoPlay className="w-full h-full object-cover" />
                            <span className="absolute bottom-5 left-5 bg-black/50 px-4 py-1 rounded-full text-xs font-bold uppercase">You</span>
                        </div>
                        {callAccepted && (
                            <div className="flex-1 bg-gray-900 rounded-[40px] overflow-hidden relative border-2 border-white/10 shadow-2xl">
                                <video playsInline ref={userVideo} autoPlay className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                    <div className="mt-20 flex gap-10">
                        {receivingCall && !callAccepted && (
                            <button onClick={answerCall} className="bg-green-500 p-8 rounded-full shadow-2xl hover:scale-110 transition animate-bounce">
                                <Phone size={30} />
                            </button>
                        )}
                        <button onClick={() => window.location.reload()} className="bg-red-500 p-8 rounded-full shadow-2xl hover:scale-110 transition">
                            <PhoneOff size={30} />
                        </button>
                    </div>
                </div>
            )}

            {/* --- GROUP MODAL --- */}
            {isGroupModalOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[40px] w-full max-w-md shadow-2xl p-10 animate-in zoom-in-95 border border-gray-100">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter">New Group</h3>
                            <button onClick={() => setIsGroupModalOpen(false)} className="text-gray-400 hover:text-black"><X size={28} /></button>
                        </div>
                        <input type="text" placeholder="Group Name..." className="w-full bg-gray-50 p-5 rounded-2xl outline-none border focus:border-orange-400 mb-6 font-bold" value={groupName} onChange={e => setGroupName(e.target.value)} />
                        <div className="max-h-[250px] overflow-y-auto space-y-2 mb-8 pr-2 no-scrollbar">
                            {allUsers.map(u => (
                                <div key={u._id} onClick={() => setSelectedUsersForGroup(prev => prev.includes(u._id) ? prev.filter(id => id !== u._id) : [...prev, u._id])} className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer border-2 transition-all ${selectedUsersForGroup.includes(u._id) ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-transparent'}`}>
                                    <span className="font-bold text-gray-700">{u.name}</span>
                                    {selectedUsersForGroup.includes(u._id) && <CheckCircle2 size={20} className="text-orange-500" />}
                                </div>
                            ))}
                        </div>
                        <button onClick={createGroupChat} className="w-full py-5 bg-orange-500 text-white rounded-full font-black text-lg shadow-lg hover:bg-black transition-all">CREATE GROUP</button>
                    </div>
                </div>
            )}
        </div>
    );
}