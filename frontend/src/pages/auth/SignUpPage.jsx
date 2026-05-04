import { ArrowRight, LockKeyhole, Mail, UserRoundPlus } from 'lucide-react';
import AuthLayout from './AuthLayout';
import AuthPanel from './AuthPanel';
import FormField from './FormField';

const SignUpPage = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
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
            className="group mt-1 inline-flex h-12 min-w-0 items-center justify-between gap-3 border-[3px] border-black bg-[#FFD600] px-3 text-sm font-black uppercase italic shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 sm:mt-2 sm:h-13 sm:border-[4px] sm:px-4 sm:text-base sm:shadow-[6px_6px_0_#000]"
          >
            <span className="truncate">Create account</span>
            <ArrowRight size={20} strokeWidth={3} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </AuthPanel>
    </AuthLayout>
  );
};

export default SignUpPage;
