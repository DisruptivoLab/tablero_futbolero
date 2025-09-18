import React from 'react';

const RoleModal = ({ isOpen, onClose, onSelectRole, playerName, roles }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4">
      <div className="bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-4 flex flex-col space-y-2 w-full max-w-xs sm:max-w-sm">
        <h3 className="text-lg font-bold text-white text-center mb-2">Posición de {playerName}</h3>
        <div className="flex flex-col space-y-2">
          {roles.map((roleInfo, index) => (
            <button
              key={index}
              className="role-selector-button text-white text-lg font-semibold py-2 px-3 rounded-md w-full text-center bg-white/10"
              onClick={() => onSelectRole(roleInfo.role, roleInfo.line)}
            >
              {roleInfo.role}
            </button>
          ))}
        </div>
        <button onClick={onClose} className="mt-2 text-gray-400 hover:text-white">
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default RoleModal;