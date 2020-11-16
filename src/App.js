import React, { useState, Suspense } from "react";
import "./App.css";
import "react-day-picker/lib/style.css";
import { StyleSheetManager } from "styled-components";
import stylisRTLPlugin from "stylis-plugin-rtl";
import { appContext } from "./AppContext";

const DatePickerComponentLazy = React.lazy(() =>
  import("./DatePickerComponent")
);

function App() {
  const [open, setOpen] = useState(false);

  return (
    <StyleSheetManager
      stylisPlugins={appContext.isRightToLeft ? [stylisRTLPlugin] : []}
    >
      <div className="App">
        <button onClick={(_) => setOpen(true)}>Open</button>
        {open && (
          <Suspense fallback={<div>Loading...</div>}>
            <DatePickerComponentLazy locale={appContext.locale} />
          </Suspense>
        )}
      </div>
    </StyleSheetManager>
  );
}

export default App;
