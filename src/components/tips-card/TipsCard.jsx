import './TipsCard.css';
import dummyData from "../../data/dummy-data";


function TipsCard(){
    return(
        <>
            <div className="tips-card">
            <h2 className='tips-header'>Tips</h2>
            <div className="recipe-tips">
                 <ul>
                     {dummyData.recipeTips.map((tip, index) => (
                         <li key={index}>{tip}</li>
                     ))}
                 </ul>
             </div>
            </div>
        </>
    );
}

export default TipsCard