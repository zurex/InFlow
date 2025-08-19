import { verifyJWT } from 'inflow/server/common/jwt';
import { cookies, headers } from 'next/headers';
import { cache } from 'react';

//#region Authentication

type VerifyedCredential = {isAuth: true; userId: string, roles: string[]} | {isAuth: false; userId?: string, roles?: string[]};

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

/**
 * Verify the token from the Authorization header.
 */
export const verifyCredential = cache(async (): Promise<VerifyedCredential> => {

    const token = await getCredentialToken();

    if (!token) {
        return { isAuth: false };
    }

    try {
        const { id, roles } = verifyJWT(token);
        return { isAuth: true, userId: id, roles };
    } catch (error)
    { 
        return { isAuth: false };
    }
});

