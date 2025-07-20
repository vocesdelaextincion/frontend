import {
  Modal,
  Button,
  Form,
  ButtonToolbar,
  Message,
  toaster,
  SelectPicker,
} from "rsuite";
import { Formik } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import api from "../../services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@packages/types/user";


interface UpdateUserModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

const Role = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

const Plan = {
  FREE: "FREE",
  PREMIUM: "PREMIUM",
} as const;

export type Plan = (typeof Plan)[keyof typeof Plan];
export type Role = (typeof Role)[keyof typeof Role];

interface FormValues {
  role: Role;
  plan: Plan;
}

const validationSchema = Yup.object().shape({
  role: Yup.string().oneOf(Object.values(Role)).required("Role is required"),
  plan: Yup.string().oneOf(Object.values(Plan)).required("Plan is required"),
});

const roleData = (Object.values(Role) as Role[]).map((role) => ({
  label: role,
  value: role,
}));
const planData = (Object.values(Plan) as Plan[]).map((plan) => ({
  label: plan,
  value: plan,
}));

const UpdateUserModal = ({ open, onClose, user }: UpdateUserModalProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<unknown, Error, FormValues>({
    mutationFn: (updatedUser) =>
      api.put(
        `/admin/users/${user?.id}`,
        updatedUser as unknown as Record<string, unknown>
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toaster.push(
        <Message type="success">User updated successfully.</Message>
      );
      onClose();
    },
    onError: (error) => {
      toaster.push(
        <Message type="error">
          {error.message || "Failed to update user."}
        </Message>
      );
    },
  });

  if (!user) return null;

  const initialFormValues: FormValues = {
    role: user.role,
    plan: user.plan,
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        <Modal.Title>Update User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik<FormValues>
          initialValues={initialFormValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={(
            values: FormValues,
            { setSubmitting }: FormikHelpers<FormValues>
          ) => {
            mutation.mutate(values, {
              onSettled: () => setSubmitting(false),
            });
          }}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
          }) => (
            <Form fluid onSubmit={() => handleSubmit()}>


              <Form.Group>
                <Form.ControlLabel>Role</Form.ControlLabel>
                <SelectPicker
                  data={roleData}
                  name="role"
                  value={values.role}
                  onChange={(value) => setFieldValue("role", value)}
                  onBlur={handleBlur}
                  block
                />
                {errors.role && touched.role && (
                  <Form.HelpText style={{ color: "red" }}>
                    {errors.role}
                  </Form.HelpText>
                )}
              </Form.Group>

              <Form.Group>
                <Form.ControlLabel>Plan</Form.ControlLabel>
                <SelectPicker
                  data={planData}
                  name="plan"
                  value={values.plan}
                  onChange={(value) => setFieldValue("plan", value)}
                  onBlur={handleBlur}
                  block
                />
                {errors.plan && touched.plan && (
                  <Form.HelpText style={{ color: "red" }}>
                    {errors.plan}
                  </Form.HelpText>
                )}
              </Form.Group>



              <Form.Group>
                <ButtonToolbar>
                  <Button
                    appearance="primary"
                    type="submit"
                    loading={isSubmitting}
                  >
                    Update
                  </Button>
                  <Button onClick={onClose} appearance="subtle">
                    Cancel
                  </Button>
                </ButtonToolbar>
              </Form.Group>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateUserModal;
