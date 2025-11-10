import "./globals.css";
import { Inter } from "next/font/google";
import QueryProvider from "@/components/providers/QueryProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";
import {ClientProvider} from "@/lib/intl/ClientProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
          <link rel="stylesheet" href="/css/react-phone-number-input/style.css"/>
      </head>
      <body className={inter.className}>
        <ClientProvider>
          <QueryProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </QueryProvider>
        </ClientProvider>
      </body>
    </html>
  );
}
