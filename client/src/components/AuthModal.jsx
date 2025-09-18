import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Contraseña debe tener al menos 8 caracteres'),
  confirmPassword: z.string().min(8, 'Contraseña debe tener al menos 8 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

const AuthModal = ({ isOpen, onClose, onRegister, onLogin }) => {
  const [isRegister, setIsRegister] = useState(true);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      if (isRegister) {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          const user = await response.json();
          localStorage.setItem('token', user.token);
          onRegister(user);
          onClose();
          reset();
        } else {
          setError('Error al registrarse');
        }
      } else {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          const user = await response.json();
          localStorage.setItem('token', user.token);
          onLogin(user);
          onClose();
          reset();
        } else {
          setError('Credenciales incorrectas');
        }
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-white mb-4 text-center">
          {isRegister ? 'Registrarse' : 'Iniciar Sesión'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-1">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-1">
              Contraseña
            </label>
            <input
              {...register('password')}
              type="password"
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          {isRegister && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-1">
                Confirmar Contraseña
              </label>
              <input
                {...register('confirmPassword')}
                type="password"
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
          )}
          {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            {isRegister ? 'Registrarse' : 'Iniciar Sesión'}
          </button>
        </form>
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="w-full mt-2 text-gray-400 hover:text-white"
        >
          {isRegister ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate'}
        </button>
        <button onClick={onClose} className="w-full mt-2 text-gray-400 hover:text-white">
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default AuthModal;