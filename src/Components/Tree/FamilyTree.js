import React from "react";
import Tree from "react-d3-tree";
import Node from "./Node";
import { useCenteredTree } from "./helpers";

const orgChart = {
  name: "Hari Shrestha",
  phone: "n/a",
  DOB: 1985,
  children: [
    {
      name: "Man Shrestha",
      attributes: {
        department: "Production",
      },
      children: [
        {
          name: "Ganga Shrestha",
          attributes: {
            department: "Fabrication",
          },
          children: [
            {
              name: "Worker",
            },
          ],
        },
        {
          name: "Dev Shrestha",
          attributes: {
            department: "Assembly",
          },
          children: [
            {
              name: "Worker",
            },
          ],
        },
      ],
    },
  ],
};

const containerStyles = {
  width: "100vw",
  height: "100vh",
};

const FamilyTree = () => {
  const [translate, containerRef] = useCenteredTree();
  const nodeSize = { x: 250, y: 110 };
  const foreignObjectProps = {
    width: nodeSize.x,
    height: nodeSize.y,
    x: -125,
    y: -10,
  };
  const renderForeignObjectNode = ({
    nodeDatum,
    toggleNode,
    foreignObjectProps,
  }) => (
    <g>
      {/* `foreignObject` requires width & height to be explicitly set. */}
      <foreignObject {...foreignObjectProps} onClick={toggleNode}>
        <Node nodeDatum={nodeDatum.name} child={nodeDatum.children} />
      </foreignObject>
    </g>
  );
  return (
    <div className="familytree" style={containerStyles} ref={containerRef}>
      <Tree
        data={orgChart}
        translate={translate}
        renderCustomNodeElement={(rd3tProps) =>
          renderForeignObjectNode({ ...rd3tProps, foreignObjectProps })
        }
        orientation="vertical"
        pathFunc="step"
        nodeSize={nodeSize}
        separation={{ siblings: 1.5 }}
        Transition
        Duration="300"
        enableLegacyTransitions
      />
    </div>
  );
};

export default FamilyTree;
