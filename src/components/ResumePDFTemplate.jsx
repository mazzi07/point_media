
export default function ResumePDFTemplate({ user, curriculo, habilidades }) {
  const styles = {
    container: {
      padding: '40px',
      fontFamily: 'Arial, sans-serif',
      color: '#333',
      backgroundColor: '#fff',
      lineHeight: '1.6',
      width: '800px', // Mantém a escala do PDF A4 igual em telas pequenas e grandes.
    },
    header: {
      borderBottom: '2px solid #3182ce',
      paddingBottom: '20px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    },
    avatar: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      objectFit: 'cover'
    },
    name: {
      fontSize: '28px',
      fontWeight: 'bold',
      margin: '0 0 5px 0',
      color: '#2c5282'
    },
    contact: {
      fontSize: '14px',
      color: '#555',
      margin: '2px 0'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#2c5282',
      textTransform: 'uppercase',
      borderBottom: '1px solid #e2e8f0',
      paddingBottom: '5px',
      marginTop: '20px',
      marginBottom: '15px'
    },
    text: {
      fontSize: '14px',
      whiteSpace: 'pre-wrap'
    },
    skillsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px'
    },
    skillBadge: {
      backgroundColor: '#ebf8ff',
      color: '#3182ce',
      border: '1px solid #3182ce',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      lineHeight: '1'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        {user?.avatar && <img src={user.avatar} alt="Avatar" style={styles.avatar} />}
        <div>
          <h1 style={styles.name}>{user?.nome}</h1>
          <p style={styles.contact}>{user?.email}</p>
          {curriculo?.cargo && <p style={styles.contact}><strong>Cargo:</strong> {curriculo.cargo}</p>}
          {curriculo?.linkedin && <p style={styles.contact}><strong>LinkedIn:</strong> {curriculo.linkedin}</p>}
          {curriculo?.github && <p style={styles.contact}><strong>GitHub:</strong> {curriculo.github}</p>}
        </div>
      </div>

      <h2 style={styles.sectionTitle}>Experiência Profissional e Resumo</h2>
      <div style={styles.text}>
        {curriculo?.experiencia || 'Não informado.'}
      </div>

      <h2 style={styles.sectionTitle}>Habilidades Técnicas</h2>
      <div style={styles.skillsContainer}>
        {habilidades && habilidades.length > 0 ? (
          habilidades.map(skill => (
            <span key={skill} style={styles.skillBadge}>{skill}</span>
          ))
        ) : (
          <span style={styles.text}>Nenhuma habilidade listada.</span>
        )}
      </div>
    </div>
  );
}
