import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";

export default function LineDemo({
  attendanceData,
  totalStudents,
  studentUid,
}) {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    if (!attendanceData || !totalStudents) return;

    // Filter attendance data for the selected studentUid
    const studentAttendanceData = attendanceData.filter(
      (entry) => entry.id === studentUid
    );

    // Convert Firebase data to chart data format
    const chartData = studentAttendanceData.map((entry) => ({
      date: entry.date,
      attendance: entry.attendance === "Present" ? 1 : 0, // Convert 'Present' to 1, 'Absent' to 0
    }));

    // Extract unique dates for x-axis labels
    const uniqueDates = Array.from(new Set(chartData.map((data) => data.date)));
    const labels = uniqueDates.map((date) =>
      new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    );

    // Aggregate attendance data for each date
    const dataPoints = uniqueDates.map((date) => {
      const presentCount = chartData.filter(
        (data) => data.date === date && data.attendance === 1
      ).length;
      const absentCount = chartData.filter(
        (data) => data.date === date && data.attendance === 0
      ).length;
      return { date, presentCount, absentCount };
    });

    // Create the chart datasets
    const data = {
      labels: labels,
      datasets: [
        {
          label: "Present",
          data: dataPoints.map((point) => point.presentCount),
          fill: false,
          borderColor: "#92f592",
          tension: 0.4,
        },
        {
          label: "Absent",
          data: dataPoints.map((point) => point.absentCount),
          fill: false,
          borderColor: "#f18484",
          tension: 0.4,
        },
      ],
    };

    // Chart options
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: "black", // Customize legend color here
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "black", // Customize x-axis tick color here
          },
          grid: {
            color: "rgba(0, 0, 0, 0.1)", // Customize x-axis grid color here
          },
        },
        y: {
          min: 0,
          max: totalStudents, // Set the maximum value of y-axis to totalStudents
          ticks: {
            color: "black", // Customize y-axis tick color here
          },
          grid: {
            color: "rgba(0, 0, 0, 0.1)", // Customize y-axis grid color here
          },
        },
      },
    };
    setChartData(data);
    setChartOptions(options);
  }, [attendanceData, totalStudents, studentUid]);

  return (
    <div className="card">
      <Chart type="line" data={chartData} options={chartOptions} />
    </div>
  );
}
