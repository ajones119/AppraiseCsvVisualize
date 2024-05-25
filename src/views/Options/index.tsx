import { CSVImportMap, DEFAULT_IMPORT_MAP } from "../../utils/parseUtils";
import CsvImportRow from "./CsvRow";
import {
    DndContext, 
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useLocalStorage } from "usehooks-ts"
import Button from "../../components/Button";
import useTheme from "../../hooks/useTheme";
import Toggle from "../../components/Toggle";
import css from "./Options.module.scss"

const Options = () => {
    const [csvOrder, setCsvOrder] = useLocalStorage<CSVImportMap[]>("AppraiseCSVisualizeImportColumnOrder", DEFAULT_IMPORT_MAP);
    const { setTheme, themeName = "Light" } = useTheme()


    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    const handleDragEnd = (event: any) => {
        const {active, over} = event;

        if (active.id !== over.id) {
            setCsvOrder((items) => {
                const oldIndex = items.findIndex(item => item.key === active.id);
                const newIndex = items.findIndex(item => item.key === over.id);

            return arrayMove(items, oldIndex, newIndex);
        });
        }
    }

    return (
        <div>
            <div>
                <div className={css.toggle}>
                    <p>Light</p>
                    <Toggle value={themeName === "Light" || themeName === ""} onClick={() => setTheme(themeName === "Dark" ? "Light" : "Dark")} />
                    <p>Dark</p>
                </div>
                <h3>CSV Column Order</h3>
                <Button onClick={() => setCsvOrder(DEFAULT_IMPORT_MAP)}>RESET</Button>
                <table className={css.table}>
                    <tr>
                        <th>Col #</th>
                        <th>Name</th>
                        <th>Type</th>
                    </tr>
                    <DndContext 
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext 
                            items={csvOrder.map(order => ({...order, id: order.key}))}
                            strategy={verticalListSortingStrategy}
                        >
                            {
                                csvOrder.map((row, index) => 
                                    <CsvImportRow row={row} index={index + 1} id={row.key} />
                                )
                            }
                        </SortableContext>
                    </DndContext>
                </table>
            </div>
        </div>
    );
}

export default Options;