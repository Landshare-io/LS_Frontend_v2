import { useState, useEffect } from 'react';

export default function ToggleSwitchButton({checked, disable, handleAutoCompoundClick} : any) {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked])

  const handleToggle = () => {
    setIsChecked(prev => !prev);
    handleAutoCompoundClick();
  };

  return (
    <div className="flex items-center">
      <label className="relative cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={isChecked}
          disabled={disable}
          onChange={handleToggle}
        />
        <div
          className="w-[36px] h-[20px] flex items-center bg-gray-300 rounded-full text-[9px] peer-checked:text-[#007bff] text-gray-300 font-extrabold after:flex after:items-center after:justify-center peer-checked:after:translate-x-full after:absolute after:left-[2px] peer-checked:after:border-white after:bg-white after:border after:border-gray-300 after:rounded-full after:h-[16px] after:w-[16px] after:transition-all peer-checked:bg-[#24BC48]">
        </div>
      </label>
    </div>
  );
}
