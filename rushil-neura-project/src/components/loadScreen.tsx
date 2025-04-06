
const Card = () => {
  return (
    <div style={{
      position: 'absolute',
      width: '300px',
      height: '150px',
      backgroundColor: '#ffebee',
      border: '2px solid #f44336',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      margin: '20px auto',
      textAlign: 'center',
      top: '34%',
      left: '40%'
    }}>
      {/* Danger symbol (exclamation mark in triangle) */}
      <div style={{
        width: '50px',
        height: '50px',
        backgroundColor: '#f44336',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '15px',
        color: 'white',
        fontSize: '30px',
        fontWeight: 'bold'
      }}>
        !
      </div>
      
      <h3 style={{ color: '#d32f2f', margin: '0 0 10px 0' }}>Work in Progress</h3>
      <p style={{ color: '#5f2120', margin: 0 }}>
        We are still working on this, sorry :(
      </p>
    </div>
  );
};

export default Card;