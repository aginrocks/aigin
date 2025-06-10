import { IDToken, OidcAuth, TokenEndpointResponses } from '@hono/oidc-auth';
import { OidcAuthClaims } from 'hono';

declare module 'hono' {
    interface OidcAuthClaims {
        sub: string;
        email: string;
        name: string;
        given_name: string;
        preferred_username: string;
        nickname: string;
        groups: string[];
    }
}

export async function oidcClaimsHook(
    orig: OidcAuth | undefined,
    claims: IDToken | undefined,
    _response: TokenEndpointResponses
): Promise<OidcAuthClaims> {
    return {
        sub: claims?.sub ?? orig?.sub ?? '',
        email: (claims?.email as string) ?? orig?.email ?? '',
        name: (claims?.name as string) ?? orig?.name ?? '',
        given_name: (claims?.given_name as string) ?? orig?.given_name ?? '',
        preferred_username:
            (claims?.preferred_username as string) ?? orig?.preferred_username ?? '',
        nickname: (claims?.nickname as string) ?? orig?.nickname ?? '',
        groups: (claims?.groups as string[]) ?? orig?.groups ?? [],
    };
}
