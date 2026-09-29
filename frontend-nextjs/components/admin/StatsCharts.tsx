"use client";

import { Bar, Doughnut, Line } from "react-chartjs-2";
import { BarElement, CategoryScale, Chart as ChartJS, ArcElement, LinearScale, LineElement, PointElement, Tooltip, Legend, Filler } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Tooltip, Legend, Filler);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { boxWidth: 10, usePointStyle: true }
    }
  },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { color: "rgba(15,23,42,0.06)" } }
  }
};

export function StatsCharts() {
  const labels = ["Jan", "Fev", "Mar", "Avr", "Mai", "Juin", "Juil"];
  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <div className="rounded-xl border border-[#eadfce] bg-white p-5 shadow-sm xl:col-span-2">
        <div className="mb-4">
          <h3 className="font-black text-slate-950">Demandes mensuelles</h3>
          <p className="text-sm text-slate-500">Evolution devis et rendez-vous.</p>
        </div>
        <div className="h-72">
          <Line
            options={chartOptions}
            data={{
              labels,
              datasets: [
                { label: "Devis", data: [12, 19, 14, 26, 31, 37, 42], borderColor: "#0b63ce", backgroundColor: "rgba(11,99,206,0.12)", fill: true, tension: 0.38 },
                { label: "RDV", data: [8, 13, 16, 15, 22, 29, 33], borderColor: "#16a34a", backgroundColor: "rgba(22,163,74,0.10)", fill: true, tension: 0.38 }
              ]
            }}
          />
        </div>
      </div>
      <div className="rounded-xl border border-[#eadfce] bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="font-black text-slate-950">Repartition</h3>
          <p className="text-sm text-slate-500">Types de services demandes.</p>
        </div>
        <div className="h-72">
          <Doughnut data={{ labels: ["Residentiel", "Commercial", "Specialise"], datasets: [{ data: [45, 35, 20], backgroundColor: ["#0b63ce", "#16a34a", "#ff7a1a"], borderWidth: 0 }] }} />
        </div>
      </div>
      <div className="rounded-xl border border-[#eadfce] bg-white p-5 shadow-sm xl:col-span-3">
        <div className="mb-4">
          <h3 className="font-black text-slate-950">Rendez-vous confirmes</h3>
          <p className="text-sm text-slate-500">Volume de confirmations par mois.</p>
        </div>
        <div className="h-72">
          <Bar options={chartOptions} data={{ labels, datasets: [{ label: "RDV confirmes", data: [8, 13, 16, 15, 22, 29, 36], backgroundColor: "#16a34a", borderRadius: 8 }] }} />
        </div>
      </div>
    </div>
  );
}
