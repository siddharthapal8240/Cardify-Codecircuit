import React from "react";

function Background() {
  return (
    <>
      <div className="fixed z-[2] w-full h-screen">
        <div className="absolute top-[5%] w-full py-10 flex justify-center text-zinc-600 text-xl font-semibold">
          Note It Down, Keep It Cool!
        </div>
        <h1 className="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] text-[13vw] leading-none tracking-tighter font-semibold text-zinc-900">
          Notes.
        </h1>
        <footer className="absolute top-[80%] w-full py-10 flex justify-center text-zinc-600 text-xl font-semibold">
          👨🏻‍💻 Developed by Sid
        </footer>
      </div>
    </>
  );
}

export default Background;