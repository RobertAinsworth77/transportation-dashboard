import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Progress, Statistic, Alert, Spin } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { UserOutlined, ClockCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';

interface CountrySummary {
  country: string;
  response_count: number;
  unique_employees: number;
  total_employees: number;
  response_rate: number;
}

interface TimePreference {
  preferred_timeframe: string;
  request_count: number;
}

interface LocationData {
  pickup_location?: string;
  dropoff_location?: string;
  request_count: number;
  percentage: number;
}

interface RouteData {
  pickup_location: string;
  dropoff_location: string;
  preferred_timeframe: string;
  request_count: number;
}

interface SummaryData {
  country_summary: CountrySummary[];
  time_preferences: TimePreference[];
}

interface CountryDetails {
  country: string;
  pickup_locations: LocationData[];
  dropoff_locations: LocationData[];
  time_preferences: TimePreference[];
  high_demand_routes: RouteData[];
}

const API_URL = "https://9wieil5vn5.execute-api.us-east-1.amazonaws.com/dev";

const LocationPreferences: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [countryDetails, setCountryDetails] = useState<CountryDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2'];

  useEffect(() => {
    fetchSummaryData();
  }, []);

  const fetchSummaryData = async (): Promise<void> => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_URL}/dashboard/location-preferences`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      
      setSummaryData(result.data);
      setError(null);
    } catch (err) {
      setError('Failed to load location preferences data');
      console.error('Error fetching summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCountryDetails = async (country: string): Promise<void> => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_URL}/dashboard/location-preferences/country/${encodeURIComponent(country)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      
      setCountryDetails(result.data);
      setError(null);
    } catch (err) {
      setError(`Failed to load details for ${country}`);
      console.error('Error fetching country details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCountrySelect = (country: string): void => {
    setSelectedCountry(country);
    fetchCountryDetails(country);
  };

  const renderCountryOverview = () => (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card title="📊 Location Preferences Overview" extra={<span>Next 14 Days</span>}>
          <Row gutter={[16, 16]}>
            {summaryData?.country_summary?.map((country) => (
              <Col xs={24} sm={12} lg={8} key={country.country}>
                <Card 
                  hoverable
                  onClick={() => handleCountrySelect(country.country)}
                  style={{ 
                    cursor: 'pointer',
                    border: selectedCountry === country.country ? '2px solid #1890ff' : '1px solid #d9d9d9'
                  }}
                >
                  <Statistic
                    title={`🇱🇨 ${country.country}`}
                    value={country.response_count}
                    suffix="responses"
                    prefix={<UserOutlined />}
                  />
                  <Progress 
                    percent={country.response_rate} 
                    size="small" 
                    status={country.response_rate > 70 ? 'success' : country.response_rate > 50 ? 'normal' : 'exception'}
                  />
                  <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
                    {country.unique_employees} of {country.total_employees} employees ({country.response_rate}%)
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      </Col>
    </Row>
  );

  const renderTimePreferences = () => (
    <Card title="⏰ Time Preference Distribution" style={{ marginTop: 16 }}>
      <ResponsiveContainer width="100%" height={300}>
        {<BarChart data={summaryData?.time_preferences as any}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="preferred_timeframe" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="request_count" fill="#1890ff" />
        </BarChart> as any}
      </ResponsiveContainer>
    </Card>
  );

  const renderCountryDetails = () => {
    if (!countryDetails) return null;

    const locationColumns = [
      {
        title: 'Location',
        dataIndex: 'pickup_location',
        key: 'location',
        render: (text: string) => <span><EnvironmentOutlined /> {text}</span>
      },
      {
        title: 'Requests',
        dataIndex: 'request_count',
        key: 'requests',
        sorter: (a: LocationData, b: LocationData) => a.request_count - b.request_count,
        defaultSortOrder: 'descend' as const
      },
      {
        title: 'Percentage',
        dataIndex: 'percentage',
        key: 'percentage',
        render: (percent: number) => <Progress percent={percent} size="small" showInfo={false} />
      }
    ];

    const routeColumns = [
      {
        title: 'Route',
        key: 'route',
        render: (record: RouteData) => `${record.pickup_location} → ${record.dropoff_location}`
      },
      {
        title: 'Time',
        dataIndex: 'preferred_timeframe',
        key: 'time',
        render: (time: string) => <span><ClockCircleOutlined /> {time}</span>
      },
      {
        title: 'Demand',
        dataIndex: 'request_count',
        key: 'demand',
        sorter: (a: RouteData, b: RouteData) => a.request_count - b.request_count,
        defaultSortOrder: 'descend' as const
      }
    ];

    return (
      <div style={{ marginTop: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title={`📍 Pickup Locations - ${countryDetails.country}`}>
              <Table 
                dataSource={countryDetails.pickup_locations} 
                columns={locationColumns}
                pagination={false}
                size="small"
                rowKey="pickup_location"
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title={`🎯 Dropoff Locations - ${countryDetails.country}`}>
              <Table 
                dataSource={countryDetails.dropoff_locations} 
                columns={locationColumns.map(col => 
                  col.dataIndex === 'pickup_location' 
                    ? { ...col, dataIndex: 'dropoff_location' }
                    : col
                )}
                pagination={false}
                size="small"
                rowKey="dropoff_location"
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} lg={12}>
            <Card title={`⏰ Time Preferences - ${countryDetails.country}`}>
              <ResponsiveContainer width="100%" height={250}>
                {<PieChart>
                  <Pie
                    data={countryDetails.time_preferences as any}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="request_count"
                    nameKey="preferred_timeframe"
                  >
                    {countryDetails.time_preferences?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    )) as any}
                  </Pie>
                  <Tooltip />
                </PieChart> as any}
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="💡 High Demand Routes" extra="3+ requests">
              <Table 
                dataSource={countryDetails.high_demand_routes} 
                columns={routeColumns}
                pagination={false}
                size="small"
                rowKey={(record: RouteData) => `${record.pickup_location}-${record.dropoff_location}-${record.preferred_timeframe}`}
              />
              {countryDetails.high_demand_routes?.length === 0 && (
                <Alert 
                  message="No high-demand routes found" 
                  description="Routes with 3+ requests will appear here"
                  type="info" 
                  showIcon 
                />
              )}
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  if (loading && !summaryData) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Loading location preferences...</div>
      </div>
    );
  }

  if (error && !summaryData) {
    return (
      <Alert
        message="Error Loading Data"
        description={error}
        type="error"
        showIcon
        style={{ margin: '20px' }}
      />
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: 16 }}>
        <h1>🗺️ Location Preferences Analytics</h1>
        <p>Employee transportation preferences for route planning optimization</p>
      </div>

      {renderCountryOverview()}
      {summaryData?.time_preferences && renderTimePreferences()}
      {selectedCountry && renderCountryDetails()}

      {error && (
        <Alert
          message="Warning"
          description={error}
          type="warning"
          showIcon
          closable
          style={{ marginTop: 16 }}
        />
      )}
    </div>
  );
};

export default LocationPreferences;
