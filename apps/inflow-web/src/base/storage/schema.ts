import { Prisma } from '@prisma/client';

//#region User

const user = Prisma.validator<Prisma.UserDefaultArgs>()({});

export type IUser = Prisma.UserGetPayload<typeof user>;

export type IUserWithRoles = IUser & {
    roles: string[];
};

const GUEST = 'guest';

export enum UserRole {
    Guest = GUEST,
    REGULAR = 'regular',
}

export function isGuestUser(user: IUserWithRoles): boolean {
    return user.roles.includes(UserRole.Guest);
}

const authenticationProvider =
    Prisma.validator<Prisma.AuthenticationProviderWhereUniqueInput>()({});

export type IAuthenticationProvider = Prisma.AuthenticationProviderGetPayload<
    typeof authenticationProvider
>;

export enum AuthenticationProvider {
    Email = 'email',
    Guest = GUEST,
}

// Create a type from the enum values
export type AuthenticationProviderType = `${AuthenticationProvider}`;

export function isGuestProvider(
    provider: AuthenticationProviderType | IAuthenticationProvider
): boolean {
    if (typeof provider === 'string') {
        return provider === AuthenticationProvider.Guest;
    }
    return provider.name === AuthenticationProvider.Guest;
}

//#endregion

//#region Thread

const thread = Prisma.validator<Prisma.ThreadDefaultArgs>()({});

export type IThread = Prisma.ThreadGetPayload<typeof thread>;


//#region Thread