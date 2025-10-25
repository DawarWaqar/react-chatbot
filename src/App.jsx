import { useState } from "react";

const App = () => {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  return (
    <>
      <Style />
      <div className="main-container">
        <SideBar
          chats={chats}
          setChats={setChats}
          setActiveChatId={setActiveChatId}
          activeChatId={activeChatId}
        />
        <Thread activeChatId={activeChatId} setChats={setChats} chats={chats} />
      </div>
    </>
  );
};

const SideBar = ({ chats, setChats, setActiveChatId, activeChatId }) => {
  const HandleClearChats = () => {
    setActiveChatId(null);
    setChats([]);
  };

  const handleAddNewChat = () => {
    const newChatId = chats.length > 0 ? chats.length + 1 : 1;
    setChats((oldChats) => [
      ...oldChats,
      {
        id: newChatId,
        title: `Chat #${newChatId}`,
        messages: [],
      },
    ]);
    setActiveChatId(newChatId);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-m">M</span>
        <span className="logo-l">L</span>
      </div>
      <div className="sidebar-chats">
        {chats.map((chat) => (
          <div
            onClick={() => setActiveChatId(chat.id)}
            className={`chat-title ${
              chat.id == activeChatId ? "active-chat" : ""
            }`}
            key={chat.id}
            id={chat.id}
          >
            {chat.title}
          </div>
        ))}
      </div>
      <div className="sidebar-buttons">
        <button className="sidebar-btn add-chat-btn" onClick={handleAddNewChat}>
          New Chat
        </button>
        <button
          className="sidebar-btn clear-chat-btn"
          onClick={HandleClearChats}
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

const Thread = ({ activeChatId, setChats, chats }) => {
  const activeChat = chats.find((chat) => chat.id == activeChatId);
  const [message, setMessage] = useState("");
  const [showNote, setShowNote] = useState(true);

  const handleSubmitMsg = () => {
    if (!message.trim()) return;

    const userMessage = {
      type: "user",
      content: message,
    };

    const botMessage = {
      type: "bot",
      content: `Mocked backend response for the message: ${message}`,
    };

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id == activeChatId
          ? {
              ...chat,
              messages: [...chat.messages, userMessage, botMessage],
            }
          : chat
      )
    );

    setMessage("");
  };

  const handleKeyDown = (event) => {
    if (event.key == "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmitMsg();
    }
  };
  return (
    <>
      {activeChat ? (
        <div className="thread">
          <div className="thread-messages">
            <h1 style={{ color: "#333", fontSize: "1.8rem" }}>
              {activeChat.title}
            </h1>
            <div className="message-container">
              {activeChat.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${
                    msg.type === "bot" ? "bot-message" : "user-message"
                  }`}
                >
                  {msg.content}
                </div>
              ))}
            </div>
          </div>
          <div className="thread-input-container">
            <div className="input-wrapper">
              <input
                placeholder="Type your message..."
                className="chat-input"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button onClick={handleSubmitMsg} className="submit-btn">
                Send
              </button>
            </div>
            {showNote && (
              <div className="sticky-note">
                <span
                  className="sticky-note-close"
                  onClick={() => setShowNote(false)}
                >
                  &times;
                </span>
                This is a simple demo chatbot. Responses are mocked and not from
                a real backend. Built using React and vanilla CSS under test
                conditions like in the interview.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          className="thread"
          style={{
            alignItems: "center",
            justifyContent: "center",
            color: "#888",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontWeight: 400 }}>Create a new chat to start.</h2>
        </div>
      )}
    </>
  );
};

const Style = () => (
  // made a component to save me from messy inline styling
  <style>
    {`
    * { box-sizing: border-box; }
    body { padding: 0px; margin: 0px; font-family: Arial, sans-serif; color: #333; background-color: white; }
    .main-container { display: flex; height: 100vh; }
    .sidebar {
      width: 25%; min-width: 220px; display: flex;
      flex-direction: column; height: 100%; background-color: #eee;
      padding: 20px; border-right: 1px solid #ddd;
    }
    .sidebar-logo { font-size: 2.2rem; font-weight: bold; margin-bottom: 20px; text-align: center; }
    .logo-m { color: green; }
    .sidebar-chats { flex-grow: 1; overflow-y: auto; }
    .sidebar-buttons {
      flex-shrink: 0; padding-top: 15px; margin-top: 15px;
      border-top: 1px solid #ddd; display: flex; align-items: center;
      justify-content: center; gap: 10px;
    }
    .thread {
      width: 75%; display: flex; flex-direction: column;
      height: 100%; padding: 20px; background-color: white;
    }
    .thread-messages { flex-grow: 1; overflow-y: auto; padding-right: 15px; }
    .thread-input-container {
      flex-shrink: 0; display: flex; flex-direction: column;
      padding-top: 15px; border-top: 1px solid #eee;
    }
    .input-wrapper { display: flex; width: 100%; }
    .chat-title {
      padding: 10px 15px; font-size: 1rem; margin-bottom: 8px;
      border-radius: 6px; cursor: pointer;
    }
    .chat-title:hover { background-color: lightgrey; }
    .active-chat { background-color: dodgerblue; color: white; font-weight: bold; }
    .sidebar-btn {
      padding: 12px 20px; border: none; border-radius: 6px;
      cursor: pointer; font-weight: bold; color: white;
      font-size: 1rem;
    }
    .add-chat-btn { background-color: green; }
    .clear-chat-btn { background-color: red; }
    .message-container { display: flex; flex-direction: column; margin-bottom: 15px; gap: 12px; }
    .message { padding: 12px 18px; border-radius: 6px; max-width: 70%; font-size: 1rem; }
    .user-message { background-color: dodgerblue; color: white; align-self: flex-end; }
    .bot-message { background-color: #eee; align-self: flex-start; }
    .chat-input {
      width: 88%; margin-right: 12px; padding: 12px 18px;
      border-radius: 6px; border: 1px solid #ccc; font-size: 1rem;
    }
    .submit-btn {
      width: 12%; border: none; background-color: dodgerblue;
      color: white; border-radius: 6px; font-size: 1rem;
      font-weight: bold; cursor: pointer;
    }
    .sticky-note {
      background-color: lightyellow; border: 1px solid goldenrod; padding: 17px;
      margin-top: 15px; border-radius: 5px; position: relative;
      font-size: 0.9rem;
    }
    .sticky-note-close {
      position: absolute; top: 5px; right: 10px;
      cursor: pointer; font-weight: bold; font-size: 1.2rem;
      color: #888;
    }
    `}
  </style>
);

export default App;
