import { generateLoginURL } from "@cloudflare/pages-plugin-cloudflare-access/api";

export const onRequest = () => {
  const loginURL = generateLoginURL({
    redirectURL: "https://paperframe.tsmith.photos/",
    domain: "https://tsmith.cloudflareaccess.com",
    // @TODO: ABSTRACT TO ENV VAR AND ROTATE
    aud: "34fc7e98fd5f56f54c4afc4b1d0f37ad04312cc6836b486fa9120b514f29c918",
  });

  return new Response(null, {
    status: 302,
    headers: { Location: loginURL },
  });
};
