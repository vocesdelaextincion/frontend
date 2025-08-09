import {
  Form,
  ButtonToolbar,
  Button,
  Panel,
  FlexboxGrid,
  Col,
  toaster,
  Message,
  Stack,
  Loader,
} from "rsuite";
import { Formik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Email inválido").required("Requerido"),
  password: Yup.string().required("Requerido"),
});

const LoginPage = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading spinner while checking token
  if (isLoading) {
    return (
      <FlexboxGrid justify="center" align="middle" style={{ height: "100vh" }}>
        <FlexboxGrid.Item>
          <Loader size="lg" content="Verificando sesión..." />
        </FlexboxGrid.Item>
      </FlexboxGrid>
    );
  }

  return (
    <FlexboxGrid
      justify="center"
      align="middle"
      style={{ height: "100vh", backgroundColor: "var(--rs-primary-500)" }}
    >
      <FlexboxGrid.Item as={Col} colspan={6}>
        <Panel
          header={<h3>Iniciar Sesión</h3>}
          bordered
          style={{ backgroundColor: "white" }}
        >
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const response = await api.post("/auth/login", values);
                login(response.token);
                toaster.push(
                  <Message type="success">¡Sesión iniciada con éxito!</Message>
                );
              } catch (error) {
                console.error("Login failed:", error);
                toaster.push(
                  <Message type="error">
                    Error al iniciar sesión. Por favor, compruebe sus
                    credenciales.
                  </Message>
                );
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({
              handleSubmit,
              values,
              handleChange,
              errors,
              touched,
              isSubmitting,
            }) => (
              <Form onSubmit={() => handleSubmit()} fluid>
                <Stack direction="column" alignItems="stretch" spacing={30}>
                  <Form.Group>
                    <Form.ControlLabel>Correo Electrónico</Form.ControlLabel>
                    <Form.Control
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={(value) => handleChange("email")(String(value))}
                      errorMessage={
                        touched.email && errors.email ? errors.email : null
                      }
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.ControlLabel>Contraseña</Form.ControlLabel>
                    <Form.Control
                      name="password"
                      type="password"
                      value={values.password}
                      onChange={(value) =>
                        handleChange("password")(String(value))
                      }
                      errorMessage={
                        touched.password && errors.password
                          ? errors.password
                          : null
                      }
                    />
                  </Form.Group>
                  <Form.Group>
                    <ButtonToolbar>
                      <Button
                        appearance="primary"
                        type="submit"
                        loading={isSubmitting}
                      >
                        Iniciar Sesión
                      </Button>
                    </ButtonToolbar>
                  </Form.Group>
                </Stack>
              </Form>
            )}
          </Formik>
        </Panel>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
};

export default LoginPage;
