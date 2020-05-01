import { ElementTree } from "..";
import { flatten, range } from "lodash-es";
import { Grid, Pane, Text } from "./elements";
import React from "react";

export function EditbaleGrid(props: {
  tree: ElementTree;
  initialData: { rows: string[]; columns: string[]; areas: string[][] };
}) {
  // return
  const names = flatten(props.initialData.areas);
  const rows = props.initialData.rows;
  const rowsSize = props.initialData.rows.length;

  const columns = props.initialData.columns;
  const columnsSize = props.initialData.columns.length;

  const areas = props.initialData.areas;

  const rowAreaNames = range(rows.length).map((n) => `re${n}`);
  const columnAreaNames = range(columns.length).map((n) => `ce${n}`);

  return (
    <Grid
      rows={["32px", "1fr", "32px"]}
      columns={["32px", "1fr", "32px"]}
      areas={[
        [".", "rows", "add-row"],
        ["columns", "preview", "."],
        ["add-column", ".", "."],
      ]}
    >
      <Pane gridArea="add-row">
        <button>+</button>
      </Pane>
      <Pane gridArea="add-column">
        <button>+</button>
      </Pane>

      <Pane gridArea="rows" background="wheat">
        <Grid rows={["1fr"]} columns={rows} areas={[rowAreaNames]}>
          {rowAreaNames.map((name, index) => {
            return (
              <Pane gridArea={name} key={index}>
                <Text>
                  <input value={rows[index]} />
                </Text>
              </Pane>
            );
          })}
        </Grid>
      </Pane>
      <Pane gridArea="columns" background="wheat">
        <Grid
          rows={columns}
          columns={["1fr"]}
          areas={columnAreaNames.map((n) => [n])}
        >
          {columnAreaNames.map((name, index) => {
            return (
              <Pane gridArea={name} key={index}>
                <Text>
                  <input value={columns[index]} style={{ width: 32 }} />
                </Text>
              </Pane>
            );
          })}
        </Grid>
        {/* columns editor */}
      </Pane>
      <Pane gridArea="preview">
        <Grid rows={rows} columns={columns} areas={areas}>
          {names.map((gridArea, index) => {
            // const hit = props.tree.children.find((c) => {
            //   return (
            //     c.data.elementType === "grid-area" &&
            //     c.data.attrs.gridArea === gridArea
            //   );
            // })!;
            // const firstChild = hit.children[0];
            return (
              <Pane gridArea={gridArea} key={index} border="1px solid black">
                <Text>
                  <input value={gridArea} />
                  {/* : bindTo {firstChild?.id ?? "null"} */}
                </Text>
                {/* <EditableView key={hit.id} tree={hit} depth={props.depth + 1} /> */}
              </Pane>
            );
          })}
        </Grid>
      </Pane>
    </Grid>
  );

  // return <div>wip</div>;
}
