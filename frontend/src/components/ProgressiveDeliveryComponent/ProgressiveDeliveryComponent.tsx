import React, { useCallback, useEffect, useRef, useState }  from 'react';
import { DependencyGraph, DependencyGraphTypes, InfoCard } from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import { makeStyles } from '@material-ui/core/styles';
import { configApiRef, fetchApiRef, useApi } from '@backstage/core-plugin-api';
import { NodeInfoComponent } from './NodeInfoComponent';

import { Entity } from '@backstage/catalog-model';

const MANY_TO_MANY_NODE_LABEL = "soak";

export interface SaasPromotionsData {
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
          const many_to_many_node = `${MANY_TO_MANY_NODE_LABEL}-${index++}`;
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
  const title: string = "Progressive Delivery Topology";

  const [topo, setTopo] = useState<SaasPromotionsData>({nodes: [], edges: []});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const config = useApi(configApiRef);
  const baseUrl = config.getString('backend.baseUrl');
  const fetchApi = useApi(fetchApiRef);

  const querySaasPromotionsData = () => {
    setIsLoading(true);
    setError(false);
    fetchApi.fetch(`${baseUrl}/api/proxy/inscope-resources/resources/configmap/saas-promotions/saas-promotions.json`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      },
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok ${response.statusText}`);
        }

        return response.text();
    }).then(data => {
        var rawData: SaasPromotionsData = JSON.parse(data);
        setTopo(rawData);
        setIsLoading(false)
    }).catch((_error) => {
        setError(true)
        setIsLoading(false)
    });
  }

  useEffect(() => {
    querySaasPromotionsData();
  }, [])

  const [clickedNodeId, setClickedNodeId] = useState<string | undefined>(undefined);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | undefined>(undefined);

  const handleNodeClick = useCallback((nodeEntity: Entity, node: Node) => {
    setClickedNodeId(nodeEntity.metadata.uid);
    setSelectedNode(node);
    setIsPopupOpen(true);
  }, []);

  const handleClose = () => {
    setIsPopupOpen(false);
  };

  const entity = useEntity().entity;

  const [nodes, setNodes] = useState<DependencyGraphTypes.DependencyNode[]>({});
  const [edges, setEdges] = useState<DependencyGraphTypes.DependencyEdge[]>({});

  const populateNodesEdges = () => {
    let name = entity.metadata.name.toLowerCase();
    if (entity.spec && entity.spec.system) {
      name = entity.spec.system.toString()
    }

    let rawEdges = topo.edges.filter(([f,t]) =>{
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

    setNodes(Array.from(uniqueNodeSet).map((n: string) => ({ id: n})))
    setEdges(rawEdges.map(([f,t]) => ({from: f, to: t})))
  }

  const CustomNodeRenderer = useCallback(({ node: { id } }: DependencyGraphTypes.RenderNodeProps) => {
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

    if (id.match(new RegExp(`^${MANY_TO_MANY_NODE_LABEL}-\\d+$`))) {
      const classes = useStyles(node.deployment_state);
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
            x={paddedWidth / 2}
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {MANY_TO_MANY_NODE_LABEL}
          </text>
        </g>
      );
    }

    const node: Node = JSON.parse(id);

    let sha: string = "none";
    if (node.commit_sha) {
      sha = node.commit_sha.length >= 32? node.commit_sha?.substring(0,7) : node.commit_sha!;
    }

    var dep = "";
    switch (node.deployment_state) {
      case  "success":
        dep = '✅'
          break;
      case "failed":
        dep = '❌'
          break;
    }
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

    const classes = useStyles({ deployment_state: node.deployment_state });
    const nodeRef = useRef();

    return (
      <g id="node">
        <rect
          className={classes.node}
          width={paddedWidth}
          height={paddedHeight}
          rx={10}
          ref={nodeRef}
          onClick={() => handleNodeClick(entity, node)}
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
        </text>
      </g>
    );
  }, [clickedNodeId, handleNodeClick],)
  


  useEffect(() => {
    populateNodesEdges();
  }, [topo]);
     
  if (isLoading) {
    return (
      <InfoCard title="Progressive Delivery Topology">
        Processing ...
      </InfoCard>
    );
  }

  if (error) {
    return (
      <InfoCard title="Progressive Delivery Topology">
        There was an error
      </InfoCard>
    );
  }

  if (nodes.length !== 0 && edges.length !== 0) {
    return (
      <InfoCard title="Progressive Delivery Topology">
        <NodeInfoComponent nodeData={selectedNode} isPopupOpen={isPopupOpen} handleClose={handleClose} />
        <DependencyGraph
          nodes={nodes}
          edges={edges}
          showArrowHeads={true}
          renderNode={CustomNodeRenderer}
          direction={DependencyGraphTypes.Direction.LEFT_RIGHT}/>
      </InfoCard>
    );
  }
}

const getNodeColorFromState = (props: any) => {
  if (props.deployment_state === "failed") return '#C41E3A';

  return '#DCE8FA';
}

const DEFAULT_COLOR = "#DCE8FA";

const colors = {
  failed: "#C41E3A",
};

const useStyles = makeStyles(
  theme => ({
    node: {
      fill: (props) => colors[props.deployment_state] || DEFAULT_COLOR,
      stroke: (props) => colors[props.deployment_state] || DEFAULT_COLOR
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

