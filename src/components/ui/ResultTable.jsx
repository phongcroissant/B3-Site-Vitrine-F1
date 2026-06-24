export default function ResultTable({ columns, rows, rowKey }) {
  return (
    <div className="overflow-x-auto f1-card p-1">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-[var(--f1-red)]">
            {columns.map((col) => (
              <th
                key={col.header}
                className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-red-500"
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
              className="border-b border-white/5 transition hover:bg-white/5"
            >
              {columns.map((col) => (
                <td key={col.header} className="py-3 px-4 text-white/90">
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
