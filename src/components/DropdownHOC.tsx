import React, { useState } from "react";
import DropdownTreeSelect, { TreeNode } from "react-dropdown-tree-select";


interface Props {
  // value?: TreeNode[];
}
const result = [
  {
    "label": "VP Accounting",
    "children": [
      {
        "label": "iWay",
        "children": [
          {
            "label": "Universidad de Especialidades del Espíritu Santo"
          },
          {
            "label": "Marmara University"
          },
          {
            "label": "Baghdad College of Pharmacy"
          }
        ]
      },
      {
        "label": "KDB",
        "children": [
          {
            "label": "Latvian University of Agriculture"
          },
          {
            "label": "Dublin Institute of Technology"
          }
        ]
      },
      {
        "label": "Justice",
        "children": [
          {
            "label": "Baylor University"
          },
          {
            "label": "Massachusetts College of Art"
          },
          {
            "label": "Universidad Técnica Latinoamericana"
          },
          {
            "label": "Saint Louis College"
          },
          {
            "label": "Scott Christian University"
          }
        ]
      },
      {
        "label": "Utilization Review",
        "children": [
          {
            "label": "University of Minnesota - Twin Cities Campus"
          },
          {
            "label": "Moldova State Agricultural University"
          },
          {
            "label": "Andrews University"
          },
          {
            "label": "Usmanu Danfodiyo University Sokoto"
          }
        ]
      },
      {
        "label": "Norton Utilities",
        "children": [
          {
            "label": "Universidad Autónoma del Caribe"
          },
          {
            "label": "National University of Uzbekistan"
          },
          {
            "label": "Ladoke Akintola University of Technology"
          },
          {
            "label": "Kohat University of Science and Technology  (KUST)"
          },
          {
            "label": "Hvanneyri Agricultural University"
          }
        ]
      }
    ]
  },
  {
    "label": "Database Administrator III",
    "children": [
      {
        "label": "TFS",
        "children": [
          {
            "label": "University of Jazeera"
          },
          {
            "label": "Technical University of Crete"
          },
          {
            "label":
              "Ecole Nationale Supérieure d'Agronomie et des Industries Alimentaires"
          },
          {
            "label": "Ho Chi Minh City University of Natural Sciences"
          }
        ]
      },
      {
        "label": "Overhaul",
        "children": [
          {
            "label": "Technological University (Taunggyi)"
          },
          {
            "label": "Universidad de Las Palmas de Gran Canaria"
          },
          {
            "label": "Olympia College"
          },
          {
            "label": "Franklin and Marshall College"
          },
          {
            "label":
              "State University of New York College of Environmental Science and Forestry"
          }
        ]
      },
      {
        "label": "GTK",
        "children": [
          {
            "label": "Salisbury State University"
          },
          {
            "label":
              "Evangelische Fachhochschule für Religionspädagogik, und Gemeindediakonie Moritzburg"
          },
          {
            "label": "Kilimanjaro Christian Medical College"
          }
        ]
      },
      {
        "label": "SRP",
        "children": [
          {
            "label": "Toyo Gakuen University"
          },
          {
            "label": "Riyadh College of Dentistry and Pharmacy"
          },
          {
            "label": "Aichi Gakusen University"
          }
        ]
      }
    ]
  },
  {
    "label": "Assistant Manager",
    "children": [
      {
        "label": "Risk Analysis",
        "children": [
          {
            "label": "Seijo University"
          },
          {
            "label": "University of Economics Varna"
          },
          {
            "label": "College of Technology at Riyadh"
          }
        ]
      },
      {
        "label": "UV Mapping",
        "children": [
          {
            "label": "Universidad de La Sabana"
          },
          {
            "label": "Pamukkale University"
          }
        ]
      }
    ]
  }
]

const HOC: React.FC<Props> = () => {
  const prepareData = (data: TreeNode[]): TreeNode[] => {
    // optional: you can skip cloning if you don't mind mutating original data
    const cloned = [...data];

    // insert special select all node
    cloned.splice(0, 0, {
      label: "Select All",
      value: "selectAll",
      className: "select-all",
    });

    return cloned;
  };

  const [treeData, setTreeData] = useState<TreeNode[]>([]);



  const toggleAll = (checked: boolean) => {
    const updatedData = [...treeData];
    for (let i = 1; i < updatedData.length; i++) {
      updatedData[i].checked = checked;
    }
    setTreeData(updatedData);
  };

  const handleChange = ({ value, checked }: { value: string; checked: boolean }) => {
    if (value === "selectAll") toggleAll(checked);
  };

  return (
    <div>
      <DropdownTreeSelect
        data={treeData}
        // onChange={handleChange}
      />
    </div>
  );
};

export default HOC;
