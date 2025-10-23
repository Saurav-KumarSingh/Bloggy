function InputField({ label, type = "text", name, value, onChange, placeholder }) {
  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className="block text-gray-700 text-sm font-medium mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-md 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                   transition duration-150 ease-in-out"
      />
    </div>
  );
}

export default InputField;
