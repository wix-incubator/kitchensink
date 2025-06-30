import "../styles/global.css";

export default function BaseLayout({
  header,
  body,
}: {
  header: React.ReactNode;
  body: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <slot name="seo-tags" />
        {header}
      </head>
      <body>{body}</body>
    </html>
  );
}
