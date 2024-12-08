export const Tabs = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

export const TabsList = ({ children, className }) => {
  return <div className={`flex border-b ${className}`}>{children}</div>;
};

export const TabsTrigger = ({ children, onClick, className }) => {
  return (
    <button onClick={onClick} className={`px-4 py-2 border-b-2 ${className}`}>
      {children}
    </button>
  );
};

export const TabsContent = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};
