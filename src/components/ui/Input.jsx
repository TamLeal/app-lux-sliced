export const Input = ({ className, ...props }) => {
  return (
    <input className={`border rounded px-2 py-1 ${className}`} {...props} />
  );
};
