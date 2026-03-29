export default function ContactSupport() {
     return (
          <div style={styles.container}>
               <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
          line-height: 1.6;
        }
      `}</style>

               {/* Header */}
               <div style={styles.header}>
                    <h1 style={styles.headerTitle}>Contact Support</h1>
                    <p style={styles.headerSubtitle}>We're here to help you with any questions or concerns</p>
               </div>

               {/* Main Container */}
               <div style={styles.mainContainer}>


                    {/* Contact Methods */}
                    <div style={styles.contactGrid}>

                         {/* Technical Support */}
                         <div style={styles.contactCard}>
                              <div style={styles.cardHeader}>
                                   <h2 style={styles.cardTitle}>Technical Support</h2>
                              </div>
                              <div style={styles.cardContent}>
                                   <p><strong>Helpline:</strong> 051-xxx-xxx-xxx</p>
                                   <p><strong>Email:</strong> xyz@judiciary.gov.pk</p>
                                   <p><strong>Hours:</strong> Monday-Friday 9:00 AM - 5:00 PM</p>

                              </div>
                         </div>

                         {/* Legal Inquiries */}
                         <div style={styles.contactCard}>
                              <div style={styles.cardHeader}>
                                   <h2 style={styles.cardTitle}>Legal Inquiries</h2>
                              </div>
                              <div style={styles.cardContent}>
                                   <p><strong>Email:</strong> xyz@judiciary.gov.pk</p>
                                   <p><strong>Phone:</strong> +92-xx-xxxxxxx</p>
                              </div>
                         </div>

                         {/* General Information */}
                         <div style={styles.contactCard}>
                              <div style={styles.cardHeader}>
                                   <h2 style={styles.cardTitle}>General Information</h2>
                              </div>
                              <div style={styles.cardContent}>
                                   <p><strong>Email:</strong> info@judiciary.gov.pk</p>
                                   <p><strong>Phone:</strong> +92-xx-xxxxxx</p>
                              </div>
                         </div>

                    </div>

                    {/* Mailing Address */}
                    <section style={styles.section}>
                         <h2 style={styles.sectionTitle}>📍 Mailing Address</h2>
                         <div style={styles.addressBox}>
                              <p><strong>Pakistan Judicial System Modernization Initiative</strong></p>
                              <p>Supreme Court of Pakistan</p>
                              <p>Constitution Avenue</p>
                              <p>Islamabad, Pakistan</p>
                         </div>
                    </section>

                    {/* Before Contacting */}
                    <section style={styles.section}>
                         <h2 style={styles.sectionTitle}>Before You Contact Us</h2>
                         <p style={styles.paragraph}>To help us serve you better, please have the following information ready:</p>
                         <ul style={styles.list}>
                              <li style={styles.listItem}>Your user ID or case number</li>
                              <li style={styles.listItem}>Description of the issue or question</li>
                              <li style={styles.listItem}>Screenshots of error messages (if applicable)</li>
                              <li style={styles.listItem}>Date and time when the issue occurred</li>
                         </ul>
                    </section>

               </div>

               {/* Footer */}
               <div style={styles.footer}>
                    <p style={styles.footerText}>&copy; 2026 Automated Trial Log</p>
                    <p style={styles.footerText}>Committed to Justice, Transparency, and Legal Excellence</p>
               </div>
          </div>
     );
}

const styles = {
     container: {
          minHeight: '100vh',
          backgroundColor: '#f3f4f6',
     },
     header: {
          background: 'linear-gradient(135deg, #1e7e34 0%, #28a745 100%)',
          color: 'white',
          padding: '24px 5px',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          height: '150px'
     },
     headerTitle: {
          fontSize: '36px',
          fontWeight: 'bold',
          marginBottom: '8px',
     },
     headerSubtitle: {
          fontSize: '18px',
          opacity: '0.95',
     },
     mainContainer: {
          maxWidth: '1000px',
          margin: '40px auto',
          backgroundColor: 'white',
          padding: '48px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
     },

     contactGrid: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
     },
     contactCard: {
          border: '2px solid #e5e7eb',
          borderRadius: '8px',
          overflow: 'hidden',
          transition: 'transform 0.2s, box-shadow 0.2s',
     },
     cardHeader: {
          background: 'linear-gradient(135deg, #1e7e34 0%, #28a745 100%)',
          color: 'white',
          padding: '16px',
     },
     cardTitle: {
          fontSize: '18px',
          fontWeight: 'bold',
          margin: 0,
     },
     cardContent: {
          padding: '20px',
          lineHeight: '1.8',
     },
     cardNote: {
          marginTop: '12px',
          fontSize: '14px',
          color: '#6b7280',
          fontStyle: 'italic',
     },
     section: {
          marginBottom: '32px',
     },
     sectionTitle: {
          fontSize: '22px',
          fontWeight: 'bold',
          color: '#15692e',
          marginBottom: '16px',
          paddingBottom: '8px',
          borderBottom: '3px solid #16a34a',
     },
     paragraph: {
          marginBottom: '12px',
          lineHeight: '1.7',
          color: '#374151',
     },
     addressBox: {
          backgroundColor: '#f9fafb',
          padding: '20px',
          borderRadius: '6px',
          border: '1px solid #e5e7eb',
          lineHeight: '1.8',
     },
     list: {
          marginLeft: '24px',
          listStyleType: 'disc',
     },
     listItem: {
          marginBottom: '8px',
          lineHeight: '1.6',
          color: '#374151',
     },

     footer: {
          background: 'linear-gradient(135deg, #2c3e50 100%)',
          color: 'white',
          padding: '32px 20px',
          textAlign: 'center',
          marginTop: '40px',
     },
     footerText: {
          marginBottom: '4px',
     },
};
