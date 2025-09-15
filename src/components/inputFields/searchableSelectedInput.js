export default function SearchableSelectedInput({ nameList }) {
  return (
    <>
      {nameList.map(({ name, title, inputprops }) => (
        <div key={name} className="mb-3">
          <label htmlFor={inputprops.id} className="form-label">
            {title}
          </label>

          <select
            id={inputprops.id}
            name={inputprops.name}
            multiple={inputprops.multiple}
            className="form-select"
            onChange={(e) => {
              const selectedOptions = Array.from(e.target.selectedOptions).map(opt => opt.value);
              inputprops.setsearch?.(selectedOptions); // update state with selected values
            }}
          >
            {inputprops.options.map((option) => (
              <option key={option.id} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>

          {inputprops.helpertext && (
            <small className="form-text text-muted">
              {inputprops.helpertext}
            </small>
          )}
        </div>
      ))}
    </>
  );
}
