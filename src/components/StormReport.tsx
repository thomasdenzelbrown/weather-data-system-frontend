import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StormReport } from '../types/StormReport';
import './StormReport.css';

const API_URL = import.meta.env.VITE_API_URL;

const formatDate = (date: string): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (`0${d.getMonth() + 1}`).slice(-2);
  const day = (`0${d.getDate() + 1}`).slice(-2);
  return `${year}-${month}-${day}`;
};

const StormReportComponent: React.FC = () => {
  const [reports, setReports] = useState<StormReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchDate, setSearchDate] = useState<string>('');
  const [searchState, setSearchState] = useState<string>('');

  const fetchReports = async (date: string, state: string) => {
    try {
      setLoading(true);
      setError(null);

      const formattedDate = date ? formatDate(date) : '';

      const queryParams = new URLSearchParams();
      if (formattedDate) queryParams.append('date', formattedDate);
      if (state) queryParams.append('state', state);

      const response = await axios.get<StormReport[]>(`${API_URL}/wind?${queryParams}`);
      setReports(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching storm reports');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports('', '');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReports(searchDate, searchState);
  };

  return (
    <div className="storm-report-container">
      <h1>Storm Reports</h1>

      <form onSubmit={handleSearch} className="search-form">
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            placeholder="YYYY-MM-DD"
          />
        </div>
        <div>
          <label htmlFor="state">State:</label>
          <input
            type="text"
            id="state"
            placeholder="Enter state"
            value={searchState}
            onChange={(e) => setSearchState(e.target.value)}
          />
        </div>
        <button type="submit">Search</button>
      </form>

      {loading ? (
        <p>Loading storm reports...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="report-list">
          {reports.length === 0 ? (
            <p>No storm reports found.</p>
          ) : (
            reports.map((report, index) => (
              <div key={index} className="report-card">
                <h3>{report.location}</h3>
                <p><strong>Date:</strong> {report.date}</p>
                <p><strong>State:</strong> {report.state}</p>
                <p><strong>Time:</strong> {report.time}</p>
                <p><strong>Speed:</strong> {report.speed} mph</p>
                <p><strong>Severity:</strong> {report.severity}</p>
                {report.comments && <p><strong>Comments:</strong> {report.comments}</p>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default StormReportComponent;
