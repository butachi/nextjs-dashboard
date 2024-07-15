'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce.number()
        .gt(0, { message: 'Please enter an amount greate than $0. ' }),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status',
    }),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({id: true, date: true});
const UpdateInvoice = FormSchema.omit({id: true, date: true});

export async function createInvoice(prevState: State,formData: FormData) {
    const validedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validedFields.success) {
        return {
            errors: validedFields.error.flatten().fieldErrors,
            message: 'Mission Fields. Failed to Create Invoice',
        }
    }

    const { customerId, amount, status } = validedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amount}, ${status}, ${date})
        `;
    } catch(error) {
        return {
            message: 'Database Error: Faild to Create Invoice.',
        };
    }
   
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
    
    const validedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    if (!validedFields.success) {
        return {
            errors: validedFields.error.flatten().fieldErrors,
            message: 'Mission Fields. Failed to Update Invoice'
        }
    }
    const {customerId, amount, status} = validedFields.data;
    const amountInCents = amount * 100;
    
    try {
        await sql`
        UPDATE invoices 
        SET customer_id = ${customerId}, amount=${amountInCents}, status=${status}
        WHERE id = ${id}
        `;
    } catch (error) {
        return {
            message: 'Database Error: Faild to Update Invoice.',
        }
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');

}

export async function deleteInvoice(id: string) {
    try {
        await sql`
            DELETE FROM invoices WHERE ID = ${id}
        `;
        revalidatePath('/dashboard/invoices');
        return {
            message: 'Deleted Invoice'
        }
    } catch (error) {
        return {
            message: 'Database Error: Faild to Delete Invoice.',
        }
    }
}