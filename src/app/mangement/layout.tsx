import React from "react";


export default async function RootLayout({ children }: any) {


  return (
    <div>
      <main>{children}</main>
    </div>
  );
}
