const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-100 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <p className="text-sm sm:text-base text-slate-300 text-center sm:text-left">
            ProcTesting — Proctored Exams
          </p>

          <span className="text-xs sm:text-sm text-slate-400 text-center sm:text-right">
            Product of{" "}
            <span className="font-semibold text-rose-400">
              Information Technology
            </span>{" "}
            Department
          </span>

        </div>

        <p className="mt-2 text-center text-xs text-slate-500">
          &copy; {year} • Built with React, Node.js/Express, and MongoDB
        </p>

      </div>
    </footer>
  );
};

export default Footer;
