import React, { useEffect, useState } from "react";
import * as constants from '../constants.js';
import Button from '@mui/material/Button';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from "@emotion/react";
import './Filter.css';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

const Filter = () => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isData, setIsData] = useState(false);
  const [err, setErr] = useState('');

  const { palette } = createTheme();
  const { augmentColor } = palette;
  const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });
  const theme = createTheme({
    palette: {
      orange: createColor('#FC4C02'),
      navyBlue: createColor('#243856'),
      steelBlue: createColor('#5C76B7'),
      violet: createColor('#BC00A3'),
    },
  });

  const [selectedActivity, setSelectedActivity] = useState('All');
  let [filteredActivities, setFilteredActivities] = useState(null);
  const options = ['All', 'Run', 'Ride', 'WeightTraining'];

  const handleOptionChange = (event) => {setSelectedActivity(event.target.value)};

  const [startDate, setStartDate] = React.useState(dayjs('2022-04-17'));
  const [endDate, setEndDate] = React.useState(dayjs('2023-11-28'));
  
  function formatDate(rowDate) {
    var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = new Date(rowDate).toLocaleDateString("en-US", options);
    return formattedDate
  };

  const GetData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://www.strava.com/oauth/token?client_id=${constants.clientId}&client_secret=${constants.clientSecret}&refresh_token=${constants.refreshToken}&grant_type=refresh_token`, { method: 'POST' });

      if (!response.ok){
        throw new Error(`Error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Access Token: ', result['access_token']);

    console.log(startDate.$d);
      var start = startDate.$d.getTime()/1000.0;
      console.log("Epoch After Time: ", (start));
      var end = endDate.$d.getTime()/1000.0;
      console.log("Epoch Before Time: ", (end));

      const activityData = await fetch(`https://www.strava.com/api/v3/athlete/activities?before=${end}&after=${start}&per_page=200`, { 
        method: 'GET',
        headers: {
            Authorization: `Bearer ${result['access_token']}`
        } 
    });
      if (!activityData.ok){
        throw new Error(`Error! Status: ${activityData.status}`);
      }

      const all_activities = await activityData.json()
      setActivities(all_activities);
      setIsData(true);
    } catch (err) {
      setErr(err.message);
    } finally {
      setIsLoading(false);
      if (selectedActivity === 'All') {
        filteredActivities = activities;
    } else {
        filteredActivities = activities.filter((activity) => activity.type === selectedActivity);
        console.log(filteredActivities)
    }
    }
  };

  useEffect(() => {
    // Apply filter when selectedActivity changes
    if (activities.length > 0) {
      const filtered = selectedActivity === 'All'
        ? activities
        : activities.filter((activity) => activity.type === selectedActivity);
      setFilteredActivities(filtered);
    }
  }, [selectedActivity, activities]);

  return (
    <ThemeProvider theme={theme}>
      <div>
        <div className="filtering">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker', 'DatePicker']}>
                        <div className="date-selection">
                            <DatePicker
                            label="Start Date"
                            value={startDate}
                            onChange={(newValue) => setStartDate(newValue)}
                            />
                                 
                            <DatePicker
                            label="End Date"
                            value={endDate}
                            onChange={(newValue) => setEndDate(newValue)}
                            />
                        </div>
                </DemoContainer>
            </LocalizationProvider>
            <br/>
            <div className='dropdown-container'>
            <FormControl fullWidth>
                <InputLabel id="dropdown-label">Activity</InputLabel>
                <Select
                    labelId="dropdown-label"
                    id="dropdown"
                    value={selectedActivity}
                    onChange={handleOptionChange}
                    >
                    {options.map((option) => (
                        <MenuItem key={option} value={option}>
                        {option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            </div>
            <br/>
            <br/>
            <Button variant="contained" color='navyBlue' onClick={GetData} id="filter-button">Filter</Button>

            <br/>

            {isLoading && <h2>Loading...</h2>}
            
        </div>

        <table>
          {isData && <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Date</th>
            </tr>
          </thead>}
          <tbody>
          {filteredActivities !== null && filteredActivities !== undefined && (filteredActivities.map((activity) => (
              <tr key={activity.id}>
                <td>
                    <a href={`https://www.strava.com/activities/${activity.id}`} target="_blank" rel="noopener noreferrer">
                    {activity.name}
                    </a>
                </td>
                <td>{activity.type}</td>
                <td>{formatDate(activity.start_date_local)}</td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </ThemeProvider>
  );
};

export default Filter;