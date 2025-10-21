import InputText from "./InputText";

export default function CustomInput({ type, id, label, name, value }) {
  return (
    <>
      {type === "text" && (
        <InputText id={id} label={label} name={name} value={value} />
      )}
    </>
  );
}
