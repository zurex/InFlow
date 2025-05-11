// This is a Data Access Layer (DAL).
// It used to centralize your data requests and authorization logic.

import { prisma } from 'inflow/base/storage/common/prisma';
import { verifyJWT } from 'inflow/server/common/jwt';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';

/**
 * 
 * @returns The token from the Authorization header or the cookie.
 */
export const getCredentialToken = async () => {
    let token: string | undefined;

    token = (await cookies()).get('credential')?.value;

    if (!token) {
        const authorization = (await headers()).get('Authorization');
        const parts = authorization?.split(' ') || [];
        if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
            token = parts[1];
        }
    }

    return token;
}

type VerifyedCredential = {isAuth: true; userId: string} | {isAuth: false; userId: null};

/**
 * Verify the token from the Authorization header.
 */
export const verifyCredential = cache(async (): Promise<VerifyedCredential> => {

    const token = await getCredentialToken();

    if (!token) {
        return { isAuth: false, userId: null };
    }

    try {
        const { id } = verifyJWT(token);
        return { isAuth: true, userId: id };
    } catch (error)
    { 
        return { isAuth: false, userId: null };
    }
});

export const getCurrentUserId = async () => {
    const { isAuth, userId } = await verifyCredential();

    if (isAuth === false || !userId) {
        return 'anonymous';
    }

    return userId;
}

/**
 * Fetch the user from the database.
 */
export const getUser = cache(async () => {
    console.log('[DAL] Fetching user from database');
    const { isAuth, userId } = await verifyCredential();

    if (isAuth === false || !userId) {
        return null;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        return user;
    } catch (error) {
        console.log('Failed to fetch user')
        return null;
    }
});