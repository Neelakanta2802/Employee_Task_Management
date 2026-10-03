import ExpenseTrackerPractice2 from './Components/ExpenseTrackerPractice1/ExpenseTrackerPractice2';
import EmployeeTaskManagementSystem from './Components/EmployeeTaskManagementSystem/EmployeeTaskManagementSystem';


export default function App() {
  return (
    // min-vh-100 forces the background gradient container to fill the full viewport height
    <div className='main-div min-vh-100 d-flex justify-content-center p-3 p-sm-5'>
     <EmployeeTaskManagementSystem/> 
    </div>
  );
}
