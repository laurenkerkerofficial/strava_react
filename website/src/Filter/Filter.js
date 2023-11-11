import React, { useEffect, useState } from "react";
import * as constants from '../constants.js';
import Button from '@mui/material/Button';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from "@emotion/react";
import './Filter.css';

const Filter = () => {

    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
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

    
    const GetData = async() => {
        setIsLoading(true);
        try {
            const response = await fetch(`https://www.strava.com/oauth/token?client_id=${constants.clientId}&client_secret=${constants.clientSecret}&refresh_token=${constants.refreshToken}&grant_type=refresh_token`, { method: 'POST' });

            if (!response.ok){
                throw new Error(`Error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Access Token: ', result['access_token']);
            const activityData = await fetch(`https://www.strava.com/api/v3/athlete/activities?access_token=${result['access_token']}`, {method: 'GET'});
            if (!activityData.ok){
                throw new Error(`Error! Status: ${activityData.status}`);
            }
            const all_activities = await activityData.json()
            setActivities(all_activities);
        } catch (err) {
            setErr(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
        <div>
            {err && <h2>{err}</h2>}

            <Button variant="contained" color='navyBlue' onClick={GetData} className="filter-button">Filter</Button>

            {isLoading && <h2>Loading...</h2>}

            {activities.map((activities) =>(
                <p>{activities.name}</p>
            ))

            }

            {/* if you want to display 1 object */}

            {/* {activities && typeof activities === 'object' && Object.keys(activities).length > 0
                ? Object.keys(activities).map((key) => (
                    <div key={key}>
                    <h2>{key}: {activities[key]}</h2>
                    <br />
                    </div>
                ))
            : ""} */}
        </div>
        </ThemeProvider>
    );
  };
  
  export default Filter;