'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function VerifyPage() {
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your adventure account...');

  useEffect(() => {
    const verify = async () => {
      try {
        const token = params.token;
        if (!token) {
          setStatus('error');
          setMessage('Invalid verification link.');
          return;
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify/${token}`);
        
        // If verification is successful, backend usually returns login token/user
        // but we can just show success and let them login manually or auto-login
        const { token: authToken, data } = response.data;
        
        if (authToken && data.user) {
          localStorage.setItem('token', authToken);
          localStorage.setItem('user', JSON.stringify(data.user));
          axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        }

        setStatus('success');
        setMessage('Your account is verified! Welcome to the adventure.');
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed. The link may have expired.');
      }
    };

    verify();
  }, [params.token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/90 backdrop-blur-xl p-12 rounded-3xl shadow-2xl w-full max-w-lg border border-white/20 text-center"
      >
        <div className="mb-8">
          {status === 'loading' && (
            <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
          )}
          {status === 'success' && (
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-4xl">✅</span>
            </div>
          )}
          {status === 'error' && (
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-4xl">❌</span>
            </div>
          )}
        </div>

        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          {status === 'loading' ? 'Verifying...' : status === 'success' ? 'Verified!' : 'Verification Failed'}
        </h2>
        
        <p className="text-slate-600 text-lg mb-10 leading-relaxed">
          {message}
        </p>

        {status !== 'loading' && (
          <button 
            onClick={() => router.push(status === 'success' ? '/' : '/signup')}
            className={`px-10 py-4 rounded-full font-bold text-lg shadow-lg transition-all active:scale-95 ${
              status === 'success' 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {status === 'success' ? "Let's Play!" : 'Try Registering Again'}
          </button>
        )}
      </motion.div>
    </div>
  );
}
