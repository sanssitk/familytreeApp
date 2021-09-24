import db, { storage } from "../Provider/firebase";
import { v4 as uuidv4 } from "uuid";

const dbRef = db.ref("relatives");

const refId = uuidv4();

// Firebase Database
const getFbKey = (uid, callback) => {
  dbRef
    .orderByChild("uid")
    .equalTo(uid)
    .on("value", (snapshot) => {
      const fbKey = Object.keys(snapshot.val())[0];
      callback(fbKey);
    });
};

const keyValue = (fbKey) => {
  return db.ref(`relatives/${fbKey}`);
};

const readDB = () => {
  return dbRef;
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

const updateRel = (uid, body) => {
  const { title, value } = body;
  dbRef
    .orderByChild("uid")
    .equalTo(uid)
    .on("value", (snapshot) => {
      const data = snapshot.val();
      const key = Object.keys(data)[0];
      dbRef
        .child(key)
        .child("rels")
        .update({ [title]: value }, (error) => {
          if (error) {
            return (
              <div class="ui warning message">
                <i class="close icon"></i>
                <div class="header">Fail to Add</div>
              </div>
            );
          } else {
            return (
              <div class="ui info message">
                <i class="close icon"></i>
                <div class="header">Successfully Added!!</div>
              </div>
            );
          }
        });
    });
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
            return (
              <div class="ui warning message">
                <i class="close icon"></i>
                <div class="header">
                  Not able to upload at this time. Try again!!!
                </div>
              </div>
            );
          } else {
            return (
              <div class="ui info message">
                <i class="close icon"></i>
                <div class="header">Successfully updated!!</div>
              </div>
            );
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
