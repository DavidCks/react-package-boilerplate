import React, { useState } from "react";

/**
 * Represents a parameter schema for the function tester component.
 *
 * @typedef {Object} SchemaType
 * @property {string} id - The unique identifier for the input field.
 * @property {string} type - The type of input (e.g., "text", "number").
 * @property {string} label - The display label for the input field.
 */
type SchemaType = {
  id: string;
  type: string;
  label: string;
};

/**
 * Props for the `FunctionTester` component.
 *
 * @typedef {Object} FunctionTesterProps
 * @property {Function} func - The function to be tested, which receives input values as arguments.
 * @property {SchemaType[]} schema - An array of schema objects defining the function parameters.
 */
type FunctionTesterProps = {
  func: Function;
  schema: SchemaType[];
};

/**
 * A reusable form component that dynamically generates input fields
 * based on a schema and executes a function when submitted.
 *
 * The form captures input values, maps them according to the schema,
 * and passes them as arguments to the provided function.
 *
 * ## Example Usage
 * ```tsx
 * const myFunction = (name: string, age: number) => {
 *   console.log(`Name: ${name}, Age: ${age}`);
 * };
 *
 * const schema = [
 *   { id: "name", type: "text", label: "Name" },
 *   { id: "age", type: "number", label: "Age" }
 * ];
 *
 * <FunctionTester func={myFunction} schema={schema} />
 * ```
 *
 * @component
 * @param {FunctionTesterProps} props - The component props.
 * @returns {JSX.Element} The dynamically generated form component.
 */
export const FunctionTester = ({ func, schema }: FunctionTesterProps) => {
  // Set up state to hold parameter values based on the schema
  const [values, setValues] = useState(
    schema.reduce((acc: Record<string, string>, param: SchemaType) => {
      acc[param.id] = ""; // Default to empty string for each parameter
      return acc;
    }, {})
  );

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target as any;
    setValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Map the parameter values based on the schema
    const args = schema.map((param: SchemaType) => values[param.label]);
    func(...args);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column" }}
    >
      {schema.map((param) => (
        <div key={param.label} style={{ marginBottom: "10px" }}>
          <label htmlFor={param.label}>
            {param.label}:{" "}
            <input
              style={{
                color: "white",
                backgroundColor: "black",
                paddingInline: "6px",
              }}
              id={param.label}
              name={param.label}
              type={param.type === "number" ? "number" : "text"}
              value={values[param.label] || ""} // Ensure value is connected to state
              onChange={handleChange}
            />
          </label>
        </div>
      ))}
      <button type="submit">Run</button>
    </form>
  );
};
