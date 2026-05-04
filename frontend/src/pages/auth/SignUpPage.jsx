import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, Mail, UserRoundPlus } from 'lucide-react';
import AuthLayout from './AuthLayout';
import AuthPanel from './AuthPanel';
import FormField from './FormField';
import { register } from '../../services/authApi';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    const formData = new FormData(event.target);
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim().toLowerCase();
    const password = formData.get('password');

    try {
      await register({ name, email, password });
      navigate('/signin');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Account setup"
      title="Claim Your Monitor OS"
      subtitle="Create the operator profile first; backend auth can attach to the same inputs and protected shell when it lands."
    >
      <AuthPanel
        footerHref="/signin"
        footerLabel="Sign in"
        footerText="Already cleared?"
        icon={UserRoundPlus}
        onSubmit={handleSubmit}
        title="Sign Up"
      >
        <div className="grid gap-4">
          {error && (
            <div className="rounded border-2 border-red-500 bg-red-50 p-3 text-sm font-bold text-red-700">
              {error}
            </div>
          )}
          <FormField autoComplete="name" icon={UserRoundPlus} label="Full name" name="name" placeholder="Operator name" />
          <FormField autoComplete="email" icon={Mail} label="Email" name="email" placeholder="you@example.com" type="email" />
          <FormField
            autoComplete="new-password"
            icon={LockKeyhole}
            label="Password"
            name="password"
            placeholder="Create access key"
            type="password"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="group mt-1 inline-flex h-12 min-w-0 items-center justify-between gap-3 border-[3px] border-black bg-[#FFD600] px-3 text-sm font-black uppercase italic shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed sm:mt-2 sm:h-13 sm:border-[4px] sm:px-4 sm:text-base sm:shadow-[6px_6px_0_#000]"
          >
            <span className="truncate">{isLoading ? 'Creating...' : 'Create account'}</span>
            <ArrowRight size={20} strokeWidth={3} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </AuthPanel>
    </AuthLayout>
  );
};

export default SignUpPage;
