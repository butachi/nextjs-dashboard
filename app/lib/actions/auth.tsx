'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { use } from 'react';
import { SignupFormSchema } from '../definitions';
import bcrypt from 'bcrypt';
import { sql } from '@vercel/postgres';

import { redirect } from 'next/navigation';
import { date } from 'zod';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                case 'CallbackRouteError':
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

export type State = {
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
    };
    message?: string | null;
};

export async function register(
    prevState: State | undefined,
    formData: FormData
) {
    // 1. validate form fields
    const validedFields = SignupFormSchema.safeParse({
        name:       formData.get('name'),
        email:      formData.get('email'),
        password:   formData.get('password'),
    });

    // if any form fields are invalid, return early
    if (!validedFields.success) {
        return {
            errors: validedFields.error.flatten().fieldErrors,
            message: 'Mission Fields. Failed to Create User',
        }
    }

    // call the provider or db to create a user...
    // 2. prepare data for insertion into database
    const {name, email, password} = validedFields.data;
    // hash the user's password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await sql`
        INSERT INTO users (name, email, password)
        VALUES (${name}, ${email}, ${hashedPassword})
        `;
    } catch(error) {
        return {
            message: 'Database Error: Faild to Create Invoice.',
        };
    }
   
    redirect('/dashboard/invoices');

    // 1. validate form fields
    // const validateFields = SignupFormSchema.safeParse({
    //     name:       formData.get('name'),
    //     email:      formData.get('email'),
    //     password:   formData.get('password'),
    // })

    // // if any form fields are invalid, return early
    // if (!validateFields.success) {
    //     return {
    //         errors: validateFields.error.flatten().fieldErrors,
    //     }
    // }

    // // call the provider or db to create a user...
    // // 2. prepare data for insertion into database
    // const {name, email, password} = validateFields.data;
    // // hash the user's password before storing it
    // const hashedPassword = await bcrypt.hash(password, 10);

    // // 3. insert the usr into database or call an Auth Library's API
    // try {
    //     await sql`
    //     INSERT INTO users (name, email, password)
    //     VALUES (${name}, ${email}, ${hashedPassword})
    //     `
    // } catch (error) {
    //     if (error instanceof AuthError) {
    //         switch (error.type) {
    //             case 'CredentialsSignin':
    //                 return 'Invalid credentials.';
    //             case 'CallbackRouteError':
    //                 return 'CallbackRouteError';
    //             default:
    //                 return 'Something went wrong.';
    //         }
    //     }
    //     throw error;
    // }

    // redirect('/login');

}