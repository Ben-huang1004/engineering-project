
import * as XLSX from "xlsx";
import React, { useState, useEffect } from "react";
import './Gantt.scss';
import { FixedSizeList as List } from 'react-window';

const Gantt = () => {
  const [dTime, setTime] = useState(0);
  const [cardData, setCardData] = useState(0);
  const [data, setData] = useState(0);
  const [classArray, setclass] = useState(0);
  const [SFtime, setSFtime] = useState(0);
  const [PJTime, setPJTime] = useState(0);
  const [YMNumber, setYMNumber] = useState(0);

  //設置監聽
  useEffect(() => {
    var flex = document.querySelector('.flex');
    console.log(flex.scrollWidth)
    var sheetGantt = document.querySelector('.sheetGantt');

    sheetGantt.addEventListener('scoll', scrollControl);

    console.log(PJTime)
    //點擊gantt Bar 讓card出現的監聽 
    var bar = document.querySelectorAll('.bar');
    for (let i = 0; i < bar.length; i++) {
      bar[i].addEventListener('click', barFunc);
    }
    //讓card消失的XX監聽
    var X = document.querySelector('.X');
    X.addEventListener('click', disappear);
    //點擊專案名稱讓表格滑動到開始時間的監聽
    var scroll = document.querySelectorAll('.itemsName');
    for (let i = 0; i < scroll.length; i++) {
      scroll[i].addEventListener('click', scrollFunc.bind(null, i));
    }
    //listener of show less/more
    var setListener = document.querySelectorAll('.listener');
    for (let i = 0; i < setListener.length; i++) {
      setListener[i].addEventListener('click', click);
    }
  })
  const scrollControl = () => { };

  //Card show positionXY
  const barFunc = (e) => {
    let barY = e.target.getBoundingClientRect().y;
    let bNumber = e.target.className.split(' ')[0];
    let j = Number(bNumber.replace('b', ''));
    setCardData(data[j]);//set Card所需資料

    var a = document.getElementById('calcCardXY');//calcCardXY要設id在包住gantt sheet最外層的box
    let x = a.scrollLeft;
    let y = a.scrollTop;
    let boxX = a.offsetLeft;
    let boxY = a.offsetTop;
    var card = document.querySelector('.card');
    let containersize = [a.clientHeight, a.clientWidth];
    var cards = document.getElementById("cardid");
    cards.style.display = 'block';

    //計算Card出現的位置XY
    if (e.clientY > (boxY + (containersize[0] / 2))) {
      if (e.clientX > (boxX + (containersize[1] * 3 / 4))) {
        card.style.left = `${e.clientX + x - boxX - (card.clientWidth)}px`;
        card.style.top = `${barY - 20 + y - boxY - (card.clientHeight)}px`;
      } else {
        card.style.left = `${e.clientX + x - boxX}px`;
        card.style.top = `${barY - 20 + y - boxY - (card.clientHeight)}px`;
      }
    } else {
      if (e.clientX > (boxX + (containersize[1] * 3 / 4))) {
        card.style.left = `${e.clientX + x - boxX - (card.clientWidth)}px`;
        card.style.top = `${barY + 20 + y - boxY}px`;
      } else {
        card.style.left = `${e.clientX + x - boxX}px`;
        card.style.top = `${barY + 20 + y - boxY}px`;
      }

    }
  }
  //disapear Card
  function disappear() {
    var x = document.getElementById("cardid");
    //console.log(x);
    x.style.display = 'none';
  }
  //scroll to items start time
  const scrollFunc = (i) => {
    var scrollContainer = document.querySelector('.sheetGantt');
    let sheetBorder = document.querySelector('.sheetBorder');
    let d = (dTime[i] * (sheetBorder.offsetWidth)) - 20;

    scrollContainer.scrollTo({ left: d, behavior: 'smooth' });
  }
  //任務名稱與Gantt展開、收起
  const click = (e) => {
    const elements = document.querySelectorAll(`.${e.target.id}`);
    e.target.setAttribute(
      "state",
      e.target.getAttribute("state") === "false" ? "true" : "false"
    );
    // e.target.textContent = e.target.textContent === "expand_less" ? "expand_more" : "expand_less";

    if (e.target.getAttribute("state") === "false") {
      /// open
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = "";
      }
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].getAttribute("state") !== null) {
          const targets = document.querySelectorAll(`.${elements[i].id}`);
          for (let x = 0; x < targets.length; x++) {
            if (elements[i].getAttribute("state") === "true") {
              targets[x].style.display = "none";

            }
          }
        }
      }
    } else {

      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = "none";
      }
    }
  };
  //讀取exel檔
  const readExcel = (file) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (e) => {
      const bufferArray = e.target.result;
      const wb = XLSX.read(bufferArray, { type: "dinary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const d = XLSX.utils.sheet_to_json(ws);

      //日期格式整理Mon/5/03/21 to 2021/05/03 
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

      //setuseState前置
      let startArray = [];
      let finishArray = [];
      let DataArray = [];
      for (let n = 0; n < d.length; n++) {
        d[n].Start = Datefomat(d[n].Start);
        d[n].Finish = Datefomat(d[n].Finish);
        DataArray.push([d[n].Name, d[n].Start, d[n].Finish, d[n].ID, d[n]['Outline Level']]);
        startArray.push(new Date(d[n].Start));
        finishArray.push(new Date(d[n].Finish));
      }
      var maxDate = new Date(Math.max.apply(null, finishArray));
      var minDate = new Date(Math.min.apply(null, startArray));
      let timeArray = [];
      let stDate = new Date(`${minDate.getFullYear()}/${minDate.getMonth() + 1}/1`)
      //每個開始時間與Gantt起始時間的差距
      for (let i = 0; i < startArray.length; i++) {
        timeArray.push(new Date((startArray[i]) - new Date(stDate)) / 60 / 60 / 24 / 1000);
      }
      //set useState
      setTime(timeArray);
      setData(DataArray);
      setClassArray(d);
      setSFtime([minDate, maxDate]);
      setPJTime([startArray, finishArray]);
      //console.log(d[0].Start);
      // var className = setHtml(d);
      // let html = getDatesBetweenDates(minDate, maxDate);
      // var flex = document.querySelector('.flex');
      // flex.innerHTML = html;

    };
  };
  //Gantt sheet的年與月

  const GetDatesBetweenDates = ({ firstDay, setEndDate }) => {


    let M = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.']

    let htmlyears = [];


    var month = new Date(firstDay.getFullYear(), (firstDay.getMonth()), 1);

    const theendDate = new Date(setEndDate.getFullYear(), (setEndDate.getMonth() + 1), 0);
    var j = 0;
    while (month <= theendDate) {
      let days = new Date(month.getFullYear(), Number(month.getMonth()) + 1, 0).getDate()
      let day = Array(days).fill('true');

      htmlyears.push(
        <div className='grid-container'>
          <div className='ganttYM'>{month.getFullYear()}{M[month.getMonth()]}</div>
          <div className='flex-column'><div className='flex-row gDate'>{
            day.map((x, key) => (<div className="ganttDate">{key + 1}</div>))
          }</div><div className={`ganttSheet${j} flex-row`}>{day.map((x, key) => <div className="flex-column">{getSheet(month, key)}</div>)}</div></div></div>
      )
      j += 1;
      month.setMonth(month.getMonth() + 1)
    }

    // while (month <= theendDate) {
    //   let days = new Date(month.getFullYear(), Number(month.getMonth()) + 1, 0).getDate()
    //   str += `<div class='grid-container'> <div class='ganttYM'>${month.getFullYear()}${M[month.getMonth()]} </div><div class='flex-column'><div class='flex-row gDate'>`
    //   for (let i = 1; i <= days; i++) {
    //     let today = new Date(`${month.getFullYear()}/ ${month.getMonth() + 1}/${i}`)
    //     if (String(today) === String(str2)) {
    //       if (i < 10) {
    //         str += `<div class='ganttDate' style='background:rgba(255, 166, 0, 0.419)'>0${i}</div>`;
    //       } else { str += `<div class='ganttDate' style='background:rgba(255, 166, 0, 0.419)'>${i}</div>`; }
    //     } else {
    //       if (i < 10) {
    //         str += `<div class='ganttDate'>0${i}</div>`;
    //       } else { str += `<div class='ganttDate'>${i}</div>`; }
    //     }


    //   }
    //   str += `</div><div class='ganttSheet${j}'>sheet</div></div></div>`
    //   j += 1;
    //   month.setMonth(month.getMonth() + 1)
    // }

    return htmlyears;
  }
  //Gantt sheet的表格和gantt bar
  const getSheet = (month, key) => {

    let html = [];
    key += 1;
    var today = new Date();
    var istoday = new Date(`${month.getFullYear()}/${month.getMonth() + 1}/${key}`);

    if (String(today) !== String(istoday)) {
      for (let i = 0; i < PJTime[0].length; i++) {
        let itemclass = classArray[i];
        let items = PJTime[0][i];
        let itemf = PJTime[1][i];
        if (istoday >= items && istoday <= itemf) {
          html.push(<div className={`sheetBorderBar ${itemclass}`}><div className={`b${i} bar`}></div></div>)

        } else {
          html.push(<div className={`sheetBorder ${itemclass}`}></div>)

        }
      }
    }
    return (html);

    // var today = new Date();
    // var str = new Date(`${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`)
    // var k = 0;
    // var month = new Date(firstDay.getFullYear(), (firstDay.getMonth()), 1);
    // const theendDate = new Date(setEndDate.getFullYear(), (setEndDate.getMonth() + 1), 0);
    // //以月為單位新增 直到gantt表格的最後一天
    // while (month <= theendDate) {
    //   let days = new Date(month.getFullYear(), Number(month.getMonth()) + 1, 0).getDate()
    //   var sheet = '';
    //   for (let j = 0; j < itemStart.length; j++) {
    //     const items = itemStart[j];
    //     const itemf = itemEnd[j];
    //     const itemclass = className[j];
    //     sheet += `<div class='flex-row ${itemclass}'>`

    //     for (let i = 1; i <= days; i++) {
    //       let today = new Date(`${month.getFullYear()}/${month.getMonth() + 1}/${i}`)
    //       //判斷什麼時候新增gantt bar
    //       if (String(today) === String(str)) {
    //         //特別標示今天
    //         if (today >= items && today <= itemf) {
    //           sheet += `<div class='sheetBorderBar' style='background:rgba(255, 166, 0, 0.419)' ><div class='b${j} bar bar2' style='color:rgba(128, 128, 128, 0.537)'></div></div>`
    //         } else {
    //           sheet += `<div class='sheetBorder' style='background:rgba(255, 166, 0, 0.419)'></div>`
    //         }
    //       }
    //       //一般時的gantt bar
    //       else {
    //         if (today >= items && today <= itemf) {
    //           sheet += `<div class='sheetBorderBar'><div class='b${j} bar'></div></div>`
    //         } else {
    //           sheet += `<div class='sheetBorder'></div>`
    //         }
    //       }
    //     }
    //     sheet += `</div>`
    //   }
    //   //var ganttsheet = document.querySelector(`.ganttSheet${k}`)
    //   // ganttsheet.innerHTML = sheet;
    //   sheet = '';
    //   k += 1;
    //   month.setMonth(month.getMonth() + 1)
    // }

  }
  const Htmlfor = () => {
    let d = data;
    let htmlArray = [];
    for (let i = 0; i < d.length; i++) {
      if (i < d.length - 1) {
        if (Number(d[i][4]) === Number(d[i + 1][4]) - 1) {
          htmlArray.push(<div style={{ fontWeight: 'bold', paddingLeft: `${((Number(d[i][4]) * 30) - 30)}px` }} className={`items ${classArray[i]}`} state="false"> <span className=" material-symbols-outlined listener" state="false" id={`c${d[i][3]}`}>
            expand_more</span><div className="itemsName" >{d[i][0]}</div></div>)
        } else {
          htmlArray.push(<div style={{ paddingLeft: `${((Number(d[i][4]) * 30))}px` }} className={`items ${classArray[i]}`}><div className="itemsName">{d[i][0]}</div></div>)
        }

      } else { htmlArray.push(<div style={{ paddingLeft: `${((Number(d[i][4]) * 30))}px` }} className={`items ${classArray[i]}`}><div className="itemsName">{d[i][0]}</div></div>) }

    }

    return htmlArray;

  }
  const Html = ({ d, classArray }) => {
    return (<div>
      <div className="items title">任務名稱</div>
      {
        //d.map((elements, key) => (<div className="items">{elements[0]}</div>))
        Htmlfor()
      }
    </div>
    );
  }


  const setClassArray = (d) => {
    var className = [];
    //判斷任務子項目並塞入className
    for (let i = d.length - 1; i >= 0; i--) {
      let str = '';
      let n = d[i]['Outline Level'] - 1;
      for (let j = i - 1; j >= 0; j--) {
        if (d[j]['Outline Level'] === String(n)) {
          str += `c${d[j].ID} `;
          n = n - 1;
        }
        if (n === 0) { break; }
      }
      className.unshift(str);
    }
    setclass(className);
  }

  //任務名稱那一欄
  // const setHtml = (d) => {
  //   var className = [];
  //   //判斷任務子項目並塞入className
  //   for (let i = d.length - 1; i >= 0; i--) {
  //     let str = '';
  //     let n = d[i]['Outline Level'] - 1;
  //     for (let j = i - 1; j >= 0; j--) {
  //       if (d[j]['Outline Level'] === String(n)) {
  //         str += `c${d[j].ID} `;
  //         n = n - 1;
  //       }
  //       if (n === 0) { break; }
  //     }
  //     className.unshift(str);
  //   }

  //   let Html = '<div class="items title">任務名稱</div>';

  //   for (let i = 0; i < d.length; i++) {
  //     if (i < d.length - 1) {
  //       if (Number(d[i]['Outline Level']) === Number(d[i + 1]['Outline Level']) - 1) {
  //         Html += `<div style="font-weight:bold; padding-left:${((Number(d[i]['Outline Level']) * 30) - 30)}px" class="items ${className[i]}"  state="false"> <span class=" material-symbols-outlined listener" state="false" " id="c${d[i].ID}">
  //         expand_more</span><div class="itemsName" >${d[i].Name}</div></div>`
  //       } else {
  //         Html += `<div style=padding-left:${((Number(d[i]['Outline Level']) * 30))}px class="items ${className[i]}"><div class="itemsName">${d[i].Name}</div></div>`
  //       }
  //     } else { Html += `<div style=padding-left:${((Number(d[i]['Outline Level']) * 30))}px class="items ${className[i]}"><div class="itemsName">${d[i].Name}</div></div>` }
  //   }
  //   var sheet = document.querySelector('.sheet');
  //   //console.log(sheet)
  //   sheet.innerHTML = Html;
  //   //console.log(sheet)
  //   return className;
  // }



  return (
    <div className="container">

      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files[0];
          readExcel(file);
        }}
      />
      <div className="ganttcontainer">
        <div className="sideBar">
          <div className="sideBarItems">

            <div className="Rectangle"><span className="project">專案進度表</span></div>
            <div className="Rectangle"><span>日報總表</span></div>
            <div className="Rectangle"><span>權限設定</span></div>
            <div className="Rectangle"> <span>帳號設定</span></div>
            <div className="Rectangle"><span>通知設定</span></div>
          </div>
        </div>
        <div className="BG">
          <div className="sheetGantt" id='calcCardXY'>
            <div className="sheet">
              {data !== 0 && classArray !== 0 ? < Html d={data} classArray={classArray} /> : console.log('no data')}
            </div>

            <div className='flex'>
              {SFtime !== 0 ? <GetDatesBetweenDates firstDay={SFtime[0]} setEndDate={SFtime[1]} /> : console.log('no time data')}
            </div>
            <div className="card" id="cardid">
              <button className="X">x</button>
              <p>任務名稱:{cardData[0]}</p>
              <p>開始時間:{cardData[1]}</p>
              <p>結束時間:{cardData[2]}</p>
            </div>
          </div>
        </div>
      </div>
    </div >


  );
};

export default Gantt;
