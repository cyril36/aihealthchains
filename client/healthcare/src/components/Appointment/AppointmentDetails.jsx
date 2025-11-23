import {
  Grid,
  Panel,
  Divider,
  Stack,
  IconButton,
  Col,
  Row,
  ButtonToolbar,
  Notification,
  toaster,
} from "rsuite";
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";
import { deleteAppointment } from "../../api/appointments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "../../context/Router";

const AppointmentsDetails = ({
  appointment,
  handleEditAppointment,
  setSelectedAppointment,
}) => {
  const { navigate } = useRouter();
  const queryClient = useQueryClient();

    //delete an appointment
  const deleteMutation = useMutation({
    mutationFn: deleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries(["appointments"]);
      toaster.push(
        <Notification type="success">Appointment deleted</Notification>
      );
    },
  });



  let render = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        color: "hsl(210, 8%, 45%)",
        padding: "30px",
      }}
    >
      <svg
        width="120"
        height="120"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{ marginBottom: "20px", opacity: 0.3 }}
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
      <p>Select an appointment to view details</p>
    </div>
  );
  if (appointment) {
    render = (
      <div >
        <Panel
          bordered
          style={{
            background: "hsl(0, 0%, 98%)",
            border: "1px solid hsl(210, 10%, 80%)",
            marginBottom: "24px",
            borderRadius: "8px",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          }}
        >
          <Stack
            justifyContent="space-between"
            alignItems="center"
            style={{ marginBottom: "24px" }}
          >
            <h2
              style={{
                margin: 0,
                color: "hsl(215, 28%, 15%)",
                fontSize: "1.875rem",
                fontWeight: 700,
                fontFamily: "IBM Plex Sans, sans-serif",
              }}
            >
              {appointment.name}
            </h2>
            <ButtonToolbar>
              <IconButton
                icon={<EditIcon />}
                appearance="ghost"
                onClick={() => handleEditAppointment(appointment)}
              ></IconButton>
              <IconButton
                icon={<TrashIcon />}
                appearance="ghost"
                color="red"
                onClick={() => {
                  if (window.confirm("Delete appointment?")) {
                    deleteMutation.mutate(appointment.id);
                    navigate(window.location.pathname);
                    setSelectedAppointment(null)
                  }
                }}
              ></IconButton>
            </ButtonToolbar>
          </Stack>
          <Grid style={{ marginBottom: "24px" }}>
            <Row>
              <Col span={8}>
                <div
                  style={{
                    marginBottom: "8px",
                    fontSize: "0.75rem",
                    color: "hsl(210, 8%, 45%)",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  Date
                </div>
                <div style={{ fontSize: "1.125rem", fontWeight: 600 }}>
                  {appointment.dateTime}
                </div>
              </Col>
            </Row>
          </Grid>
          <Divider />
          <div>
            <div
              style={{
                marginBottom: "12px",
                fontSize: "0.75rem",
                color: "hsl(210, 8%, 45%)",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              reason
            </div>
            <p style={{ lineHeight: 1.625 }}>
              {appointment.reason || "No medical history"}
            </p>
          </div>
        </Panel>
      </div>
    );
  }
  return render;
};

export default AppointmentsDetails;
