const NotFound = () => {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-[200px] font-extrabold max-sm:text-[120px]">404</h1>
      <p className="font-semibold text-2xl max-sm:text-lg">Sorry, Page Not Found!</p>
      <span className="mt-3 font-light text-base max-sm:text-sm">
        You must to
        <a href="/login" className="text-sm ml-1 text-primary underline font-semibold hover:text-blue-400">
          Login
        </a>
      </span>
    </main>
  );
};
export default NotFound;
