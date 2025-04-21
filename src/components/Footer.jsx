import React from 'react';

function Footer() {
  return (
    <footer style={styles.footer}>
      <p>© 2025 MyApp. All rights reserved.</p>
    </footer>
  );
}

const styles = {
  footer: {
    marginTop: 'auto',
    padding: '16px',
    backgroundColor: '#f1f1f1',
    textAlign: 'center',
    fontSize: '14px',
    color: '#555',
  }
};

export default Footer;
