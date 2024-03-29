import './MethodCard.css';
import dummyData from "../../data/dummy-data";


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

export default MethodCard