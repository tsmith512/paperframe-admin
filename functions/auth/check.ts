import { parse } from 'cookie';
import { getIdentity } from "@cloudflare/pages-plugin-cloudflare-access/api";

export const onRequest: PagesFunction = async ({ request }) => {
  const cookie = parse(request.headers.get('Cookie') || '');

  if (cookie['CF_Authorization']) {
    const identity = await getIdentity({
      jwt: cookie['CF_Authorization'],
      domain: "https://tsmith.cloudflareaccess.com",
    });

    if (identity?.email) {
      return new Response(identity.email, { status: 200 });
    } else if (identity?.service_token_id) {
      return new Response(identity.service_token_id, { status: 200 });
    } else {
      return new Response('JWT failed validation', { status: 403 });
    }
  }

  return new Response('No auth token in request', { status: 403 });
};
