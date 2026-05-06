import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole } from 'lucide-react';

import OtpField from './otpField';
import { resendOtp, resetAuthState, verifyLoginOtp, verifyRegisterOtp } from '../../store/authSlice';
import { setCurrentUser } from '../../services/authApi';
import { toast } from 'react-toastify';

const OtpVerificationPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { userEmail, authType } = useSelector(state => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleAccountVerification = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        const formData = new FormData(event.target);
        const otp = formData.get('otp')?.trim();
        console.log("Verifying with Email & OTP:", userEmail, otp);

        try {
            const payload = {
                email: userEmail,
                otp: otp,
            };

            const actionToCall = authType === 'login' ? verifyLoginOtp : verifyRegisterOtp;

            const response = await dispatch(actionToCall(payload)).unwrap();
            console.log('Account verified and created successfully!', response);

            if (response?.data?.user) {
                setCurrentUser(response?.data?.user);
            }
            toast.success(response?.message || "Account verified and created successfully!")
            navigate('/dashboard/overview');

        } catch (err) {
            console.error('Verification failed:', err);
            
            if (typeof err === 'string') {
                setError(err);
            } else if (err?.message) {
                setError(err.message);
            } else {
                setError('Verification failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Naya function: URL change karne ke liye
    const handleNavigation = () => {
        if (authType === 'login') {
            navigate('/signup');
            dispatch(resetAuthState())
        } else {
            navigate('/signin');
               dispatch(resetAuthState())
        }
    };

    const handleResendOtp = async()=> {
      try{
        const purpose = authType === "login" ? "login" : "register"
          const response =  await dispatch(resendOtp({purpose ,email:userEmail})).unwrap()
        toast.success(response.message || "Otp resent successfully!")
      }catch(err){
   console.error('Verification failed:', err);
            
            if (typeof err === 'string') {
                setError(err);
            } else if (err?.message) {
                setError(err.message);
            } else {
                setError('Verification failed. Please try again.');
            }
      }

    } 

    return (
        <div className='flex flex-col min-w-0 lg:order-2 w-full sm:max-w-[40rem] mx-auto'>
            {/* Secure Window Bar */}
            <div className="w-full items-center justify-between border-b-[4px] border-black bg-black p-3 text-white flex">
                <div className="flex gap-2">
                    <span className="h-3.5 w-3.5 rounded-full border-2 border-white bg-[#FF5F56]" />
                    <span className="h-3.5 w-3.5 rounded-full border-2 border-white bg-[#FFBD2E]" />
                    <span className="h-3.5 w-3.5 rounded-full border-2 border-white bg-[#00E676]" />
                </div>
                <span className="text-[10px] font-black uppercase italic tracking-[0.18em]">Secure_Window</span>
            </div>

            {/* Form Section */}
            <form className="bg-[#FDFBF7] p-4 sm:p-6 w-full grid gap-5 border-[3px] border-black" onSubmit={handleAccountVerification}>
                <div className="mb-5 hidden items-center gap-3 sm:flex">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border-[3px] border-black bg-[#00E676] shadow-[4px_4px_0_#000]">
                        <LockKeyhole size={22} strokeWidth={3} />
                    </span>
                    <h2 className="text-2xl font-black uppercase italic leading-none sm:text-3xl">Verify Your OTP</h2>
                </div>

                {error && (
                    <div className="rounded border-2 border-red-500 bg-red-50 p-3 text-sm font-bold text-red-700">
                        {error}
                    </div>
                )}

                <OtpField name="otp" autoComplete="otp" label="Enter otp" placeholder="Enter otp" icon={LockKeyhole} />
                
                <button
                    type="submit"
                    disabled={isLoading}
                    className="group mt-1 inline-flex h-12 min-w-0 w-full items-center justify-between gap-3 border-[3px] border-black bg-[#FFD600] px-3 text-sm font-black uppercase italic shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed sm:mt-2 sm:h-13 sm:border-[4px] sm:px-4 sm:text-base sm:shadow-[6px_6px_0_#000]"
                >
                    <span className="truncate">{isLoading ? 'Verifying...' : 'Verify otp'}</span>
                    <ArrowRight size={20} strokeWidth={3} className="transition-transform group-hover:translate-x-1" />
                </button>
                 <div className='w-full flex justify-end'>
                    <button
                  type='button' 
                  onClick= {handleResendOtp}
                   className="uppercase italic text-[#1E6BFF] underline decoration-[3px] underline-offset-4  ">
              Resend otp
            </button>
                    </div>
            </form>

            {/* Link ki jagah button ka use kiya hai jo navigate function call karega */}
            <div className="border-[3px] border-black bg-white p-3 text-center text-sm font-black sm:border-[4px] sm:p-4">
                <span className="text-black/60">
                    {authType === "login" ? "New operator" : "Already cleared?"}
                </span>{' '}
                <button 
                    onClick={handleNavigation}
                    className="uppercase italic text-[#1E6BFF] underline decoration-[3px] underline-offset-4 bg-transparent border-none cursor-pointer p-0 m-0"
                >
                    {authType === "login" ? "Create account" : "Sign in"}
                </button>
            </div>
        </div>
    );
};

export default OtpVerificationPage;