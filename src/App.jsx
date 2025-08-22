import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaMoneyBillWave, FaUserFriends, FaTimes } from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";
import { RiExchangeDollarLine } from "react-icons/ri";

const initialFriends = [
  {
    id: 1,
    name: "Asilbek",
    img: "https://t4.ftcdn.net/jpg/02/24/86/95/360_F_224869519_aRaeLneqALfPNBzg0xxMZXghtvBXkfIA.jpg",
    balance: -7,
  },
  {
    id: 2,
    name: "Azizbek",
    img: "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg",
    balance: 20,
  },
  {
    id: 3,
    name: "Bexruz",
    img: "https://cdn.create.vista.com/api/media/small/318367382/stock-photo-portrait-of-a-handsome-young-man-smiling-against-yellow-background",
    balance: 0,
  },
  {
    id: 4,
    name: "Sardorbek",
    img: "https://cdn.create.vista.com/api/media/small/154945740/stock-photo-happy-caucasian-man",
    balance: 50,
  },
];

export default function BillSplitter() {
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [bill, setBill] = useState("");
  const [myExpense, setMyExpense] = useState("");
  const [payer, setPayer] = useState("you");
  const [paymentType, setPaymentType] = useState("naqd");
  const [currency, setCurrency] = useState("UZS");

  const [showAddModal, setShowAddModal] = useState(false);
  const [newFriendName, setNewFriendName] = useState("");
  const [newFriendImg, setNewFriendImg] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setNewFriendImg(reader.result);
    reader.readAsDataURL(file);
  };

  const addFriend = () => {
    if (!newFriendName) return;
    setFriends([
      ...friends,
      {
        id: Date.now(),
        name: newFriendName,
        img: newFriendImg || `https://i.pravatar.cc/100?u=${newFriendName}`,
        balance: 0,
      },
    ]);
    setNewFriendName("");
    setNewFriendImg("");
    setShowAddModal(false);
  };

  const handleSplitBill = () => {
    if (!bill || !myExpense || !selectedFriend) return;
    const friendExpense = bill - myExpense;
    let updatedBalance = selectedFriend.balance;

    if (payer === "you") {
      updatedBalance += friendExpense;
    } else {
      updatedBalance -= myExpense;
    }

    const updatedFriends = friends.map((f) =>
      f.id === selectedFriend.id ? { ...f, balance: updatedBalance } : f
    );

    setFriends(updatedFriends);
    setBill("");
    setMyExpense("");
    setSelectedFriend(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center gap-6">
      <div className="bg-white p-4 rounded-2xl shadow-lg w-[400px] max-h-[380px] overflow-y-auto card">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className="flex items-center justify-between mb-3 bg-[#f3f4f6] rounded-xl p-2"
          >
            <div className="flex items-center gap-2">
              <img
                src={friend.img}
                alt={friend.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{friend.name}</p>
                <p
                  className={`text-sm ${
                    friend.balance > 0
                      ? "text-green-600"
                      : friend.balance < 0
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {friend.balance > 0
                    ? `${friend.name} owes you ${friend.balance}${currency}`
                    : friend.balance < 0
                    ? `You owe ${friend.name} ${Math.abs(
                        friend.balance
                      )}${currency}`
                    : `You and ${friend.name} are even`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedFriend(friend)}
              className="px-3 py-1 bg-orange-500 text-white rounded-lg text-sm shadow"
            >
              {selectedFriend?.id === friend.id ? "Close" : "Select"}
            </button>
          </div>
        ))}

        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 w-full bg-orange-500 text-white py-2 rounded-lg shadow"
        >
          + Add Friend
        </button>
      </div>

      {selectedFriend && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-2xl shadow-xl w-96 relative"
          >
            <button
              onClick={() => setSelectedFriend(null)}
              className="absolute top-3 right-3 text-orange-600 text-xl"
            >
              <FaTimes />
            </button>

            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-orange-600">
              <FaUserFriends /> Split a bill with {selectedFriend.name}
            </h2>

            <label className="block mb-2">
              <FaMoneyBillWave className="inline" /> Bill value
            </label>
            <input
              type="number"
              value={bill}
              onChange={(e) => setBill(Number(e.target.value))}
              className="w-full p-2 border rounded mb-3"
            />

            <label className="block mb-2">🙋 Your expense</label>
            <input
              type="number"
              value={myExpense}
              onChange={(e) => setMyExpense(Number(e.target.value))}
              className="w-full p-2 border rounded mb-3"
            />

            <label className="block mb-2">
              👤 {selectedFriend.name}'s expense
            </label>
            <input
              type="number"
              value={bill - myExpense || 0}
              readOnly
              className="w-full p-2 border rounded mb-3 bg-gray-100"
            />

            <label className="block mb-2 flex items-center gap-2">
              {" "}
              <MdOutlinePayment /> Payment type
            </label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="w-full p-2 border rounded mb-3"
            >
              <option value="naqd">Naqd</option>
              <option value="karta">Karta</option>
            </select>

            <label className="block mb-2 flex items-center gap-2">
              <RiExchangeDollarLine /> Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-2 border rounded mb-3"
            >
              <option value="UZS">UZS</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>

            <label className="block mb-2">🧾 Who is paying?</label>
            <select
              value={payer}
              onChange={(e) => setPayer(e.target.value)}
              className="w-full p-2 border rounded mb-3"
            >
              <option value="you">You</option>
              <option value="friend">{selectedFriend.name}</option>
            </select>

            <button
              onClick={handleSplitBill}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg shadow mt-2"
            >
              Split bill
            </button>
          </motion.div>
        </motion.div>
      )}

      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 w-80 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-3 right-3 text-gray-600"
            >
              <FaTimes />
            </button>
            <h2 className="text-lg font-bold mb-4">Add a friend</h2>
            <input
              type="text"
              placeholder="Friend name"
              value={newFriendName}
              onChange={(e) => setNewFriendName(e.target.value)}
              className="w-full p-2 border rounded mb-3"
            />
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {newFriendImg && <img src={newFriendImg} alt="preview" />}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1 bg-gray-400 text-white rounded-lg"
              >
                Close
              </button>
              <button
                onClick={addFriend}
                className="px-3 py-1 bg-orange-500 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
