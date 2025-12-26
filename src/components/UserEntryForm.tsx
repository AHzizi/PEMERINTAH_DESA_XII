import React, { useState } from 'react';
import { User } from '../types/quiz';
import { useQuiz } from '../contexts/QuizContext';
import { UserCheck } from 'lucide-react';

export const UserEntryForm: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errors, setErrors] = useState({ firstName: '', lastName: '' });
  const { setUser } = useQuiz();

  const validateForm = () => {
    const newErrors = { firstName: '', lastName: '' };
    let isValid = true;

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const user: User = {
        firstName: firstName.trim(),
        lastName: lastName.trim()
      };
      setUser(user);
    }
  };

  return (
    <div className='container mx-auto px-4 py-8 h-full'>
       <h1 className="sm:text-5xl md:text-4xl relative top-10 text-3xl font-bold text-blue-500 dark:text-white text-center  font-sans">
          LATIHAN SOAL PEMERINTAH DESA XII
          <br />
          <br />
          <span><h4 className='text-3xl'>Untuk Tes Perangkat Desa 2025</h4></span>
       </h1>

      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md border border-sky-100 dark:border-gray-700">
          <div className="text-center mb-8">
            
            <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 dark:bg-blue-900 rounded-full mb-4">
              <UserCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          
            <p className="text-gray-600 dark:text-gray-300">
              Please enter your details to begin the quiz
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  if (errors.firstName) {
                    setErrors(prev => ({ ...prev, firstName: '' }));
                  }
                }}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white ${
                  errors.firstName 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-sky-200 dark:border-gray-600 focus:border-blue-500'
                }`}
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (errors.lastName) {
                    setErrors(prev => ({ ...prev, lastName: '' }));
                  }
                }}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white ${
                  errors.lastName 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-sky-200 dark:border-gray-600 focus:border-blue-500'
                }`}
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.lastName}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Start Quiz
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Semoga Berhasil</p>
            <p>Selamat Mengerjakan 😁</p>
          </div>
        </div>
    </div>
    </div>

  );
};