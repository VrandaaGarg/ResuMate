import { FaPalette } from "react-icons/fa";
import { useState } from "react";

const textLevels = ["h1", "h2", "h3", "mainH2", "mainH3", "mainH4"];

const headingLabels = {
  h1: "Sidebar H1",
  h2: "Sidebar H2",
  h3: "Sidebar H3",
  mainH2: "Main H2",
  mainH3: "Main H3",
  mainH4: "Main H4",
};

const TextColorPicker = ({ resume, onChange }) => {
  const [showColorPanel, setShowColorPanel] = useState(false);

  return (
    <div className="relative group">
      {/* Icon Button */}
      <button
        className="p-2 rounded-md hover:bg-gray-100 transition"
        title="Change Text Colors"
        onClick={() => setShowColorPanel((prev) => !prev)}
      >
        <FaPalette className="text-lg text-gray-700" />
      </button>

      {/* Popup Panel */}
      {showColorPanel && (
        <div className="absolute right-0 z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-64">
          <p className="text-xs font-medium text-gray-600 mb-2">
            Text Color for Headings
          </p>

          <div className="grid grid-cols-2 gap-3">
            {textLevels.map((key) => (
              <label key={key} className="flex items-center gap-2 text-xs">
                <span className="text-gray-700 w-20">{headingLabels[key]}</span>
                <div className="relative w-6 h-6 rounded-full overflow-hidden border cursor-pointer group">
                  <div
                    className="absolute inset-0 z-0 rounded-full"
                    style={{
                      backgroundColor: resume.textColors?.[key] || "#000000",
                    }}
                  />
                  <input
                    type="color"
                    value={resume.textColors?.[key] || "#000000"}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        textColors: {
                          ...prev.textColors,
                          [key]: e.target.value,
                        },
                      }))
                    }
                    className="absolute inset-0 z-10 opacity-0 cursor-pointer"
                  />
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextColorPicker;
