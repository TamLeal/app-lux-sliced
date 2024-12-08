export const Table = ({ children }) => (
  <table className="w-full">{children}</table>
);

export const TableHeader = ({ children }) => (
  <thead className="bg-gray-200">{children}</thead>
);

export const TableBody = ({ children }) => <tbody>{children}</tbody>;

export const TableRow = ({ children }) => (
  <tr className="border-b">{children}</tr>
);

export const TableHead = ({ children }) => (
  <th className="text-left px-4 py-2">{children}</th>
);

export const TableCell = ({ children }) => (
  <td className="px-4 py-2">{children}</td>
);
