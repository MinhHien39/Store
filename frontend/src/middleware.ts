import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const DEFAULT_BASIC_AUTH_USERNAME = "admin";
const DEFAULT_BASIC_AUTH_PASSWORD = "store";

const unauthorizedResponse = () =>
    new NextResponse("Authentication required.", {
        status: 401,
        headers: {
            "WWW-Authenticate": 'Basic realm="Store Admin", charset="UTF-8"',
        },
    });

export function middleware(request: NextRequest) {
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Basic ")) {
        return unauthorizedResponse();
    }

    const encodedCredentials = authorization.slice(6).trim();

    try {
        const decodedCredentials = atob(encodedCredentials);
        const separatorIndex = decodedCredentials.indexOf(":");

        if (separatorIndex < 0) {
            return unauthorizedResponse();
        }

        const username = decodedCredentials.slice(0, separatorIndex);
        const password = decodedCredentials.slice(separatorIndex + 1);

        const expectedUsername =
            process.env.ADMIN_BASIC_AUTH_USERNAME ?? DEFAULT_BASIC_AUTH_USERNAME;
        const expectedPassword =
            process.env.ADMIN_BASIC_AUTH_PASSWORD ?? DEFAULT_BASIC_AUTH_PASSWORD;

        if (username === expectedUsername && password === expectedPassword) {
            return NextResponse.next();
        }
    } catch {
        return unauthorizedResponse();
    }

    return unauthorizedResponse();
}

export const config = {
    matcher: ["/admin", "/admin/:path*"],
};
