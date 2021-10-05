import React, { useEffect, useState } from "react";
import db from "../../Provider/firebase";

const FindList = () => {
  const [allMembers, setAllMembers] = useState([]);
  useEffect(() => {
    db.ref("relatives")
      .get()
      .then((datas) => {
        let memCol = [];
        datas.forEach((data) => {
          memCol.push(data.val());
        });
        setAllMembers(memCol);
      });
  }, []);

  return (
    <div className="memberCollection">
      {allMembers.map((d, i) => (
        <p key={i}>{d.data.firstName}</p>
      ))}
    </div>
  );
};

export default FindList;
