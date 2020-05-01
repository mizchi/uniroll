import { forwardRef, CSSProperties, DOMAttributes } from "react";
import React from "react";

export const Pane = forwardRef(
  (
    props: CSSProperties & {
      children?: any;
      attrs?: Omit<DOMAttributes<HTMLDivElement>, "style">;
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

export const Flex = forwardRef(
  (
    props: CSSProperties & {
      children?: any;
      attrs?: Omit<DOMAttributes<HTMLDivElement>, "style">;
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
  rows: Array<string>;
  columns: Array<string>;
  areas: string[][];
  children?: any;
};

export const Grid = forwardRef(
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

export const GridArea = forwardRef(
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
      children?: any;
      attrs?: Omit<DOMAttributes<HTMLDivElement>, "style">;
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
