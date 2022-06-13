import React, { useState } from "react";
import * as XLSX from "xlsx";
import Schedule from "./Schedule/Schedule";



function App() {

    const [Data, setData] = useState(0);
    const [Mode, setMode] = useState('A');
    const readExcel = (file) => {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        fileReader.onload = (e) => {
            const bufferArray = e.target.result;
            const wb = XLSX.read(bufferArray, { type: "dinary" });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const d = XLSX.utils.sheet_to_json(ws);

            setData(d);
            for (let i = 0; i < d.length; i++) {
                d[i].Start = Datefomat(d[i].Start);
                d[i].Finish = Datefomat(d[i].Finish);
            }

        };


    };

    function Datefomat(setdate) {
        const str = setdate;
        const day = str.split(" ");
        const date = day[1].split("/")
        if ((date[0]) < 10) {
            date[0] = `0${date[0]}`
        }
        const fomatdate = `20${date[2]}/${date[0]}/${date[1]}`
        return (fomatdate);
    }
    function changeMode() {
        Mode === 'A' ? setMode('B') : setMode('A');
    }
    return (
        <div className="container">

            <input
                type="file"
                onChange={(e) => {
                    const file = e.target.files[0];
                    readExcel(file);
                }}
            />
            <button onClick={changeMode}>Change Mode</button>
            {console.log(Data)}
            {Data !== 0 ? <Schedule Data={Data} Mode={Mode} /> : console.log('no data')}

        </div>
    );
}

export default App;
