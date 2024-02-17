import React, { useEffect, useRef, useState } from "react";

const InputSpotlightBorder = ({
  onChange,
  value,
  disabled,
}: {
  onChange: (value: string) => void;
  value: string;
  disabled?: boolean;
}) => {
  const divRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLInputElement>) => {
    if (!divRef.current || isFocused) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  useEffect(() => {
    const handleKeyboardEvent = () => {
      if (isFocused && inputRef.current) {
        const windowWidth = window.innerWidth;
        const isMobile = windowWidth <= 768;
        if (isMobile) {
          window.scrollBy(0, document.body.scrollHeight);
        }
      }
    };

    window.addEventListener("resize", handleKeyboardEvent);

    return () => {
      window.removeEventListener("resize", handleKeyboardEvent);
    };
  }, [isFocused]);

  return (
    <>
      <div className="relative w-full">
        <input
          ref={inputRef}
          onMouseMove={handleMouseMove}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          autoComplete="off"
          placeholder="Your message here..."
          type="text"
          onChange={(e) => {
            onChange(e.target.value);
          }}
          value={value}
          disabled={disabled}
          name="prompt"
          className="h-12 w-full cursor-default rounded-xl border border-slate-800 bg-neutral-950 p-3.5 text-slate-100 transition-colors duration-500 focus:border-[#8678F9] focus:outline-none text-base font-normal"
        />
        <input
          ref={divRef}
          disabled
          style={{
            border: "1px solid #8678F9",
            opacity,
            WebkitMaskImage: `radial-gradient(30% 30px at ${position.x}px ${position.y}px, black 45%, transparent)`,
          }}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-10 h-12 w-full cursor-default rounded-xl border border-[#8678F9] bg-[transparent] p-3.5 opacity-0  transition-opacity duration-500 placeholder:select-none"
        />
      </div>
    </>
  );
};

export default InputSpotlightBorder;
