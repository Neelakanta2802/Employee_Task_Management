import React from 'react';
import { useState } from 'react';

export default function ParkingfeeCollectionPractcie1() {
    const[vehicleType,setVehicleType] = useState("");
    const[entryTime,setEntryTime] = useState("");
    const[exitTime,setExitTime] = useState("");
    const[parkingFee,setParkingFee] = useState(null);

    //Result states
    const[error,setError] = useState("");
    const[duration,setDuration] = useState(null);
    const[billableHours,setBillableHours] = useState(null);

    //defining object
    const rates = {
     Bike: { firstHour: 20, additionalHour: 15, dailyMax: 150 },
    Car: { firstHour: 50, additionalHour: 30, dailyMax: 400 },
    SUV: { firstHour: 70, additionalHour: 40, dailyMax: 500 }
    }
    const calculateBill = ()=>{
        if(!vehicleType || !entryTime || !exitTime){
            setError("All fileds are required");
            return;
        }
        //converting timestamps into js object
        const start = new Date(entryTime);
        const end = new Date(exitTime);
        if(end<=start){
          setError("Exit Time shouldbe greater than entry Time ");
          return;
        }
        setError("");

        const durationInMilliSeconds = end-start; 
        const durationInMinutes = durationInMilliSeconds /(1000*60);
        //duration to display
        setDuration(`${Math.floor(durationInMinutes/60)}Hours : ${durationInMinutes%60}minutes `);
        const hours =Math.ceil(durationInMinutes/60) ;
        setBillableHours(hours);
        //calculate fee 
        let fee = 0;
        if(durationInMinutes > 15){
          const rate = rates[vehicleType] ;
          fee = rate.firstHour;
          if(hours > 1){
            fee += (hours-1)*rate.additionalHour;
          }
          fee = Math.min(fee,rate.dailyMax);
        }
        setParkingFee(fee);


    }
  return (
    <div>
        {error && <h2>{error}</h2>}
        {parkingFee !== null && (
        <h2>Total Fee: ₹{parkingFee}</h2>
      )}
        <select value={vehicleType} onChange={(e)=>setVehicleType(e.target.value)}>
        <option value="" disabled hidden>select the vehicle</option>
         <option value="Bike">Bike</option>   
         <option value="Car">Car</option> 
         <option value="SUV">SUV</option> 

        </select>
        <label htmlFor='meeting-time'>Select the date and time</label>
        <input type='datetime-local' value={entryTime} onChange={(e)=>setEntryTime(e.target.value)}></input>
        <input type='datetime-local' value={exitTime} onChange={(e)=>setExitTime(e.target.value)}></input>
        <button onClick={()=>calculateBill()}>Calculate</button>
        { parkingFee !== null && (
            <>
          <h2>parking Bill</h2>
          
            <h2>Vehicle:{vehicleType}</h2>
            <div>
            <h2>Entry:{entryTime}</h2>
            <h2>Exit:{exitTime}</h2>
            <h2>Duration:{duration}</h2>
            <h2>Billable Hours:{billableHours}</h2>
            <h2>Total:${parkingFee}</h2>
            
          </div>
          </>
        )
        }
    </div>
  )
}
