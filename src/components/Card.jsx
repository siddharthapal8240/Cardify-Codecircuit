import React, { useState } from "react";
import { motion } from "framer-motion";
import { AiOutlineCheck, AiOutlineClose, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";

const Card = ({
  data,
  reference,
  onDone,
  isTemp,
  onCancel,
  onAdd,
  onEdit,
  onDragEnd,
  index,
  initialX = 0,
  initialY = 0,
}) => {
  const [desc, setDesc] = useState(data.desc || "");
  const [isEditing, setIsEditing] = useState(isTemp || false);

  // Define gradient classes for random selection
  const gradientClasses = [
    "bg-gradient-to-r from-teal-600 to-teal-700",
    "bg-gradient-to-r from-indigo-600 to-indigo-700",
    "bg-gradient-to-r from-rose-600 to-rose-700",
    "bg-gradient-to-r from-amber-600 to-amber-700",
    "bg-gradient-to-r from-emerald-600 to-emerald-700",
  ];

  // Select a gradient based on index for consistent randomness
  const selectedGradient = gradientClasses[index % gradientClasses.length];

  const handleAdd = () => {
    if (desc.trim()) {
      onAdd({ desc });
    }
  };

  const handleSaveEdit = () => {
    if (desc.trim()) {
      onEdit(desc);
      setIsEditing(false);
    }
  };

  const handleDragEnd = (event, info) => {
    if (!isTemp && onDragEnd) {
      onDragEnd(info.point.x, info.point.y);
    }
  };

  return (
    <motion.div
      drag={!isTemp}
      dragConstraints={reference}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      initial={{ opacity: 0, x: initialX, y: initialY }}
      animate={{ opacity: 1, x: initialX, y: initialY }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className="absolute flex-shrink-0 w-60 rounded-[45px] bg-zinc-900/90 text-white px-6 py-6 flex flex-col justify-between group"
      style={{ minHeight: "150px", maxHeight: "500px" }}
    >
      <div className="flex justify-between items-center mb-4">
        <div className={`${selectedGradient} text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shadow-md`}>
          {isTemp ? "NEW" : index + 1}
        </div>
      </div>

      {isEditing ? (
        <textarea
          className="bg-transparent outline-none resize-none text-sm font-semibold w-full whitespace-pre-wrap break-words min-h-[80px] max-h-[300px]"
          placeholder="Write your note..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          wrap="soft"
        />
      ) : (
        <p className="text-sm font-semibold whitespace-pre-wrap break-words min-h-[80px] max-h-[300px] overflow-y-auto">
          {data.desc}
        </p>
      )}

      <div className="flex justify-center gap-4 mt-4 min-h-[40px]">
        {isTemp ? (
          <>
            <div className="relative group/button">
              <button
                onClick={onCancel}
                className="w-10 h-10 bg-zinc-700/80 hover:bg-zinc-600/80 text-zinc-200 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                <AiOutlineClose size={20} />
              </button>
              <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-zinc-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover/button:opacity-100 transition-opacity duration-200">
                Cancel
              </span>
            </div>
            <div className="relative group/button">
              <button
                onClick={handleAdd}
                className="w-10 h-10 bg-teal-700/80 hover:bg-teal-600/80 text-teal-100 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                <AiOutlineCheck size={20} />
              </button>
              <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-zinc-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover/button:opacity-100 transition-opacity duration-200">
                Add
              </span>
            </div>
          </>
        ) : isEditing ? (
          <>
            <div className="relative group/button">
              <button
                onClick={() => setIsEditing(false)}
                className="w-10 h-10 bg-zinc-700/80 hover:bg-zinc-600/80 text-zinc-200 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                <AiOutlineClose size={20} />
              </button>
              <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-zinc-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover/button:opacity-100 transition-opacity duration-200">
                Cancel
              </span>
            </div>
            <div className="relative group/button">
              <button
                onClick={handleSaveEdit}
                className="w-10 h-10 bg-indigo-700/80 hover:bg-indigo-600/80 text-indigo-100 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                <AiOutlineCheck size={20} />
              </button>
              <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-zinc-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover/button:opacity-100 transition-opacity duration-200">
                Save
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="relative group/button">
              <button
                onClick={() => setIsEditing(true)}
                className="w-10 h-10 bg-indigo-700/80 hover:bg-indigo-600/80 text-indigo-100 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
              >
                <AiOutlineEdit size={20} />
              </button>
              <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-zinc-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover/button:opacity-100 transition-opacity duration-200">
                Edit
              </span>
            </div>
            <div className="relative group/button">
              <button
                onClick={onDone}
                className="w-10 h-10 bg-rose-700/80 hover:bg-rose-600/80 text-rose-100 rounded-full flex items-center justify-center Sageltransition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
              >
                <AiOutlineDelete size={20} />
              </button>
              <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-zinc-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover/button:opacity-100 transition-opacity duration-200">
                Done
              </span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Card;