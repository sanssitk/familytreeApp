import React, { useEffect, useState } from "react";
import f3 from "family-chart";
import data from "./data.json";
import "./familyChart.css";
import { useStateValue } from "../../StateManagement/StateProvider";

const FamilyChart = (treeProps) => {
  const [ref, setRef] = useState();
  const [store, setStore] = useState();
  const [id, setId] = useState();
  const [, dispatch] = useStateValue();

  useEffect(() => {
    if (!ref) return;
    if (!store) {
      const store = f3.createStore({
          data: data,
          cont: ref,
          card_display: [
            (d) => `${d.data.firstName} ${d.data.lastName}` || "",
            (d) => `Phone: ${d.data.phoneNumber}` || "",
            (d) => `${d.data.birthDate} - ${d.data.deathDate}` || "",
          ],
          mini_tree: treeProps.minified,
          hide_rels: false,
          node_separation: 300,
          level_separation: 150,
          card_dim: {
            w: 200,
            h: 65,
            text_x: 65,
            text_y: 15,
            img_w: 55,
            img_h: 55,
            img_x: 5,
            img_y: 5,
          },
        }),
        view = f3.d3AnimationView(store);
      setStore(store);
      store.setOnUpdate((props) =>
        view.update({ tree: store.state.tree, ...(props || {}) })
      );
      store.update.tree();
    } else {
      return store;
    }
    document.querySelector(".main_svg").lastElementChild.remove();
  }, [ref, treeProps]);

  if (store) {
    store.state.cont
      .querySelector(".main_svg")
      .addEventListener("click", (e) => {
        const node = e.target;
        if (node.closest(".card_family_tree")) return;
        if (node.closest(".card_break_link")) return;
        if (!node.closest(".card")) return;
        const card = node.closest(".card");
        const id = card.getAttribute("data-id");
        setId(id);
        dispatch({
          type: "NODE_ID",
          nodeId: id,
        });
      });
  }

  return <div className="family-chart" ref={(e) => setRef(e)}></div>;
};

export default FamilyChart;
