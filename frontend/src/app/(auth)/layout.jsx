export default function AuthLayout({ children }) {
  return (
    <>
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-center p-6 md:p-10 min-h-[calc(100svh-66px)]">
          <div className=" w-full max-w-md rounded-2xl  px-6 py-14 shadow-md md:max-w-2xl ">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
