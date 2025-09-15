import React, { useState, useEffect } from 'react';
import { supabase } from '../SupabaseClient';
import { useAuth } from '../context/AuthContext';
import '../styles/Analytics.css';

const Analytics = () => {
  const { institutionId } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [incidentReports, setIncidentReports] = useState([]);
  const [drillAttendance, setDrillAttendance] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [drills, setDrills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!institutionId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const profilesRes = await supabase.from('profiles').select('*').eq('institution_id', institutionId).eq('role', 'student');
        const studentIds = (profilesRes.data || []).map(p => p.id);

        const [incidentRes, attendanceRes, feedbackRes, quizRes, drillsRes] = await Promise.all([
          supabase.from('incident_reports').select('*').in('reporter_id', studentIds),
          supabase.from('drill_attendance').select('*').in('user_id', studentIds),
          supabase.from('feedback').select('*').in('user_id', studentIds),
          supabase.from('quiz_attempts').select('*').in('user_id', studentIds),
          supabase.from('drills').select('*').eq('institution_id', institutionId)
        ]);

        setProfiles(profilesRes.data || []);
        setIncidentReports(incidentRes.data || []);
        setDrillAttendance(attendanceRes.data || []);
        setFeedback(feedbackRes.data || []);
        setQuizAttempts(quizRes.data || []);
        setDrills(drillsRes.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [institutionId]);

  // Calculate metrics
  const totalUsers = profiles.length;
  const sosUsers = incidentReports.filter(r => r.severity === 'high').length;
  const safeUsers = totalUsers - sosUsers;
  const unknownUsers = 0; // Assuming no unknown

  const safetyRate = totalUsers > 0 ? Math.round((safeUsers / totalUsers) * 100) : 0;
  const responseRate = drillAttendance.length > 0 ? Math.round((drillAttendance.filter(a => a.status === 'present').length / drillAttendance.length) * 100) : 0;

  // Preparedness index: average score from quiz attempts
  const avgScore = quizAttempts.length > 0 ? quizAttempts.reduce((sum, q) => sum + (q.score / q.max_score), 0) / quizAttempts.length * 100 : 0;
  const preparednessIndex = Math.round(avgScore);

  const preparednessData = [
    { day: 'Mon', index: preparednessIndex },
    { day: 'Tue', index: preparednessIndex },
    { day: 'Wed', index: preparednessIndex },
    { day: 'Thu', index: preparednessIndex },
    { day: 'Fri', index: preparednessIndex },
    { day: 'Sat', index: preparednessIndex },
    { day: 'Sun', index: preparednessIndex }
  ];

  // Alert response data from drills and attendance
  const alertResponseData = drills.map(drill => {
    const attendanceForDrill = drillAttendance.filter(a => a.drill_id === drill.id);
    const total = attendanceForDrill.length;
    const present = attendanceForDrill.filter(a => a.status === 'present').length;
    const participants = total > 0 ? Math.round((present / total) * 100) : 0;
    return {
      alert: drill.title,
      participants,
      date: new Date(drill.scheduled_at).toISOString().split('T')[0]
    };
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="analytics">
      <h3>System Analytics</h3>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-value">{totalUsers}</div>
          <div className="metric-label">Total Users</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-value">{safetyRate}%</div>
          <div className="metric-label">Safety Rate</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-value">{responseRate}%</div>
          <div className="metric-label">Response Rate</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-value">{sosUsers}</div>
          <div className="metric-label">Active SOS</div>
        </div>
      </div>
      
      <div className="charts-grid">
        <div className="chart-card">
          <h4>User Status Distribution</h4>
          <div className="status-chart">
            <div className="chart-bar safe-bar" style={{ width: `${(safeUsers / totalUsers) * 100}%` }}>
              <span>Safe: {safeUsers}</span>
            </div>
            <div className="chart-bar sos-bar" style={{ width: `${(sosUsers / totalUsers) * 100}%` }}>
              <span>SOS: {sosUsers}</span>
            </div>
            <div className="chart-bar unknown-bar" style={{ width: `${(unknownUsers / totalUsers) * 100}%` }}>
              <span>Unknown: {unknownUsers}</span>
            </div>
          </div>
        </div>
        
        <div className="chart-card">
          <h4>Preparedness Index Trend</h4>
          <div className="trend-chart">
            {preparednessData.map((item, index) => (
              <div key={index} className="trend-item">
                <div className="trend-bar" style={{ height: `${item.index}%` }}></div>
                <div className="trend-label">{item.day}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="alert-analytics">
        <h4>Alert Response Rates</h4>
        <div className="alert-table">
          <div className="alert-header">
            <span>Alert Type</span>
            <span>Participants</span>
            <span>Date</span>
          </div>
          {alertResponseData.map((alert, index) => (
            <div key={index} className="alert-row">
              <span>{alert.alert}</span>
              <span>{alert.participants}%</span>
              <span>{alert.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;