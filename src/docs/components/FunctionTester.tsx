import React, { useState } from "react";

// Define the types for the schema and props
type SchemaType = {
  id: string;
  type: string;
  label: string;
};

type FunctionTesterProps = {
  func: Function;
  schema: SchemaType[];
};

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
