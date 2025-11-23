import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Input,
  Button,
  Modal,
  Form,
  SelectPicker,
  DatePicker,
  Notification,
  toaster,
  Textarea,
} from "rsuite";
import { usePatients } from "../../hook/patients";
import { useDoctors } from "../../hook/doctors";
import { createAppointment, updateAppointment } from "../../api/appointments";

export function AppointmentModal({
  open,
  onClose,
  appointment,
  mode,
  preSelectedPatientId,
  preSelectedDoctorId,
}) {
  const queryClient = useQueryClient();
  const { data: patients } = usePatients();
  const { data: doctors } = useDoctors();

  const [formValue, setFormValue] = useState({
    patientId: preSelectedPatientId || "",
    doctorId: preSelectedDoctorId || "",
    dateTime: new Date(),
    reason: "",
  });


  //Load the doctor data into the form
  useEffect(() => {
    if (appointment && mode === "edit") {
      setFormValue({
        ...appointment,
        dateTime: new Date(appointment.dateTime),
      });
    } else {
      setFormValue({
        patientId: preSelectedPatientId || "",
        doctorId: preSelectedDoctorId || "",
        dateTime: new Date(),
        reason: "",
      });
    }
  }, [appointment, mode, open, preSelectedPatientId, preSelectedDoctorId]);


  //create an appointment
  const createMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries(["appointments"]);
      toaster.push(
        <Notification type="success">Appointment created</Notification>
      );
      onClose();
    },
  });


  //update an appointment
  const updateMutation = useMutation({
    mutationFn: updateAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries(["appointments"]);
      toaster.push(
        <Notification type="success">Appointment updated</Notification>
      );
      onClose();
    },
  });


  //triggered when clicking on Save to update of create an appointment
  const handleSubmit = () => {
    const data = {
      ...formValue,
      patientId: Number(formValue.patientId),
      doctorId: Number(formValue.doctorId),
      dateTime: formValue.dateTime.toISOString(),
    };
    if (mode === "edit") {
      updateMutation.mutate({ id: appointment.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const patientOptions =
    patients?.map((p) => ({ label: p.name, value: p.id })) || [];
  const doctorOptions =
    doctors?.map((d) => ({
      label: `${d.name} - ${d.specialty}`,
      value: d.id,
    })) || [];

  return (
    <Modal open={open} onClose={onClose} size="md">
      <Modal.Header>
        <Modal.Title>
          {mode === "edit" ? "Edit Appointment" : "Add New Appointment"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form fluid formValue={formValue} onChange={setFormValue}>
          <Form.Group>
            <Form.Label>Patient</Form.Label>
            <Form.Control
              name="patientId"
              accepter={SelectPicker}
              data={patientOptions}
              block
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Doctor</Form.Label>
            <Form.Control
              name="doctorId"
              accepter={SelectPicker}
              data={doctorOptions}
              block
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Date & Time</Form.Label>
            <Form.Control
              name="dateTime"
              accepter={DatePicker}
              format="yyyy-MM-dd HH:mm"
              block
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Reason</Form.Label>
            <Form.Control
              name="reason"
              rows={3}
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
