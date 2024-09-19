import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StormReport } from '../types/StormReport';
import './StormReport.css';

const API_URL = import.meta.env.VITE_API_URL;

const StormReportComponent: React.FC = () => {
  const [reports, setReports] = useState<StormReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get<StormReport[]>(`${API_URL}/wind`);
        setReports(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching storm reports');
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return <p>Loading storm reports...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="storm-report-container">
      <h1>Storm Reports</h1>
      <div className="report-list">
        {reports.map((report, index) => (
          <div key={index} className="report-card">
            <h3>{report.location}</h3>
            <p><strong>Date:</strong> {report.date}</p>
            <p><strong>Time:</strong> {report.time}</p>
            <p><strong>Speed:</strong> {report.speed} mph</p>
            <p><strong>Severity:</strong> {report.severity}</p>
            {report.comments && <p><strong>Comments:</strong> {report.comments}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StormReportComponent;
