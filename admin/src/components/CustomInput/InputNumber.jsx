export default function InputNumber({ id, label, name, value }) {
  return (
    <div className="mb-2">
      <label htmlFor={id} className="text-black uppercase font-semibold">
        {label}
      </label>
      <input
        type="number"
        id={id}
        name={name}
        value={value}
        className="w-full mt-2 border border-gray-300 bg-gray-50 p-2 rounded-md text-gray-500"
      />
    </div>
  );
}
