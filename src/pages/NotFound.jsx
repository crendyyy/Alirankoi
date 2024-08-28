const NotFound = () => {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1>Not Found</h1>
      <nav>
        <ol className="text-sm">
          <span>You must to </span>
          <a href="/login" className="text-sm text-blue-400 underline">
            Login
          </a>
        </ol>
      </nav>
    </main>
  );
};
export default NotFound;
