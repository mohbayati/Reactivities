import React from "react";
import { FieldRenderProps } from "react-final-form";
import { Form, FormFieldProps, Label, Select } from "semantic-ui-react";

interface IProps
  extends FieldRenderProps<string, HTMLElement>,
    FormFieldProps {}

const SelectInput: React.FC<IProps> = ({
  input,
  options,
  width,
  placeholder,
  meta: { touched, error },
}) => {
  return (
    <Form.Field error={touched && !!error}  width={width}>
      <Select
        value={input.value}
        options={options}
        onChange={(e,data)=>input.onChange(data.value)}
        placeholder={placeholder}
      />
      {touched && error && (
        <Label basic color="red">
          {error}
        </Label>
      )}
    </Form.Field>
  );
};

export default SelectInput;
