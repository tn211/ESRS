import './MethodCard.css'; // Importing CSS file for styling
import dummyData from "../../data/dummy-data"; // Importing dummy data

// Functional component for MethodCard
function MethodCard(){ 
    return(
        <>
            <div className="method-card">
            <h2 className='method-header'>Method</h2>
            <div className="recipe-method">
                 <ol>
                     {dummyData.recipeMethod.map((step, index) => (
                         <li key={index}>{step}</li> 
                     ))}
                 </ol>
             </div>
            </div>
        </>
    );
}
// Exporting MethodCard component
export default MethodCard