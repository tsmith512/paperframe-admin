import type { PluginData } from "@cloudflare/pages-plugin-cloudflare-access";

export const onRequest: PagesFunction<unknown, any, PluginData> = async ({
  data,
}) => {
  return new Response(
    JSON.stringify(data)
  );
};
