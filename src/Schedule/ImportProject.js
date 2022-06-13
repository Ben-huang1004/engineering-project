import { Fragment } from "react";
import './ImportProject.scss';
import disappear from './image/disappear.png'
import uploadIcon from './image/upload.png'


const ImportProject = ({onClick}) => {

  
    const ImportInterface = () => {
     
        return (<Fragment>

            <div className="Container">
                <div className="flexRow firstRow"><div className="tittle">匯入專案</div><div className="disappear" style={{ backgroundImage: `url(${disappear})` }} onClick={onClick}></div></div>
                <div className="bar"> </div>
                <div className="Content">
                    <div className="flexColumn">
                        <div className="flexRow">
                            <div className="projectName">專案名稱</div><div className="riceSize" id="riceSize1">*</div>
                        </div>
                        <input className="inputStyle" placeholder="輸入名稱" />
                    </div>
                    <div className="flexColumn">
                        <div className="flexRow">
                            <div className="projectName">匯入檔案</div><div className="riceSize" id="riceSize1">*</div>
                        </div>


                        <div className="selectFile">
                            <div className="center"><div className="uploadIcon" style={{ backgroundImage: `url(${uploadIcon})` }}></div></div>
                            <span>上傳檔案</span>
                            <input
                                type="file"
                                onChange={(e) => {
                                    const file = e.target.files[0];

                                }}
                            />
                        </div>

                    </div>
                    <div className="flexRow" style={{ justifyContent: 'space-between' }}>
                        <button className="cancel">取消</button>
                        <button className="enter">確定</button>
                    </div>
                </div>
            </div>

        </Fragment>);
    }
    return (<ImportInterface />);
}
export default ImportProject;