import React, { useState, useEffect } from 'react';
import { InfoCard, DependencyGraph, DependencyGraphTypes } from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import { makeStyles } from '@material-ui/core/styles';

const TopologyComponent = () => {
  const [topo, setTopo] = useState("{}");
  useEffect(() => {
    fetch("http://localhost:7007/api/progressive-delivery/topo").then((response) => {
      console.log(response);
      return response.text();
    }).then((data) => {
      console.log(data);
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
    const edges = rawData.edges.map(([f, t]) => ({
      from: JSON.parse(f),
      to: JSON.parse(t)
    })).filter(({ from, to }) => from.app.toLowerCase() === name.toLowerCase() || to.app.toLowerCase() === name.toLowerCase()).map(
      ({ from, to }) => ({ from: JSON.stringify(from), to: JSON.stringify(to) })
    );
    let nodes = rawData.nodes.map((node) => JSON.parse(node)).filter((n) => n.app.toLowerCase() == name.toLowerCase()).map((n) => ({ id: JSON.stringify(n) }));
    edges.forEach((e) => {
      nodes.push({ id: e.from });
      nodes.push({ id: e.to });
    });
    return /* @__PURE__ */ React.createElement(InfoCard, { title: "Progressive Delivery Topology" }, /* @__PURE__ */ React.createElement(
      DependencyGraph,
      {
        nodes,
        edges,
        showArrowHeads: true,
        renderNode: CustomNodeRenderer,
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
  let node = JSON.parse(id);
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
//# sourceMappingURL=index-4e53575e.esm.js.map
