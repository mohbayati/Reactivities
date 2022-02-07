import { FORM_ERROR } from "final-form";
import { useContext } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import { combineValidators, isRequired } from "revalidate";
import { Button, Form, Header } from "semantic-ui-react";
import ErrorMessage from "../../app/common/form/errorMessage";
import TextInput from "../../app/common/form/TextInput";
import { IUserFromValues } from "../../app/models/user";
import { RootStoreContext } from "../../app/stores/rootStore";

const validate = combineValidators({
  email: isRequired("email"),
  password: isRequired("password"),
});
const LoginForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { userStore } = rootStore;
  return (
    <FinalForm
      onSubmit={(values: IUserFromValues) =>
        userStore.login(values).catch((error) => ({
          [FORM_ERROR]: error,
        }))
      }
      validate={validate}
      render={({
        handleSubmit,
        submitting,
        submitError,
        invalid,
        pristine,
        dirtySinceLastSubmit,
      }) => (
        <Form onSubmit={handleSubmit} error>
          <Header
            content="Login to Reactivites"
            color="teal"
            textAlign="center"
            as="h2"
          />
          <Field name="email" component={TextInput} placeholder="email" />
          <Field
            name="password"
            component={TextInput}
            placeholder="Password"
            type="Password"
          />
          {submitError && (
            <ErrorMessage
              error={submitError}
              text="Invalid email and password"
            />
          )}

          <Button
            loading={submitting}
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            content="Login"
            fluid
            color="teal"
          />
        </Form>
      )}
    />
  );
};
export default LoginForm;
