import React, { useState, useRef, useEffect } from 'react';

// Dropdown wrapper component
function Dropdown({ children }: { children: JSX.Element[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const clonedChildren = children.map((child, index: number) => {
    if (child.type === Dropdown.Toggle) {
      return React.cloneElement(child, {
        key: `dropdown-toggle-${index}`,
        onClick: () => setIsOpen(!isOpen),
        isOpen,
      });
    }
    if (child.type === Dropdown.Menu) {
      return React.cloneElement(child, { key: `dropdown-toggle-${index}`, isOpen });
    }
    return child;
  });

  return <div className="relative inline-block text-left" ref={dropdownRef}>{clonedChildren}</div>;
}

// Dropdown.Toggle component
Dropdown.Toggle = function Toggle({ children }: { children: JSX.Element[] }) {
  return (
    <button
      className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
    >
      {children}
    </button>
  );
};

// Dropdown.Menu component
Dropdown.Menu = function Menu({ children }: { children: JSX.Element }) {
  return (
    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
      <div className="py-1">{children}</div>
    </div>
  );
};

export default Dropdown;
