
import { data, Route, Routes } from 'react-router';
import { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { axiosInstance } from './lib/axios.js';

import LoginPage from './pages/LoginPage.jsx';
import HomePage from './pages/HomePage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import CallPage from './pages/CallPage.jsx';
import NotificationPage from './pages/NotificationPage.jsx';
import OnBoardingPage from './pages/OnBoardingPage.jsx';

const App = () => {
  const { data , isLoading, error } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const res = await axiosInstance.get('https://localhost:5001/api/auth/me');
      return res.data;
    }
  })

  console.log(data);
  console.log(isLoading);
  console.log(error);

  return (
    <div className='h-screen' data-theme='night'>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/chat' element={<ChatPage />} />
        <Route path='/call' element={<CallPage />} />
        <Route path='/notifications' element={<NotificationPage />} />
        <Route path='/onboarding' element={<OnBoardingPage />} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App;
