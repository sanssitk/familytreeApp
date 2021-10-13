import db, { storage } from "../Provider/firebase";

const dbRef = db.ref("relatives");

// Firebase Database
const getFbKey = (id, callback) => {
  dbRef
    .orderByChild("id")
    .equalTo(id)
    .on("value", (snapshot) => {
      if (snapshot.val()) {
        const fbKey = Object.keys(snapshot.val())[0];
        callback(fbKey);
      }
    });
};

const keyValue = (fbKey) => {
  return db.ref(`relatives/${fbKey}`);
};

const readDB = (uid, callback) => {
  dbRef
    .orderByChild("uid")
    .equalTo(uid)
    .once("value", (snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((datas) => {
          callback(datas.val());
        });
      } else {
        callback(null);
      }
    });
};

const addDB = (data) => {
  dbRef.push(data, (err) => {
    if (err) {
      throw new Error("Not able to add at this time, Try Again");
    } else {
      alert("Successfully added");
    }
  });
};

const updateRel = (id, body) => {
  const { title, value } = body;
  if (title.length > 2 && title !== "father" && title !== "mother") {
    const titleRef = title.toLowerCase();
    dbRef
      .orderByChild("id")
      .equalTo(id)
      .once("value", (snapshot) => {
        snapshot.forEach((datas) => {
          if (datas.hasChild(`rels/${titleRef}`)) {
            datas.forEach((items) => {
              const oldData = items.child(titleRef);
              oldData.ref.update([...oldData.val(), value[0]], (error) => {
                if (error) {
                  alert("Fail to Add");
                } else {
                  alert("Successfully Added!!");
                }
              });
            });
          } else {
            datas.child("rels").ref.update({ [titleRef]: [value] });
          }
        });
      });
  } else {
    if (title.length === 2) {
      // login for adding parents data
      const titleRef = "spouses";
      dbRef
        .orderByChild("id")
        .equalTo(id)
        .once("value", (snapshot) => {
          snapshot.forEach((datas) => {
            if (datas.hasChild(`rels/${titleRef}`)) {
              datas.forEach((items) => {
                const oldData = items.child(titleRef);
                oldData.ref.update([...oldData.val(), value[0]], (error) => {
                  if (error) {
                    alert("Fail to Add");
                  } else {
                    alert("Successfully Added!!");
                  }
                });
              });
            } else {
              datas.child("rels").ref.update({ [titleRef]: value });
            }
          });
        });
    } else {
      // login for adding in own data as parents
      const titleRef = title.toLowerCase();
      dbRef
        .orderByChild("id")
        .equalTo(id)
        .once("value", (snapshot) => {
          snapshot.forEach((datas) => {
            datas.child("rels").ref.update({ [titleRef]: value });
          });
        });
    }
  }
};

const updateData = (uid, body) => {
  const { title, value } = body;
  dbRef
    .orderByChild("uid")
    .equalTo(uid)
    .on("value", (snapshot) => {
      const data = snapshot.val();
      const key = Object.keys(data)[0];
      dbRef
        .child(key)
        .child("data")
        .update({ [title]: value }, (error) => {
          if (error) {
            alert("Not able to upload at this time. Try again!!!");
          } else {
            alert("Successfully updated!!!!");
          }
        });
    });
};

const _deleteDB = (key) => {
  dbRef.child(key).remove();
};

// Firebase Storage
const read = () => {
  // storage.ref.ge
  // storage.ref.getDownloadURL();
};

const add = (id, url, getImageUrl) => {
  const uploadPic = storage.ref(`images/${id}.jpg`).put(url);
  uploadPic.on(
    "stage_changed",
    (snapshot) => {},
    (err) => console.log(err),
    () => getUrl(id, getImageUrl)
  );
};

const getUrl = (id, getImageUrl) => {
  storage
    .ref(`images/${id}.jpg`)
    .getDownloadURL()
    .then((url) => getImageUrl(url));
};

const _delete = (key) => {
  storage.ref("images/");
};

export const dbServices = {
  readDB,
  addDB,
  getFbKey,
  updateData,
  updateRel,
  keyValue,
  delete: _deleteDB,
};

export const storageServices = {
  read,
  add,
  getUrl,
  delete: _delete,
};
