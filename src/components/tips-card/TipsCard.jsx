import './TipsCard.css'; // Importing CSS file for styling
import dummyData from "../../data/dummy-data"; // Importing dummy data for tips

// TipsCard component
function TipsCard(){ 
    return(
        <>
            <div className="tips-card"> {/* Tips card container */}
            <h2 className='tips-header'>Tips</h2> {/* Tips header */}
            <div className="recipe-tips"> {/* List of recipe tips */}
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
// Export TipsCard component
export default TipsCard