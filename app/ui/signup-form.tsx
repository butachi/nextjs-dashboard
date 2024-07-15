'use client';

import { ArrowRightIcon, AtSymbolIcon, DocumentTextIcon, KeyIcon } from "@heroicons/react/24/outline";
import { Button } from '@/app/ui/button';
import { useActionState } from "react";
import { register, State } from "@/app/lib/actions/auth";

export default function SignupForm() {
    const initialState: State = {message: null, errors: {}}; 
    const [state, formAction, isPending] = useActionState(register, initialState)
    return (
        <form action={formAction}>
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
                <h1>Create a Acme Account</h1>
                <div className="w-full">
                    <div>
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="name"
                            >
                            Name
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="name"
                                type="name"
                                name="name"
                                placeholder="Enter your name"
                                required
                            />
                            <DocumentTextIcon className="pointer-events absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                        <div id="name-error" aria-live='polite' aria-atomic="true">
                            {state?.errors?.name && state?.errors.name.map((error: string) => (
                                <p className='mt-2 text-sm text-red-500' key={error}>
                                {error}
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className="mt-4">
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="email"
                            >
                            email
                        </label>
                        <div className="relative">
                            <input className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500" 
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                required
                            />
                            <AtSymbolIcon className="pointer-events absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
                        </div>
                        <div id="email-error" aria-live='polite' aria-atomic="true">
                            {state?.errors?.email && state?.errors.email.map((error: string) => (
                                <p className='mt-2 text-sm text-red-500' key={error}>
                                {error}
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className="mt-4">
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="password"
                            >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                required
                                minLength={6}
                            />
                            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                        <div id="name-error" aria-live='polite' aria-atomic="true">
                            {state?.errors?.password && state?.errors?.password.map((error: string) => (
                                <p className='mt-2 text-sm text-red-500' key={error}>
                                {error}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
                <Button className="mt-4 w-full" aria-disabled={isPending}>
                    Sign up <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
                </Button>
            </div>
        </form>
    );
}