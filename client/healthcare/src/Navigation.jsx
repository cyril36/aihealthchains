import React from "react";
import { Container, Header, Content, Stack, Nav } from "rsuite";
import { PatientsPage } from "./components/Patient/PatientPage";
import { AppointmentsPage } from "./components/Appointment/AppointmentPage";

import { DoctorsPage } from "./components/Doctor/DoctorPage";
import { Route, useRouter } from "./context/Router";


export function Navigation() {
  const { currentPath, navigate } = useRouter();

  const getActiveKey = () => {
    if (/^\/appointments/.test(currentPath)) return "appointments";
    if (/^\/doctors/.test(currentPath)) return "doctors";
    return "patients";
  };

  // navigate to the endpoint according to the link clicked
  const handleNavSelect = (eventKey) => {
    if (eventKey === "patients") navigate("/");
    else if (eventKey === "appointments") navigate("/appointments");
    else if (eventKey === "doctors") navigate("/doctors");
  };

  function Brand() {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div>
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "white",
              lineHeight: 1,
              fontFamily: "IBM Plex Sans, sans-serif",
            }}
          >
            AI Health Chains
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "rgba(255, 255, 255, 0.7)",
              marginTop: "4px",
              letterSpacing: "1px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            PATIENT MANAGEMENT SYSTEM
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "hsl(0, 0%, 96%)",
        padding: "20px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <Container
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          background: "white",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          border: "1px solid hsl(210, 10%, 80%)",
        }}
      >
        <Header
          style={{
            background: "#1c2431f2",
            borderBottom: "1px solid hsl(210, 10%, 80%)",
            padding: "28px 36px",
          }}
        >
          <Stack justifyContent="space-between" alignItems="center">
            <div onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
              <Brand />
            </div>
            <Nav
              appearance="subtle"
              activeKey={getActiveKey()}
              onSelect={handleNavSelect}
              style={{ color: "white" }}
            >
              <Nav.Item eventKey="patients" style={{ color: "white" }}>
                Patients
              </Nav.Item>
              <Nav.Item eventKey="appointments" style={{ color: "white" }}>
                Appointments
              </Nav.Item>
              <Nav.Item eventKey="doctors" style={{ color: "white" }}>
                Doctors
              </Nav.Item>
            </Nav>
          </Stack>
        </Header>

        <Content style={{ padding: 0 }}>
          <Route path="/" component={PatientsPage} />
          <Route path="/appointments" component={AppointmentsPage} />
          <Route path="/doctors" component={DoctorsPage} />
        </Content>
      </Container>
    </div>
  );
}
