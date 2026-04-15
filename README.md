# Automated Trial Log

## Overview
Automated Trial Log is an AI-powered courtroom management and transcription system designed to digitize and streamline judicial proceedings.

It replaces manual stenography with real-time speech-to-text transcription, supports local languages, and provides structured, role-based access to court records.

The system enhances accuracy, efficiency, and accessibility in managing court hearings and case data.

---

##  Objectives
- Provide real-time speech-to-text transcription of court hearings  
- Reduce human error in manual documentation  
- Support local-language input (Urdu, Punjabi, English, etc.) with English output  
- Enable efficient case and hearing management  
- Ensure secure, role-based access control  
- Generate official, structured PDF transcripts and order sheets  
- Improve overall judicial workflow efficiency  

---

## Features

###  AI-Based Speech-to-Text Transcription
- Converts live courtroom audio into real-time text transcripts  
- Generates time-stamped entries for accurate record tracking  
- Speaker identification (diarization)  
- Editable transcripts for correcting detected audio and speakers  

---

### 📄 Case Transcript Management
- Stores complete hearing transcripts with timestamps  
- Supports:
  - Live editing by stenographers  
  - Review and approval by judges  
- Maintains version control for transparency and traceability  

---

###  Automated Order Sheet Generation (AI-Powered)
- Generates structured order sheets automatically from transcripts  
- Uses AI to:
  - Identify key legal statements and decisions  
  - Extract important events, arguments, and outcomes  
  - Summarize proceedings into a formal, court-ready format  

---

###  Role-Based Workflow System
- **Judge** → Reviews, edits, and approves transcripts & order sheets  
- **Stenographer** → Edits AI-generated transcripts and resolves errors  
- **Admin** → Manages cases and users  

---

###  PDF Export & Documentation
- Converts finalized transcripts and order sheets into official PDF format  
- Ensures documents are print-ready and properly structured  
- Suitable for legal archiving and record-keeping  

---

###  Case & Hearing Management
- Schedule and manage hearing dates  
- Track case progress and updates  
- Maintain organized digital records for each case  

---

###  Secure Data Handling
- Role-based access control for sensitive legal data  
- Ensures data integrity and restricted access  

---

###  Mobile App (Judges)
- Case tracking  
- Transcript viewing  

---

##  Roles & Permissions

###  Judge
- Review and edit transcripts and order sheets  
- Approve or reject submissions from stenographers  
- Access finalized records  
- View case schedules  

---

###  Stenographer
- Monitor and edit live transcription  
- Create order sheets using AI or transcripts  
- Submit transcripts and order sheets for approval  
- View case schedules  

---

###  Admin
- View cases and users  
- Access case-related documents  
- Add and schedule cases  
- Manage users (Steno / Judge / Admin)  

---

###  Chief Judge (Master Role)
- Full system access  
- Manage courts and assign case types  
- Add and manage users  
- Access all case-related data  

---

## Tech Stack

### Frontend
- React.js  
- Vite  
- Tailwind CSS  

###  Backend
- Node.js  
- Express.js  

### Mobile App
- React Native  
- Expo  

###  AI / ML
- Whisper (Speech-to-Text)  
- Pyannote (Speaker Diarization)  
- Mistral AI (Order sheet generation)  

###  Database
- PostgreSQL  

###  Cloud Storage
- Supabase  

---

##  Conclusion
Automated Trial Log provides a scalable and intelligent solution for modernizing courtroom operations.

By integrating AI-driven transcription with structured case management and role-based access, the system significantly improves accuracy, efficiency, and transparency in judicial processes.

It represents a practical step toward digital transformation in the legal domain.
