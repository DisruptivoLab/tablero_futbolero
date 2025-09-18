import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';

const registerSchema = z.object({
  username: z.string().min(3, 'Username debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
});

const AuthModal = ({ isOpen, onClose }) => {
  const [isRegister, setIsRegister] = useState(true);
  const [error, setError] = useState('');
  const { login, register: authRegister } = useAuth();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema),
  });

  const onSubmit = async (data) => {
    setError('');
    let result;
    if (isRegister) {
      result = await authRegister(data.username, data.email, data.password);
    } else {
      result = await login(data.email, data.password);
    }

    if (result.success) {
      onClose();
      reset();
    } else {
      setError(result.message || 'Ocurrió un error');
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
          {isRegister && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-1">
                Username
              </label>
              <input
                {...register('username')}
                type="text"
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
            </div>
          )}
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
          onClick={() => {
            setIsRegister(!isRegister);
            setError('');
            reset();
          }}
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
