import ProgressBar from 'react-bootstrap/ProgressBar';
const progress = 80;
function Dashboard(){
    return(
        <>
        <div className="d-flex flex-column bg-info rounded p-3">
            <div className="d-flex flex-row justify-content-between">
                <p><small>Balance</small></p><p><small>Active Wallet</small></p>
            </div>


            <ProgressBar now={progress} label={`${progress}%`}/>
        </div>
        </>
    )
}
export default Dashboard