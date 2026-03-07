interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search coins..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
