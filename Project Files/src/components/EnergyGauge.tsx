export default function EnergyGauge({ value }: { value: number }) {
  const percentage = Math.min((value / 2500) * 100, 100);

  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 shadow-xl">
      <h3 className="text-white mb-4 text-lg font-semibold">
        Energy Output
      </h3>

      <div className="w-full h-6 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-400 transition-all duration-1000"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-green-300 mt-3 text-xl font-bold">
        {value.toFixed(2)} kW
      </p>
    </div>
  );
}
