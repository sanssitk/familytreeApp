import React from "react";
import { Card, Image } from "semantic-ui-react";

const Events = ({ eventData }) => {
  const { event, img, postBy, eventOn } = eventData;

  return (
    <Card className="events">
      <Card.Content>
        <Image floated="right" size="mini" src={img} />
        <Card.Header>{postBy}</Card.Header>
        <Card.Meta>{eventOn}</Card.Meta>
        <Card.Description>{event}</Card.Description>
      </Card.Content>
    </Card>
  );
};

export default Events;
