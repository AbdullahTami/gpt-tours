"use client";

import { Toaster } from "react-hot-toast";

function Provider({ children }) {
  return (
    <>
      <Toaster position="top-center" />
      {children}
    </>
  );
}

export default Provider;
