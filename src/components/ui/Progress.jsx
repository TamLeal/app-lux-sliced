export const Progress = ({ value, className }) => {
  return (
    <div className={`relative w-full bg-gray-300 h-2 rounded ${className}`}>
      <div
        className="absolute left-0 top-0 h-2 bg-blue-500 rounded"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};
