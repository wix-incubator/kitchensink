import { ClientRouter } from "astro:transitions";

export function BaseLayout({
  head,
  body,
}: {
  head: React.ReactNode;
  body: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <ClientRouter />
        {head}
      </head>
      <body>{body}</body>
    </html>
  );
}
