export const Card = ({ children, className }) => {
  return <div className={`p-4 shadow rounded ${className}`}>{children}</div>;
};

export const CardHeader = ({ children, className }) => {
  return <div className={`mb-2 ${className}`}>{children}</div>;
};

export const CardTitle = ({ children, className }) => {
  return <h3 className={`font-semibold ${className}`}>{children}</h3>;
};

export const CardContent = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};
