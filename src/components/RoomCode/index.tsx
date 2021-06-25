import React from "react";
import { FiCopy } from "react-icons/fi";

type RoomCodeType = {
  code: string;
};

const RoomCode: React.FC<RoomCodeType> = ({ code }) => {
  function copyRoomCodeToClipBoard() {
    navigator.clipboard.writeText(code);
  }
  return (
    <button onClick={copyRoomCodeToClipBoard} className="flex items-center">
      <span className="bg-p-purple p-2.5 px-3 rounded-l-lg">
        <FiCopy size={18} color="#fff" />
      </span>
      <span className="px-4 py-1.5 border border-p-purple rounded-r-lg">
        Sala {code}
      </span>
    </button>
  );
};

export default RoomCode;