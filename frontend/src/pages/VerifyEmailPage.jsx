import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const VerifyEmailPage = () => {
  const { verifyEmail } = useAuth();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (token && email) {
      verifyEmail(token, email)
        .then((res) => {
          setSuccess(res.success);
          setMessage(res.message);
        })
        .catch(() => {
          setSuccess(false);
          setMessage('An unexpected error occurred during verification.');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
      setSuccess(false);
      setMessage('Invalid or missing verification parameters.');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-100/40 filter blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-100/40 filter blur-3xl" />

      <div className="w-full max-w-md z-10 text-center">
        <div className="inline-flex bg-brand-600 p-3.5 rounded-2xl text-white shadow-xl shadow-brand-500/20 mb-8">
          <span className="font-extrabold text-xl tracking-wider">DF</span>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/40">
          {loading ? (
            <div className="py-8">
              <svg className="animate-spin h-10 w-10 text-brand-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <h3 className="text-lg font-bold text-slate-800">Verifying Account...</h3>
              <p className="text-sm text-slate-400 mt-1">Please wait while we activate your profile.</p>
            </div>
          ) : (
            <div className="py-4">
              <div className={`inline-flex items-center justify-center h-12 w-12 rounded-full mb-4 ${
                success ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
              }`}>
                {success ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {success ? 'Verification Complete!' : 'Verification Failed'}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                {message}
              </p>

              <Link to="/signin">
                <Button variant="primary" className="w-full py-3">
                  {success ? 'Go to Sign In' : 'Back to Login'}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
