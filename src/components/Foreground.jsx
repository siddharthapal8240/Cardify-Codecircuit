import React, { useRef, useState, useCallback, useEffect } from "react";
import Card from "./Card";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlinePlus, AiOutlineHistory, AiOutlineDelete } from "react-icons/ai";

const Foreground = () => {
  const ref = useRef(null);
  const [notes, setNotes] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("noteHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("noteHistory", JSON.stringify(history));
    } else {
      localStorage.removeItem("noteHistory");
    }
  }, [history]);

  const addNote = (note) => {
    const maxX = window.innerWidth - 260 - 20;
    const maxY = window.innerHeight - 200 - 20;
    const baseX = window.innerWidth - 300;
    const baseY = window.innerHeight - 400;
    const offset = Math.min(notes.length, 5) * 20;

    const newNote = {
      ...note,
      id: Date.now(),
      x: Math.min(baseX + offset, maxX),
      y: Math.min(baseY + offset, maxY),
    };
    setNotes((prev) => [newNote, ...prev]);
    setIsAdding(false);
  };

  const markDone = (id) => {
    setNotes((prev) => {
      const noteToRemove = prev.find((note) => note.id === id);
      if (noteToRemove) {
        setHistory((prevHistory) => [
          {
            ...noteToRemove,
            completedAt: new Date().toISOString(),
          },
          ...prevHistory,
        ]);
      }
      return prev.filter((note) => note.id !== id);
    });
  };

  const deleteHistoryEntry = (id) => {
    setHistory((prev) => prev.filter((note) => note.id !== id));
  };

  const updateNote = (id, newDesc) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, desc: newDesc } : note
      )
    );
  };

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const updatePosition = useCallback(
    debounce((id, x, y) => {
      const maxX = window.innerWidth - 260 - 20;
      const maxY = window.innerHeight - 200 - 20;
      const constrainedX = Math.max(0, Math.min(x, maxX));
      const constrainedY = Math.max(0, Math.min(y, maxY));

      setNotes((prev) =>
        prev.map((note) =>
          note.id === id ? { ...note, x: constrainedX, y: constrainedY } : note
        )
      );
    }, 50),
    []
  );

  return (
    <>
      <div
        ref={ref}
        className="fixed top-0 left-0 z-[3] w-full h-full p-5 overflow-auto"
        style={{ scrollBehavior: "smooth" }}
      >
        <AnimatePresence>
          {isAdding && (
            <Card
              key="temp"
              data={{ desc: "" }}
              reference={ref}
              isTemp={true}
              onCancel={() => setIsAdding(false)}
              onAdd={addNote}
            />
          )}
          {notes.slice().reverse().map((note, index) => (
            <Card
              key={note.id}
              data={note}
              reference={ref}
              onDone={() => markDone(note.id)}
              onEdit={(desc) => updateNote(note.id, desc)}
              onDragEnd={(x, y) => updatePosition(note.id, x, y)}
              index={index}
              initialX={note.x}
              initialY={note.y}
            />
          ))}
        </AnimatePresence>

        {/* Add Button */}
        <motion.button
          onClick={() => setIsAdding((prev) => !prev)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-green-600 text-white text-3xl rounded-full flex items-center justify-center shadow-lg z-[4]"
          animate={{ rotate: isAdding ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 50 }}
        >
          <AiOutlinePlus />
        </motion.button>

        {/* History Button */}
        <motion.button
          onClick={() => setShowHistory((prev) => !prev)}
          className="fixed bottom-8 right-28 w-14 h-14 bg-indigo-600 text-white text-3xl rounded-full flex items-center justify-center shadow-lg z-[4]"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 50 }}
        >
          <AiOutlineHistory />
        </motion.button>

        {/* History Modal */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="fixed bottom-24 right-8 w-80 bg-zinc-900/95 text-white rounded-2xl p-4 shadow-xl z-[5] max-h-[60vh] overflow-y-auto history-modal"
            >
              <h2 className="text-lg font-semibold mb-4">Note History</h2>
              {history.length === 0 ? (
                <p className="text-sm text-zinc-400">No notes in history.</p>
              ) : (
                history.map((note, index) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-4 p-3 bg-zinc-800/50 rounded-lg relative group"
                  >
                    <button
                      onClick={() => deleteHistoryEntry(note.id)}
                      className="absolute top-2 right-2 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <AiOutlineDelete size={18} />
                    </button>
                    <p className="text-sm whitespace-pre-wrap break-words pr-8">
                      {note.desc}
                    </p>
                    <p className="text-xs text-zinc-400 mt-2">
                      Completed: {new Date(note.completedAt).toLocaleString()}
                    </p>
                  </motion.div>
                ))
              )}
              <button
                onClick={() => setShowHistory(false)}
                className="w-full bg-indigo-700/80 hover:bg-indigo-600/80 rounded-lg py-2 text-sm font-semibold text-indigo-100 transition-all duration-200"
              >
                Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Foreground;