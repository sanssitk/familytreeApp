import React from "react";
import { Button, Card, Image } from "semantic-ui-react";

const Events = ({ eventData }) => {
  const { event, img, postBy, postOn } = eventData;

  // converting firebase timestamp (postOn) to js date
  const toDate = new Date(postOn.toDate());
  let year = toDate.getFullYear();
  let month = toDate.getMonth();
  let day = toDate.getDate();
  let dateString = `${day}/${month}/${year}`;

  return (
    <Card className="events">
      <Card.Content>
        <Image floated="right" size="mini" src={img} />
        <Card.Header>{postBy}</Card.Header>
        <Card.Meta>{dateString}</Card.Meta>
        <Card.Description>{event}</Card.Description>
      </Card.Content>
    </Card>
  );
};

export default Events;
