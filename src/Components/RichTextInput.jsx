import React, { useRef, useEffect, useState } from "react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListOl,
  FaListUl,
} from "react-icons/fa";
import { motion } from "framer-motion";

const RichTextInput = ({ value, onChange, placeholder = "Type here..." }) => {
  const ref = useRef();
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    if (ref.current && value !== ref.current.innerHTML) {
      ref.current.innerHTML = value || "";
    }
    setIsEmpty(!value || value === "<br>");
  }, [value]);

  const handleInput = () => {
    if (ref.current) {
      const html = ref.current.innerHTML;
      setIsEmpty(!html || html === "<br>");
      onChange(html);
    }
  };

  const format = (cmd) => {
    document.execCommand("defaultParagraphSeparator", false, "p");
    document.execCommand(cmd, false, null);
  };

  return (
    <div className="space-y-2 w-full relative">
      {/* Editable Field */}
      <div className="relative">
        {isEmpty && (
          <div className="absolute left-3 top-3 text-gray-400 text-sm pointer-events-none select-none">
            {placeholder}
          </div>
        )}
        <motion.div
          layout
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          spellCheck={false}
          onInput={handleInput}
          onPaste={(e) => {
            e.preventDefault();
            const text = e.clipboardData.getData("text/plain");
            // Allow only plain text (no styles), then wrap it safely
            document.execCommand(
              "insertHTML",
              false,
              text.replace(/\n/g, "<br>")
            );
          }}
          className="min-h-[100px] border border-gray-300 rounded p-3 focus:outline-none text-sm text-gray-800 bg-white transition"
          style={{ whiteSpace: "pre-wrap" }}
        />
      </div>

      {/* Toolbar */}
      <motion.div
        layout
        className="flex gap-2 bg-gray-100 p-1.5 justify-center rounded border border-gray-200 shadow-sm text-sm"
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
    </div>
  );
};

export default RichTextInput;
