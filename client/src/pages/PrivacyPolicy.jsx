export default function PrivacyPolicy() {
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
                    <h1 style={styles.headerTitle}>Privacy Policy</h1>
                    <p style={styles.headerSubtitle}>Automated Trial Log</p>
               </div>

               {/* Main Container */}
               <div style={styles.mainContainer}>


                    {/* Section 1 */}
                    <section style={styles.section}>
                         <h2 style={styles.sectionTitle}>
                              1. Introduction
                         </h2>
                         <p style={styles.paragraph}>
                              The Automated Trial Log system is committed to protecting the privacy and confidentiality of all users, litigants, legal practitioners, and judicial officers. This Privacy Policy outlines how we collect, use, store, and protect personal and case-related information through our Case Management System and AI-powered transcription services.
                         </p>
                         <div style={styles.infoBox}>
                              <strong>Our Commitment:</strong> We recognize that judicial proceedings involve sensitive information requiring the highest standards of privacy, security, and confidentiality in accordance with Pakistan's legal framework and international best practices.
                         </div>
                    </section>

                    {/* Section 2 */}
                    <section style={styles.section}>
                         <h2 style={styles.sectionTitle}>
                              2. Information We Collect
                         </h2>

                         <h3 style={styles.subsectionTitle}>2.1 Case Management System Data</h3>
                         <ul style={styles.list}>
                              <li style={styles.listItem}><strong>Information:</strong> Names, addresses, CNIC numbers, contact details of plaintiffs and defendants</li>
                              <li style={styles.listItem}><strong>Case Details:</strong> Case numbers, filing dates, case types, and case status</li>
                              <li style={styles.listItem}><strong>User Credentials:</strong> Login credentials, access logs, and system usage data</li>
                         </ul>

                         <h3 style={styles.subsectionTitle}>2.2 Voice Recording and Transcription Data</h3>
                         <ul style={styles.list}>
                              <li style={styles.listItem}><strong>Audio Recordings:</strong> Real-time voice recordings of court proceedings</li>
                              <li style={styles.listItem}><strong>Transcripts:</strong> AI-generated transcripts of proceedings</li>
                              <li style={styles.listItem}><strong>Metadata:</strong> Recording timestamps, duration, case identification, and session information</li>
                         </ul>

                         <h3 style={styles.subsectionTitle}>2.3 AI-Generated Content</h3>
                         <ul style={styles.list}>
                              <li style={styles.listItem}><strong>Order Sheets:</strong> AI-assisted generation of order sheets</li>
                              <li style={styles.listItem}><strong>Case Summaries:</strong> Automated summaries of proceedings</li>
                              <li style={styles.listItem}><strong>Analytics Data:</strong> Case flow analysis and statistical information</li>
                         </ul>
                    </section>

                    {/* Section 3 */}
                    <section style={styles.section}>
                         <h2 style={styles.sectionTitle}>
                              3. How We Use Your Information
                         </h2>

                         <h3 style={styles.subsectionTitle}>3.1 Primary Purposes</h3>
                         <ul style={styles.list}>
                              <li style={styles.listItem}><strong>Case Administration:</strong> Managing case files, scheduling hearings, and tracking case progress</li>
                              <li style={styles.listItem}><strong>Record Keeping:</strong> Maintaining accurate and complete judicial records as required by law</li>
                              <li style={styles.listItem}><strong>Transcript Generation:</strong> Creating accurate records of court proceedings</li>
                              <li style={styles.listItem}><strong>Order Sheet Preparation:</strong> Automating the generation of orders and case documentation</li>
                              <li style={styles.listItem}><strong>Access to Justice:</strong> Enabling authorized parties to access case information and documents</li>
                         </ul>
                    </section>

                    {/* Section 4 */}
                    <section style={styles.section}>
                         <h2 style={styles.sectionTitle}>
                              4. Voice Recording
                         </h2>

                         <div style={styles.warningBox}>
                              <strong>Important Notice:</strong> All court proceedings may be recorded and processed using AI-powered speech-to-text and voice diarization technology.
                         </div>

                         <h3 style={styles.subsectionTitle}>4.1 Recording Procedures</h3>
                         <p style={styles.paragraph}>
                              Court proceedings are recorded using secure audio capture systems. All participants in proceedings consent to recording by participating in the judicial process. Recordings are initiated and terminated by authorized court officials only.
                         </p>
                    </section>

                    {/* Section 5 */}
                    <section style={styles.section}>
                         <h2 style={styles.sectionTitle}>
                              5. AI-Powered Transcript and Order Sheet Generation
                         </h2>

                         <h3 style={styles.subsectionTitle}>5.1 Transcript Accuracy</h3>
                         <p style={styles.paragraph}>
                              While our AI system provides high-accuracy transcription, all transcripts are marked as "AI-Generated" and subject to human review and certification. Official certified transcripts require verification by authorized court reporters or judicial officers.
                         </p>

                         <h3 style={styles.subsectionTitle}>5.2 Order Sheet Generation</h3>
                         <p style={styles.paragraph}>
                              AI-assisted order sheets are generated based on transcript analysis and case management data. All AI-generated order sheets require judicial review and approval before being finalized as official court records.
                         </p>

                         <h3 style={styles.subsectionTitle}>5.3 Human Oversight</h3>
                         <p style={styles.paragraph}>The system maintains human oversight at critical junctures:</p>
                         <ul style={styles.list}>
                              <li style={styles.listItem}>Review and correction of AI-generated transcripts</li>
                              <li style={styles.listItem}>Approval of automatically generated order sheets</li>
                              <li style={styles.listItem}>Verification of speaker identification in sensitive matters</li>
                         </ul>
                    </section>

                    {/* Section 6 */}
                    <section style={styles.section}>
                         <h2 style={styles.sectionTitle}>
                              6. User Rights and Controls
                         </h2>

                         <h3 style={styles.subsectionTitle}>6.1 Access Rights</h3>
                         <p style={styles.paragraph}>Authorized users have the right to:</p>
                         <ul style={styles.list}>
                              <li style={styles.listItem}>Access their personal information held in the system</li>
                              <li style={styles.listItem}>Request corrections to inaccurate information</li>
                              <li style={styles.listItem}>Obtain copies of case-related documents</li>
                              <li style={styles.listItem}>Review transcripts of proceedings they participated in</li>
                         </ul>

                         <h3 style={styles.subsectionTitle}>6.2 Limitations on Rights</h3>
                         <p style={styles.paragraph}>Certain rights may be limited when:</p>
                         <ul style={styles.list}>
                              <li style={styles.listItem}>Disclosure would compromise ongoing investigations</li>
                              <li style={styles.listItem}>Information is subject to legal privilege or confidentiality orders</li>
                              <li style={styles.listItem}>Required by law to maintain records regardless of user preferences</li>
                              <li style={styles.listItem}>Necessary to preserve the integrity of judicial proceedings</li>
                         </ul>
                    </section>


                    {/* Section 7 */}
                    <section style={styles.section}>
                         <h2 style={styles.sectionTitle}>
                              7. Updates to Privacy Policy
                         </h2>
                         <p style={styles.paragraph}>
                              This Privacy Policy may be updated periodically to reflect changes in legal requirements, system capabilities, or privacy practices. Material changes will be communicated through official channels and posted on the system portal. Continued use of the system following updates constitutes acceptance of the revised policy.
                         </p>
                    </section>
                    {/* Acknowledgment */}
                    <div style={styles.acknowledgmentBox}>
                         <strong>Acknowledgment:</strong> By using the Pakistan Judicial System Modernization platform, including the Case Management System and AI-powered transcription services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.
                    </div>
               </div>

               {/* Footer */}
               <div style={styles.footer}>
                    <p style={styles.footerText}>&copy; 2026 Automated Trial Log</p>
                    <p style={styles.footerText}>Committed to Justice, Transparency and legal </p>
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
          padding: '25px 5px',
          height: '150px',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
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
          maxWidth: '1200px',
          margin: '40px auto',
          backgroundColor: 'white',
          padding: '48px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
     },
     section: {
          marginBottom: '36px',
     },
     sectionTitle: {
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#15692e',
          marginBottom: '16px',
          paddingBottom: '8px',
          borderBottom: '4px solid #16a34a',
     },
     subsectionTitle: {
          fontSize: '20px',
          fontWeight: '600',
          color: '#16a34a',
          marginTop: '20px',
          marginBottom: '12px',
     },
     paragraph: {
          marginBottom: '16px',
          textAlign: 'justify',
          lineHeight: '1.7',
          color: '#374151',
     },
     list: {
          marginLeft: '24px',
          marginBottom: '16px',
          listStyleType: 'disc',
     },
     listItem: {
          marginBottom: '8px',
          lineHeight: '1.7',
          color: '#374151',
     },
     infoBox: {
          backgroundColor: '#f0fdf4',
          borderLeft: '4px solid #16a34a',
          padding: '20px',
          borderRadius: '4px',
          lineHeight: '1.7',
     },
     warningBox: {
          backgroundColor: '#fefce8',
          borderLeft: '4px solid #eab308',
          padding: '16px',
          borderRadius: '4px',
          marginBottom: '16px',
          lineHeight: '1.7',
     },
     acknowledgmentBox: {
          backgroundColor: '#f0fdf4',
          borderLeft: '4px solid #16a34a',
          padding: '20px',
          borderRadius: '4px',
          marginTop: '32px',
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
