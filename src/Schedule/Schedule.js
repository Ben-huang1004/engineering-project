import './Schedule.scss';
import { useState, useEffect, Fragment } from 'react';
import paginationLeft from './image/left.png'
import paginationRight from './image/right.png'
import paginationFirst from './image/first.png'
import paginationLast from './image/last.png'
import search from './image/search.png'
import edit from './image/edit.png'
import trash from './image/trash.png'
import notYet from './image/notyet.png'
import finish from './image/finish.png'
import back from './image/back.png'
import ImportProject from './ImportProject';


const Schedule = ({ Data, Mode }) => {
    var dataNumber = Data.length;
    var maxPagination;
    dataNumber % 10 === 0 ? maxPagination = parseInt(dataNumber / 10) : maxPagination = parseInt(dataNumber / 10) + 1;

    const [paginationNow, setPaginationNow] = useState(0);
    const setPaginationNumber = (Data) => {
        let paginationArray = [];
        if (Data.length > 40) {
            paginationArray = [1, 2, 3, 4, 5]
        } else if (Data.length > 30) {
            paginationArray = [1, 2, 3, 4]
        }
        else if (Data.length > 20) {
            paginationArray = [1, 2, 3]
        }
        else if (Data.length > 10) {
            paginationArray = [1, 2]
        }
        else if (Data.length <= 10) {
            paginationArray = [1]
        }
        return paginationArray;
    }

    const [pagination, setPagination] = useState(setPaginationNumber(Data));
    useEffect(() => {


        console.log('now: ' + paginationNow);
        console.log('p: ' + pagination);
        console.log('max: ' + maxPagination);
        var paginationIcon = document.querySelectorAll('.paginationIcon');
        for (let i = 0; i < paginationIcon.length; i++) {
            paginationIcon[i].style.background = '#ffffff';
        }
        paginationIcon = document.getElementById(`#${paginationNow + 1}`);
        paginationIcon.style.background = '#6296fe';
    })

    const Right = () => {
        if (paginationNow < (maxPagination - 1)) { setPaginationNow(pre => (pre + 1)) };

        let P = paginationNow;

        console.log(paginationNow)
        if (Data.length > 40) {
            if (paginationNow >= (maxPagination - 3)) { setPagination([(maxPagination - 4), (maxPagination - 3), (maxPagination - 2), (maxPagination - 1), (maxPagination)]) }
            else if (paginationNow > 0) { setPagination([(P), (P + 1), (P + 2), (P + 3), (P + 4)]) };
        } else setPaginationNumber(Data);


    }

    const Left = () => {
        paginationNow !== 0 ? setPaginationNow(pre => (pre - 1)) : console.log('no')
        let P = paginationNow;
        if (Data.length > 40) {
            if (paginationNow < 3) { setPagination([1, 2, 3, 4, 5]) }
            else if (paginationNow <= maxPagination - 3) { setPagination([(P - 2), (P - 1), (P), (P + 1), (P + 2)]) };

        } else setPaginationNumber(Data);

    }
    const PaginationClick = (e) => {
        let id = e.target.id;
        let n = Number(id.split('#')[1]) - 1;
        setPaginationNow(n);

        if (Data.length > 40) {
            if (n > 1 && n < (maxPagination - 2)) { setPagination([n - 1, n, n + 1, n + 2, n + 3]) }
            else if (n === 1) { setPagination([n, n + 1, n + 2, n + 3, n + 4]) }
            else if (n === maxPagination - 2) { setPagination([n - 2, n - 1, n, n + 1, n + 2]) };

        } else setPaginationNumber(Data);

    }

    function First() {
        setPaginationNow(0);

        if (Data.length > 40) {
            setPagination([1, 2, 3, 4, 5]);
        } else setPaginationNumber(Data);

    }
    function Last() {
        setPaginationNow(maxPagination - 1);
        if (Data.length > 40) {
            setPagination([maxPagination - 4, maxPagination - 3, maxPagination - 2, maxPagination - 1, maxPagination]);
        } else setPaginationNumber(Data);

    }
    const Pagination = () => (
        <div className='pagination' style={{ display: 'flex' }}>
            {paginationNow !== 0 ? <button className='backgroundImage functionDisable' style={{ backgroundImage: `url(${paginationFirst})` }} onClick={First}></button> : <div></div>}
            <button className='backgroundImage functionDisable' style={{ backgroundImage: `url(${paginationLeft})` }} onClick={Left}></button>
            {pagination.map(x => (<button className='Circle paginationIcon functionDisable' id={`#${x}`} onClick={PaginationClick}>{x}</button>))}
            <button className='backgroundImage functionDisable' style={{ backgroundImage: `url(${paginationRight})` }} onClick={Right}></button>
            {paginationNow !== (maxPagination - 1) ? <button className='backgroundImage functionDisable' style={{ backgroundImage: `url(${paginationLast})` }} onClick={Last}></button> : <div></div>}
        </div>
    )

    const DataSegment = (d) => {

        let a = (d.length % 10);
        let arrayb = [];
        let arrayc = [];
        let arrayd = [];
        let b = parseInt(d.length / 10);

        for (let j = 0; j < b; j++) {
            arrayc = [];
            for (let i = (j * 10); i < ((j * 10) + 10); i++) {
                arrayc.push(d[i])

            }
            arrayb.push(arrayc)
        }

        for (let j = d.length - a; j < d.length; j++) {
            arrayd.push(d[j])
        }
        arrayb.push(arrayd);

        return (arrayb);
    }
    const ModeA = ({ data }) => {
        const [InterFace,setInterFace]=useState('close');

        const OpenInterFace=()=>{
        
        setInterFace('open');
        let background=document.querySelector('.BG')
        background.style.filter='blur(10px)';        
        console.log('open');
        let functionDisable=document.querySelectorAll('.functionDisable');
        for(let i=0;i<functionDisable.length;i++){
functionDisable[i].disabled=true;
        }
        
    }
        const CloseInterFace=()=>{
            setInterFace('close');
            let background=document.querySelector('.BG')
        background.style.filter='none';  
        let functionDisable=document.querySelectorAll('.functionDisable');
        functionDisable.forEach(x=>{
            x.disabled=false;
        }) 
        }
        
        const rowArray = [];
        const SegmentD = DataSegment(data);
        SegmentD[paginationNow].forEach((x, index) => {
            rowArray.push(<div className="ScheduleRow">
                <div className='rowName'>{x.Name}</div>
                <div className='rowPerson'>{(index + 1) + (paginationNow * 10)}</div>
                <div className='rowDate'>1,000</div>
                <div className='rowTime'>{x.Start}</div>
                <div className='rowProcess'>0%</div>
                <div className='rowLastTime'>{x.Finish}</div>
                <div className='rowOperate'>
                    <div className='operateImage' style={{ backgroundImage: `url(${edit})` }} ></div>
                    <div className='bar'></div>
                    <div className='operateImage' style={{ backgroundImage: `url(${trash})` }} ></div>
                    <div className='bar'></div>
                    <div className='operateImage' style={{ backgroundImage: `url(${search})` }} ></div>
                </div>
            </div>
            )
        })
        const ScheduleTittle = () => (
            <div className='ScheduleTittle'>
                <span className='TittleName'>
                    專案名稱
                </span>
                <span className='TittlePerson'>
                    專案負責人
                </span>
                <span className='TittleDate'>
                    預估工期
                </span>
                <span className='TittleTime'>
                    預期開始時間
                </span>
                <span className='TittleProcess'>
                    進度
                </span>
                <span className='TittleLastTime'>
                    最後填寫時間
                </span>
                <span className='TittleOperate'>
                    操作
                </span>
            </div>

        )
        return (
<Fragment>
            <div className='BG'>
                
                <div className='projectTittle'><div className='projectSchedule'>專案進度總表</div><div><button className='importProject functionDisable' onClick={OpenInterFace}>匯入專案</button><button className='addProject'>新增專案</button></div></div>
                <ScheduleTittle />
                {rowArray}
                <Pagination />
                
               

            </div>
            {InterFace==='open'? <ImportProject onClick={CloseInterFace}/>:console.log('interface is close')}
          </Fragment>
        )

    }
    const ModeB = ({ data }) => {
        const rowArray = [];
        const SegmentD = DataSegment(data);
        SegmentD[paginationNow].forEach((x, index) => {
            rowArray.push(<div className="ScheduleRow">
                <div className='rowName'>{x.Name}</div>
                <div className='rowStatus'><div className='statusIcon' style={{ backgroundImage: `url(${finish})` }} ></div><p>已完成</p></div>
                <div className='rowPerson'>某某某</div>
                <div className='rowEStartTime'>{x.Start}</div>
                <div className='rowProcess'>100天</div>
                <div className='rowStartTime'>{x.Finish}</div>
                <div className='rowCumulative'>100天</div>
                <div className='rowTimeS'>延遲</div>
            </div>
            )
        })
        const ScheduleTittle = () => (
            <div className='ScheduleTittle'>
                <span className='TittleName'>
                    專案名稱
                </span>
                <span className='TittleStatus'>
                    狀態
                </span>
                <span className='TittlePerson'>
                    負責人
                </span>
                <span className='TittleESStartTime'>
                    預期開始時間
                </span>
                <span className='TittleProcess'>
                    預估工期
                </span>
                <span className='TittleStartTime'>
                    開始時間
                </span>
                <span className='TittleCumulative'>
                    累積工期
                </span>
                <span className='TittleTimeS'>
                    工期狀態
                </span>
            </div>
        )
        return (<div className='BGB'>
            <div className='goBack'><div className='backIcon' style={{ backgroundImage: `url(${back})` }} ></div>返回</div>
            <div className='projectTittle'><div className='projectSchedule'>專案進度表</div> <div className='projectWeek'>每周彙整表</div></div>
            <div className='tittleBar'><div className='blueBar'></div></div>
            <div className='flexRow'>
                <div className='flexColumn'>
                    <div className='projectName'>長安大墩新建工程</div>
                    <div className='flexRow projectInfo'><div>專案負責人: </div><div>預計專案天數: </div><div>預計開始時間: </div>
                    </div></div>
                <button className='exportReport'>匯出報表</button>
            </div>
            <ScheduleTittle />
            {rowArray}
            <Pagination />

        </div >
        )

    }
    return (
        <Fragment>

            {Mode === 'A' ? <ModeA data={Data} /> : <ModeB data={Data} />}

        </Fragment>
    )
}
export default Schedule;