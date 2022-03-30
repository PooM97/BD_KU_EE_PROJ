import { request }from './request';

const COLOR_SET = [
    {
        borderColor: 'rgba(255, 70, 67, 1)',
        above: 'rgba(255, 70, 67, 0.1)',
        below: 'rgba(255, 70, 67, 0.1)',
        hoverBackgroundColor: 'rgba(255, 70, 67, 1)'
    },
    {
        borderColor: 'rgba(255, 212, 67 , 1)',
        above: 'rgba(255, 212, 67 , 0.1)',
        below: 'rgba(255, 212, 67 , 0.1)',
        hoverBackgroundColor: 'rgba(255, 212, 67, 1)'
    },
    {
        borderColor: 'rgba(59, 160, 63, 1)',
        above: 'rgba(59, 160, 63, 0.1)',
        below: 'rgba(59, 160, 63, 0.1)',
        hoverBackgroundColor: 'rgba(67, 255, 113, 1)'
    },
    {
        borderColor: 'rgba(255, 67, 224, 1)',
        above: 'rgba(255, 67, 224, 0.1)',
        below: 'rgba(255, 67, 224, 0.1)',
        hoverBackgroundColor: 'rgba(255, 67, 224, 1)'
    },
    {
        borderColor: 'rgba(172, 67, 255, 1)',
        above: 'rgba(172, 67, 255, 0.1)',
        below: 'rgba(172, 67, 255, 0.1)',
        hoverBackgroundColor: 'rgba(172, 67, 255, 1)'
    },    
]

async function getSensorData(formData, type) {
    if (type === 'period') {
        const {group, sensor, startDate, endDate} = formData
        const body = {start: startDate, end: endDate}
        if (sensor === 'all' || sensor === undefined) {        
            return await request("POST", `/ts/period/group/${group}`, undefined, body)        
        }
        return await request("POST", `/ts/period/sensor/${sensor}`, undefined, body)  
    }
    else if (type === 'limit'){
        const { sensor, limit } = formData
        return await request("GET", `/ts/limit/sensor/${sensor}`, {limit: limit})
    }
}

async function tableSetup(formData, setTableData, type='period') {
    try {
        const data =  await getSensorData(formData, type),
        cols = Object.keys(data).map((element) => { //setup cols
            const width = (element === "timestamp") ? 210 : 150
            return { field: element, headerName: element, width: width}
        }),
        rows = [];
        for(const i in data.timestamp) { // setup rows
            const rdata = {id: i}
            for(const k of Object.keys(data)){
                rdata[k] = (k === "timestamp") ? data[k][i].replace('T', ' ') : data[k][i]
            }
            rows.push(rdata)
        }
        setTableData({cols: cols, rows: rows})
    } catch (e) {
        console.log(e)
    }
}

async function chartSetup(formData,  setChartData, type='period') {    
    try {
        var data = await getSensorData(formData, type)
        let rawData = data
        const labels = Object.keys(rawData.timestamp).map(element => { //timestamp
            return rawData.timestamp[element].substring(11,19)
        })
        if (type === 'limit') {
            labels.reverse()
        }
        const setup_data = [];
        let index = 0;
        for(let key in rawData) {
            if (key === "timestamp") {
                continue;
            }
            let borderColor, above, below, hoverBackgroundColor;
            try {
                ({borderColor, above, below, hoverBackgroundColor}= COLOR_SET[index]);
                index++;
            }
            catch {
                ({borderColor, above, below, hoverBackgroundColor}= COLOR_SET[0]);
                index = 1;
            }
            let dataset = {}
            dataset["label"] = key
            dataset["data"] = []
            for(let i in rawData[key]) {
                dataset["data"].push(rawData[key][i])               
            } 
            if (type == 'limit') {
                dataset["data"].reverse()
            }
            dataset["borderColor"] = borderColor
            dataset["tension"] = 0.25
            dataset["fill"] = {
                target: 'origin',
                above: above, // Area will be red above the origin
                below: below
            }    
            dataset["hoverBackgroundColor"] = hoverBackgroundColor
            setup_data.push(dataset)
        }       
        setChartData({labels: labels, datasets: setup_data})
    }catch(e) {
        console.log(e)
    }
}

async function usersTableSetup(setTableData) {
    try{
        const res = await request("GET", '/user/all'),
        cols = [
            {field: 'username', headerName: 'Username', width: 300, editable: true,  },           
        ],
        rows = res.map((element, i) => {                  
            return {...element, id: i}            
        })
        setTableData({rows: rows, cols: cols})
    } catch(e) {
        console.log(e)
    }    
}

export { tableSetup, chartSetup, usersTableSetup }