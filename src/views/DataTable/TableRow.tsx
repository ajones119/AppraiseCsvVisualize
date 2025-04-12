import { ReactNode } from "react";
import { TableColumn } from "../../utils/dataTableUtils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import css from "./DataTable.module.scss";

export type DataTableRow = {
  id: string;
  getter: (column: TableColumn, nextColumn?: TableColumn) => ReactNode;
  metaKey: string;
};
type DataTableRowProps = {
  row: DataTableRow;
  columns: TableColumn[];
  secondary?: boolean;
};
const DataTableRow = ({ row, columns, secondary }: DataTableRowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: row.id, animateLayoutChanges: () => false });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <tr
      className={`${css.tableRow} ${secondary && css.secondary}`}
      style={style}
      {...attributes}
    >
      <th className={css.rowIndex} ref={setNodeRef} {...listeners}>
        {row.id}
      </th>
      {columns.map((column, index) => (
        <td className={css.tableCell}>
          {row.getter(column, columns[index + 1])}
        </td>
      ))}
    </tr>
  );
};

export default DataTableRow;
