import React, { useEffect, useState } from "react";
import f3 from "family-chart";
import "./familyChart.css";
import { useStateValue } from "../../StateManagement/StateProvider";

const FamilyChart = (treeProps) => {
  const [ref, setRef] = useState();
  const [store, setStore] = useState();
  const [id, setId] = useState();
  const [{ members }, dispatch] = useStateValue();
  // const [nodeClicked, setNodeClicked] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch({
        type: "NODE_ID",
        nodeId: id,
      });
    } else {
      dispatch({
        type: "NODE_ID",
        nodeId: null,
      });
    }
  }, [id]);

  console.log(f3);

  useEffect(() => {
    if (!ref) return;
    if (!store) {
      const store = f3.createStore({
          data: treeProps.members,
          cont: ref,
          card_display: [
            (d) => `${d.data.firstName} ${d.data.lastName}` || "",
            (d) => `Phone: ${d.data.phoneNumber}` || "Death",
            (d) => `${d.data.birthDate} - ${d.data.deathDate}` || "",
          ],
          mini_tree: treeProps.minified,
          hide_rels: false,
          node_separation: 240,
          level_separation: 120,
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
  }, [ref, treeProps, members]);

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
        // setNodeClicked(!nodeClicked);
      });
  }

  return treeProps.members.length > 0 ? (
    <div className="family-chart" ref={(e) => setRef(e)}></div>
  ) : (
    <div className="family-chart">
      <h2
        className="ui header white"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "white",
        }}
      >
        <i className="settings icon large" style={{ margin: "24px auto" }}></i>
        <div
          className="content"
          style={{ textAlign: "center", lineHeight: "40px" }}
        >
          Welcome! Welcome!!! <br />
          First Add Your self and then you can start adding your family members
        </div>
      </h2>
    </div>
  );
};

export default FamilyChart;
