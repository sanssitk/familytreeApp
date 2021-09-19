import db from "../../Provider/firebase";
import { v4 as uuidv4 } from "uuid";

const memberRef = db.ref("relatives");

const refId = uuidv4();

const addFB = (id, rels, data) => {
  // shresthaDB.push(data);
};

const updateFB = (uid) => {
  db.ref(`relatives/${uid}`).update({
    rels: { father: "1", mother: "2", spouces: "", children: "" },
  });
};
const deleteFB = (data) => {};

export function getCurrentNode(id) {
  let uid;
  memberRef
    .orderByChild("id")
    .equalTo(id)
    .on("value", (snapshot) => {
      const data = snapshot.val();
      uid = Object.keys(data)[0];
    });
  updateFB(uid);
}

// return memberRef
//     .orderByChild("rels/father")
//     .equalTo("7")
//     .on("value", (snapshot) =>
//       snapshot.forEach((data) => console.log(data.val()))
//     );

// memberRef
//     .orderByChild("id")
//     .equalTo(id)
//     .once("value")
//     .then((snapshot) =>
//       snapshot.forEach((data) => {
//         if (rels == "father") {
//           console.log(refId, "father");
//           // data.val().rels.father = refId;
//         } else if (rels == "mother") {
//           console.log(refId, "mother");
//           // data.val().rels.mother = refId;
//         } else if (rels == "children") {
//           if (data.val().rels.children == "" || undefined || null) {
//             console.log(refId, "children");
//             // data.val().rels.children = [refId];
//           } else {
//             console.log(refId, "children");
//             // data.val().rels.children.append(refId);
//           }
//         } else if (rels == "spouses") {
//           if (data.val().rels.spouses == "" || undefined || null) {
//             data.val().rels.spouses = [data.id];
//           } else {
//             data.val().rels.spouses.append(refId);
//           }
//         } else if (rels == "brother") {
//           if (data.val().rels.brother == "" || undefined || null) {
//             data.val().rels.brother = [refId];
//           } else {
//             data.val().rels.brother.append(refId);
//           }
//         } else if (rels == "sister") {
//           if (data.val().rels.sister == "" || undefined || null) {
//             data.val().rels.sister = [refId];
//           } else {
//             data.val().rels.sister.append(refId);
//           }
//         }
//       })
//     )
//     .then(addFB(refId, rels, data))
//     .catch((err) => console.log(err));
