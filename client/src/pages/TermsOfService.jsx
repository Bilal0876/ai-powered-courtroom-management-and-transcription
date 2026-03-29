export default function TermsOfService() {
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
                    <h1 style={styles.headerTitle}>Terms of Service</h1>
                    <p style={styles.headerSubtitle}>Automated Trial Log</p>
               </div>

               {/* Main Container */}
               <div style={styles.mainContainer}>


                    {/* Section 1 */}
                    <section style={styles.section}>
                         <h2 style={styles.sectionTitle}>1. Acceptance of Terms</h2>
                         <p style={styles.paragraph}>
                              By accessing and using the Automated Trial Log system, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the system.
                         </p>
                    </section>

                    {/* Section 2 */}
                    <section style={styles.section}>
                         <h2 style={styles.sectionTitle}>2. Authorized Use</h2>
                         <p style={styles.paragraph}>
                              This system is intended exclusively for authorized judicial officers. Unauthorized access or misuse is strictly prohibited and may result in legal action.
                         </p>
                         <ul style={styles.list}>
                              <li style={styles.listItem}>You must maintain the confidentiality of your login credentials</li>
                              <li style={styles.listItem}>You are responsible for all activities under your account</li>
                              <li style={styles.listItem}>You must not share your access credentials with unauthorized persons</li>
                              <li style={styles.listItem}>You must immediately report any security breaches or unauthorized access</li>
                         </ul>
                    </section>

                    {/* Section 3 */}
                    <section style={styles.section}>
                         <h2 style={styles.sectionTitle}>3. Prohibited Activities</h2>
                         <p style={styles.paragraph}>Users are strictly prohibited from:</p>
                         <ul style={styles.list}>
                              <li style={styles.listItem}>Attempting to gain unauthorized access to the system or other users' accounts</li>
                              <li style={styles.listItem}>Uploading malicious software, viruses, or harmful code</li>
                              <li style={styles.listItem}>Interfering with the proper functioning of the system</li>
                              <li style={styles.listItem}>Using the system for any unlawful purpose</li>
                              <li style={styles.listItem}>Misrepresenting your identity or authority</li>
                              <li style={styles.listItem}>Accessing or disclosing confidential information without authorization</li>
                         </ul>
                    </section>

                    {/* Section 4 */}
                    <section style={styles.section}>
                         <h2 style={styles.sectionTitle}>4. AI-Generated Content</h2>
                         <p style={styles.paragraph}>
                              AI-generated transcripts and order sheets are provided as assistance tools only. All AI-generated content must be reviewed and verified by authorized personnel before being accepted as official court records. Users acknowledge that AI systems may contain errors or inaccuracies.
                         </p>
                    </section>

                    {/* Section 5 */}
                    <section style={styles.section}>
                         <h2 style={styles.sectionTitle}>5. Intellectual Property</h2>
                         <p style={styles.paragraph}>
                              All content, software, and materials provided through this system are the property of the Government of Pakistan or its licensors. Users may not reproduce, distribute, or create derivative works without authorization.
                         </p>
                    </section>

                    {/* Section 6 */}
                    <section style={styles.section}>
                         <h2 style={styles.sectionTitle}>6. Termination</h2>
                         <p style={styles.paragraph}>
                              We reserve the right to suspend or terminate user access at any time for violations of these terms, security concerns, or as required by law. Users may also request account termination by contacting system administrators.
                         </p>
                    </section>

                    {/* Section 7 */}
                    <section style={styles.section}>
                         <h2 style={styles.sectionTitle}>7. Changes to Terms</h2>
                         <p style={styles.paragraph}>
                              We may update these terms at any time. Continued use of the system after changes constitutes acceptance of the updated terms. Material changes will be communicated through the system portal.
                         </p>
                    </section>

                    {/* Contact */}
                    <div style={styles.contactBox}>
                         <h3 style={styles.contactTitle}>Questions About Terms?</h3>
                         <p>Email: xyz@judiciary.gov.pk</p>
                         <p>Phone: +92-xxxxxxxxxx</p>
                    </div>

                    {/* Acknowledgment */}
                    <div style={styles.acknowledgmentBox}>
                         <strong>By using this system, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</strong>
                    </div>
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
     section: {
          marginBottom: '28px',
     },
     sectionTitle: {
          fontSize: '22px',
          fontWeight: 'bold',
          color: '#15692e',
          marginBottom: '12px',
          paddingBottom: '8px',
          borderBottom: '3px solid #16a34a',
     },
     paragraph: {
          marginBottom: '12px',
          lineHeight: '1.7',
          color: '#374151',
     },
     list: {
          marginLeft: '24px',
          marginTop: '12px',
          listStyleType: 'disc',
     },
     listItem: {
          marginBottom: '8px',
          lineHeight: '1.6',
          color: '#374151',
     },
     contactBox: {
          backgroundColor: '#f9fafb',
          padding: '20px',
          borderRadius: '6px',
          border: '1px solid #e5e7eb',
          marginTop: '32px',
          lineHeight: '1.8',
     },
     contactTitle: {
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#15692e',
          marginBottom: '12px',
     },
     acknowledgmentBox: {
          backgroundColor: '#f0fdf4',
          borderLeft: '4px solid #16a34a',
          padding: '20px',
          borderRadius: '4px',
          marginTop: '24px',
          lineHeight: '1.7',
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
