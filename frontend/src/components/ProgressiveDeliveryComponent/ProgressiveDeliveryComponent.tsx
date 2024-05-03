import React, { useEffect, useState } from 'react';
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

interface Edge {
    from: Node;
    to: Node;
}

export const TopologyComponent = () => {
  const [topo, setTopo] = useState("{}");
  const config = useApi(configApiRef);
  const baseUrl = config.getString('backend.baseUrl');
  
  useEffect(() => {
    fetch(baseUrl + "/api/progressive-delivery/topo")
      .then(response => {
        console.log(response);
        return response.text();
      })
      .then(data => {
        console.log(data);
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

    const edges: DependencyGraphTypes.DependencyEdge[] = rawData.edges.map(([f, t]) => ({
      from: JSON.parse(f),
      to: JSON.parse(t)
    }))   
    .filter(({from, to}: Edge) => from.app.toLowerCase() === name.toLowerCase() || to.app.toLowerCase() === name.toLowerCase())
    .map(({from, to}: Edge) => (
      {from: JSON.stringify(from), to: JSON.stringify(to)})
    );

    let nodes: DependencyGraphTypes.DependencyNode[] = rawData.nodes.map(node => JSON.parse(node))
    .filter((n: Node) => n.app.toLowerCase() == name.toLowerCase())
    .map((n: Node) => ({id: JSON.stringify(n)}));

    edges.forEach((e: DependencyGraphTypes.DependencyEdge) => {
      nodes.push({id: e.from});
      nodes.push({id: e.to});
    });

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

  let node: Node = JSON.parse(id);
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
