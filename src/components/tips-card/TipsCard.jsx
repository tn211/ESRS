import './TipsCard.css';
import dummyData from "../../data/dummy-data";


function TipsCard(){
    return(
        <>
            <div className="tips-card">
            <h2 className='tips-header'>Method</h2>
            <div className="recipe-tips">
                 <ol>
                     {dummyData.recipeTips.map((tip, index) => (
                         <li key={index}>{tip}</li>
                     ))}
                 </ol>
             </div>
            </div>
        </>
    );
}

export default TipsCard