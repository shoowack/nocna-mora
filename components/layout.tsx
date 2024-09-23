import type { FC, PropsWithChildren } from "react";
import { Header } from "./header";
import { Footer } from "./footer";

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};
