import React, { useEffect, useState } from "react";
import "./LeftSidebar.css";
import { firestore } from "../../../Provider/firebase";
import Events from "./Events";
import Rules from "./Rules";
import { Card } from "semantic-ui-react";

function LeftSideBar() {
  const [eventDatas, setEventDatas] = useState([]);
  const [rules, setRules] = useState([]);

  useEffect(() => {
    firestore
      .collection("events")
      .onSnapshot((snapshot) =>
        setEventDatas(snapshot.docs.map((doc) => doc.data()))
      );
  }, []);
  useEffect(() => {
    firestore
      .collection("rules")
      .onSnapshot((snapshot) =>
        setRules(snapshot.docs.map((doc) => doc.data()))
      );
  }, []);

  // console.log(rules[0].Birthday);
  console.log();

  if (!eventDatas || !rules) return <div>Loading...</div>;

  return (
    <div className="leftsideBar">
      <h1>Events</h1>
      <Card.Group>
        {eventDatas.map((eventData, index) => (
          <Events key={index} eventData={eventData} />
        ))}
      </Card.Group>
      <h1>Birthday</h1>
      {rules.map((rule) =>
        rule.Birthday.map((data, i) => <Rules key={i} rule={data} />)
      )}
      <h1>Birthday</h1>
      {rules.map((rule) =>
        rule.Birthday.map((data, i) => <Rules key={i} rule={data} />)
      )}
    </div>
  );
}

export default LeftSideBar;
