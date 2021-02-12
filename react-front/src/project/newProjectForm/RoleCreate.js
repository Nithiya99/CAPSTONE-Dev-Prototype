import React from "react";
 
const RoleList = (props) => {
  // if (props.skillDetails === undefined) return null;
  const { onChange } = props;
  return props.roleDetails.map((val, idx) => {
    let roleName = `roleName-${idx}`;
    let roleSkills = `roleSkills-${idx}`;
    return (
      <div className="form-row mt-3" key={val.index}>
        <div className="form-group col-md-4 offset-1">
          <label>
            <big>Role Title</big>
          </label>
          <input
            type="text"
            className="form-control required"
            // rolename="roleName"
            idx={idx}
            id={roleName}
            onChange={onChange("roleName")}
            value={props.roleDetails[idx].roleName}
          />
        </div>
        {/*<div className="form-row" key={val.index}>*/}
        <div className="form-group col-md-5">
          <label>
            <big>Skills Required</big>
          </label>
          <input
            type="text"
            className="form-control required"
            // roleskills="roleSkills"
            idx={idx}
            id={roleSkills}
            onChange={onChange("roleSkills")}
            value={props.roleDetails[idx].roleSkills}
          />
        </div>
        {/*</div>*/}
        <div className="form-group col-md-2 mt-4">
          {idx === 0 ? (
            <button
              onClick={() => props.add()}
              type="button"
              className="btn btn-primary text-center"
            >
              <i className="fa fa-plus" aria-hidden="true" />
            </button>
          ) : (
            <button
              className="btn btn-danger"
              onClick={() => props.delete(val)}
            >
              <i className="fa fa-minus" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    );
  });
};
 
export default RoleList;