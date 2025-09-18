import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const SaveFormationModal = ({ isOpen, onClose, onSave, currentFormation }) => {
  const [name, setName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await onSave(name.trim(), isPublic);
      setName('');
      setIsPublic(false);
      onClose();
    } catch (error) {
      console.error('Error saving formation:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Guardar Formación</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Nombre de la formación
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 4-3-3 Ofensivo"
              required
              maxLength="100"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="isPublic" className="text-sm text-gray-300">
              Hacer pública (otros usuarios podrán verla)
            </label>
          </div>

          <div className="text-xs text-gray-400">
            Formación actual: {currentFormation || 'Sin formación'}
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white py-2 px-4 rounded-md transition-colors"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaveFormationModal;