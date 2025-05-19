import React, { useRef, useEffect } from "react";
import { FaBold, FaItalic, FaUnderline, FaListOl } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { FaListUl } from "react-icons/fa";

const RichTextInput = ({ value, onChange, placeholder = "Type here..." }) => {
  const ref = useRef();

  // Load existing HTML into editable box
  useEffect(() => {
    if (ref.current && value !== ref.current.innerHTML) {
      ref.current.innerHTML = value || "";
    }
  }, [value]);

  // Save edited HTML
  const handleInput = () => {
    if (ref.current) {
      onChange(ref.current.innerHTML);
    }
  };

  // Add formatting
  const format = (cmd) => {
    // Fix for list issues in some browsers
    document.execCommand("defaultParagraphSeparator", false, "p");
    document.execCommand(cmd, false, null);
  };

  return (
    <div className="space-y-2 w-full">
      {/* Toolbar */}
      <motion.div
        layout
        className="flex gap-2 bg-gray-100 p-1.5 rounded border border-gray-200 shadow-sm text-sm"
      >
        <button
          onClick={() => format("bold")}
          title="Bold"
          className="p-2 rounded hover:bg-gray-200 transition"
        >
          <FaBold className="text-gray-700" />
        </button>
        <button
          onClick={() => format("italic")}
          title="Italic"
          className="p-2 rounded hover:bg-gray-200 transition"
        >
          <FaItalic className="text-gray-700" />
        </button>
        <button
          onClick={() => format("underline")}
          title="Underline"
          className="p-2 rounded hover:bg-gray-200 transition"
        >
          <FaUnderline className="text-gray-700" />
        </button>
        <button
          onClick={() => format("insertOrderedList")}
          title="Ordered List"
          className="p-2 rounded hover:bg-gray-200 transition"
        >
          <FaListOl className="text-gray-700" />
        </button>

        <button
          onClick={() => format("insertUnorderedList")}
          title="Bullet List"
          className="p-2 rounded hover:bg-gray-200 transition"
        >
          <FaListUl className="text-gray-700" />
        </button>
      </motion.div>

      {/* Editable Field */}
      <motion.div
        layout
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        onInput={handleInput}
        className="min-h-[100px] border border-gray-300 rounded p-3 focus:outline-none text-sm text-gray-800 bg-white transition"
        style={{
          minHeight: "100px",
        }}
      >
        {/* Fallback empty content if needed */}
      </motion.div>
    </div>
  );
};

export default RichTextInput;
