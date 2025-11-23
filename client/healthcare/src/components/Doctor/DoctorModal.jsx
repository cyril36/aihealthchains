import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Input,
  Button,
  Modal,
  Form,
  Notification,
  toaster,
  Textarea,
} from "rsuite";
import { createDoctor, updateDoctor } from "../../api/doctors";

export function DoctorModal({ open, onClose, doctor, mode }) {
  const queryClient = useQueryClient();
  const [formValue, setFormValue] = useState({
    name: "",
    specialty: "",
    bio: "",
  });

  //Load the doctor data into the form
  useEffect(() => {
    if (doctor && mode === "edit") {
      setFormValue(doctor);
    } else {
      setFormValue({ name: "", specialty: "", bio: "" });
    }
  }, [doctor, mode, open]);

  //create a doctor
  const createMutation = useMutation({
    mutationFn: createDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries(["doctors"]);
      toaster.push(
        <Notification type="success">Doctor created successfully</Notification>
      );
      onClose();
    },
    onError: (error) => {
      console.log(error);
      toaster.push(
        <Notification type="error">Doctor creation failed</Notification>
      );
    },
  });

  //update a doctor
  const updateMutation = useMutation({
    mutationFn: updateDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries(["doctors"]);
      toaster.push(
        <Notification type="success">Doctor updated successfully</Notification>
      );
      onClose();
    },
    onError: (error) => {
      console.log(error);
      toaster.push(
        <Notification type="error">Doctor update failed</Notification>
      );
    },
  });

  //triggered when clicking on Save to update of create a doctor
  const handleSubmit = () => {
    if (mode === "edit") {
      updateMutation.mutate({ id: doctor.id, data: formValue });
    } else {
      createMutation.mutate(formValue);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="md">
      <Modal.Header>
        <Modal.Title>
          {mode === "edit" ? "Edit Doctor" : "Add New Doctor"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form fluid formValue={formValue} onChange={setFormValue}>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control name="name" />
          </Form.Group>
          <Form.Group>
            <Form.Label>Specialty</Form.Label>
            <Form.Control name="specialty" />
          </Form.Group>
          <Form.Group>
            <Form.Label>Bio</Form.Label>
            <Form.Control
              name="bio"
              rows={5}
              accepter={Textarea}
              resize={"vertical"}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit} appearance="primary">
          {mode === "edit" ? "Update" : "Create"}
        </Button>
        <Button onClick={onClose} appearance="subtle">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
