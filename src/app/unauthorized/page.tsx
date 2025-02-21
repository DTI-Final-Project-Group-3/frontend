export default function Unauthorized() {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center', 
        height: '100vh', flexDirection: 'column', textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2rem', color: '#e63946' }}>Unauthorized Access</h1>
        <p style={{ fontSize: '1.2rem', color: '#555' }}>
          You do not have permission to access this page.
        </p>
        <a href="/" style={{ marginTop: '20px', textDecoration: 'none', color: '#1d3557' }}>
          ← Go Back Home
        </a>
      </div>
    );
  }
  