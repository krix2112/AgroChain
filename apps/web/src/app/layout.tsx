import "./globals.css";
import "../styles/index.css";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'AgroChain — Direct Farm to Buyer Trade',
  description: 'No middlemen. Transparent prices. Every transaction on Shardeum Blockchain.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Noto+Sans+Devanagari:wght@400;500;600;700;800&family=Noto+Serif:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
