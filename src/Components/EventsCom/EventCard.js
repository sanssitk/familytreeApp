import React, { useState, useEffect } from "react";
import { Card, Image } from "semantic-ui-react";
import { firestore } from "../../Provider/firebase";
import { fireStore } from "../../Services/firebaseServices";
import {
  Button,
  Icon,
  Header,
  Modal,
  Form,
  Input,
  TextArea,
} from "semantic-ui-react";

const EventCard = ({ uid }) => {
  const [eventDatas, setEventDatas] = useState([]);
  const [open, setOpen] = useState(false);
  const [dateSelected, setDateSelected] = useState();
  const [phNumber, setPhNumber] = useState();
  const [newaddress, setAddress] = useState();
  const [eventInfo, setEventInfo] = useState();
  const [activePost, setActivePost] = useState(false);

  useEffect(() => {
    firestore
      .collection("events")
      .orderBy("eventOn")
      .onSnapshot((snapshot) =>
        setEventDatas(snapshot.docs.map((doc) => doc.data()))
      );
  }, []);

  const eachCardsample = (eventDetails, index) => {
    const { event, img, postBy, eventOn, dataUid, tel, address, id } =
      eventDetails;

    const handlePostEdit = () => {
      setOpen(true);
    };

    const handleUpdatePost = () => {
      const callback = (res) => {
        if (res) {
          setOpen(false);
        }
      };
      phNumber && fireStore.updateFs(id, "tel", phNumber, callback);
      newaddress && fireStore.updateFs(id, "address", newaddress, callback);
      eventInfo && fireStore.updateFs(id, "event", eventInfo, callback);
      dateSelected && fireStore.updateFs(id, "eventOn", dateSelected, callback);
    };

    const handlePostDelete = (e) => {
      const clickedId = e.currentTarget.parentNode.id;
      fireStore.removeFS(clickedId);
    };
    return open ? (
      <Modal
        key={index}
        closeIcon
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      >
        <Header icon="edit" content="Update Events" />
        <Modal.Content>
          <Form widths="equal">
            <Form.Field
              control={Input}
              label="Date"
              placeholder={eventOn}
              type="date"
              required
              value={dateSelected ? dateSelected : eventOn}
              onChange={(e) => {
                setDateSelected(e.target.value);
                setActivePost(true);
              }}
            />
            <Form.Group widths="equal">
              <Form.Field
                control={Input}
                label="Phone Number"
                placeholder={tel}
                required
                type="number"
                min="1000000000"
                max="9999999999"
                maxlenght="10"
                value={phNumber ? phNumber : tel}
                onChange={(e) => {
                  setPhNumber(e.target.value);
                  setActivePost(true);
                }}
              />
              <Form.Field
                control={Input}
                label="Address"
                placeholder={address}
                required
                value={newaddress ? newaddress : address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setActivePost(true);
                }}
              />
            </Form.Group>
            <Form.Field
              control={TextArea}
              label="Event Details"
              placeholder={event}
              required
              value={eventInfo ? eventInfo : event}
              onChange={(e) => {
                setEventInfo(e.target.value);
                setActivePost(true);
              }}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={() => setOpen(false)}>
            <Icon name="remove" /> Cancel
          </Button>
          <Button
            color="green"
            disabled={activePost ? false : true}
            onClick={handleUpdatePost}
          >
            <Icon name="checkmark" /> Post
          </Button>
        </Modal.Actions>
      </Modal>
    ) : (
      <Card key={index}>
        <Card.Content>
          <Image floated="right" size="mini" src={img} />
          <Card.Header>{eventOn}</Card.Header>
          <Card.Meta>{`Post By: ${postBy}`}</Card.Meta>
          <Card.Meta>{`Contact No: ${tel}`}</Card.Meta>
          <Card.Meta>{`Address: ${address}`}</Card.Meta>
          <Card.Description>{event}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <div className="ui two buttons" id={id}>
            <Button
              basic
              color="green"
              disabled={dataUid === uid ? false : true}
              onClick={handlePostEdit}
            >
              Edit
            </Button>
            <Button
              basic
              color="red"
              disabled={dataUid === uid ? false : true}
              onClick={handlePostDelete}
            >
              Delete
            </Button>
          </div>
        </Card.Content>
      </Card>
    );
  };

  return (
    <Card.Group centered itemsPerRow={2}>
      {eventDatas.map((eventData, index) => eachCardsample(eventData, index))}
    </Card.Group>
  );
};

export default EventCard;
