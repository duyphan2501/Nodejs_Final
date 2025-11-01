import InputDate from "./InputDate";
import InputText from "./InputText";
import InputNumber from "./InputNumber";

export default function CustomInput({
  type,
  id,
  label,
  name,
  value,
  handleChangeInput,
}) {
  return (
    <>
      {type === "text" && (
        <InputText
          id={id}
          label={label}
          name={name}
          value={value}
          handleChangeInput={handleChangeInput}
        />
      )}
      {type === "date" && (
        <InputDate
          id={id}
          label={label}
          name={name}
          value={value}
          handleChangeInput={handleChangeInput}
        />
      )}
      {type === "number" && (
        <InputNumber
          id={id}
          label={label}
          name={name}
          value={value}
          handleChangeInput={handleChangeInput}
        />
      )}
    </>
  );
}
