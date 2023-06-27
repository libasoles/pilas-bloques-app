import { Stack } from "@mui/material"
import { SceneMap, SerializedChallenge } from "../serializedChallenge"
import { LocalStorage } from "../../localStorage"
import { defaultMaps } from "./Selection"
import styles from "./grid.module.css"

// these consts are for testing purpose 
const A = "A"
const O = "O"
const E = "E"
const G = "-"

const mapa = [[A,O,O,O,O,A,O,O,O,O,A,O,O,O,O],[G,O,G,G,G,A,O,O,O,O,A,O,O,O,O],[G,O,O,O,G,A,O,O,O,O,A,O,O,O,O],[E,G,G,G,G,A,O,O,O,O,A,O,O,O,O]]

// the scene has multiple initial scenarios
export const SceneGrid = () => {

    const challenge: SerializedChallenge | null = LocalStorage.getCreatorChallenge()

    const maps: SceneMap[] = challenge ? challenge.scene.maps : defaultMaps

    return <div className={styles.container}>
        <Stack className={styles.grid + ' ' + styles.border} >
            {maps[0].map((row, i) =>
                <Stack  key={i} className={styles.row} direction="row" data-testid="challenge-row">
                    {row.map((cellContent, j) => <Cell key={j} testId="challenge-cell">{cellContent}</Cell>)}
                </Stack>)}
        </Stack>
    </div>
}

const Cell: React.FC<CellProps> = (props) => 
    <div data-testid={props.testId} className = {styles.cell + ' ' + styles.border}>
            {props.children}
    </div>

interface CellProps { children: React.ReactNode, testId: string}