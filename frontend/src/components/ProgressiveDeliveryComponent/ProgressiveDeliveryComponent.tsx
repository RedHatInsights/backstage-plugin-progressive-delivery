import React, { useEffect, useState }  from 'react';
import { DependencyGraph, DependencyGraphTypes, InfoCard } from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import { makeStyles } from '@material-ui/core/styles';
import { configApiRef, useApi } from '@backstage/core-plugin-api';

interface SaasPromotionsData {
    nodes: string[];
    edges: [string, string][];
}

interface Node {
    app: string;
    saas: string;
    resourceTemplate: string;
    target: string | undefined;
    cluster: string | undefined;
    namespace: string | undefined;
    isTest: boolean;
    commit_sha: string | undefined;
    deployment_state: "success" | "missing" | "failed" | undefined;
}

function simplifyManyToMany(edges: [string, string][]): [string, string][] {
  let node_origins: { [key: string]: Set<string> } = {};

  for (const [o, t] of edges) {
    if (!(t in node_origins)) {
      node_origins[t] = new Set();
    }
    node_origins[t].add(o);
}

  let node_origins_lookup: { [key: string]: Set<string> } = {};
  for (const [k, v] of Object.entries(node_origins)) {
      const key = JSON.stringify(Array.from(v));
      if (!(key in node_origins_lookup)) {
          node_origins_lookup[key] = new Set();
      }
      node_origins_lookup[key].add(k);
  }

  let multi_origins: { [key: string]: number } = {};
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
          const many_to_many_node = `soak-${index++}`;
          const origins = JSON.parse(originsKey) as string[];
          const targets = node_origins_lookup[originsKey];
          for (const o of origins) {
              for (const t of Array.from(targets)) {
                  edges = edges.filter(edge => !(edge[0] === o && edge[1] === t));

                  if (!edges.some(e => e[0] === o && e[1] === many_to_many_node))
                    edges.push([o, many_to_many_node]);

                  if (!edges.some(e => e[0] === many_to_many_node && e[1] === t))
                    edges.push([many_to_many_node, t]);
              }
          }
      }
  }

  return edges;
}


export const TopologyComponent = () => {
  const [topo, setTopo] = useState("{}");
  const config = useApi(configApiRef);
  const baseUrl = config.getString('backend.baseUrl');

  useEffect(() => {
    fetch(baseUrl + "/api/plugin-progressive-delivery-backend/topo")
      .then(response => {
        return response.text();
      })
      .then(data => {
        return setTopo(data);
      })
  }, [])

  const name = useEntity().entity.metadata.name.toLowerCase();

  if (topo !== "{}") {
    try {
      var rawData: SaasPromotionsData = JSON.parse(topo);
    } catch {
      return (
      <InfoCard title="Progressive Delivery Topology">
        Error parsing json
      </InfoCard>);
    }

    let rawEdges = rawData.edges.filter(([f, t])=>{
      const from = JSON.parse(f);
      const to = JSON.parse(t);
      return from.app.toLowerCase() === name.toLowerCase() || to.app.toLowerCase() === name.toLowerCase();
    });

    rawEdges = simplifyManyToMany(rawEdges);

    const uniqueNodeSet = new Set<string>();
    rawEdges.forEach(([f, t]) => {
      uniqueNodeSet.add(f);
      uniqueNodeSet.add(t);
    });
    rawData.nodes.map((n) => JSON.parse(n))
      .filter((n: Node) => n.app.toLowerCase() == name.toLowerCase())
      .forEach((n: Node) => uniqueNodeSet.add(JSON.stringify(n)));

    const nodes: DependencyGraphTypes.DependencyNode[] = Array.from(uniqueNodeSet).map((n: string) => ({ id: n}));

    const edges: DependencyGraphTypes.DependencyEdge[] = rawEdges.map(([f,t]) => ({from: f, to: t}));

    return (
      <InfoCard title="Progressive Delivery Topology">
        <DependencyGraph
          nodes={nodes}
          edges={edges}
          showArrowHeads={true}
          renderNode={CustomNodeRenderer}
          direction={DependencyGraphTypes.Direction.LEFT_RIGHT}/>
      </InfoCard>
    );
  } else {
    return (
      <InfoCard title="Progressive Delivery Topology">
        Processing ...
      </InfoCard>
    );
  }
}

function CustomNodeRenderer({ node: { id } }: DependencyGraphTypes.RenderNodeProps) {
  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);
  const idRef = React.useRef<SVGTextElement | null>(null);

  React.useLayoutEffect(() => {
    // set the width to the length of the ID
    if (idRef.current) {
      let { height: renderedHeight, width: renderedWidth } =
        idRef.current.getBBox();
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

  let node: Node;
  try {
    node = JSON.parse(id);
  } catch {
    console.warn("Parse error: ", id);
    console.warn("Assuming this is soak...");

    const classes = useStyles({ isTest: false });


    return (<g>
      <rect 
        className={classes.node} 
        width={paddedWidth}
        height={paddedHeight}
        rx={10}
      />
      <text
        ref={idRef}
        className={classes.text}
        y={paddedHeight / 2}
        x={paddedWidth / 2}
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {id}
      </text>
    </g>);
  }

  let sha: string = "none";
  if (node.commit_sha) {
    sha = node.commit_sha.length >= 32? node.commit_sha?.substring(0,7) : node.commit_sha!;
  }
  let dep: string = node.deployment_state == "success" ? '✅' : '❌';
  const num_of_bolds: number = 1;
  let label: string[] = [
    `${node.resourceTemplate}/${node.target}`,
    `on ${node.cluster}/${node.namespace} (${node.saas})`,
    `${sha} ${dep}`,
  ];
  let tspans = label.map((l, i) => {
    return (
      <tspan
        x={paddedWidth / 2}

        // We can't use paddedHeight because we'll recalculate the height while
        // adding to the height, which causes an infinite loop.
        y={(i+1) * 2 * padding}
        fontWeight={i < num_of_bolds ? "bold" : "normal"}
      >
        {l}
      </tspan>);
  });

  const classes = useStyles({ isTest: node.isTest });
  return (
    <g>
      <rect
        className={classes.node}
        width={paddedWidth}
        height={paddedHeight}
        rx={10}
      />
      <text
        ref={idRef}
        className={classes.text}
        y={paddedHeight / 2}
        x={paddedWidth * 2}
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {tspans}
      </text>)
    </g>
  );
}

const useStyles = makeStyles(
  theme => ({
    node: {
      fill: (props) => {
        let isTest = extractBool(props)
        if (isTest) {
            return '#FFF3D1';
        } else {
            return '#DCE8FA';
        }
      },
      stroke: (props) => {
          let isTest = extractBool(props)
          if (isTest) {
              return '#FFE59E';
          } else {
              return '#9BB3D6';
          }
      },
    },
    edge: {
      strokeWidth: 2,
    },
    path: {
      strokeWidth: 2,
    },
    text: {
      fill: () => {
        if (theme.palette.type === "light" ) {
          return 'black';
        } else {
          return theme.palette.primary.contrastText;
        }
      },
    },
  }),
  { name: 'BackstageDependencyGraphDefaultNode' },
);

function extractBool(props: { isTest?: boolean; }) {
    if (props.isTest) {
        return true;
    } else {
        return false;
    }
}
