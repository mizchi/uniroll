import React, { useState, useEffect, useRef } from "react";
import { Pane, Grid, Flex } from "./elements";
import { ElementTree, isLayoutElement, GridNode } from "../types";
import flatten from "lodash-es/flatten";
import { EditableBox } from "./EditableBox";
import { BlankPane } from "./BlankPane";
import { View } from "./View";
import { useTreeState } from "../contexts/tree";
import { TreeEditMode } from "../reducer";
import { EditbaleGrid } from "./EditableGrid";
import Modal from "react-modal";

export function EditableView(props: { tree: ElementTree; depth: number }) {
  const { editMode } = useTreeState();
  const data = props.tree.data;
  const showLayoutHeader =
    editMode === TreeEditMode.ALL ||
    (isLayoutElement(data.elementType) && editMode === TreeEditMode.LAYOUT);
  const showElementHeader =
    editMode === TreeEditMode.ALL ||
    (!isLayoutElement(data.elementType) && editMode === TreeEditMode.ELEMENT);

  switch (data.elementType) {
    case "root": {
      return (
        <EditableBox
          showHeader={false}
          // showHeader={showLayoutHeader}
          tree={props.tree}
          depth={props.depth + 1}
        />
      );
    }
    case "grid": {
      const gridAreaNames = flatten(data.attrs.areas);
      const { rows, columns, areas } = data.attrs;
      const gridEditable = editMode === TreeEditMode.LAYOUT;
      return (
        <EditableBox
          showHeader={showLayoutHeader}
          tree={props.tree}
          depth={props.depth + 1}
        >
          {gridEditable ? (
            <EditbaleGrid initialData={data.attrs} tree={props.tree} />
          ) : (
            <Grid rows={rows} columns={columns} areas={areas}>
              {gridAreaNames.map((gridArea) => {
                const hit = props.tree.children.find((c) => {
                  return (
                    c.data.elementType === "grid-area" &&
                    c.data.attrs.gridArea === gridArea
                  );
                });
                if (hit == null) {
                  return <>Nothing for {gridArea}</>;
                }
                return (
                  <Pane gridArea={gridArea} key={gridArea}>
                    <EditableView
                      key={hit.id}
                      tree={hit}
                      depth={props.depth + 1}
                    />
                  </Pane>
                );
              })}
            </Grid>
          )}
        </EditableBox>
      );
    }
    case "grid-area": {
      return (
        <EditableBox
          showHeader={showLayoutHeader}
          tree={props.tree}
          depth={props.depth + 1}
        />
      );
    }
    case "flex": {
      const isBlank = props.tree.children.length === 0;
      if (isBlank) {
        return (
          <EditableBox
            showHeader={showLayoutHeader}
            tree={props.tree}
            depth={props.depth + 1}
          >
            <Flex flexDirection={data.attrs.direction}>
              {isBlank ? (
                <BlankPane
                  parentId={props.tree.id}
                  text={`Add ${data.attrs.direction}`}
                />
              ) : (
                <View tree={props.tree} />
              )}
            </Flex>
          </EditableBox>
        );
      }

      return (
        <EditableBox
          showHeader={showLayoutHeader}
          tree={props.tree}
          depth={props.depth + 1}
        >
          <Flex flexDirection={data.attrs.direction}>
            <Flex flex={4} flexDirection={data.attrs.direction}>
              {props.tree.children.map((child) => {
                return (
                  <EditableView
                    key={child.id}
                    tree={child}
                    depth={props.depth + 1}
                  />
                );
              })}
            </Flex>
            <Flex flex={1}>
              <BlankPane
                parentId={props.tree.id}
                text={`Add ${data.attrs.direction}`}
              />
            </Flex>
          </Flex>
        </EditableBox>
      );
    }

    // element
    case "text": {
      return (
        <EditableBox
          showHeader={showElementHeader}
          tree={props.tree}
          depth={props.depth + 1}
        >
          <View tree={props.tree} />
        </EditableBox>
      );
    }
    case "image": {
      return (
        <EditableBox
          showHeader={showElementHeader}
          tree={props.tree}
          depth={props.depth + 1}
        >
          <View tree={props.tree} />
        </EditableBox>
      );
    }
    case "image": {
      return (
        <EditableBox
          showHeader={showElementHeader}
          tree={props.tree}
          depth={props.depth + 1}
        >
          <View tree={props.tree} />
        </EditableBox>
      );
    }
    case "wysiwyg": {
      return (
        <EditableBox
          showHeader={showElementHeader}
          tree={props.tree}
          depth={props.depth + 1}
        >
          <Wysiwyg />
          {/* <View tree={props.tree} /> */}
        </EditableBox>
      );
    }
    default: {
      return (
        <EditableBox
          showHeader={showElementHeader}
          tree={props.tree}
          depth={props.depth + 1}
        >
          WIP: {(data as any).elementType}
        </EditableBox>
      );
    }
  }
}

function Wysiwyg() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Pane>
        <button onClick={() => setIsOpen(true)}>Edit by wysiwyg</button>
      </Pane>
      {isOpen && (
        <Modal
          ariaHideApp
          isOpen={true}
          onRequestClose={() => setIsOpen(false)}
        >
          WIP: Wysiwyg
        </Modal>
      )}
    </>
  );
}
