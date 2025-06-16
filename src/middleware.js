import { NextResponse } from "next/server";

export const config = {
  matcher: "/integrations/:path*",
};

export function middleware(request) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-createxyz-project-id", "cba3df5a-98f7-4fcc-a370-e9287d33c7ab");
  requestHeaders.set("x-createxyz-project-group-id", "2bbd90c5-dec9-4e67-a69a-5332033e41a7");


  request.nextUrl.href = `https://www.create.xyz/${request.nextUrl.pathname}`;

  return NextResponse.rewrite(request.nextUrl, {
    request: {
      headers: requestHeaders,
    },
  });
}