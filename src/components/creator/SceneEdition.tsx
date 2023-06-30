import { Stack } from "@mui/material";
import { SceneGrid } from "./SceneGrid";
import { useTranslation } from "react-i18next"
import { IncDecButtons } from "./IncDecButtons";
import { useState, useEffect } from 'react';
import { LocalStorage } from "../../localStorage";
import { SceneMap, SerializedChallenge } from "../serializedChallenge";

const OBSTACLE = "O"
const ACTOR = "A"
const EMPTY = "-"

const COL_0 = 0
const CEL_0 = 0

export const relocateActor = (row: string[], colSearch: number, inMap: SceneMap) => {
    if (row.includes(ACTOR, colSearch)) {
        if (inMap[COL_0][CEL_0] === EMPTY || inMap[COL_0][CEL_0] === OBSTACLE) {
            inMap[COL_0][CEL_0] = ""
        }
        inMap[COL_0][CEL_0] = ACTOR + ( inMap[COL_0][CEL_0].length ? '&' + inMap[COL_0][CEL_0] : '')
    }
    return inMap;
}

type SizeProps = {
    mapIndex: number
    setColumns: (col: number) => void
    setRows: (row: number) => void
}

const SizeEditor = (props: SizeProps) => {
    const { t } = useTranslation("creator")

    const initialRows = LocalStorage.getCreatorChallenge()?.scene.maps[props.mapIndex].length
    const initialColumns = LocalStorage.getCreatorChallenge()?.scene.maps[props.mapIndex][COL_0].length

    const [row, setRow] = useState(initialRows || 1)
    const [col, setCol] = useState(initialColumns || 1)

    useEffect(() => {
        const updateMap = () => {
            let challenge: SerializedChallenge | null;
            let actualMap: SceneMap;

            const checkRow = () => {
                if (row !== actualMap.length) {
                    if (row < actualMap.length) {
                        actualMap = relocateActor(actualMap[actualMap.length - 1], COL_0, actualMap)
                        actualMap.pop()
                    }
                    else
                        actualMap.push(actualMap[COL_0].slice().fill(EMPTY))
                    return true
                }
                return false
            }

            const checkCol = () => {
                if (col !== actualMap[COL_0].length) {
                    if (col < actualMap[COL_0].length) {
                        actualMap.map((row) => {
                            actualMap = relocateActor(row, row.length - 1, actualMap)
                            return row.pop()
                        })
                    }
                    else
                        actualMap.map((row, i) => actualMap[i] = row.concat(EMPTY))
                    return true
                }
                return false
            }

            const readMap = () => {
                challenge = LocalStorage.getCreatorChallenge()
                actualMap = challenge!.scene.maps[props.mapIndex];
            }

            const saveMap = () => {
                LocalStorage.saveCreatorChallenge(challenge)
            }

            // main process

            readMap();

            if (checkCol()) {
                saveMap()
                props.setColumns(col)
            }

            if (checkRow()) {
                saveMap()
                props.setRows(row)
            }
        }

        updateMap();

    }, [col, row, props]);


    return (
        <Stack sx={{ flexDirection: "column", height: "200px", justifyContent: "space-between", padding: "10px" }}>
            <IncDecButtons returnValue={setCol} initialValue={col} min={1} max={12} label={t("scene-numCols")} testId="col" data-testid="map-col"/>
            <IncDecButtons returnValue={setRow} initialValue={row} min={1} max={10} label={t("scene-numRows")} testId="row" data-testid="map-row"/>
        </Stack>
    )
}

const Tool = () => <div style={{ borderStyle: "solid", width: "50px", height: "50px" }}></div>

const SceneTools = () =>
    <Stack alignItems="center" style={{ padding: "10px" }}>
        <p>Poner obstáculo</p>
        <Tool />
        <p>Poner objeto(s)</p>
        <Stack direction="row" style={{ flexWrap: "wrap", justifyContent: "center" }}>
            <Tool />
            <Tool />
            <Tool />
            <Tool />
            <Tool />
        </Stack>
        <p>Poner personaje</p>
        <Tool />
        <p>Borrar</p>
        <Tool />
    </Stack>

export const SceneEdition = () => {
    const [, setCols] = useState(0)
    const [, setRows] = useState(0)
    const [workingMap,] = useState(0)

    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between">
            <SizeEditor mapIndex={workingMap} setColumns={setCols} setRows={setRows} />
            <SceneGrid mapIndex={workingMap} />
            <SceneTools />
        </Stack>
    )
}
