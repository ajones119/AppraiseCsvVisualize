import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import css from "./Options.module.scss"
import { CSVImportMap } from "../../utils/parseUtils";
type CsvImportRowProps = {
    id: string,
    row: CSVImportMap
    index: number
}
const CsvImportRow = ({row, id, index}: CsvImportRowProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        setActivatorNodeRef
      } = useSortable({id: id, animateLayoutChanges: () => false});
      
      const style = {
        transform: CSS.Transform.toString(transform),
        transition,
      };
      
      return (
        <tr className={css.tableRow} ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <th className={css.rowIndex} ref={setActivatorNodeRef}>{index}</th>
            <td>{row.name}</td>
            <td>{row.type}</td>
        </tr>
      );
}

export default CsvImportRow;

