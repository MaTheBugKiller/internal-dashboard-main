"use client"
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import * as Dialog from "@radix-ui/react-dialog";

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const error = searchParams.get('error');
  const [loading, setLoading] = useState(false);

  const handleMicrosoftLogin = async () => {
    setLoading(true);
    console.log("Initiating login process...");

    try {
      console.log("Initiating Microsoft login...");
      await signIn('azure-ad', {
        callbackUrl: callbackUrl,
        redirect: true
      });
      toast.success('Redirecting to Microsoft login...');
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <Dialog.Root defaultOpen={true}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/10" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <Dialog.Title className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Welcome Back
          </Dialog.Title>
          
          <p className="text-gray-500 text-center mb-8">Sign in to continue to your dashboard</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error === 'CredentialsSignin' ? 'Invalid login credentials' : 
               error === 'AccessDenied' ? 'You do not have access to this application' :
               `Error signing in: ${error}`}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleMicrosoftLogin}
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in with Microsoft"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function LoginFormFallback() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
          <p className="text-gray-500">Loading login form...</p>
        </div>
      </div>
    );
  }