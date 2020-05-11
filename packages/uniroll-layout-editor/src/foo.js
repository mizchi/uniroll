/** @jsx h */
import "./style.css";
import { h, forwardRef } from "preact";
import layout from "./layout.json";
import flatten from "lodash.flatten";

// document.body.innerHTML = JSON.stringify(layout, null, 2);

const Pane = forwardRef(
  (
    props: CSSProperties & {
      children?: any,
      attrs?: Omit<DOMAttributes<HTMLDivElement>, "style">,
    },
    ref: any
  ) => {
    const { children, attrs, ...others } = props;
    return (
      <div
        ref={ref}
        style={{
          width: "100%",
          height: "100%",
          minWidth: 0,
          minHeight: 0,
          ...others,
        }}
        {...attrs}
      >
        {props.children}
      </div>
    );
  }
);

const Flex = forwardRef(
  (
    props: CSSProperties & {
      children?: any,
      attrs?: Omit<DOMAttributes<HTMLDivElement>, "style">,
    },
    ref: any
  ) => {
    const { children, attrs, ...others } = props;
    return (
      <div
        ref={ref}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          ...others,
        }}
        {...attrs}
      >
        {props.children}
      </div>
    );
  }
);

type GridShorthandProps = {
  rows: Array<string>,
  columns: Array<string>,
  areas: string[][],
  children?: any,
};

const Grid = forwardRef(
  (props: Omit<CSSProperties, "columns"> & GridShorthandProps, ref: any) => {
    const { children, rows, columns, areas, ...others } = props;
    return (
      <div
        ref={ref}
        style={{
          width: "100%",
          height: "100%",
          display: "grid",
          gridTemplateColumns: columns.join(" "),
          gridTemplateRows: rows.join(" "),
          gridTemplateAreas: areas
            .map((area) => "'" + area.join(" ") + "'")
            .join(" "),
          ...others,
        }}
      >
        {props.children}
      </div>
    );
  }
);

const GridArea = forwardRef(
  (props: CSSProperties & { children: any }, ref: any) => {
    const { children, ...others } = props;
    return (
      <div
        ref={ref}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "grid",
        }}
      >
        <div
          style={{ position: "absolute", top: 0, bottom: 0, right: 0, left: 0 }}
        >
          <Pane {...others}>{props.children}</Pane>
        </div>
      </div>
    );
  }
);

export const Text = forwardRef(
  (
    props: CSSProperties & {
      children?: any,
      attrs?: Omit<DOMAttributes<HTMLDivElement>, "style">,
    },
    ref: any
  ) => {
    const { children, attrs, ...others } = props;
    return (
      <div
        ref={ref}
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          ...others,
        }}
        {...attrs}
      >
        {props.children}
      </div>
    );
  }
);

function View(props: { tree: ElementTree }) {
  const data = props.tree.data;
  switch (data.elementType) {
    case "root": {
      return (
        <Pane>
          {props.tree.children.map((c) => {
            return <View key={c.id} tree={c} />;
          })}
        </Pane>
      );
    }

    case "flex": {
      return (
        <Flex flexDirection={data.attrs.direction}>
          {props.tree.children.map((c) => {
            return <View key={c.id} tree={c} />;
          })}
        </Flex>
      );
    }

    case "grid": {
      const gridAreaNames = flatten(data.attrs.areas);
      const { rows, columns, areas } = data.attrs;
      return (
        <Grid rows={rows} columns={columns} areas={areas}>
          {gridAreaNames.map((gridArea) => {
            const existNode = props.tree.children.find((c) => {
              return (
                c.data.elementType === "grid-area" &&
                c.data.attrs.gridArea === gridArea
              );
            });
            return (
              <Pane gridArea={gridArea} key={gridArea}>
                {existNode && <View key={existNode.id} tree={existNode} />}
              </Pane>
            );
          })}
        </Grid>
      );
    }
    case "grid-area": {
      return (
        <>
          {props.tree.children.map((c) => {
            return <View key={c.id} tree={c} />;
          })}
        </>
      );
    }
    case "text": {
      return <Text>{data.attrs.value}</Text>;
    }
    case "image": {
      return (
        <Pane>
          <img
            src={data.attrs.src}
            style={{
              width: "auto",
              height: "auto",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          />
        </Pane>
      );
    }
    default: {
      return <Text>WIP: {data.elementType}</Text>;
    }
  }
}

render(<View tree={layout} />, document.body);
