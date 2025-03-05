import { useState, useEffect, useRef } from "react";

const MultiSelectDropdown = ({options, formData, name}) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

    useEffect(() => {
      setSelectedOptions(formData[name]);
    }, [formData]);

  // Handle selecting an option
  const handleSelect = (option) => {
    if (!selectedOptions.includes(option)) { 
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  // Handle removing a selected option
  const handleRemove = (option) => {
    setSelectedOptions(selectedOptions.filter((item) => item !== option));
  };

  useEffect(() => {
    formData[name] = selectedOptions;
  }, [selectedOptions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen])

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Select Box */}
      <div
        className="border border-gray-300 p-2 w-full flex flex-wrap gap-2 items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOptions.length === 0 ? (
          <span className="text-gray-400">Select {name}...</span>
        ) : (
          selectedOptions?.map((option) => (
            <div
              key={option}
              className="bg-blue-500 text-white px-2 py-1 rounded flex items-center"
            >
              {option}
              <button
                className="ml-2 text-white font-bold"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(option);
                }}
              >
                ❌
              </button>
            </div>
          ))
        )}
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute top-full z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
          {options?.map((option) => (
            <div
              key={option}
              className="p-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
