import { VariableSizeGrid as Grid, FixedSizeList as List } from "react-window";
import * as XLSX from "xlsx";

import React, { useState, useEffect } from "react";
import "./ReactWindow.scss";


const ReactWindow = () => {

    const [dates, setDates] = useState(0);
    const [data, setData] = useState(0);
    const [filterData, setFilterData] = useState(0);
    const [Button, setButton] = useState(0);
    const [scrollto, setScrollto] = useState(0);
    const [gantt, setGantt] = useState(0);
    const [SFtime, setSFtime] = useState(0);

    var itemHeiht = 33;
  

    useEffect(() => {
        if (scrollto) {
            scrollFunc();
        }
        console.log(data)

    });
    const readExcel = (file) => {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        fileReader.onload = (e) => {
            const bufferArray = e.target.result;
            const wb = XLSX.read(bufferArray, { type: "dinary" });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const d = XLSX.utils.sheet_to_json(ws);
            const startArray = [];
            const finishArray = [];
            setData(d);
            setFilterData(d);
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
            for (let n = 0; n < d.length; n++) {
                d[n].Start = Datefomat(d[n].Start);
                d[n].Finish = Datefomat(d[n].Finish);
                startArray.push(new Date(d[n].Start));
                finishArray.push(new Date(d[n].Finish));

            }
            var maxDate = new Date(Math.max.apply(null, finishArray));
            var minDate = new Date(Math.min.apply(null, startArray));

            var Dates = [];

            //   let M = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.']



            var startDate = new Date(minDate.getFullYear(), (minDate.getMonth()), 1);

            var finishDate = new Date(maxDate.getFullYear(), (maxDate.getMonth() + 1), 0);


            while (startDate <= finishDate) {
                Dates.push(`${startDate.getDate()}`);

                startDate.setDate(startDate.getDate() + 1);
            }
            setSFtime([minDate, maxDate]);

            setDates(Dates);
            setClassArray(d);

            let GanttArray = [];

            for (let i = 0; i < d.length; i++) {
                let projectDate = new Date(minDate.getFullYear(), (minDate.getMonth()), 1);

                let projectStart = new Date(d[i].Start);
                let projectFinish = new Date(d[i].Finish)
                let projectSF = [];
                while (projectDate <= finishDate) {
                    if (projectStart <= projectDate && projectDate <= projectFinish) {
                        projectSF.push(1);
                    } else {
                        projectSF.push(0);
                    }
                    projectDate.setDate(projectDate.getDate() + 1);

                }
                GanttArray.push(projectSF)
            }

            //console.log(GanttArray)
            setGantt(GanttArray);
        };


    };


    const GetDatesBetweenDates = ({ firstDay, setEndDate }) => {
        let M = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.']

        let htmlyears = [];


        var month = new Date(firstDay.getFullYear(), (firstDay.getMonth()), 1);

        const theendDate = new Date(setEndDate.getFullYear(), (setEndDate.getMonth() + 1), 0);

        while (month <= theendDate) {
            let days = new Date(month.getFullYear(), Number(month.getMonth()) + 1, 0).getDate()

            let dWidth = Number(days) * 30 - 2;
            htmlyears.push(

                <div className='ganttYM' style={{ width: `${dWidth}px` }}>{month.getFullYear()}{M[month.getMonth()]}</div>

            )

            month.setMonth(month.getMonth() + 1)
        }
        return htmlyears;
    }

    const scrollFunc = () => {
        var Grid = document.querySelector('.Grid');
        Grid.scrollTo({
            top: scrollto
        });
    }
    const DropFunction = (e) => {
        let ide = e.target.id;
        ide = ide.split('i')[1];
        for (let i = 0; i < data.length; i++) {
            if (data[i].ID === ide) {
                var id = i
            }
        }

        var item = document.querySelector(`#item${ide}`);


        //setScrollto(item.offsetTop);
        setScrollto(item.offsetTop - e.clientY + 33);
        let NotesArray = data[Number(id)].Notes;

        data[id].State = (data[id].State === 'false' ? 'true' : 'false');
        if (data[id].State === "false") {
            /// open
            for (let i = 0; i < NotesArray.length; i++) {
                data[NotesArray[i]].Active = 'Yes';
            }
            for (let i = 0; i < NotesArray.length; i++) {
                if (data[NotesArray[i]].State !== 'null') {
                    const targets = data[NotesArray[i]].Notes;
                    for (let x = 0; x < targets.length; x++) {
                        if (data[NotesArray[i]].State === "true") {
                            data[targets[x]].Active = 'No';
                        }
                    }
                }
            }
        } else {
            /// close
            for (let i = 0; i < NotesArray.length; i++) {
                data[NotesArray[i]].Active = 'No'
            }
        }


        setData(data);
        setFilterData(data.filter((e) => e.Active === 'Yes'));
    }

    const setClassArray = (d) => {
        let b = [];
        //判斷任務子項目並塞入className
        for (let i = 0; i < d.length - 1; i++) {
            let Class = [];

            for (let j = i + 1; j < d.length; j++) {
                if (Number(d[i]['Outline Level']) === Number(d[j]['Outline Level'])) {
                    break;
                } else if (Number(d[i]['Outline Level']) < Number(d[j]['Outline Level'])) {

                    Class.push(j);
                }
            };
            d[i].Notes = Class;
            if (Number(d[i]['Outline Level']) < Number(d[i + 1]['Outline Level'])) {
                b.push(d[i].ID);
                d[i].State = 'false';
            } else {
                d[i].State = 'null'
            }
        }
        setButton(b)

    }







    const columnWidths = new Array(dates === 0 ? 1 : dates.length).fill(true).map((x, key) => {
        if (key === 0) {
            return 30;
        } else {
            return 30;
        }
    });
    const rowHeights = new Array(filterData === 0 ? 1 : filterData.length + 1).fill(true).map(() => itemHeiht);

    const Cell = ({ columnIndex, rowIndex, style }) => {

        if (rowIndex === 0) {
            return (
                <div className='item flexColumn itemDate' style={style}>
                    {dates !== 0 ? dates[columnIndex] : columnIndex}
                </div>
            )
        } else {
            if (gantt[rowIndex - 1][columnIndex] === 0) {
                return (
                    <div className='ganttitem' style={style}>
                    </div>
                );
            } else if (gantt[rowIndex - 1][columnIndex] === 1) {
                return (
                    <div className='ganttitem' style={style}>
                        <div className={` bar`}></div>
                    </div>
                );
            }

        }

    };

    const wei = (e) => {
        let scrollControlX = e.scrollLeft;
        let scrollControlY = e.scrollTop;
        var YAndM = document.querySelector('.YAndM')
        var ListW = document.querySelector('.List');
        YAndM.scrollTo({ left: Number(scrollControlX), behavior: "smooth" })
        ListW.scrollTo({ top: Number(scrollControlY) })

    };



    const Window = () => (
        <Grid
            className="Grid"
            id='GridID'
            columnCount={dates.length}
            columnWidth={(index) => columnWidths[index]}
            height={564}
            rowCount={Number(filterData.length) + 1}
            rowHeight={(index) => rowHeights[index]}
            width={500}
            onScroll={wei}
        >
            {Cell}
        </Grid>
    );


    const Row = ({ index, style }) => {
        if (Button.includes(filterData[index].ID)) {
            return (
                <div className='item ' id={`item${filterData[index].ID}`} style={style}>
                    <div style={{ paddingLeft: (filterData[index]['Outline Level'] * 20) - 20 }}>
                        <span className={`r${index} itemName material-symbols-outlined `} onClick={DropFunction} id={`i${filterData[index].ID}`}>
                            expand_less
                        </span>{filterData[index].Name}
                    </div>
                </div>
            );
        }
        else {
            return (
                <div className={'item '} style={style}>
                    <div style={{ paddingLeft: (filterData[index]['Outline Level'] * 20) }}>
                        {filterData[index].Name}
                    </div>
                </div >
            );
        }
    };

    const ListWindow = () => (
        <List
            className="List"
            height={564}
            itemCount={filterData.length}
            itemSize={itemHeiht}
            width={500}

        >
            {Row}
        </List>
    );

    return (
        <div className="container">
            <input
                type="file"
                onChange={(e) => {
                    const file = e.target.files[0];
                    readExcel(file);
                }}
            />
            <div className="Gantt">
                <div className="YAndM"><div className="YM"><div className="projectName" style={{ width: 500 }}>任務名稱</div>{SFtime !== 0 ? <GetDatesBetweenDates firstDay={SFtime[0]} setEndDate={SFtime[1]} /> : console.log('no time data')}</div></div>
                <div style={{ display: 'flex' }}>
                    <ListWindow />
                    <Window /></div>
            </div>

        </div>
    );
};
export default ReactWindow;
