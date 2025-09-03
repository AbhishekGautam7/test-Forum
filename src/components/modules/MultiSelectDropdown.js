import { useEffect, useRef, useState } from "react";

export default function MultiSelectDropdown({
  multiple,
  value,
  onChange,
  options,
  placeholder = "Select...",
  handleSearchChange,
  setIsOpen,
  isOpen,
  inputValue,
  setInputValue,
}) {
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  function clearOptions() {
    multiple ? onChange([]) : onChange(undefined);
  }

  function selectOption(option) {
    if (multiple) {
      if (!value.some((o) => o.value === option.value)) {
        onChange([...value, option]);
      }
    } else {
      if (option.value !== value?.value) onChange(option);
    }
  }

  function isOptionSelected(option) {
    return multiple
      ? value.some((o) => o.value === option.value)
      : option.value === value?.value;
  }

  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(0);
      setInputValue("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => {
      if (
        e.target !== containerRef.current &&
        e.target !== inputRef.current &&
        !containerRef.current.contains(e.target)
      )
        return;

      switch (e.code) {
        case "Enter":
        case "Space":
          setIsOpen((prev) => !prev);
          if (isOpen) selectOption(options[highlightedIndex]);
          break;
        case "ArrowUp":
        case "ArrowDown": {
          if (!isOpen) {
            setIsOpen(true);
            break;
          }
          const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
          if (newValue >= 0 && newValue < options.length) {
            setHighlightedIndex(newValue);
          }
          break;
        }
        case "Escape":
          setIsOpen(false);
          break;
      }
    };
    containerRef.current?.addEventListener("keydown", handler);
    return () => {
      containerRef.current?.removeEventListener("keydown", handler);
    };
  }, [isOpen, highlightedIndex, options]);

  return (
    <div
      ref={containerRef}
      onBlur={(e) => {
        if (!containerRef.current.contains(e.relatedTarget)) {
          setIsOpen(false);
        }
      }}
      onClick={(e) => {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
      }}
      tabIndex={0}
      className="select-container"
    >
      <span className="select-value">
        {!multiple && (value === null || value === undefined) ? (
          <span>{placeholder}</span>
        ) : null}

        {multiple && Array.isArray(value) && value.length === 0 ? (
          <span>{placeholder}</span>
        ) : null}

        {multiple
          ? value.map((v) => (
              <button
                key={v.value}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(value.filter((o) => o.value !== v.value));
                }}
                className="option-badge"
              >
                {v.label}
                <span className="remove-btn">&times;</span>
              </button>
            ))
          : value?.label}
      </span>
      {(multiple && Array.isArray(value) && value.length) ||
      (!multiple && value?.label) ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            clearOptions();
          }}
          className="clear-btn"
        >
          &times;
        </button>
      ) : null}

      <div className="divider"></div>
      <div className="caret"></div>
      <ul className={`options ${isOpen ? "show" : ""}`}>
        <li className="search_div">
          <input
            type="text"
            ref={inputRef}
            onClick={(e) => e.stopPropagation()}
            placeholder="Search..."
            value={inputValue}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </li>

        <div className="option_container">
          {options.map((option, index) => (
            <li
              onClick={(e) => {
                e.stopPropagation();
                selectOption(option);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              key={option.value}
              className={`option ${
                isOptionSelected(option) ? "selected" : ""
              } ${index === highlightedIndex ? "highlighted" : ""}`}
            >
              {option.label}
            </li>
          ))}
        </div>
      </ul>
    </div>
  );
}
