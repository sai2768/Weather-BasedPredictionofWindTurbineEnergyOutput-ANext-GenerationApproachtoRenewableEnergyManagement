import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function EnergyChart({ data }: any) {
  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 shadow-xl">
      <h3 className="text-white mb-4 text-lg font-semibold">
        Energy Trend
      </h3>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="time" stroke="#ffffff" />
          <YAxis stroke="#ffffff" />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#00ffcc" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
