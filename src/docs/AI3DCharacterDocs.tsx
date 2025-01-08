import { SandaiClient } from "sandai-core";
import { useEffect, useState } from "react";
import { FunctionTester } from "./components/FunctionTester";

export type AI3DCharacterDocsProps = {
  client: SandaiClient;
};

export const AI3DCharacterDocs = (props: AI3DCharacterDocsProps) => {
  const [docs, setDocs] = useState<ReturnType<typeof props.client._getDocs>>(
    props.client._getDocs()
  );

  useEffect(() => {
    const _docs = props.client._getDocs();
    setDocs(_docs);
  }, [props.client]);

  return (
    <div
      style={{
        display: "flex",
        position: "absolute",
        color: "#F9F9F9FF",
        overflowX: "auto",
      }}
    >
      {Array.from(docs.entries()).map(([instanceName, functionNameMap]) => (
        <div
          key={instanceName}
          style={{
            borderRadius: "12px",
            backgroundColor: "#00000088",
            padding: "10px",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {instanceName}
          </h2>
          {Array.from(functionNameMap.entries()).map(
            ([functionName, functionDescriptionMap]) => (
              <div
                key={functionName}
                style={{
                  paddingBlock: "8px",
                }}
              >
                <pre>{functionName}</pre>
                {Array.from(functionDescriptionMap.entries()).map(
                  ([functionDescription, boundFunction]) => (
                    <div key={functionDescription}>
                      <p
                        style={{
                          opacity: 0.75,
                          fontStyle: "italic",
                        }}
                      >
                        {functionDescription}
                      </p>
                      <FunctionTester
                        func={boundFunction.func}
                        schema={boundFunction.schema}
                      />
                    </div>
                  )
                )}
              </div>
            )
          )}
        </div>
      ))}
    </div>
  );
};
