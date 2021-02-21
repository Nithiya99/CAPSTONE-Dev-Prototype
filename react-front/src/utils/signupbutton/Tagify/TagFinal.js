import React from "react";
import Tags from "@yaireo/tagify/dist/react.tagify";
import "@yaireo/tagify/dist/tagify.css";
// Tagify settings object
const baseTagifySettings = {
  blacklist: [],
  enforceWhitelist: true,
  dropdown: {
    enabled: 0,
  },
  callbacks: {},
};

function TagFinal({
  label = "blehh",
  name = "bleh",
  initialValue = ["html"],
  suggestions = ["html", "css", "JS", "Adbode", "MS"],
  setSkills,
}) {
  const handleChange = (e) => {
    // console.log(e.detail.tagify.value);
    let arr = [];
    e.detail.tagify.value.map((val) => {
      arr.push(val.value);
    });
    setSkills(arr);
  };

  const settings = {
    ...baseTagifySettings,
    whitelist: suggestions,
    callbacks: {
      add: handleChange,
      remove: handleChange,
      blur: handleChange,
      edit: handleChange,
      invalid: handleChange,
      click: handleChange,
      focus: handleChange,
      "edit:updated": handleChange,
      "edit:start": handleChange,
    },
  };
  //   console.log("words:");
  //   console.log(suggestions);
  if (suggestions.length === 0) return null;
  return (
    <div className="form-group">
      <label htmlFor={"field-" + name}>{label}</label>
      <Tags settings={settings} initialValue={initialValue} />
    </div>
  );
}

export default TagFinal;
