import { redirect } from "react-router";
import {
  destroySessionFully,
  getSessionCookie
} from "~/auth/services/sessions/session.server";
import type { Route } from "./+types/logout.page";

/**
 * Logout action.
 * Handles user logout by:
 *  - Retrieving the current session cookie
 *  - Destroying the host session and the portal parent-domain cookie
 *  - Redirecting the user to the login page
 *
 * Portal auto-login sets Domain=.intelli-verse-x.ai. Clearing only the
 * host-only cookie left isAuthenticated=true → login redirected home →
 * refresh failed → auto_logout loop.
 *
 * @param request - The incoming request object from Remix.
 * @returns A redirect response to the login page with the session cookie cleared.
 */
export async function action({ request }: Route.ActionArgs) {
  /** Extract the cookie header from the incoming request. */
  const headers = request.headers.get("Cookie");

  /** Retrieve the current session cookie using the cookie header. */
  const sessionCookie = await getSessionCookie(headers);

  /** Destroy host + parent-domain sessions, then send the user to login. */
  return redirect("/auth/login", {
    headers: await destroySessionFully(sessionCookie)
  });
}
