import { useState, useMemo, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Grid,
  List,
  Input,
  InputGroup,
  Pagination,
  Stack,
  Button,
  Col,
  Row,
} from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import PlusIcon from "@rsuite/icons/Plus";
export function AppointmentsList({
  readonly = false,
  appointmentsPerPage = 10,
  appointments,
  doctors,
  patients,
  selectedAppointment,
  setSelectedAppointment,
  handleCreationAppointment,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // filter the appointment according to the search terms with doctor and patient name
  const filteredAppointments = useMemo(() => {
    if (!Array.isArray(appointments)) return [];
    if (!appointments) return [];
    if (!searchTerm) return appointments;
    return appointments.filter((apt) => {
      const patient = patients?.find((p) => p.id === apt.patientId);
      const doctor = doctors?.find((d) => d.id === apt.doctorId);
      return (
        patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [appointments, searchTerm, patients, doctors]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(
    filteredAppointments.length / appointmentsPerPage
  );
  const startIndex = (currentPage - 1) * appointmentsPerPage;
  const paginatedAppointments = filteredAppointments.slice(
    startIndex,
    startIndex + appointmentsPerPage
  );

  return (
    <>
      <div style={{ padding: "24px" }}>
        <Stack
          justifyContent="space-between"
          alignItems="center"
          style={{ marginBottom: "16px" }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "1.25rem",
              color: "hsl(215, 20%, 20%)",
              fontWeight: 600,
              fontFamily: "IBM Plex Sans, sans-serif",
            }}
          >
            Appointments
          </h3>
          {!readonly && (
            <Button
              appearance="primary"
              startIcon={<PlusIcon />}
              onClick={handleCreationAppointment}
            >
              Add
            </Button>
          )}{" "}
        </Stack>

        <InputGroup style={{ marginBottom: "20px", maxWidth: "400px" }}>
          <Input
            placeholder="Search by patient or doctor name..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
          <InputGroup.Addon>
            <SearchIcon />
          </InputGroup.Addon>
        </InputGroup>

        <div
          style={{
            fontSize: "0.875rem",
            color: "hsl(210, 8%, 45%)",
            marginBottom: "10px",
          }}
        >
          {filteredAppointments.length > 0
            ? `Showing ${startIndex + 1}-${Math.min(
                startIndex + appointmentsPerPage,
                filteredAppointments.length
              )} of ${filteredAppointments.length}`
            : "No appointments"}
        </div>
      </div>

      {/*       {isLoading ? <LoadingState message="Loading appointments..." /> : error ? <ErrorState message="Failed to load appointments." /> : filteredAppointments.length === 0 ? <EmptyState message="No appointments found" /> : (
       */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 24px" }}>
        <List hover>
          {paginatedAppointments.map((apt) => {
            const patient = patients?.find((p) => p.id === apt.patientId);
            const doctor = doctors?.find((d) => d.id === apt.doctorId);
            const date = new Date(apt.dateTime).toLocaleString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
            return (
              <List.Item
                key={apt.id}
                style={{
                  cursor: "pointer",
                  background:
                    selectedAppointment?.id == apt.id
                      ? "hsl(0, 0%, 98%)"
                      : "white",
                  border:
                    selectedAppointment?.id == apt.id
                      ? "2px solid hsl(182, 40%, 45%)"
                      : "2px solid hsl(210, 10%, 80%)",
                  borderRadius: "8px",
                  marginBottom: "12px",
                  padding: "16px",
                  transition: "all 0.2s ease",
                }}
                onClick={() =>
                  setSelectedAppointment({
                    patient: patient,
                    doctor: doctor,
                    ...apt,
                  })
                }
              >
                <Grid align="middle">
                  <Row>
                    <Col span={6}>
                      <div
                        style={{
                          fontWeight: 700,
                          color: "hsl(182, 40%, 45%)",
                          fontSize: "1rem",
                          marginBottom: "4px",
                        }}
                      >
                        {date}
                      </div>
                    </Col>
                  </Row>
                  {patient && (
                    <Row>
                      {" "}
                      <Col span={6}>
                        <span
                          style={{
                            marginBottom: "4px",
                            fontSize: "0.75rem",
                            color: "hsl(210, 8%, 45%)",
                            textTransform: "uppercase",
                            fontWeight: 600,
                          }}
                        >
                          Patient :
                        </span>
                        <span style={{ fontWeight: 600 }}>
                          {patient?.name || "Unknown"}
                        </span>
                      </Col>
                    </Row>
                  )}
                  {doctor && (
                    <Row>
                      <Col span={6}>
                        <span
                          style={{
                            marginBottom: "4px",
                            fontSize: "0.75rem",
                            color: "hsl(210, 8%, 45%)",
                            textTransform: "uppercase",
                            fontWeight: 600,
                          }}
                        >
                          Doctor :
                        </span>
                        <span style={{ fontWeight: 600 }}>
                          {doctor?.name || "Unknown"}
                        </span>
                        {doctor && (
                          <div
                            style={{
                              fontSize: "0.875rem",
                              color: "hsl(210, 8%, 45%)",
                            }}
                          >
                            {doctor.specialty}
                          </div>
                        )}
                      </Col>
                    </Row>
                  )}
                </Grid>
              </List.Item>
            );
          })}
        </List>
      </div>
      {totalPages > 1 && (
        <div
          style={{ padding: "20px", borderTop: "1px solid hsl(210, 10%, 80%)" }}
        >
          <Pagination
            prev
            next
            size="md"
            ellipsis
            maxButtons={2}
            boundaryLinks
            total={filteredAppointments.length}
            limit={appointmentsPerPage}
            activePage={currentPage}
            onChangePage={setCurrentPage}
            style={{ justifyContent: "center" }}
          />
        </div>
      )}
    </>
  );
}
