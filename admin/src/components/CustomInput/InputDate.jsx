export default function InputDate({ id, label, name, value }) {
  return (
    <div className="mb-2 w-full">
      <label htmlFor={id} className="text-black uppercase font-semibold">
        {label}
      </label>
      <input
        id="dateFrom"
        type="date"
        className="border p-2 rounded-md w-full"
        name={name}
        value={value}
      />
    </div>
  );
}
