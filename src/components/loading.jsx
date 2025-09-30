import "./loading.css"

function loading() {
  return (
     <div className="lds-layout">
        <div className="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        loading..
      </div>    
  )
}

export default loading