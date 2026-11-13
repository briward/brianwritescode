/**
 * Where a request to an old domain is sent: the same path and query on the target origin. The
 * fragment never reaches the server, so it is left for the browser to carry over.
 *
 * @param requestUrl The full URL that was asked for, such as `https://briward.com/about`.
 * @param targetOrigin The origin to send it to, such as `https://brianwritescode.com`.
 *
 * @returns The URL to redirect to.
 */
export default function redirectUrlOf(requestUrl: string, targetOrigin: string): string {
  const { pathname, search } = new URL(requestUrl);

  return new URL(`${pathname}${search}`, targetOrigin).toString();
}
