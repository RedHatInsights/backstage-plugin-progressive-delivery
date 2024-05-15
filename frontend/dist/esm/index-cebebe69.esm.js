import React, { useState, useEffect } from 'react';
import { InfoCard, DependencyGraph, DependencyGraphTypes } from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import { makeStyles } from '@material-ui/core/styles';
import { useApi, configApiRef } from '@backstage/core-plugin-api';

const MANY_TO_MANY_NODE_LABEL = "soak";
function simplifyManyToMany(edges) {
  let node_origins = {};
  for (const [o, t] of edges) {
    if (!(t in node_origins)) {
      node_origins[t] = /* @__PURE__ */ new Set();
    }
    node_origins[t].add(o);
  }
  let node_origins_lookup = {};
  for (const [k, v] of Object.entries(node_origins)) {
    const key = JSON.stringify(Array.from(v));
    if (!(key in node_origins_lookup)) {
      node_origins_lookup[key] = /* @__PURE__ */ new Set();
    }
    node_origins_lookup[key].add(k);
  }
  let multi_origins = {};
  for (const [_t, origins] of Object.entries(node_origins)) {
    if (origins.size > 1) {
      const originsKey = JSON.stringify(Array.from(origins));
      if (!(originsKey in multi_origins)) {
        multi_origins[originsKey] = 0;
      }
      multi_origins[originsKey] += 1;
    }
  }
  let index = 0;
  for (const [originsKey, count] of Object.entries(multi_origins)) {
    if (count > 1) {
      const many_to_many_node = `${MANY_TO_MANY_NODE_LABEL}-${index++}`;
      const origins = JSON.parse(originsKey);
      const targets = node_origins_lookup[originsKey];
      for (const o of origins) {
        for (const t of Array.from(targets)) {
          edges = edges.filter((edge) => !(edge[0] === o && edge[1] === t));
          if (!edges.some((e) => e[0] === o && e[1] === many_to_many_node))
            edges.push([o, many_to_many_node]);
          if (!edges.some((e) => e[0] === many_to_many_node && e[1] === t))
            edges.push([many_to_many_node, t]);
        }
      }
    }
  }
  return edges;
}
const TopologyComponent = () => {
  const [topo, setTopo] = useState("{}");
  const config = useApi(configApiRef);
  const baseUrl = config.getString("backend.baseUrl");
  useEffect(() => {
    fetch(baseUrl + "/api/plugin-progressive-delivery-backend/topo").then((response) => {
      return response.text();
    }).then((data) => {
      return setTopo(data);
    });
  }, []);
  const name = useEntity().entity.metadata.name.toLowerCase();
  if (topo !== "{}") {
    try {
      var rawData = JSON.parse(topo);
    } catch {
      return /* @__PURE__ */ React.createElement(InfoCard, { title: "Progressive Delivery Topology" }, "Error parsing json");
    }
    let rawEdges = rawData.edges.filter(([f, t]) => {
      const from = JSON.parse(f);
      const to = JSON.parse(t);
      return from.app.toLowerCase() === name.toLowerCase() || to.app.toLowerCase() === name.toLowerCase();
    });
    rawEdges = simplifyManyToMany(rawEdges);
    const uniqueNodeSet = /* @__PURE__ */ new Set();
    rawEdges.forEach(([f, t]) => {
      uniqueNodeSet.add(f);
      uniqueNodeSet.add(t);
    });
    const nodes = Array.from(uniqueNodeSet).map((n) => ({ id: n }));
    const edges = rawEdges.map(([f, t]) => ({ from: f, to: t }));
    return /* @__PURE__ */ React.createElement(InfoCard, { title: "Progressive Delivery Topology" }, /* @__PURE__ */ React.createElement(
      DependencyGraph,
      {
        nodes,
        edges,
        showArrowHeads: true,
        renderNode: CustomNodeRenderer,
        fit: "contain",
        direction: DependencyGraphTypes.Direction.LEFT_RIGHT
      }
    ));
  } else {
    return /* @__PURE__ */ React.createElement(InfoCard, { title: "Progressive Delivery Topology" }, "Processing ...");
  }
};
function CustomNodeRenderer({ node: { id } }) {
  var _a;
  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);
  const idRef = React.useRef(null);
  React.useLayoutEffect(() => {
    if (idRef.current) {
      let { height: renderedHeight, width: renderedWidth } = idRef.current.getBBox();
      renderedHeight = Math.round(renderedHeight);
      renderedWidth = Math.round(renderedWidth);
      if (renderedHeight !== height || renderedWidth !== width) {
        setWidth(renderedWidth);
        setHeight(renderedHeight);
      }
    }
  }, [width, height]);
  const padding = 10;
  const paddedWidth = width + padding * 2;
  const paddedHeight = height + padding * 2;
  if (id.match(new RegExp(`^${MANY_TO_MANY_NODE_LABEL}-\\d+$`))) {
    const classes2 = useStyles({ isTest: false });
    return /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement(
      "rect",
      {
        className: classes2.node,
        width: paddedWidth,
        height: paddedHeight,
        rx: 10
      }
    ), /* @__PURE__ */ React.createElement(
      "text",
      {
        ref: idRef,
        className: classes2.text,
        y: paddedHeight / 2,
        x: paddedWidth / 2,
        textAnchor: "middle",
        alignmentBaseline: "middle"
      },
      MANY_TO_MANY_NODE_LABEL
    ));
  }
  const node = JSON.parse(id);
  let sha = "none";
  if (node.commit_sha) {
    sha = node.commit_sha.length >= 32 ? (_a = node.commit_sha) == null ? void 0 : _a.substring(0, 7) : node.commit_sha;
  }
  let dep = node.deployment_state == "success" ? "\u2705" : "\u274C";
  const num_of_bolds = 1;
  let label = [
    `${node.resourceTemplate}/${node.target}`,
    `on ${node.cluster}/${node.namespace} (${node.saas})`,
    `${sha} ${dep}`
  ];
  let tspans = label.map((l, i) => {
    return /* @__PURE__ */ React.createElement(
      "tspan",
      {
        x: paddedWidth / 2,
        y: (i + 1) * 2 * padding,
        fontWeight: i < num_of_bolds ? "bold" : "normal"
      },
      l
    );
  });
  const classes = useStyles({ isTest: node.isTest });
  return /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement(
    "rect",
    {
      className: classes.node,
      width: paddedWidth,
      height: paddedHeight,
      rx: 10
    }
  ), /* @__PURE__ */ React.createElement(
    "text",
    {
      ref: idRef,
      className: classes.text,
      y: paddedHeight / 2,
      x: paddedWidth * 2,
      textAnchor: "middle",
      alignmentBaseline: "middle"
    },
    tspans
  ), ")");
}
const useStyles = makeStyles(
  (theme) => ({
    node: {
      fill: (props) => {
        let isTest = extractBool(props);
        if (isTest) {
          return "#FFF3D1";
        } else {
          return "#DCE8FA";
        }
      },
      stroke: (props) => {
        let isTest = extractBool(props);
        if (isTest) {
          return "#FFE59E";
        } else {
          return "#9BB3D6";
        }
      }
    },
    edge: {
      strokeWidth: 2
    },
    path: {
      strokeWidth: 2
    },
    text: {
      fill: () => {
        if (theme.palette.type === "light") {
          return "black";
        } else {
          return theme.palette.primary.contrastText;
        }
      }
    }
  }),
  { name: "BackstageDependencyGraphDefaultNode" }
);
function extractBool(props) {
  if (props.isTest) {
    return true;
  } else {
    return false;
  }
}

export { TopologyComponent };
//# sourceMappingURL=index-cebebe69.esm.js.map
