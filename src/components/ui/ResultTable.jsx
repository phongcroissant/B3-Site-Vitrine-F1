export default function ResultTable({ columns, rows, rowKey }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.header}
                className="text-left py-3 px-4 font-medium text-black"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={rowKey(row, index)}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              {columns.map((col) => (
                <td key={col.header} className="py-3 px-4 text-black">
                  {col.render(row, index)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
