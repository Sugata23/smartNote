import { db } from '@/lib/db';
import { $notes } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'
import { eq, and } from 'drizzle-orm';
import Link from 'next/link';
import { clerk } from '@/lib/clerk-server';
import { Button } from '@/components/ui/button';

type Props = {
    params: {
        noteId: string;
    }
}

const NoteBookPage = async ({ params: { noteId } }: Props) => {
    const { userId } = auth();
    if (!userId) {
        return redirect("/dashboard");
    }
    const user = await clerk.users.getUser(userId);
    const notes = await db
    .select()
    .from($notes)
    .where(and(eq($notes.id, parseInt(noteId)), eq($notes.userId, userId)));
    if (notes.length != 1) {
        return redirect("/dashboard");
    }
    const note = notes[0];
    return(
        <div className="min-h-screen grainy p-8">
            <div className="max-w-4xl mx-auto">
                <div className="border shadow-xl border-stone-200 rounded-lg p-4 flex items-center">
                    <Link href='/dashboard'>
                        <Button className="bg-green-600" size="sm">
                            Back
                        </Button>
                    </Link>
                    <div className="w-3"></div>
                    <span className="font-semibold">
                        {user.firstName} {user.lastName}
                    </span>
                    <span className="inline-block mx-1">/</span>
                    <span className="text-stone-500 font-semibold">{note.name}</span>
                    <div className="ml-auto">
                        {/* <DeleteButton noteId={note.id} /> */}
                    </div>
                </div>

                <div className="h-4"></div>
                <div className="border-stone-200 shadow-xl border rounded-lg px-16 py-8 w-full">
                    {/* <TipTapEditor note={note} /> */}
                </div>
            </div>
        </div>
    )
}

export default NoteBookPage
