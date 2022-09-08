const tickerInput = document.querySelector('input')

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault()
    getTime(tickerInput.value);
    
    console.log('tickerInput.value: ' + tickerInput.value);
})

function getTime(cityVal)
{
    axios.get('https://api.ipgeolocation.io/timezone?apiKey=28b41d333504480c844fac22cabf10a1&location=' + cityVal) 
    .then((res) => {
        //get current date and time
        var today = new Date();
        var timeAmPm  = today.toLocaleString('en-US', { hour: 'numeric', hour12: true });
        var ampm = timeAmPm.slice(-2);

        // console.log(timeAmPm);
        // var ampm = timeAmPm.substring(-10);

        var time2 = today.getHours() + ":" + today.getMinutes(); //+ ":" + today.getSeconds();
        var time = "";
        // console.log(time);



        console.log(today.getHours());
        console.log(today.getMinutes());
        
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        console.log(today);
        
        let timeSub = time2.substring(0, 2);
        let timeVarParse = parseInt(timeSub);
        if (timeVarParse > 12 && timeVarParse <= 24) {
            timeVarParse = Math.abs(timeVarParse - 12);
        }

        console.log(timeVarParse);
        // let timeVarOneSecondP = time.substring(2);

        todayHours = timeVarParse;
        todayMinutes = today.getMinutes();
        todaySec = today.getSeconds();

        if(timeVarParse < 10)
        {
            time = time + "0" + todayHours;
        }
        else if (todayHours >= 10)
        {
            time = time + ":" + todayHours;
        }

        if(todayMinutes < 10)
        {
            time = time + ":0" + todayMinutes;
        }
        else if (todayMinutes >= 10)
        {
            time = time + ":" + todayMinutes;
        }


        if(todaySec < 10)
        {
            time = time + ":0" + todaySec;
        }
        else if (todaySec >= 10)
        {
            time = time + ":" + todaySec;
        }

        console.log(time);


        document.querySelector(".timeOne").innerText = time + " " + ampm + " " + timezone;
        document.querySelector(".dateOne").innerText = today.toDateString();

        var lat;
        var lng;
        getCoordinates();
        function getCoordinates() 
        {
            var options =
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            };

            function success(pos) {
                var crd = pos.coords;
                lat = crd.latitude.toString();
                lng = crd.longitude.toString();
                apiVar = "http://api.openweathermap.org/geo/1.0/reverse?lat=" + lat + "&lon=" + lng + "&limit=5&appid=194ee72d592f482a6b3c343c7d5b244f";
                console.log(apiVar)
                axios.get(apiVar)
                    .then((res1) => {
                        document.querySelector(".cityOne").innerText = "Time in " + res1.data[0].name;
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                return;
            }

            function error(err) {
                console.warn(`ERROR(${err.code}): ${err.message}`);
            }

            navigator.geolocation.getCurrentPosition(success, error, options);
        }

        cityOrState = res.data.geo.city;
        if (cityOrState == "") {
            if (res.data.geo.state != "")
            {
                cityOrState = res.data.geo.state;
            }
            else{
                cityOrState = tickerInput.value;
                console.log(tickerInput.value);
            }

        }
        
        // New Location City Portrayed
        document.querySelector(".cityTwo").innerText = "Time in " + cityOrState + ", " + res.data.geo.country;

        // New Location Time & TZ portrayed
        document.querySelector(".timeTwo").innerText = res.data.time_12 + " " + res.data.timezone;


        dateTwoLocation1 = res.data.date_time_wti.substring(0, 3);
        dateTwoLocation2 = res.data.date_time_wti.substring(8, 11);
        dateTwoLocation3 = res.data.date_time_wti.substring(5, 7);
        dateTwoLocation4 = res.data.date_time_wti.substring(12, 16);

        document.querySelector(".dateTwo").innerText = dateTwoLocation1 + " " + dateTwoLocation2 + " " + dateTwoLocation3 + " " + dateTwoLocation4;


        function getTimeZoneOffset(date, timeZone) {

            // Abuse the Intl API to get a local ISO 8601 string for a given time zone.
            let iso = date.toLocaleString('en-CA', { timeZone, hour12: false }).replace(', ', 'T');
            
            // Include the milliseconds from the original timestamp
            iso += '.' + date.getMilliseconds().toString().padStart(3, '0');
            
            // Lie to the Date object constructor that it's a UTC time.
            const lie = new Date(iso + 'Z');
          
            return -(lie - date) / 60 / 1000;
          }

        console.log(getTimeZoneOffset(new Date(), timezone)); //=> 240
        console.log(getTimeZoneOffset(new Date(), res.data.timezone)); //=> -480

        currentTZ = getTimeZoneOffset(new Date(), timezone);
        newTZ = getTimeZoneOffset(new Date(), res.data.timezone);
        let difference = currentTZ - newTZ;
        let diffHrs = difference / 60;
        let posNeg = "";

        if (diffHrs >= 0)
        {
            posNeg = "+";
        }
        if (res.data.city != "" && res.data.state != "")
        {
            document.querySelector(".diffTwo").innerText = posNeg + " " + diffHrs + " Hour(s)";
        }


    })

    .catch((err) => {
        document.querySelector(".cityTwo").innerText = "Invalid Location";
        document.querySelector(".timeTwo").innerText = "";
        document.querySelector(".dateTwo").innerText = "";
        console.log(err);
    })
}

getTime("Denver");


