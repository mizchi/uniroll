// import { ElementTree, ElementSource } from "./types";
// import uniqueId from "lodash-es/uniqueId";

// export const sources: ElementSource[] = [
//   {
//     displayName: "Text",
//     sourceType: "text",
//     value: "",
//   },
//   {
//     displayName: "Image",
//     sourceType: "image",
//     src:
//       "http://imgcc.naver.jp/kaze/mission/USER/20140612/42/4930882/68/598x375xe4022b20b838933f265c1591.jpg",
//   },
//   {
//     displayName: "Row",
//     sourceType: "flex",
//     direction: "row",
//   },
//   {
//     displayName: "Column",
//     sourceType: "flex",
//     direction: "column",
//   },
//   {
//     displayName: "Grid(1x1)",
//     sourceType: "grid",
//     rows: ["1fr"],
//     columns: ["1fr"],
//     areas: [["1"]],
//   },
//   {
//     displayName: "Grid(2x2)",
//     sourceType: "grid",
//     rows: ["1fr", "1fr"],
//     columns: ["1fr", "1fr"],
//     areas: [
//       ["a", "b"],
//       ["c", "d"],
//     ],
//   },
//   {
//     displayName: "Wysiwyg",
//     sourceType: "wysiwyg",
//     data: [],
//   },
// ];

// export const sampleTree: ElementTree = {
//   id: "$root",
//   data: { elementType: "root" },
//   children: [
//     {
//       id: uniqueId(),
//       data: {
//         elementType: "grid",
//         rows: ["1fr", "1fr"],
//         columns: ["1fr", "1fr"],
//         areas: [
//           ["a", "b"],
//           ["c", "d"],
//         ],
//       },
//       children: [
//         {
//           id: uniqueId(),
//           data: {
//             elementType: "grid-area",
//             gridArea: "a",
//           },
//           children: [
//             {
//               id: uniqueId(),
//               data: { elementType: "text", value: "foo" },
//               children: [],
//             },
//           ],
//         },
//         {
//           id: uniqueId(),
//           data: {
//             elementType: "grid-area",
//             gridArea: "b",
//           },
//           children: [],
//         },
//         {
//           id: uniqueId(),
//           data: {
//             elementType: "grid-area",
//             gridArea: "c",
//           },
//           children: [
//             {
//               id: uniqueId(),
//               data: {
//                 elementType: "grid",
//                 rows: ["1fr"],
//                 columns: ["1fr", "1fr"],
//                 areas: [["e", "f"]],
//               },
//               children: [
//                 {
//                   id: uniqueId(),
//                   data: {
//                     elementType: "grid-area",
//                     gridArea: "e",
//                   },
//                   children: [
//                     {
//                       id: uniqueId(),
//                       data: {
//                         elementType: "flex",
//                         direction: "column",
//                       },
//                       children: [],
//                     },
//                   ],
//                 },
//                 {
//                   id: uniqueId(),
//                   data: {
//                     elementType: "grid-area",
//                     gridArea: "f",
//                   },
//                   children: [
//                     {
//                       id: uniqueId(),
//                       data: {
//                         elementType: "text",
//                         value: "yyy",
//                       },
//                       children: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: uniqueId(),
//           data: {
//             elementType: "grid-area",
//             gridArea: "d",
//           },
//           children: [
//             {
//               id: uniqueId(),
//               data: {
//                 elementType: "image",
//                 src:
//                   "http://imgcc.naver.jp/kaze/mission/USER/20140612/42/4930882/68/598x375xe4022b20b838933f265c1591.jpg",
//               },
//               children: [],
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };

// export const rootTree: ElementTree = {
//   id: "$root",
//   data: { elementType: "root" },
//   children: [],
// };

// export const flexTree: ElementTree = {
//   id: "$root",
//   data: { elementType: "root" },
//   children: [
//     {
//       id: uniqueId(),
//       data: {
//         elementType: "flex",
//         direction: "column",
//       },
//       children: [
//         {
//           id: uniqueId(),
//           data: {
//             elementType: "text",
//             value: "text",
//           },
//           children: [],
//         },
//       ],
//     },
//   ],
// };

// export const wysiwigTree: ElementTree = {
//   id: "$root",
//   data: { elementType: "root" },
//   children: [
//     {
//       id: uniqueId(),
//       data: {
//         elementType: "wysiwyg",
//         data: [],
//       },
//       children: [],
//     },
//   ],
// };
