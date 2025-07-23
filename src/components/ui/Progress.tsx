export const Progress = ({ value }: { value: number }) => (
  <div className="w-full h-2 bg-gray-200 rounded">
    <div style={{ width: `${value}%` }}
      className="h-full rounded bg-primary transition-all duration-300" />
  </div>
); 