import { addMonths } from 'date-fns';
import { prisma } from 'inflow/base/storage/prisma';
import { isGuestUser, IUserWithRoles } from 'inflow/base/storage/schema';
import { verifyCredential } from 'inflow/lib/dal';
import { generateUUID } from 'inflow/lib/utils';
import { accountProvisioner } from 'inflow/server/commands/accountProvisioner';
import { generateJwtToken } from 'inflow/server/common/jwt';
import { cookies } from 'next/headers';

interface AuthOptions {
    allowAnonymous?: boolean;
}

export async function auth({
    allowAnonymous = false
}: AuthOptions): Promise<IUserWithRoles | null> {
    const { isAuth, userId, roles } = await verifyCredential();
    if (!isAuth) {
        if (!allowAnonymous) {
            return null;
        } else {
            const user = await createGuestUser();
            setAuthCookieWithToken(user);
            return user;
        }
    }
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { authenticationProviders: false }
    });

    if (!user) {
        console.error(`User with ID ${userId} not found`);
        return null;
    }

    return {...user, roles} as IUserWithRoles;
}

async function setAuthCookieWithToken(user: IUserWithRoles) {
    // for guest users, we set a long expiration time
    const expires = addMonths(new Date(), isGuestUser(user) ? 10 : 3);
    const token = generateJwtToken(user, expires);
    const cookieStore = await cookies();
    cookieStore.set('credential', token, { expires });
    console.log(`Set auth cookie for user: ${user.id}`);
}

async function createGuestUser() {
    const name = `guest-${generateUUID()}`;
    const result = await accountProvisioner({
        ip: '',
        user: {
            name,
            email: '',
        },
        authenticationProvider: {
            name: 'guest',
            providerId: name,
        }
    });
    console.log(`Created guest user: ${name} with id: ${result.user.id}`);
    return result.user;
}