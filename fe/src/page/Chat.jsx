import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, DropdownMenu, Dialog, Tabs } from "radix-ui";
import {
  MessageSquare,
  Search,
  MoreVertical,
  Phone,
  Video,
  Send,
  Paperclip,
  Smile,
  Mic,
  ArrowLeft,
  Edit2,
  Check,
  CheckCheck,
  X,
} from "lucide-react";
import VantaBg from "../components/VantaBg";

// ==================== MOCK DATA ====================
const mockUsers = [
  {
    id: "1",
    name: "Alice Johnson",
    avatar: "AJ",
    status: "online",
    lastMessage: "Hey! How are you?",
    time: "10:30 AM",
    unread: 2,
  },
  {
    id: "2",
    name: "Bob Smith",
    avatar: "BS",
    status: "offline",
    lastMessage: "Thanks for the help!",
    time: "Yesterday",
    unread: 0,
  },
  {
    id: "3",
    name: "Charlie Brown",
    avatar: "CB",
    status: "online",
    lastMessage: "See you tomorrow",
    time: "2 days ago",
    unread: 5,
  },
  {
    id: "4",
    name: "Diana Prince",
    avatar: "DP",
    status: "online",
    lastMessage: "Perfect!",
    time: "3 days ago",
    unread: 0,
  },
];

const mockMessages = [
  {
    id: "1",
    senderId: "1",
    text: "Hey! How are you doing?",
    time: "10:30 AM",
    status: "read",
    type: "received",
  },
  {
    id: "2",
    senderId: "me",
    text: "I am good! Thanks for asking",
    time: "10:32 AM",
    status: "read",
    type: "sent",
  },
  {
    id: "3",
    senderId: "1",
    text: "Want to grab coffee later?",
    time: "10:35 AM",
    status: "read",
    type: "received",
  },
  {
    id: "4",
    senderId: "me",
    text: "Sure! What time works for you?",
    time: "10:36 AM",
    status: "delivered",
    type: "sent",
  },
];

// ==================== USER LIST ITEM ====================
const UserListItem = ({ user, isActive, onClick }) => (
  <motion.div
    whileHover={{ backgroundColor: "rgba(0,0,0,0.03)" }}
    onClick={onClick}
    className={`flex items-center gap-3 p-3 cursor-pointer border-b border-gray-100 ${
      isActive ? "bg-gray-100" : ""
    }`}
  >
    <div className="relative">
      <Avatar.Root className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
        <Avatar.Fallback className="text-white font-semibold">
          {user.avatar}
        </Avatar.Fallback>
      </Avatar.Root>
      {user.status === "online" && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
      )}
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-baseline">
        <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
        <span className="text-xs text-gray-500">{user.time}</span>
      </div>
      <p className="text-sm text-gray-600 truncate">{user.lastMessage}</p>
    </div>

    {user.unread > 0 && (
      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
        <span className="text-xs text-white font-bold">{user.unread}</span>
      </div>
    )}
  </motion.div>
);

// ==================== MESSAGE BUBBLE ====================
const MessageBubble = ({ message }) => {
  const isSent = message.type === "sent";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isSent ? "justify-end" : "justify-start"} mb-3`}
    >
      <div
        className={`max-w-[70%] px-4 py-2 rounded-2xl ${
          isSent
            ? "bg-blue-500 text-white rounded-br-sm"
            : "bg-gray-200 text-gray-900 rounded-bl-sm"
        }`}
      >
        <p className="text-sm">{message.text}</p>
        <div
          className={`flex items-center gap-1 justify-end mt-1 ${
            isSent ? "text-blue-100" : "text-gray-500"
          }`}
        >
          <span className="text-xs">{message.time}</span>
          {isSent &&
            (message.status === "read" ? (
              <CheckCheck size={14} />
            ) : message.status === "delivered" ? (
              <CheckCheck size={14} />
            ) : (
              <Check size={14} />
            ))}
        </div>
      </div>
    </motion.div>
  );
};

// ==================== LEFT SIDEBAR ====================
const LeftSidebar = ({
  users,
  activeUser,
  onUserSelect,
  isMobileMenuOpen,
  onClose,
}) => (
  <motion.div
    initial={{ x: 0 }}
    animate={
      // if mobile => animate using sidebar toggle
      window.innerWidth < 1024
        ? { x: isMobileMenuOpen ? 0 : "-100%" }
        : { x: 0 } // desktop always at 0
    }
    transition={{ type: "tween" }}
    className="fixed lg:relative inset-y-0 left-0 z-30 w-full sm:w-80 bg-white border-r border-gray-200 flex flex-col "
  >
    {/* Header */}
    <div className="p-4 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">ChitChat</h1>
        <button className="lg:hidden" onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search conversations..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    {/* User List */}
    <div className="flex-1 overflow-y-auto">
      {users.map((user) => (
        <UserListItem
          key={user.id}
          user={user}
          isActive={activeUser?.id === user.id}
          onClick={() => {
            onUserSelect(user);
            onClose();
          }}
        />
      ))}
    </div>
  </motion.div>
);

// ==================== CHAT HEADER ====================
const ChatHeader = ({ user, onBack, onProfileClick }) => (
  <div className="p-4 bg-white border-b border-gray-200 flex items-center gap-3">
    <button onClick={onBack} className="lg:hidden">
      <ArrowLeft size={24} />
    </button>

    <div className="relative cursor-pointer" onClick={onProfileClick}>
      <Avatar.Root className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
        <Avatar.Fallback className="text-white font-semibold">
          {user.avatar}
        </Avatar.Fallback>
      </Avatar.Root>
      {user.status === "online" && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
      )}
    </div>

    <div className="flex-1 min-w-0 cursor-pointer" onClick={onProfileClick}>
      <h2 className="font-semibold text-gray-900">{user.name}</h2>
      <p className="text-xs text-gray-500">
        {user.status === "online" ? "Online" : "Offline"}
      </p>
    </div>

    <div className="flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <Video size={20} className="text-gray-600" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <Phone size={20} className="text-gray-600" />
      </motion.button>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <MoreVertical size={20} className="text-gray-600" />
          </motion.button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className="min-w-[200px] bg-white rounded-lg shadow-lg p-2 z-50">
            <DropdownMenu.Item className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer">
              View Profile
            </DropdownMenu.Item>
            <DropdownMenu.Item className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer">
              Clear Chat
            </DropdownMenu.Item>
            <DropdownMenu.Item className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer text-red-600">
              Block User
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  </div>
);

// ==================== CHAT INPUT ====================
const ChatInput = ({ onSend }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <Smile size={24} className="text-gray-600" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <Paperclip size={24} className="text-gray-600" />
        </motion.button>

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {message.trim() ? (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            className="p-2 bg-blue-500 rounded-full"
          >
            <Send size={20} className="text-white" />
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Mic size={24} className="text-gray-600" />
          </motion.button>
        )}
      </div>
    </div>
  );
};

// ==================== PROFILE DIALOG ====================
const ProfileDialog = ({ user, isOpen, onClose }) => (
  <Dialog.Root open={isOpen} onOpenChange={onClose}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
      <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl p-6 w-[90vw] max-w-md z-50">
        <div className="flex justify-between items-center mb-6">
          <Dialog.Title className="text-2xl font-bold">Profile</Dialog.Title>
          <Dialog.Close asChild>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <X size={20} />
            </button>
          </Dialog.Close>
        </div>

        <div className="flex flex-col items-center mb-6">
          <Avatar.Root className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center mb-4">
            <Avatar.Fallback className="text-white font-bold text-4xl">
              {user?.avatar}
            </Avatar.Fallback>
          </Avatar.Root>
          <h3 className="text-2xl font-bold mb-1">{user?.name}</h3>
          <p className="text-gray-500">
            {user?.status === "online" ? "Online" : "Offline"}
          </p>
        </div>

        <Tabs.Root defaultValue="about" className="w-full">
          <Tabs.List className="flex border-b border-gray-200 mb-4">
            <Tabs.Trigger
              value="about"
              className="flex-1 py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-500"
            >
              About
            </Tabs.Trigger>
            <Tabs.Trigger
              value="media"
              className="flex-1 py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-500"
            >
              Media
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="about" className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p className="text-gray-900">
                {user?.name.toLowerCase().replace(" ", ".")}@example.com
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Phone</label>
              <p className="text-gray-900">+1 234 567 8900</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Bio</label>
              <p className="text-gray-900">
                Hey there! I'm using this chat app.
              </p>
            </div>
          </Tabs.Content>

          <Tabs.Content value="media" className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-square bg-gradient-to-br from-blue-200 to-purple-200 rounded-lg"
              />
            ))}
          </Tabs.Content>
        </Tabs.Root>

        <div className="flex gap-2 mt-6">
          <button className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2">
            <Phone size={18} />
            Call
          </button>
          <button className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2">
            <Video size={18} />
            Video
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

// ==================== MAIN APP ====================
const ChatApp = () => {
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState(mockMessages);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleSendMessage = (text) => {
    const newMessage = {
      id: Date.now().toString(),
      senderId: "me",
      text,
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sent",
      type: "sent",
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="relative h-screen min-w-screen flex overflow-hidden p-2 lg:p-8">
      <div className="absolute w-screen h-screen top-0 z-[-1] right-0">
        <VantaBg />
      </div>{" "}
      {/* Left Sidebar */}
      <LeftSidebar
        users={mockUsers}
        activeUser={activeUser}
        onUserSelect={setActiveUser}
        isMobileMenuOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeUser ? (
          <>
            <ChatHeader
              user={activeUser}
              onBack={() => {
                setActiveUser(null);
                setIsMobileMenuOpen(true);
              }}
              onProfileClick={() => setIsProfileOpen(true)}
            />

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-gray-100">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </div>

            <ChatInput onSend={handleSendMessage} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden mb-4 px-6 py-3 bg-blue-500 text-white rounded-full"
              >
                Open Conversations
              </button>
              <MessageSquare size={80} className="mx-auto mb-4 text-gray-300" />
              <h2 className="text-2xl font-bold text-gray-400 mb-2">
                Select a conversation
              </h2>
              <p className="text-gray-400">
                Choose a chat from the left to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Profile Dialog */}
      <ProfileDialog
        user={activeUser}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
};

export default ChatApp;
