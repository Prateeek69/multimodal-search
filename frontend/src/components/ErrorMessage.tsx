const ErrorMessage = ({ message }: { message: string }) => (
  <div className="max-w-xl mx-auto mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-400/40 shadow-sm">
    <p className="text-center text-red-200 font-medium">{message}</p>
  </div>
);

export default ErrorMessage;