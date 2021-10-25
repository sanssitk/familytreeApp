import React, { useState } from "react";
import "./routes.css";
import EventCard from "../Components/EventsCom/EventCard";
import { fireStore } from "../Services/firebaseServices";
import { useStateValue } from "../StateManagement/StateProvider";
import { NepaliDatePicker, BSDate } from "nepali-datepicker-react";
import { v4 as uuidv4 } from "uuid";
import {
  Container,
  Button,
  Icon,
  Header,
  Modal,
  Form,
  Input,
  TextArea,
} from "semantic-ui-react";

const Events = () => {
  const toDate = new Date();
  // let year = toDate.getFullYear();
  // let month = toDate.getMonth();
  // let day = toDate.getDate();
  // let dateString = `${day}/${month}/${year}`;
  const now = new BSDate().now();
  const [open, setOpen] = useState(false);
  const [dateSelected, setDateSelected] = useState(now);
  const [phNumber, setPhNumber] = useState();
  const [address, setAddress] = useState();
  const [eventInfo, setEventInfo] = useState();
  const [{ user }] = useStateValue();

  const resetValue = () => {
    setDateSelected();
    setPhNumber();
    setAddress();
    setEventInfo();
  };

  const ModalExampleCloseIcon = () => {
    const handlePost = (e) => {
      e.preventDefault();
      const userName = user.displayName;
      const imageUrl = user.photoURL;
      const uniqueId = uuidv4();
      const newEvent = {
        dataUid: user.uid,
        id: uniqueId,
        eventOn: dateSelected,
        img: imageUrl,
        postBy: userName,
        event: eventInfo,
        tel: phNumber,
        address: address,
      };
      fireStore.addFS(newEvent, uniqueId);
      setOpen(false);
    };
    return (
      <Modal
        closeIcon
        open={open}
        trigger={
          user && (
            <Button icon labelPosition="left" color="green">
              <Icon name="add" />
              Add Events
            </Button>
          )
        }
        onClose={() => {
          setOpen(false);
          resetValue();
        }}
        onOpen={() => setOpen(true)}
      >
        <Header icon="add" content="Add New Events" />
        <Modal.Content>
          <Form widths="equal">
            <label htmlFor="nepaliDate">
              <strong>Date</strong>
            </label>
            <NepaliDatePicker
              value={dateSelected}
              format="YYYY-MM-DD"
              id="nepaliDate"
              onChange={(date) => setDateSelected(date)}
            />
            {/* <Form.Field
              control={Input}
              label="Date"
              placeholder=""
              type="date"
              required
              value={dateSelected}
              onChange={(e) => setDateSelected(e.target.value)}
            /> */}
            <Form.Group widths="equal">
              <Form.Field
                control={Input}
                label="Phone Number"
                placeholder="Mobile No."
                required
                type="number"
                min="1000000000"
                max="9999999999"
                maxlenght="10"
                value={phNumber}
                onChange={(e) => setPhNumber(e.target.value)}
              />
              <Form.Field
                control={Input}
                label="Address"
                placeholder="Address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Form.Group>
            <Form.Field
              control={TextArea}
              label="Event Details"
              placeholder="Details here..."
              required
              value={eventInfo}
              onChange={(e) => setEventInfo(e.target.value)}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="red"
            onClick={() => {
              setOpen(false);
              resetValue();
            }}
          >
            <Icon name="remove" /> Cancel
          </Button>
          <Button
            color="green"
            onClick={handlePost}
            disabled={
              phNumber && dateSelected && address && eventInfo ? false : true
            }
          >
            <Icon name="checkmark" /> Post
          </Button>
        </Modal.Actions>
      </Modal>
    );
  };

  return (
    <Container style={{ margin: 36 }}>
      {ModalExampleCloseIcon()}
      <EventCard uid={user.uid} />
    </Container>
  );
};

export default Events;
