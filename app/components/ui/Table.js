/* ─── Table — Notion table block renderer ───────────────────────
 * Server component. Renders a Notion `table` block with its children.
 * Respects `has_column_header` and `has_row_header` from the block.
 *
 * Usage (in a Notion block renderer):
 *   import Table from '@/app/components/ui/Table';
 *   case 'table':
 *     return <Table block={block} childrenMap={childrenMap} />;
 *
 * Or standalone with plain data:
 *   <Table headers={['Col A', 'Col B']} rows={[['1','2'],['3','4']]} />
 */

import RichText from './RichText';

/* ── Notion block mode (block + childrenMap) ── */
function NotionTable({ block, childrenMap }) {
  const rows = childrenMap?.[block.id] ?? [];
  const hasColHeader = block.table?.has_column_header;
  const hasRowHeader = block.table?.has_row_header;

  const [headerRow, ...bodyRows] = hasColHeader ? rows : [null, ...rows];

  return (
    <div className="ui-table-wrap">
      <table className={`ui-table${hasRowHeader ? ' ui-table--row-header' : ''}`}>
        {headerRow && (
          <thead>
            <tr>
              {headerRow.table_row?.cells?.map((cell, ci) => (
                <th key={ci}>
                  <RichText texts={cell} />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {bodyRows.map((row, ri) => (
            <tr key={ri}>
              {row.table_row?.cells?.map((cell, ci) => (
                <td key={ci}>
                  <RichText texts={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Plain data mode (headers + rows as strings) ── */
function PlainTable({ headers, rows, striped = false }) {
  return (
    <div className="ui-table-wrap">
      <table className="ui-table">
        {headers?.length > 0 && (
          <thead>
            <tr>
              {headers.map((h, i) => <th key={i}>{h}</th>)}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={striped && ri % 2 === 1 ? { background: 'var(--surface)' } : {}}>
              {row.map((cell, ci) => <td key={ci}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Table({ block, childrenMap, headers, rows, striped }) {
  if (block && childrenMap) return <NotionTable block={block} childrenMap={childrenMap} />;
  return <PlainTable headers={headers} rows={rows ?? []} striped={striped} />;
}
