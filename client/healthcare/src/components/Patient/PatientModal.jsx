import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Input,
  Button,
  Modal,
  Form,
  SelectPicker,
  Notification,
  toaster,
  Textarea,
} from "rsuite";
import { createPatient, updatePatient } from "../../api/patients";

export function PatientModal({ open, onClose, patient, mode }) {
  const queryClient = useQueryClient();
  const [formValue, setFormValue] = useState({
    name: "",
    age: "",
    gender: "",
    medicalHistory: "",
  });

  //Load the patient data into the form
  useEffect(() => {
    if (patient && mode === "edit") {
      setFormValue(patient);
    } else {
      setFormValue({ name: "", age: "", gender: "", medicalHistory: "" });
    }
  }, [patient, mode, open]);

  //create a patient
  const createMutation = useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries(["patients"]);
      toaster.push(
        <Notification type="success">Patient created successfully</Notification>
      );
      onClose();
    },
    onError: (error) => {
      console.log(error);
      toaster.push(
        <Notification type="error">Patient creation failed</Notification>
      );
    },
  });


  //update a patient
  const updateMutation = useMutation({
    mutationFn: updatePatient,
    onSuccess: () => {
      queryClient.invalidateQueries(["patients"]);
      toaster.push(
        <Notification type="success">Patient updated successfully</Notification>
      );
      onClose();
    },
    onError: (error) => {
      console.log(error);
      toaster.push(
        <Notification type="error">Patient update failed</Notification>
      );
    },
  });



  //triggered when clicking on Save to update of create a patient
  const handleSubmit = () => {
    if (mode === "edit") {
      updateMutation.mutate({ id: patient.id, data: formValue });
    } else {
      createMutation.mutate(formValue);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="md">
      <Modal.Header>
        <Modal.Title>
          {mode === "edit" ? "Edit Patient" : "Add New Patient"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form fluid formValue={formValue} onChange={setFormValue}>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control name="name" />
          </Form.Group>
          <Form.Group>
            <Form.Label>Age</Form.Label>
            <Form.Control name="age" type="number" min={1} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Gender</Form.Label>
            <Form.Control
              name="gender"
              accepter={SelectPicker}
              data={[
                { label: "Male", value: "Male" },
                { label: "Female", value: "Female" },
                { label: "Other", value: "Other" },
                { label: "Prefer not to say", value: "Prefer not to say" },
                { label: "Non-binary", value: "Non-binary" },
              ]}
              block
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Medical History</Form.Label>
            <Form.Control
              name="medicalHistory"
              rows={5}
              accepter={Textarea}
              resize={"vertical"}
            />
          </Form.Group>
          *{" "}
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
