-- Supabase Database Dump
-- Generated on: 2026-04-07T10:35:08.483Z


-- Table: case_recording
CREATE TABLE IF NOT EXISTS public.case_recording (
    id integer NOT NULL DEFAULT nextval('case_recording_id_seq'::regclass),
    case_id integer,
    recording_url text
);

-- Data for case_recording
INSERT INTO public.case_recording (id, case_id, recording_url) VALUES (1, 28, 'https://qxhyujcaqmsvrryjpuxj.supabase.co/storage/v1/object/public/Transcription_Files/audio/recording_20260109_043436.wav');
INSERT INTO public.case_recording (id, case_id, recording_url) VALUES (2, 31, 'https://qxhyujcaqmsvrryjpuxj.supabase.co/storage/v1/object/public/Transcription_Files/audio/recording_20260109_104633.wav');

-- Table: case_details
CREATE TABLE IF NOT EXISTS public.case_details (
    case_id integer NOT NULL DEFAULT nextval('case_details_case_id_seq'::regclass),
    case_type character varying NOT NULL,
    case_title character varying NOT NULL,
    case_status character varying NOT NULL,
    case_party1 character varying NOT NULL,
    case_party2 character varying NOT NULL,
    steno_code character varying,
    judge_code character varying,
    court integer,
    case_code character varying,
    transcript character varying DEFAULT 'NO'::character varying,
    ordersheet character varying DEFAULT 'NO'::character varying,
    case_level character varying,
    created_by_role character varying NOT NULL,
    created_by_code character varying NOT NULL
);

-- Data for case_details
INSERT INTO public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level, created_by_role, created_by_code) VALUES (18, 'Civil', 'Inheritance Dispute: Farhan vs. Family', 'In-Progress', 'Farhan', 'Family Members', NULL, NULL, NULL, 'CVL-2025-18', 'NO', 'NO', NULL, 'admin', 'ADM-01');
INSERT INTO public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level, created_by_role, created_by_code) VALUES (24, 'Anti-Corruption', 'Sayasatdaan mulk ka paisa kha gaye', 'In-Progress', 'Awaam', 'PMLN', NULL, NULL, NULL, 'ANT-2025-24', 'NO', 'NO', NULL, 'admin', 'ADM-01');
INSERT INTO public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level, created_by_role, created_by_code) VALUES (23, 'Banking', 'Bilal chor, bank se pase chori karke bhaag gaya', 'In-Progress', 'Bank', 'Bilal', NULL, NULL, NULL, 'BNK-2025-23', 'NO', 'NO', NULL, 'admin', 'ADM-01');
INSERT INTO public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level, created_by_role, created_by_code) VALUES (25, 'Criminal', 'Bilal chor, bank se paise chori kar gaya', 'In-Progress', 'Ahmed', 'Bilal', NULL, NULL, NULL, 'CRM-2025-25', 'NO', 'NO', NULL, 'admin', 'ADM-01');
INSERT INTO public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level, created_by_role, created_by_code) VALUES (20, 'Criminal', 'Fraud Case: State vs. Hassan', 'In-Progress', 'State', 'Hassan', NULL, NULL, NULL, 'CRM-2025-20', 'NO', 'NO', NULL, 'admin', 'ADM-01');
INSERT INTO public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level, created_by_role, created_by_code) VALUES (29, 'Family', 'Custody Battle: Sara vs. Imran', 'In-Progress', 'Sara Ahmed', 'Imran Sheikh', NULL, NULL, NULL, 'FAM-2025-29', 'NO', 'NO', NULL, 'admin', 'ADM-01');
INSERT INTO public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level, created_by_role, created_by_code) VALUES (30, 'Civil', 'Contract Breach: Enterprises vs. Corp', 'Scheduled', 'ABC Enterprises', 'XYZ Corporation', 'STN-01', 'JDG-01', 1, 'CVL-2025-30', 'NO', 'NO', 'High Court', 'admin', 'ADM-01');
INSERT INTO public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level, created_by_role, created_by_code) VALUES (32, 'Family', 'Divorce Proceedings: Ayesha vs. Kamran', 'In-Progress', 'Ayesha Begum', 'Kamran Hussain', NULL, NULL, NULL, 'FAM-2025-32', 'NO', 'NO', NULL, 'admin', 'ADM-01');
INSERT INTO public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level, created_by_role, created_by_code) VALUES (14, 'Labor', 'Factory Workers vs. ABC Industries', 'In-Progress', 'Workers Union', 'ABC Industries', NULL, NULL, NULL, 'LBR-2025-14', 'NO', 'NO', NULL, 'admin', 'ADM-01');
INSERT INTO public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level, created_by_role, created_by_code) VALUES (44, 'Labor', 'labor work load', 'In-Progress', 'labor', 'company', NULL, NULL, NULL, 'LBR-2026-44', 'NO', 'NO', 'Subordinate Court', 'admin', 'ADM-01');
INSERT INTO public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level, created_by_role, created_by_code) VALUES (15, 'Civil', 'Land Ownership Case of Aslam vs. Yousaf', 'In-Progress', 'Aslam', 'Yousaf', NULL, NULL, NULL, 'CVL-2025-15', 'NO', 'NO', NULL, 'admin', 'ADM-02');
INSERT INTO public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level, created_by_role, created_by_code) VALUES (19, 'Family', 'Child Custody: Maria vs. Saad', 'In-Progress', 'Maria', 'Saad', NULL, NULL, NULL, 'FAM-2025-19', 'NO', 'NO', NULL, 'admin', 'ADM-02');
INSERT INTO public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level, created_by_role, created_by_code) VALUES (17, 'Commercial', 'Breach of Contract: XYZ Ltd vs. Qasim Traders', 'In-Progress', 'XYZ Ltd', 'Qasim Traders', NULL, NULL, NULL, 'COM-2025-17', 'NO', 'NO', NULL, 'admin', 'ADM-02');
INSERT INTO public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level, created_by_role, created_by_code) VALUES (35, 'Family', 'Inheritance Distribution: Siblings Dispute', 'In-Progress', 'Fatima Akram', 'Usman Akram', NULL, NULL, NULL, 'FAM-2025-35', 'NO', 'NO', NULL, 'admin', 'ADM-02');
INSERT INTO public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level, created_by_role, created_by_code) VALUES (51, 'Environmental', 'xyz housing society deforestation ', 'In-Progress', 'state', 'xyz housing society', NULL, NULL, NULL, 'ENV-2026-51', 'NO', 'NO', 'High Court', 'admin', 'ADM-01');
INSERT INTO public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level, created_by_role, created_by_code) VALUES (39, 'Customs', 'Theft caught on camera', 'Scheduled', 'Waqar Zohaib', 'Mirza Ghalib ', NULL, NULL, NULL, 'BNK-2025-39', 'NO', 'NO', '', 'admin', 'ADM-01');
INSERT INTO public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level, created_by_role, created_by_code) VALUES (28, 'Criminal', 'Fraud Case: State vs. Malik', 'Completed', 'State', 'Tariq Malik', 'STN-02', 'JDG-02', 2, 'CRM-2025-28', 'YES', 'YES', 'Subordinate Court', 'admin', 'ADM-02');
INSERT INTO public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level, created_by_role, created_by_code) VALUES (31, 'Criminal', 'Theft Case: State vs. Abbas', 'Completed', 'State', 'Salman Abbas', 'STN-02', 'JDG-02', 2, 'CRM-2025-31', 'YES', 'YES', 'Subordinate Court', 'admin', 'ADM-02');
INSERT INTO public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level, created_by_role, created_by_code) VALUES (27, 'Civil', 'Property Dispute: Ahmed vs. Khan', 'Postponed', 'Ahmed Ali', 'Hassan Khan', NULL, NULL, NULL, 'CVL-2025-27', 'NO', 'NO', '', 'admin', 'ADM-01');
INSERT INTO public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level, created_by_role, created_by_code) VALUES (16, 'Criminal', 'Murder Trial: State vs. Noman', 'Postponed', 'State', 'Noman', NULL, NULL, NULL, 'CRM-2025-16', 'YES', 'NO', '', 'admin', 'ADM-02');
INSERT INTO public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level, created_by_role, created_by_code) VALUES (54, 'Civil', 'testing', 'In-Progress', 'x', 'y', NULL, NULL, NULL, 'CVL-2026-54', 'NO', 'NO', 'High Court', 'chief-judge', 'CJD-01');
INSERT INTO public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level, created_by_role, created_by_code) VALUES (60, 'Labor', 'abc', 'Scheduled', 'xyz', 'ahmed', 'STN-02', 'JDG-02', 2, 'LBR-2026-60', 'NO', 'NO', 'Subordinate Court', 'admin', 'ADM-01');
INSERT INTO public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level, created_by_role, created_by_code) VALUES (55, 'Family', 'testing ', 'Postponed', 'abc', 'def', NULL, NULL, NULL, 'FAM-2026-55', 'NO', 'NO', '', 'admin', 'ADM-01');
INSERT INTO public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level, created_by_role, created_by_code) VALUES (11, 'Civil', 'Property Dispute between X and y', 'Completed', 'X', 'Y', NULL, NULL, NULL, 'CVL-2025-11', 'YES', 'YES', '', 'admin', 'ADM-01');
INSERT INTO public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level, created_by_role, created_by_code) VALUES (26, 'Civil', 'uni filed against student ', 'Completed', 'uni', 'ahmed', NULL, NULL, NULL, 'CVL-2025-26', 'YES', 'YES', '', 'admin', 'ADM-01');
INSERT INTO public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level, created_by_role, created_by_code) VALUES (37, 'Commercial', 'Shop under construction, burned', 'Scheduled', 'Junaid Iqbal', 'Rehan Akhtars', NULL, NULL, NULL, 'COM-2025-37', 'YES', 'NO', '', 'admin', 'ADM-01');
INSERT INTO public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level, created_by_role, created_by_code) VALUES (40, 'Civil', 'Theft in uni x', 'Completed', 'Professor', 'xyz', NULL, NULL, NULL, 'CVL-2026-40', 'YES', 'YES', '', 'admin', 'ADM-01');
INSERT INTO public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level, created_by_role, created_by_code) VALUES (62, 'Labor', 'abcoo', 'In-Progress', 'state', 'company', NULL, NULL, NULL, 'LBR-2026-62', 'NO', 'NO', 'High Court', 'admin', 'ADM-01');
INSERT INTO public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level, created_by_role, created_by_code) VALUES (36, 'Civil', 'Tenant Eviction: Landlord vs. Tenant', 'In Progress', 'Rashid Mahmood', 'Bilal Farooq', NULL, NULL, NULL, 'CVL-2025-36', 'NO', 'NO', '', 'admin', 'ADM-01');
INSERT INTO public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level, created_by_role, created_by_code) VALUES (34, 'Criminal', 'Assault Case: State vs. Raza', 'Scheduled', 'State', 'Ali Raza ansari', NULL, NULL, NULL, 'CRM-2025-34', 'NO', 'NO', '', 'admin', 'ADM-02');
INSERT INTO public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level, created_by_role, created_by_code) VALUES (13, 'Family', 'Divorce Petition of Sara and Ali KHAN', 'In Progress', 'Sara', 'Ali', NULL, NULL, NULL, 'FAM-2025-13', 'NO', 'NO', '', 'admin', 'ADM-02');
INSERT INTO public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level, created_by_role, created_by_code) VALUES (68, 'Customs', 'aaa22', 'Scheduled', 'aaabbb', 'bbbaaa', 'STN-02', 'JDG-02', 2, 'CST-2026-68', 'NO', 'NO', 'Subordinate Court', 'admin', 'ADM-01');
INSERT INTO public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level, created_by_role, created_by_code) VALUES (61, 'Labor', 'abc', 'Scheduled', 'xyz', 'ahmed', 'STN-02', 'JDG-02', 2, 'LBR-2026-61', 'NO', 'NO', 'Subordinate Court', 'admin', 'ADM-01');
INSERT INTO public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level, created_by_role, created_by_code) VALUES (67, 'Banking', 'testit22', 'In Progress', 'jalalaaa', 'lajajaaa', 'STN-01', 'JDG-01', NULL, 'ELC-2026-67', 'NO', 'NO', 'High Court', 'admin', 'ADM-01');
INSERT INTO public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level, created_by_role, created_by_code) VALUES (50, 'Banking', 'bank employee', 'In Progress', 'private', 'bank', NULL, NULL, NULL, 'BNK-2026-50', 'NO', 'NO', 'Subordinate Court', 'admin', 'ADM-01');

-- Table: court_courttype
CREATE TABLE IF NOT EXISTS public.court_courttype (
    court_id integer NOT NULL,
    type_id integer NOT NULL
);

-- Data for court_courttype
INSERT INTO public.court_courttype (court_id, type_id) VALUES (1, 1);
INSERT INTO public.court_courttype (court_id, type_id) VALUES (1, 2);
INSERT INTO public.court_courttype (court_id, type_id) VALUES (1, 3);
INSERT INTO public.court_courttype (court_id, type_id) VALUES (1, 4);
INSERT INTO public.court_courttype (court_id, type_id) VALUES (1, 6);
INSERT INTO public.court_courttype (court_id, type_id) VALUES (3, 2);
INSERT INTO public.court_courttype (court_id, type_id) VALUES (4, 3);
INSERT INTO public.court_courttype (court_id, type_id) VALUES (5, 4);
INSERT INTO public.court_courttype (court_id, type_id) VALUES (6, 5);
INSERT INTO public.court_courttype (court_id, type_id) VALUES (7, 6);
INSERT INTO public.court_courttype (court_id, type_id) VALUES (2, 10);

-- Table: edited_transcripts
CREATE TABLE IF NOT EXISTS public.edited_transcripts (
    id bigint NOT NULL DEFAULT nextval('edited_transcripts_id_seq'::regclass),
    original_transcript_id bigint NOT NULL,
    case_id integer NOT NULL,
    speaker character varying,
    edited_text text NOT NULL,
    start_time real,
    end_time real,
    edited_by character varying NOT NULL,
    role character varying NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

-- Data for edited_transcripts
INSERT INTO public.edited_transcripts (id, original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role, updated_at) VALUES ('4', '124', 11, 'ayan', 'why does he change it', 120, 125, 'Asjad Shahab', 'stenographer', '2025-12-26T19:12:58.306Z');
INSERT INTO public.edited_transcripts (id, original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role, updated_at) VALUES ('5', '115', 11, 'ayan', 'I have done work on the web but', 95, 100, 'Asjad Shahab', 'stenographer', '2025-12-26T19:13:30.076Z');
INSERT INTO public.edited_transcripts (id, original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role, updated_at) VALUES ('6', '106', 11, 'ayan', 'this should be your name', 60, 65, 'Asjad Shahab', 'stenographer', '2025-12-26T19:14:54.992Z');
INSERT INTO public.edited_transcripts (id, original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role, updated_at) VALUES ('7', '107', 11, 'ayan', 'i dont know', 65, 70, 'Asjad Shahab', 'stenographer', '2025-12-26T19:15:05.959Z');
INSERT INTO public.edited_transcripts (id, original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role, updated_at) VALUES ('8', '129', 11, 'ayan', 'we can save it', 185, 190, 'Asjad Shahab', 'stenographer', '2025-12-26T19:16:28.339Z');
INSERT INTO public.edited_transcripts (id, original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role, updated_at) VALUES ('9', '95', 11, 'ayan', 'new text 1 2 3', 0, 5, 'Ayan Shahab', 'judge', '2025-12-26T23:23:22.523Z');
INSERT INTO public.edited_transcripts (id, original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role, updated_at) VALUES ('11', '107', 11, 'ayan', 'now i know', 65, 70, 'Ayan Shahab', 'judge', '2025-12-27T10:18:41.861Z');
INSERT INTO public.edited_transcripts (id, original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role, updated_at) VALUES ('12', '95', 11, 'ayan', 'again new text', 0, 5, 'Ayan Shahab', 'judge', '2025-12-27T10:34:04.589Z');
INSERT INTO public.edited_transcripts (id, original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role, updated_at) VALUES ('13', '95', 11, 'ayan', 'again again', 0, 5, 'Ayan Shahab', 'judge', '2025-12-27T10:34:20.733Z');
INSERT INTO public.edited_transcripts (id, original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role, updated_at) VALUES ('14', '96', 11, 'ayan', '2nd update', 5, 10, 'Ayan Shahab', 'judge', '2025-12-27T11:39:06.494Z');
INSERT INTO public.edited_transcripts (id, original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role, updated_at) VALUES ('15', '96', 11, 'ayan', '2nd upda', 5, 10, 'Ayan Shahab', 'judge', '2025-12-27T12:03:04.020Z');
INSERT INTO public.edited_transcripts (id, original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role, updated_at) VALUES ('16', '96', 11, 'ayan', '2nd updat', 5, 10, 'Ayan Shahab', 'judge', '2025-12-27T12:16:09.382Z');
INSERT INTO public.edited_transcripts (id, original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role, updated_at) VALUES ('17', '140', 15, 'bilal', 'bla bla bla', 50, 55, 'Asjad Shahab', 'stenographer', '2025-12-28T12:56:50.366Z');
INSERT INTO public.edited_transcripts (id, original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role, updated_at) VALUES ('18', '139', 15, 'bilal', 'you said that bilal edited it', 40, 45, 'Ayan Shahab', 'judge', '2025-12-28T12:58:39.596Z');
INSERT INTO public.edited_transcripts (id, original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role, updated_at) VALUES ('19', '131', 15, 'bilal', 'Hello, Assalamualaikum. My name is Bilal.', 0, 5, 'Ayan Shahab', 'judge', '2025-12-28T14:45:40.046Z');
INSERT INTO public.edited_transcripts (id, original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role, updated_at) VALUES ('20', '131', 15, 'bilal', 'Hello, Assalamualaikum. My name is Bilal. and i am ayan', 0, 5, 'Ayan Shahab', 'judge', '2025-12-28T14:52:02.762Z');
INSERT INTO public.edited_transcripts (id, original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role, updated_at) VALUES ('21', '131', 15, 'bilal', 'Hello, Assalamualaikum. My name is Bilal. and i am ayan, again', 0, 5, 'Ayan Shahab', 'judge', '2025-12-28T14:55:36.612Z');
INSERT INTO public.edited_transcripts (id, original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role, updated_at) VALUES ('22', '131', 15, 'bilal', 'Hello, Assalamualaikum. My name is Bilal. and i am ayan, again AGAIN', 0, 5, 'Ayan Shahab', 'judge', '2025-12-28T15:01:21.784Z');
INSERT INTO public.edited_transcripts (id, original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role, updated_at) VALUES ('23', '132', 15, 'bilal', 'I am trying to test it and its working', 5, 10, 'Ayan Shahab', 'judge', '2025-12-28T15:14:06.015Z');
INSERT INTO public.edited_transcripts (id, original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role, updated_at) VALUES ('24', '136', 15, 'bilal', 'Okay. hehe', 10, 15, 'Ayan Shahab', 'judge', '2025-12-28T15:15:42.579Z');
INSERT INTO public.edited_transcripts (id, original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role, updated_at) VALUES ('29', '359', 39, 'ayan', 'updated.', 0, 5, 'Bilal Khadim', 'stenographer', '2026-01-02T19:48:35.860Z');
INSERT INTO public.edited_transcripts (id, original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role, updated_at) VALUES ('30', '361', 39, 'bilal', 'update again', 5, 10, 'Bilal Khadim', 'stenographer', '2026-01-02T19:55:56.619Z');
INSERT INTO public.edited_transcripts (id, original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role, updated_at) VALUES ('31', '364', 39, 'ayan', 'change', 10, 15, 'Bilal Khadim', 'stenographer', '2026-01-02T19:57:14.603Z');
INSERT INTO public.edited_transcripts (id, original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role, updated_at) VALUES ('32', '359', 39, 'ayan', 'updated. cha', 0, 5, 'Bilal Khadim', 'stenographer', '2026-01-02T20:03:01.849Z');
INSERT INTO public.edited_transcripts (id, original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role, updated_at) VALUES ('33', '359', 39, 'ayan', 'updated. ch', 0, 5, 'Bilal Khadim', 'stenographer', '2026-01-02T20:06:31.645Z');
INSERT INTO public.edited_transcripts (id, original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role, updated_at) VALUES ('35', '385', 40, 'judge', 'Let''s start court hearing', 0, 5, 'Bilal Khadim', 'stenographer', '2026-01-02T21:07:49.629Z');
INSERT INTO public.edited_transcripts (id, original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role, updated_at) VALUES ('36', '387', 40, 'judge', 'present the case no. 122', 5, 10, 'Bilal Khadim', 'stenographer', '2026-01-02T21:08:08.842Z');
INSERT INTO public.edited_transcripts (id, original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role, updated_at) VALUES ('37', '396', 40, 'lawyer', 'this allegation is without any evidence', 40, 45, 'Malik Junaid Aziz', 'judge', '2026-01-02T21:15:23.131Z');
INSERT INTO public.edited_transcripts (id, original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role, updated_at) VALUES ('38', '448', 39, 'ayan', 'changed', 0, 5, 'Bilal Khadim', 'stenographer', '2026-01-03T08:21:55.385Z');
INSERT INTO public.edited_transcripts (id, original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role, updated_at) VALUES ('39', '458', 26, 'bilal', 'lets start', 10, 15, 'Ayan Shahab', 'judge', '2026-01-05T14:14:11.368Z');
INSERT INTO public.edited_transcripts (id, original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role, updated_at) VALUES ('40', '481', 31, 'witness', 'Now the beat that we are talking about is being repeated in that room', 65, 70, 'Bilal Khadim', 'stenographer', '2026-01-09T05:46:06.211Z');
INSERT INTO public.edited_transcripts (id, original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role, updated_at) VALUES ('41', '467', 31, 'lawyer', '', 10, 15, 'Malik Junaid Aziz', 'judge', '2026-01-09T05:52:06.475Z');

-- Table: hearing_details
CREATE TABLE IF NOT EXISTS public.hearing_details (
    hearing_id integer NOT NULL DEFAULT nextval('hearing_details_hearing_id_seq'::regclass),
    case_id integer NOT NULL,
    hearing_date date NOT NULL,
    hearing_time time without time zone NOT NULL
);

-- Data for hearing_details
INSERT INTO public.hearing_details (hearing_id, case_id, hearing_date, hearing_time) VALUES (26, 55, '2026-02-21T19:00:00.000Z', '12:00:00');
INSERT INTO public.hearing_details (hearing_id, case_id, hearing_date, hearing_time) VALUES (27, 61, '2026-02-28T19:00:00.000Z', '12:02:00');
INSERT INTO public.hearing_details (hearing_id, case_id, hearing_date, hearing_time) VALUES (28, 60, '2026-02-21T19:00:00.000Z', '16:49:00');
INSERT INTO public.hearing_details (hearing_id, case_id, hearing_date, hearing_time) VALUES (30, 68, '2028-02-21T19:00:00.000Z', '12:00:00');

-- Table: court_type
CREATE TABLE IF NOT EXISTS public.court_type (
    type_id integer NOT NULL DEFAULT nextval('court_type_type_id_seq'::regclass),
    type_name character varying NOT NULL,
    court_type_code character varying
);

-- Data for court_type
INSERT INTO public.court_type (type_id, type_name, court_type_code) VALUES (4, 'Banking', 'BNK');
INSERT INTO public.court_type (type_id, type_name, court_type_code) VALUES (1, 'Civil', 'CVL');
INSERT INTO public.court_type (type_id, type_name, court_type_code) VALUES (6, 'Commercial', 'COM');
INSERT INTO public.court_type (type_id, type_name, court_type_code) VALUES (2, 'Criminal', 'CRM');
INSERT INTO public.court_type (type_id, type_name, court_type_code) VALUES (3, 'Family', 'FAM');
INSERT INTO public.court_type (type_id, type_name, court_type_code) VALUES (7, 'Anti-Corruption', 'ANT');
INSERT INTO public.court_type (type_id, type_name, court_type_code) VALUES (5, 'Constitutional', 'CNS');
INSERT INTO public.court_type (type_id, type_name, court_type_code) VALUES (8, 'Tax', 'TAX');
INSERT INTO public.court_type (type_id, type_name, court_type_code) VALUES (9, 'Labor', 'LBR');
INSERT INTO public.court_type (type_id, type_name, court_type_code) VALUES (10, 'Election', 'ELC');
INSERT INTO public.court_type (type_id, type_name, court_type_code) VALUES (11, 'Environmental', 'ENV');
INSERT INTO public.court_type (type_id, type_name, court_type_code) VALUES (12, 'Customs', 'CST');
INSERT INTO public.court_type (type_id, type_name, court_type_code) VALUES (13, 'Other', 'OTH');
INSERT INTO public.court_type (type_id, type_name, court_type_code) VALUES (14, 'Rape', 'RPE');
INSERT INTO public.court_type (type_id, type_name, court_type_code) VALUES (15, 'Cyber', 'CYB');

-- Table: ordersheets
CREATE TABLE IF NOT EXISTS public.ordersheets (
    id integer NOT NULL DEFAULT nextval('ordersheets_id_seq'::regclass),
    case_id integer NOT NULL,
    content_html text NOT NULL,
    status character varying DEFAULT 'pending'::character varying,
    submitted_by character varying,
    reviewed_by character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    reviewed_at timestamp without time zone,
    ordersheet_url text
);

-- Data for ordersheets
INSERT INTO public.ordersheets (id, case_id, content_html, status, submitted_by, reviewed_by, created_at, reviewed_at, ordersheet_url) VALUES (6, 11, '
<div class="ordersheet-template">

  <div class="os-header">
    <div class="os-form">Form No: HCJD/C-121</div>
    <div class="os-title"><b>ORDER SHEET</b></div>
    <div class="os-subtitle"><b>IN THE Lahore High Court</b></div>
    <div class="os-subtitle"><b>JUDICIAL DEPARTMENT</b></div>
    <div class="os-case"><b>Writ Petition No. 11</b></div>
  </div>

  <div class="os-parties">
    <div>Ahmed</div>
    <div><b>Versus</b></div>
    <div>Bilal</div>
  </div>

  <table class="os-table">
    <thead>
    <tr>
      <th class="col-serial">S.No. of order / Proceedings</th>
      <th class="col-date">Date of order / Proceedings</th>
      <th class="col-order">
        Order with signature of Judge and that of<br>
        Parties of counsel, where necessary
      </th>
    </tr>
  </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>2025-12-25</td>
        <td>
          <div id="order-body" class="editable" contenteditable="true"> So mic testing, how do I mic this one? Mic testing. mic testing, hello, hello, hello, hello, hello.</div>
        </td>
      </tr>
    </tbody>
  </table>

</div>
', 'approved', 'Asjad Shahab', 'Ayan Shahab', '2025-12-30T16:09:46.858Z', '2025-12-30T16:17:32.703Z', 'https://qxhyujcaqmsvrryjpuxj.supabase.co/storage/v1/object/public/Transcription_Files/ordersheets/Ordersheet_11.pdf');
INSERT INTO public.ordersheets (id, case_id, content_html, status, submitted_by, reviewed_by, created_at, reviewed_at, ordersheet_url) VALUES (8, 40, '
<div class="ordersheet-template">
  <div class="os-header">
    <div class="os-form">Form No: HCJD/C-121</div>
    <div class="os-title"><b><u>ORDER SHEET</u></b></div>
    <div class="os-subtitle"><b>IN THE District Courts Lahore</b></div>
    <div class="os-subtitle"><b>JUDICIAL DEPARTMENT</b></div>
    <div class="os-case"><b>Writ Petition No. 40</b></div>
  </div>

  <div class="os-parties">
    <div>Professor</div>
    <div><b>Versus</b></div>
    <div>xyz</div>
  </div>

  <table class="os-table">
    <thead>
    <tr>
      <th class="col-serial">S.No. of order / Proceedings</th>
      <th class="col-date">Date of order / Proceedings</th>
      <th class="col-order">
        Order with signature of Judge and that of<br>
        Parties of counsel, where necessary
      </th>
    </tr>
  </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>2026-01-12</td>
        <td>Lawyer ABC<br>PROCEEDINGS:<br>A civil case, CVL-2026-40, titled ''Theft in uni'', was heard in the court of Malik Junaid Aziz on 2026-01-12 at 13:16. The case involved a professor and ''xyz''. The professor accused ''xyz'' of treachery under section 420. ''xyz'' and his lawyer denied the allegation. A witness was presented in the court to testify.<br>ORDERS:<br>1. Statement of the lawyer of the accused was heard.<br>2. Witness was called to the stand and recorded statement.<br>NEXT DATE OF HEARING:<br>5-01-2026</td>
      </tr>
    </tbody>
  </table>
</div>', 'approved', 'Bilal Khadim', 'Malik Junaid Aziz', '2026-01-02T21:13:29.505Z', '2026-01-02T21:16:12.699Z', 'https://qxhyujcaqmsvrryjpuxj.supabase.co/storage/v1/object/public/Transcription_Files/ordersheets/Ordersheet_40.pdf');
INSERT INTO public.ordersheets (id, case_id, content_html, status, submitted_by, reviewed_by, created_at, reviewed_at, ordersheet_url) VALUES (11, 26, '
<div class="ordersheet-template">

  <div class="os-header">
    <div class="os-form">Form No: HCJD/C-121</div>
    <div class="os-title"><b>ORDER SHEET</b></div>
    <div class="os-subtitle"><b>IN THE Lahore High Court</b></div>
    <div class="os-subtitle"><b>JUDICIAL DEPARTMENT</b></div>
    <div class="os-case"><b>Writ Petition No. 26</b></div>
  </div>

  <div class="os-parties">
    <div>uni</div>
    <div><b>Versus</b></div>
    <div>ahmed</div>
  </div>

  <table class="os-table">
    <thead>
    <tr>
      <th class="col-serial">S.No. of order / Proceedings</th>
      <th class="col-date">Date of order / Proceedings</th>
      <th class="col-order">
        Order with signature of Judge and that of<br>
        Parties of counsel, where necessary
      </th>
    </tr>
  </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>2025-12-31</td>
        <td>
          <div id="order-body" class="editable" contenteditable="true"></div>
        </td>
      </tr>
    </tbody>
  </table>gh,vggcuktftysadfghjk</div>
', 'approved', 'Asjad Shahab', NULL, '2026-01-05T14:30:00.393Z', NULL, 'https://qxhyujcaqmsvrryjpuxj.supabase.co/storage/v1/object/public/Transcription_Files/ordersheets/Ordersheet_26.pdf');
INSERT INTO public.ordersheets (id, case_id, content_html, status, submitted_by, reviewed_by, created_at, reviewed_at, ordersheet_url) VALUES (16, 28, '
<div class="ordersheet-template">

  <div class="os-header">
    <div class="os-form">Form No: HCJD/C-121</div>
    <div class="os-title"><b>ORDER SHEET</b></div>
    <div class="os-subtitle"><b>IN THE District Courts Lahore</b></div>
    <div class="os-subtitle"><b>JUDICIAL DEPARTMENT</b></div>
    <div class="os-case"><b>Writ Petition No. 28</b></div>
  </div>

  <div class="os-parties">
    <div>State</div>
    <div><b>Versus</b></div>
    <div>Tariq Malik</div>
  </div>

  <table class="os-table">
    <thead>
    <tr>
      <th class="col-serial">S.No. of order / Proceedings</th>
      <th class="col-date">Date of order / Proceedings</th>
      <th class="col-order">
        Order with signature of Judge and that of<br>
        Parties of counsel, where necessary
      </th>
    </tr>
  </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>2025-01-16</td>
        <td>
          <div id="order-body" class="editable" contenteditable="true"></div>
        </td>
      </tr>
    </tbody>
  </table>the text did not come</div>
', 'pending', NULL, NULL, '2026-01-08T23:36:47.547Z', NULL, 'https://qxhyujcaqmsvrryjpuxj.supabase.co/storage/v1/object/public/Transcription_Files/ordersheets/Ordersheet_28.pdf');
INSERT INTO public.ordersheets (id, case_id, content_html, status, submitted_by, reviewed_by, created_at, reviewed_at, ordersheet_url) VALUES (17, 31, '
<div class="ordersheet-template">
  <div class="os-header">
    <div class="os-form">Form No: HCJD/C-121</div>
    <div class="os-title"><b><u>ORDER SHEET</u></b></div>
    <div class="os-subtitle"><b>IN THE District Courts Lahore</b></div>
    <div class="os-subtitle"><b>JUDICIAL DEPARTMENT</b></div>
    <div class="os-case"><b>Writ Petition No. 31</b></div>
  </div>

  <div class="os-parties">
    <div>State</div>
    <div><b>Versus</b></div>
    <div>Salman Abbas</div>
  </div>

  <table class="os-table">
    <thead>
    <tr>
      <th class="col-serial">S.No. of order / Proceedings</th>
      <th class="col-date">Date of order / Proceedings</th>
      <th class="col-order">
        Order with signature of Judge and that of<br>
        Parties of counsel, where necessary
      </th>
    </tr>
  </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>2025-01-20</td>
        <td>PROCEEDINGS:<br>The witness testified that the accused is innocent and a fake case is being filed against him. The judge agreed and the proceedings were closed. The witness requested to sign the documents and change certain information.<br>ORDERS:<br>1. The accused, Salman Abbas, is found innocent.<br>2. The case is closed.<br>3. The witness''s request to sign the documents and change certain information is granted.<br>NEXT DATE OF HEARING:<br>10-01-2026</td>
      </tr>
    </tbody>
  </table>
</div>', 'pending', NULL, NULL, '2026-01-09T05:49:09.815Z', NULL, 'https://qxhyujcaqmsvrryjpuxj.supabase.co/storage/v1/object/public/Transcription_Files/ordersheets/Ordersheet_31.pdf');

-- Table: original_transcript
CREATE TABLE IF NOT EXISTS public.original_transcript (
    id bigint NOT NULL DEFAULT nextval('original_transcript_id_seq'::regclass),
    case_id integer NOT NULL,
    speaker character varying,
    start_time real,
    end_time real,
    message text,
    created_at timestamp without time zone DEFAULT now(),
    original_language text
);

-- Data for original_transcript
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('95', 11, 'ayan', 0, 5, 'Now we will talk about some transcripts', '2025-12-26T19:10:29.047Z', 'سٹارٹ کی اب ہم دونوں باتیت کریں گے کچھ ایک ٹرانسپریم بھی');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('96', 11, 'ayan', 5, 10, 'We will try our best for this case.', '2025-12-26T19:10:29.056Z', 'ایک کیس کے لئے پوچھ کرتے ہیں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('97', 11, 'ayan', 10, 15, 'What are you saying? You have seen our natural talks.', '2025-12-26T19:10:29.064Z', 'کیا آپ بولے ہیں اس میں نیچلو گفتہ کو ہمارے گیر دیکھ لیں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('98', 11, 'ayan', 15, 20, 'So you also say something so that we can see how bad or how good is his digestion.', '2025-12-26T19:10:29.068Z', 'ہاں تو آپ بھی تو کچھ بولے تاکہ ہم دیکھیں اور اس کی ڈائزن کتنی وکار ہے کتنی ہے ٹھیک ہے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('99', 11, 'ayan', 20, 25, 'I will tell you after I am done with it, you should do it after you are done with it. It doesn''t work like this.', '2025-12-26T19:10:29.071Z', 'ہمیں اکے بھی بولوں گا اس کا اتنا سے اکے بھی کر لینا چاہیئے یہاں سکتا ہے کہ یہ کام نہیں کرتا ہے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('100', 11, 'ayan', 25, 30, 'It was useful. It was useful. You said it yourself.', '2025-12-26T19:10:29.077Z', 'فائدہ کی پس فائدہ کی پس یہ تم نے خودی بول دی');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('101', 11, 'ahmed', 40, 45, 'Yes, that''s it. Actually, I don''t know anything about Nokia. I don''t know anything about it.', '2025-12-26T19:11:00.790Z', 'اچھا تو بہت سامجھنے ایروں میں گوھروں کیا اور کافی زیادہ انسی');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('102', 11, 'ahmed', 45, 50, 'I don''t know why I''m talking to you. I don''t know why I''m talking to you.', '2025-12-26T19:11:00.793Z', 'کیوں کہ آپ کو اکسیلی بات کر رہے ہیں تو اس ویڈیو سے میں بات نہیں پہلے ساتھ آئے گا لیکن یہ دکھوں گے کب سے میری بات');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('103', 11, 'ahmed', 50, 55, 'Now we will', '2025-12-26T19:11:00.798Z', 'اب جاکے یہ اس کو');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('104', 11, 'ayan', 35, 40, 'because I don''t speak majority', '2025-12-26T19:11:00.869Z', 'کیونکہ میں نے بہت زیادہ بولا');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('105', 11, 'ayan', 55, 60, 'after 5-6 seconds', '2025-12-26T19:11:00.900Z', '5-6 سکن کے بعد');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('106', 11, 'ayan', 60, 65, 'Thank you for watching.', '2025-12-26T19:11:33.268Z', 'یہ تمہارے نام');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('107', 11, 'ayan', 65, 70, 'Thank you so much.', '2025-12-26T19:11:33.287Z', 'کچھ میدے پر امد');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('108', 11, 'ayan', 70, 75, 'I have put these 5 minutes in the video. I don''t want to say this.', '2025-12-26T19:11:33.301Z', 'یہ پانچ درہوڑ پیان ڈال دیا میں نہیں بولی');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('109', 11, 'ayan', 75, 80, 'So this can be fixed in few records', '2025-12-26T19:11:33.306Z', 'تو یہ کچھ ریکارڈز میں ٹھیک کر لیتا ہے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('110', 11, 'ayan', 80, 85, 'and in some regards, this is... in some regards, this is... yes', '2025-12-26T19:11:33.310Z', 'اور کچھ ڈگارڈز میں یہ ڈگارڈز میں یہ ڈگارڈز میں یہ ڈگارڈز میں یہ');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('111', 11, 'ayan', 90, 95, 'Where did you write your name? You can write your name here You can click here', '2025-12-26T19:12:19.027Z', 'نام کر سکتے ہیں نام ایڈ کر سکتے ہیں یہاں پر کلک کریں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('112', 11, 'ayan', 105, 110, 'Now it should have your name in it, because you forgot it.', '2025-12-26T19:12:19.069Z', 'اب اس میں تمہارا نام آنا چاہیئے یوں کی بات تم نے بھولی ہے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('113', 11, 'ayan', 110, 115, 'we will see after few seconds', '2025-12-26T19:12:19.077Z', 'کچھ سکن کے بعد دیکھ لیتے ہیں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('114', 11, 'ayan', 115, 120, 'I have seen a lot of things like this and I am very happy about it.', '2025-12-26T19:12:19.079Z', 'لکھاتے ہیں کہ کافی بہت سال ہے اور ہم 네کٹل بہت بہت منتظر کرنے کے لئے ملکی گوھڑ گوھہ سینڈب');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('115', 11, 'ayan', 95, 100, 'I have not done any work on the web data but', '2025-12-26T19:12:19.139Z', 'ویب ویڈیو اس میں یہ لوگ کام نہیں کیا ہوا لیکن');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('116', 11, 'ayan', 125, 130, 'Thank you for watching this video.', '2025-12-26T19:12:55.812Z', 'سکھائی تھی بھوکت نابل سنچل');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('117', 11, 'ayan', 150, 155, 'Thank you.', '2025-12-26T19:12:55.820Z', 'شکریہ');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('118', 11, 'ayan', 155, 160, 'Thank you for watching this video.', '2025-12-26T19:12:55.823Z', 'یہ ویڈیو دیکھنے کے لئے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('119', 11, 'ahmed', 165, 170, 'One second is enough. Wow.', '2025-12-26T19:12:55.826Z', 'واں سینگ جو جلا رہا واں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('120', 11, 'ayan', 130, 135, '36.46%', '2025-12-26T19:12:55.832Z', '36 ۔ 36 ۔ 46 ۔');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('121', 11, 'ayan', 135, 140, 'It''s been 2 minutes of transcript, why is it still bending?', '2025-12-26T19:12:55.839Z', 'دو منٹ تنسکرپٹ ہو رہی ہے آپ تک بینڈنگ پر کیوں گا');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('122', 11, 'ahmed', 140, 145, 'What do you want to do? 2 minutes', '2025-12-26T19:12:55.840Z', 'ہے بلاؤ یہ دو منٹ');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('123', 11, 'ayan', 145, 150, 'He put your name on it He didn''t put your name on it, he put my name on it', '2025-12-26T19:12:55.848Z', 'اس نے تمہارے نام ڈالا اس نے تمہارے نام نہیں ڈالا اس نے میرے نام ہی ڈالا');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('124', 11, 'ayan', 120, 125, 'Thank you for watching this video.', '2025-12-26T19:12:55.881Z', 'پہلے چینج کھرنگا');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('125', 11, 'ayan', 170, 175, 'Let me change it.', '2025-12-26T19:13:33.192Z', 'ڈی چینج اٹ');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('126', 11, 'ayan', 175, 180, 'Let''s start with my bag.', '2025-12-26T19:13:33.209Z', 'جو چاہتے ہیں میرے بیٹھ');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('127', 11, 'ayan', 180, 185, 'Now it has done the change. Now it has done the change. Now it has done the change.', '2025-12-26T19:13:33.225Z', 'وہ صحیح کیا اس نے ایلوٹ کیا اب اس نے کر دیا چینج جوہاز بنتا ہے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('128', 11, 'ayan', 190, 195, 'looking up any suggestions that they may have for us.', '2025-12-26T19:13:33.228Z', 'کہ یہاں اپنی سکتے ہیں کہ یہاں اپنی سکتے ہیں۔');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('129', 11, 'ayan', 185, 190, 'Thanks for watching', '2025-12-26T19:13:33.265Z', 'اس کو بھی ہم بچوں سکتے ہیں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('130', 11, 'ahmed', 195, 200, 'I have produced what I have.', '2025-12-26T19:14:00.933Z', 'میں نے اپنے نظروں کو کھائی رہا ہوں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('131', 15, 'bilal', 0, 5, 'Say something. Hello, Assalamualaikum. My name is Bilal.', '2025-12-28T12:55:53.711Z', 'بولو کچھ یہ اللہ اسلام علیکم میرا نام بلانے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('132', 15, 'bilal', 5, 10, 'I am trying to test it', '2025-12-28T12:55:53.716Z', 'میں اس کو تسکنے کی کوشش کر رہا ہوں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('133', 15, 'ahmed', 25, 30, 'This is also like this. Whatever I have to do with this I will show you.', '2025-12-28T12:55:53.734Z', 'میں اس کے لئے جو کرنا چاہتا ہوں میں اس کے لئے جو کرنا چاہتا ہوں میں اس کے لئے چاہتا ہوں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('134', 15, 'ahmed', 15, 20, 'I have to edit this a little bit.', '2025-12-28T12:55:53.738Z', 'یہاں میں اس کو تھوڑی بہت ویڈیو کرنی ہے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('135', 15, 'ayan', 20, 25, 'we will make it a little wider you made it expandable in fact it looks like this', '2025-12-28T12:55:53.743Z', 'we will make it a little wider you made it expandable in fact it looks like this');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('136', 15, 'bilal', 10, 15, 'Okay.', '2025-12-28T12:55:53.828Z', 'ٹھیک ہے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('351', 39, 'ayan', 0, 5, 'I am testing again.', '2026-01-02T19:34:42.025Z', 'پیسے ٹیسٹ کر رہا ہوں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('137', 15, 'bilal', 30, 35, 'I would like to thank all of you for watching this video.', '2025-12-28T12:56:25.487Z', 'میں اس کو بہت بہت بہت سے کرنا چاہتا ہوں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('138', 15, 'bilal', 35, 40, 'Look what he is doing here.', '2025-12-28T12:56:25.505Z', 'یہ لیکن یہاں پہ کر رہا ہے احمد بولدی ہے اس نے بلال بلی');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('139', 15, 'bilal', 40, 45, 'You said this. I said this. You said this.', '2025-12-28T12:56:25.521Z', 'یہ تم نے بولا تھا یہ میں نے بولا تھا یہ تم نے بولا تھا');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('140', 15, 'bilal', 50, 55, 'This is a very old school This is a very old school', '2025-12-28T12:56:25.525Z', 'یہ بھائی نے پورا تھا اس نیوشل ٹیکس ہی و سکول ٹیکس');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('141', 15, 'bilal', 60, 65, 'like this this is ok our p-transcript is ready', '2025-12-28T12:56:58.653Z', 'جیسے یہ ٹرانسکرپ بن گئی ہے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('142', 15, 'bilal', 65, 70, 'You can also edit this comment to edit', '2025-12-28T12:56:58.676Z', 'اس کا ایڈیٹ بھی کر سکتے ہیں ایڈیٹ کرنے کے لئے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('143', 15, 'bilal', 70, 75, 'What is this old school?', '2025-12-28T12:56:58.700Z', 'اور سکول میں کیا');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('144', 15, 'bilal', 90, 95, 'now we are going to edit it now we are going to edit it now we are doing it', '2025-12-28T12:56:58.703Z', 'بیلٹ بیلٹ سیب ہو گیا ہم کرتے ہیں بس ٹھیک ہے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('145', 15, 'bilal', 75, 80, 'What is written here? This is the whole thing.', '2025-12-28T12:56:58.755Z', 'کیا لکھے یہاں پر؟ یہ بھائی نے پورا');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('146', 15, 'bilal', 80, 85, 'That''s it. Thank you.', '2025-12-28T12:56:58.866Z', 'ڈائس ڈائس');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('194', 37, 'ayan', 0, 5, 'I am testing it again', '2025-12-30T15:27:29.642Z', 'اچھا میں پھر سے اس کو تیسک کر کے دیکھ رہا ہوں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('195', 37, 'ayan', 5, 10, 'How is the transcription of this?', '2025-12-30T15:27:29.646Z', 'اس کی ترانسکرپشن کیسی ہے؟');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('196', 37, 'bilal', 10, 15, 'He will have to do some work because he needs some data which he can use.', '2025-12-30T15:27:29.653Z', 'وہ تو ہوگا لیکن اسی کام کرنا ہوگا کیونکہ اس کو کوئی ڈیٹا تو چاہیے رہا جو چلے گا');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('197', 37, 'ayan', 15, 20, 'What will you do if it is better? It is better, but it needs work.', '2025-12-30T15:27:29.659Z', 'بہتر ہے کام کی ضرورت ہے لیکن');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('198', 37, 'ayan', 25, 30, 'I am waiting for the virus to spread', '2025-12-30T15:28:10.231Z', 'میں اس کو ویڈ کر رہا ہوں کہ یہ بیرائز کریں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('199', 37, 'bilal', 35, 40, 'I have to fix this also', '2025-12-30T15:28:10.250Z', 'یہ بھی ٹھیک کرنا تھا');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('200', 37, 'ayan', 40, 45, 'People are doing a lot of work. They are doing a lot of work.', '2025-12-30T15:28:10.258Z', 'بڑے لوگ کر رہے ہیں بڑی بڑی جو تھی سو سپل بڑی جو کام کر رہا ہوتا ہے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('201', 37, 'ayan', 45, 50, 'This is a strange example, but why do you do it?', '2025-12-30T15:28:10.264Z', 'وہ یہ کرتے ہیں کہ اس طرح کی چیزوں بھو پھور کے تو کرتے ہیں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('202', 37, 'ayan', 50, 55, 'We have to learn from the database, we have to learn and then we have to give it a retake.', '2025-12-30T15:28:10.268Z', 'کہ دیٹا پیسے لٹن کیا کرتے ہیں لٹن کرتے ہیں کہ اس کو ریڈیو بھی کرتے ہیں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('203', 37, 'ayan', 65, 70, 'Thank you very much.', '2025-12-30T15:28:43.152Z', 'Thank you very much.');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('204', 37, 'ayan', 75, 80, 'I will fine tune it for you ok I wanted to fine tune it', '2025-12-30T15:28:43.170Z', 'میں آپ کو فائن ٹیون کرتا ہوں ٹھیک ہے بھائی فائن ٹیون بھی کرنا تھا بھائی');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('205', 37, 'ayan', 85, 90, 'I am not doing a good job.', '2025-12-30T15:28:43.175Z', 'اس کے پر اس کو دیکھیں اور پہلے سے زیادہ انٹرمیر ہوں اچھا کام نہیں کر رہا');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('206', 37, 'ayan', 90, 95, 'Now we need to work on it again.', '2025-12-30T15:28:43.181Z', 'ہمارا پھر سے اس میں کام کرنے کی ضرورت ہے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('207', 37, 'ayan', 95, 100, 'and it will have such a texture.', '2025-12-30T15:28:43.186Z', 'اور اس کا اس طرح سے ٹیکچر ہوگا');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('208', 37, 'ayan', 100, 105, 'Yes, this will be the case.', '2025-12-30T15:28:43.189Z', 'تو یہ گرانس ہوگا');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('209', 37, 'ayan', 110, 115, 'If people get trained, then their learning size will be smaller.', '2025-12-30T15:29:01.256Z', 'پھر ترین ہو گیا تو لرنی کا سیس کو چھوٹ نہیں ہوتا ہے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('210', 37, 'ayan', 115, 120, 'So, this is the model of it, I have already done this model.', '2025-12-30T15:29:01.259Z', 'تو اس کا وہ بڑل جو آتی ہے میں رہا ہوں یہ بڑل لچ کر چکا ہوتا ہے سب کچھ');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('352', 39, 'ayan', 5, 10, 'I am waiting for the test, but still I am testing.', '2026-01-02T19:34:42.044Z', 'تس کر کر کے پیزار ہوگی ہو لیکن پھر بھی تسٹ کر رہا ہوں میں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('353', 39, 'ayan', 10, 15, 'I am not writing right now because we will not be able to do the demo.', '2026-01-02T19:34:42.047Z', 'کیونکہ بھی ڈیموگرہ اپ ناکے جائیں گے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('354', 39, 'ayan', 0, 5, 'I am testing again.', '2026-01-02T19:34:42.047Z', 'پیسے ٹیسٹ کر رہا ہوں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('355', 39, 'ayan', 5, 10, 'I am waiting for the test, but still I am testing.', '2026-01-02T19:34:42.047Z', 'تس کر کر کے پیزار ہوگی ہو لیکن پھر بھی تسٹ کر رہا ہوں میں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('356', 39, 'ayan', 10, 15, 'I am not writing right now because we will not be able to do the demo.', '2026-01-02T19:34:42.147Z', 'کیونکہ بھی ڈیموگرہ اپ ناکے جائیں گے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('357', 39, 'bilal', 15, 20, 'This is the skin coating Is there skin coating in this?', '2026-01-02T19:34:55.839Z', 'سکنڈ کوڈنگ ہے سکنڈ کوڈنگ ہوتی ہے اس میں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('358', 39, 'bilal', 15, 20, 'This is the skin coating Is there skin coating in this?', '2026-01-02T19:34:55.845Z', 'سکنڈ کوڈنگ ہے سکنڈ کوڈنگ ہوتی ہے اس میں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('359', 39, 'ayan', 0, 5, 'I am testing again.', '2026-01-02T19:36:25.282Z', 'پیسے ٹیسٹ کر رہا ہوں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('360', 39, 'bilal', 55, 60, '2,000 to 2,000', '2026-01-02T19:36:25.290Z', 'دو ڑو ہزار ہے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('361', 39, 'ayan', 5, 10, 'I am waiting for the test, but still I am testing.', '2026-01-02T19:36:25.290Z', 'تس کر کر کے پیزار ہوگی ہو لیکن پھر بھی تسٹ کر رہا ہوں میں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('362', 39, 'bilal', 60, 65, 'That is the only thing that I can do.', '2026-01-02T19:36:25.293Z', 'بہت زیادہ کام کرنے کے لئے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('363', 39, 'ayan', 100, 105, 'Please subscribe to my channel.', '2026-01-02T19:36:25.297Z', 'ملاکو ترے باقا نہیں کرتا');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('365', 39, 'ayan', 105, 110, 'Oh yes, oh yes.', '2026-01-02T19:36:25.299Z', 'بھائی بھائی');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('364', 39, 'ayan', 10, 15, 'I am not writing right now because we will not be able to do the demo.', '2026-01-02T19:36:25.298Z', 'کیونکہ بھی ڈیموگرہ اپ ناکے جائیں گے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('366', 39, 'ayan', 110, 115, 'It''s all declared now.', '2026-01-02T19:36:25.300Z', 'ڈکرٹ ہو گیا ہوا');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('367', 39, 'bilal', 115, 120, 'I am feeling sleepy I think', '2026-01-02T19:36:25.304Z', 'بھائیدہ بھائیدہ');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('371', 39, 'ayan', 130, 135, 'But still it is closed, so let''s do it again.', '2026-01-02T19:36:25.310Z', 'پھر بھی یہ بند ہے اس کو پھر کر لیتے ہیں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('368', 39, 'ayan', 120, 125, 'I will see you in the next video, take care and take care of yourself.', '2026-01-02T19:36:25.305Z', 'پڑھ لیتا نیوستریڈ ہوگا رہنسکنے پڑھے میں یوز افیکٹ و افنیستریڈ اس لئے میں اپنے ہوں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('369', 39, 'ayan', 125, 130, 'I put it in the local storage so that they can speak', '2026-01-02T19:36:25.308Z', 'لوکل سٹورچ کے نے ڈال دیا کہ بھائی سپیک کرے یہ بنت ہے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('372', 39, 'ayan', 135, 140, 'All the students should do this. The speaker should also be mapped.', '2026-01-02T19:36:25.311Z', 'لیکن اس نے سارے بڑھنے ہاں، سپیکر اور سپیکر بھی میں سے یہ اپ نیپ کرنا چاہیئے اس کو');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('373', 39, 'ayan', 140, 145, 'Thank you', '2026-01-02T19:36:25.316Z', 'ایہاں بلاؤ، ایہاں بلاؤ');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('370', 39, 'ayan', 35, 40, 'Thank you very much.', '2026-01-02T19:36:25.309Z', 'Thank you very much.');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('374', 39, 'ayan', 40, 45, 'Thank you.', '2026-01-02T19:36:25.322Z', 'بھائی');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('375', 39, 'bilal', 15, 20, 'This is the skin coating Is there skin coating in this?', '2026-01-02T19:36:25.321Z', 'سکنڈ کوڈنگ ہے سکنڈ کوڈنگ ہوتی ہے اس میں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('385', 40, 'judge', 0, 5, 'Let''s start the experiment', '2026-01-02T21:06:46.939Z', 'ڈالت کی کروائی شروع کی');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('386', 40, 'judge', 30, 35, 'What does the accused''s lawyer want to say?', '2026-01-02T21:06:46.969Z', 'ملزم کے وکیل کیا کہنا چاہتا ہے؟');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('387', 40, 'judge', 5, 10, 'case no. 122', '2026-01-02T21:06:46.979Z', 'کیس نمبر 122 پیش کیا جائے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('388', 40, 'judge', 15, 20, 'Please give your statement to the lawyer of this case.', '2026-01-02T21:06:46.985Z', 'مدعی کے وکیل اپنا بیان دیں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('389', 40, 'lawyer', 10, 15, 'Yes, sir. Case no. 22 is ready.', '2026-01-02T21:06:53.717Z', 'جی جناہ قیس نمبر ایک سب بائیس حاضر ہے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('390', 40, 'lawyer', 45, 50, 'Is there any witness?', '2026-01-02T21:06:53.719Z', 'کیا کوئی گواہ موجود ہے؟');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('391', 40, 'lawyer', 55, 60, 'Please present the witness', '2026-01-02T21:06:53.721Z', 'گواہ کو پیش کیا جائے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('392', 40, 'lawyer', 20, 25, 'This step was taken under section 420.', '2026-01-02T21:07:00.196Z', 'جناب یہ قدمہ دفعہ 420 کے تاہر درج کیا گیا ہے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('393', 40, 'lawyer', 50, 55, 'Yes, there is a witness in the court.', '2026-01-02T21:07:00.200Z', 'جی ہاں ایک اینے گواہ ادالت میں موجود ہے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('394', 40, 'lawyer', 25, 30, 'It is an allegation of treachery against the accused.', '2026-01-02T21:07:00.303Z', 'منظم پر ڈھوکا دے کاکے عظام ہے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('395', 40, 'lawyer', 35, 40, 'My client did not commit any crime.', '2026-01-02T21:07:00.319Z', 'میرے موکل نے کسی قسم کا جرم نہیں کیا');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('396', 40, 'lawyer', 40, 45, 'This is the purpose of this video.', '2026-01-02T21:07:00.333Z', 'یہ رزاہم بے بنیاد ہے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('397', 40, 'lawyer', 60, 65, 'I have seen it with my own eyes.', '2026-01-02T21:07:26.203Z', 'جناب میرا یہ وہاں کے اپنے آنکھوں سے دیکھا گیا ہے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('398', 40, 'judge', 65, 70, 'record the statement of the witness.', '2026-01-02T21:07:26.210Z', 'گواہ کا بیان ریکارڈ کیا جائے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('436', 28, 'ahmed', 55, 60, 'How are you feeling now? Let''s go down.', '2026-01-03T08:11:10.787Z', 'پتہ نہیں کیا آپ کو شعور کرتے ہیں؟ دیکھو');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('438', 28, 'ahmed', 85, 90, 'How do you speak Urdu like a person who speaks English?', '2026-01-03T08:11:10.796Z', 'باز کھیل نہیں ہے تم اوردھو کس طرح بول رہے ہیں جیسے انگلش بولتا ہے ہاں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('437', 28, 'ahmed', 60, 65, 'What are you looking at?', '2026-01-03T08:11:10.795Z', 'چاہتے ہیں جا سکتے ہیں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('439', 28, 'ahmed', 90, 95, 'I don''t know how to speak in English It''s easy', '2026-01-03T08:11:10.799Z', 'I don''t know how to speak in English It''s easy');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('441', 28, 'ahmed', 95, 100, 'You better speak like a dog, or else they will come. Look Ahmed, you are talking wrong.', '2026-01-03T08:11:10.804Z', 'لیکن تو بیٹا کوپوں کی طرح بولی جائے گا دی اینگل فور دو دیکھو ایباد تم غلط بات کر رہے ہو');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('440', 28, 'ahmed', 65, 70, 'What is this line?', '2026-01-03T08:11:10.802Z', 'یہ کیا لائن ہے؟ کیا آپ جانتے ہیں؟');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('442', 28, 'ahmed', 100, 105, 'I am talking to him calmly.', '2026-01-03T08:11:10.805Z', 'ہرام سے ہی بات کرو');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('443', 28, 'ahmed', 105, 110, 'And the drone Bro, this bike looks like Farooq', '2026-01-03T08:11:10.808Z', 'اور ڈروم بھائی یہ بائیک فرق ہوتا ہے لیکن');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('444', 28, 'ahmed', 110, 115, 'I think the mic is faulty The mic is fine Is the code faulty?', '2026-01-03T08:11:10.810Z', 'یہ مائیک فارگ ہو گیا مائیک ٹھیک ہے یہ کون فارگ ہو گیا');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('445', 28, 'ahmed', 75, 80, 'Please', '2026-01-03T08:11:10.815Z', 'بہت بہت شکریہ');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('446', 28, 'ahmed', 70, 75, 'It has improved to some extent, but now you keep quiet, nothing has happened yet.', '2026-01-03T08:11:10.819Z', 'کچھ حد تک یہ بہتر ہو شکا ہے ٹھیک ہے ابھی تم چھپ کرو ابھی کچھ نہیں ہولا');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('447', 28, 'ahmed', 80, 85, 'Is the voice clear? It''s not clear.', '2026-01-03T08:11:10.820Z', 'یہ جو ہے نا آہ وہ کلیر ہے وہ کلیر نہیں ہے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('448', 39, 'ayan', 0, 5, 'Let''s start. We are checking the system.', '2026-01-03T08:21:42.008Z', 'سٹرٹ ہاں ہم اس کا سسٹم چیک کر رہے ہیں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('449', 39, 'bilal', 5, 10, 'How will the transcription be better?', '2026-01-03T08:21:46.785Z', 'ترسکریپشن کیسے بہتر ہوگی؟');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('450', 39, 'arsalan', 15, 20, 'The translation will be in Urdu and English and it will take almost 2-3 seconds.', '2026-01-03T08:21:52.203Z', 'بردو اور انگلیش کی ترانسلیشن ہوگی اس طرح سے اور یہ ریال ٹائم بھی ہوتی ہے اس کو 2 سے 3 سیکنٹ سلوک ہوتی ہے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('451', 39, 'arsalan', 55, 60, 'Then we will map the speaker in it. Now the speaker will do this. Speaker B.', '2026-01-03T08:21:52.205Z', 'پھر ہم سپیکر میپ کر دیں گے اس کے اندر یہ ہم نے بولے کہ یہ سارے اب وہ سارے سپیکر اس کو یہ کر دے گا سپیکر بی');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('452', 39, 'arsalan', 35, 40, 'Its accuracy is around 80-50%', '2026-01-03T08:21:52.245Z', 'اس کی اکویسی ایرانڈ 80، 70، 50 پرسنٹ ہے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('453', 39, 'bilal', 40, 45, 'We can use this medium model, but our laptop is not of that level, so we are not using it.', '2026-01-03T08:22:09.370Z', 'اس کا میڈیو موڈل ہی اس سے بہتر موڈل کر سکتے ہیں لیکن ہمارا لیپٹوپ اس لیول کا نہیں ہے تو ہم اس کے بارے میں اس کو نہیں ہوں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('454', 39, 'bilal', 50, 55, 'Thank you very much.', '2026-01-03T08:22:09.379Z', 'Thank you very much.');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('455', 39, 'arsalan', 65, 70, 'He has scored all the marks.', '2026-01-03T08:22:09.380Z', 'اس نے سارے مارکس رکھا ہے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('456', 39, 'arsalan', 60, 65, 'Bilal will turn on speaker B and speaker A will turn on speaker A.', '2026-01-03T08:22:09.385Z', 'بلال کا بھی سرن اپ کر دے گا اور سپیکر اے باقی طور پر');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('457', 39, 'bilal', 30, 35, 'Have you studied this? Sir, what we have observed...', '2026-01-03T08:22:09.460Z', 'میں اسی کیا آتی ہے آپ نے اسٹڈی کیا ہے؟ سر ہم نے جو اوزورف کیا ہے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('458', 26, 'bilal', 10, 15, 'JazakAllah', '2026-01-05T14:08:20.554Z', 'جہاں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('459', 26, 'bilal', 15, 20, 'As you know this system is transcribing complex text', '2026-01-05T14:08:20.562Z', 'کیسا کہ آپ جانتے ہیں یہ سسٹم کافی کمپلکس ٹیکس کو ٹرانسکرائب کر رہا ہے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('460', 26, 'bilal', 0, 5, 'Assalamu alaikum, my name is Bilal and I am going to test it.', '2026-01-05T14:08:20.650Z', 'اسلام علیکم میرا نام بلال ہے اور میں اس کو تسک کرنے کے لئے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('461', 26, 'bilal', 20, 25, 'and i am trying to show it', '2026-01-05T14:08:20.672Z', 'اور میں اس کو دکھانے کی کوشش کر رہا ہوں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('462', 28, 'ayan', 0, 5, 'Thank you for watching.', '2026-01-08T23:34:19.810Z', 'ڈرہو ڈرہو');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('463', 28, 'ayan', 10, 15, 'Of course', '2026-01-08T23:34:19.917Z', 'بہت زیادہ');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('464', 28, 'bilal', 20, 25, 'What is he doing now?', '2026-01-08T23:34:28.901Z', '۔۔۔۔۔۔۔.');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('465', 28, 'ayan', 35, 40, 'I am very scared.', '2026-01-08T23:34:41.192Z', 'مجھے بہت بہت رکھتا ہے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('466', 31, 'lawyer', 5, 10, 'in which my client is...', '2026-01-09T05:45:26.208Z', 'جس میں میرا موقع کیل جو ہے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('467', 31, 'lawyer', 10, 15, 'I will go to English school', '2026-01-09T05:45:26.220Z', 'لیکن انگل سکو');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('468', 31, 'lawyer', 30, 35, 'What do you think about it?', '2026-01-09T05:45:26.226Z', 'بہت بہت بہت بہت بہت بہت');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('469', 31, 'witness', 15, 20, 'He is innocent.', '2026-01-09T05:45:35.083Z', 'بے گناہ ہے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('470', 31, 'witness', 20, 25, 'Mm-hmm.', '2026-01-09T05:45:35.088Z', 'Mm-hmm.');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('471', 31, 'witness', 25, 30, 'Lawyer Ahmad, please start your proceeding.', '2026-01-09T05:45:35.089Z', 'لائر احمد آپ اپنا جو ہے نا وہ پروسیڈنگ سٹارٹ کریں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('472', 31, 'witness', 40, 45, 'A fake case is being filed.', '2026-01-09T05:45:35.193Z', 'چھوٹا کیس ڈالا جا رہا ہے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('473', 31, 'witness', 35, 40, 'so judge sahab here on my client', '2026-01-09T05:45:35.211Z', 'جدھ ساںب یہاں پر میرے کلائنٹ کے اوپر');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('474', 31, 'judge', 45, 50, 'This is garbage text.', '2026-01-09T05:45:51.495Z', 'بہت بہت بہت یہ کاربی سٹیکس آگے ہے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('475', 31, 'judge', 75, 80, 'today''s proceedings are over now we will do the next hearing', '2026-01-09T05:45:51.516Z', 'آج کی پروسیٹنگز کتم ہو گئی ہیں اب ہم یہ اگلی ہیرنگ');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('476', 31, 'judge', 50, 55, 'As you can see he is on my client''s lap.', '2026-01-09T05:45:51.534Z', 'جیسا بھی یہاں بڑھ میرے کلائنٹ پہ اوپر');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('477', 31, 'judge', 55, 60, 'This is what I had told you.', '2026-01-09T05:45:51.547Z', 'اللہ آپ میں جو بلا تھا');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('478', 31, 'judge', 70, 75, 'Today''s procedure is over.', '2026-01-09T05:45:51.558Z', 'آج کی پروسیڈنگ ختم ہو گئی ہے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('479', 31, 'judge', 80, 85, 'will take the statement of the witness.', '2026-01-09T05:45:51.559Z', 'پہ جانا وہ ویڈنیس کی سٹیٹمنٹ جانا بہ لیں گے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('480', 31, 'judge', 60, 65, 'That''s it. Yeah.', '2026-01-09T05:45:51.561Z', 'That''s it. Yeah.');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('481', 31, 'witness', 65, 70, 'Now the beat that we are talking about is being repeated in that room.', '2026-01-09T05:46:00.676Z', 'اب وہی ہم جو بیٹ بول رہے ہیں وہ اس کنگرہ پر بیٹ ہوا جا رہے ہیں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('482', 31, 'witness', 85, 90, 'Okay sir. Okay sir, let''s close the case.', '2026-01-09T05:46:00.677Z', 'ٹھیک ہے سر ٹھیک ہے سر کیس بند کر دیتے ہیں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('483', 31, 'witness', 95, 100, 'Before we stop here, we have to sign our name. We forgot to do that in the beginning.', '2026-01-09T05:46:00.678Z', 'اس پہلے ہم اپنے نام ایسائن کرلیں وہ تو ہم شروع میں کرنا بول گئے ہیں');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('484', 31, 'witness', 100, 105, 'Thank you very much. Thank you.', '2026-01-09T05:46:00.679Z', 'بہت زیادہ چھوڑ رہا بھی یہ مخلصی میں نہیں بولاتا');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('485', 31, 'witness', 90, 95, 'If you want to edit it, we can edit it now. No, just do that.', '2026-01-09T05:46:00.680Z', 'اگر آپ نے ایلیٹ کرنا چاہتے ہیں تو ہم ایلیٹ بھی کر سکتے ہیں نہیں ابھی بس اس کو وہ کرو');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('486', 31, 'witness', 105, 110, 'These are all the lawyers that I have called.', '2026-01-09T05:46:43.775Z', 'یہ سارے لویر بن گئے جو سندنس میں نے بولا تھا');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('487', 31, 'witness', 130, 135, 'Now we have to change this. As they say, this is wrong.', '2026-01-09T05:46:43.787Z', 'چچھ ہو گیا اب ہی ساتھ چینج کرنا ہے جیسے ابھی فرس کرنے یہ بولتے ہیں یہ خلط ہے');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('488', 31, 'witness', 115, 120, 'Let''s witness the moment. Do we have to do this manually? Yes sir.', '2026-01-09T05:46:43.881Z', 'Let''s witness the moment. Do we have to do this manually? Yes sir.');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('489', 31, 'witness', 110, 115, 'Who said this? No That''s good', '2026-01-09T05:46:43.889Z', 'اس نے بولا تھا');
INSERT INTO public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) VALUES ('490', 31, 'witness', 120, 125, 'You have to sign. Pakistanis sign themselves. Okay, you have to sign for the first time. Yes, you have to sign for the first time.', '2026-01-09T05:46:43.904Z', 'پاکی سارے بار خود سائن ہو جاتے ہیں اچھا پورس ٹائم آپ نے پڑھا ٹائم آپ نے پڑھا');

-- Table: judge_info
CREATE TABLE IF NOT EXISTS public.judge_info (
    id integer NOT NULL DEFAULT nextval('judge_info_id_seq'::regclass),
    judge_code character varying,
    judge_name character varying NOT NULL,
    judge_email character varying NOT NULL,
    judge_cnic text NOT NULL,
    judge_birthday date,
    judge_court integer NOT NULL,
    auth_uid uuid
);

-- Data for judge_info
INSERT INTO public.judge_info (id, judge_code, judge_name, judge_email, judge_cnic, judge_birthday, judge_court, auth_uid) VALUES (2, 'JDG-02', 'Malik j', 'judgedistrictcout@courtlog.com', '1234567890121', '2003-06-04T19:00:00.000Z', 2, 'ef960f86-2f03-4ab8-b250-312c6ebfe6ae');
INSERT INTO public.judge_info (id, judge_code, judge_name, judge_email, judge_cnic, judge_birthday, judge_court, auth_uid) VALUES (1, 'JDG-01', 'Ahmed', 'judgehighcourt@courtlog.com', '11111-0000000-0', '2000-01-18T19:00:00.000Z', 1, 'd6566fcf-54f2-495b-8f3f-dc602c229665');

-- Table: transcript
CREATE TABLE IF NOT EXISTS public.transcript (
    transcript_id integer NOT NULL DEFAULT nextval('transcript_transcript_id_seq'::regclass),
    case_id integer NOT NULL,
    transcript text NOT NULL
);

-- Data for transcript
INSERT INTO public.transcript (transcript_id, case_id, transcript) VALUES (1, 11, 'Court session started at 10:00 AM.
Judge greeted both parties.
Ahmed presented his property documents.
Bilal raised objections.
Judge asked for witnesses.
Witness 1 gave statement supporting Ahmed.
Witness 2 gave statement supporting Bilal.
Ahmed lawyer argued property ownership.
Bilal lawyer questioned documents authenticity.
Judge reviewed the submitted evidence.
Court paused for recess at 11:30 AM.
Session resumed at 11:45 AM.
Both parties agreed to mediation.
Judge directed parties to submit final statements.
Court adjourned at 12:30 PM.');
INSERT INTO public.transcript (transcript_id, case_id, transcript) VALUES (3, 13, 'Court session began at 10:15 AM.
Sara presented her petition documents.
Ali responded with his statements.
Judge asked about prior reconciliation attempts.
Both parties gave personal statements.
Lawyers argued custody preferences.
Witnesses testified about child welfare.
Judge asked social worker for report.
Sara lawyer emphasized best interest of child.
Ali lawyer questioned report accuracy.
Judge reviewed all submitted documents.
Court paused for short break at 11:20 AM.
Session resumed at 11:35 AM.
Judge suggested mediation.
Court adjourned at 12:00 PM.');
INSERT INTO public.transcript (transcript_id, case_id, transcript) VALUES (6, 16, 'Court session started at 09:00 AM.
Prosecution presented case against Noman.
Defense entered plea of not guilty.
Witness 1 testified about the incident.
Witness 2 provided supporting evidence.
Defense cross-examined witnesses.
Prosecution submitted forensic report.
Defense questioned forensic accuracy.
Judge requested additional documentation.
Both parties debated legal procedures.
Court paused for short break at 10:30 AM.
Session resumed at 10:45 AM.
Prosecution summarized evidence.
Defense provided counter-arguments.
Judge set next hearing date and adjourned session at 11:30 AM.');

-- Table: transcript_approval
CREATE TABLE IF NOT EXISTS public.transcript_approval (
    id integer NOT NULL DEFAULT nextval('transcript_approval_id_seq'::regclass),
    case_id integer,
    status character varying NOT NULL DEFAULT 'draft'::character varying,
    submitted_by character varying,
    reviewed_by character varying,
    submitted_at timestamp without time zone,
    reviewed_at timestamp without time zone,
    judge_notes text,
    transcript_url text
);

-- Data for transcript_approval
INSERT INTO public.transcript_approval (id, case_id, status, submitted_by, reviewed_by, submitted_at, reviewed_at, judge_notes, transcript_url) VALUES (15, 11, 'approved', 'Asjad Shahab', 'Ayan Shahab', '2025-12-26T19:16:32.754Z', '2025-12-29T20:37:12.027Z', NULL, 'https://qxhyujcaqmsvrryjpuxj.supabase.co/storage/v1/object/public/Transcription_Files/transcripts/Transcript_11.pdf');
INSERT INTO public.transcript_approval (id, case_id, status, submitted_by, reviewed_by, submitted_at, reviewed_at, judge_notes, transcript_url) VALUES (27, 37, 'submitted', 'Bilal Khadim', NULL, '2025-12-30T15:37:30.856Z', NULL, NULL, NULL);
INSERT INTO public.transcript_approval (id, case_id, status, submitted_by, reviewed_by, submitted_at, reviewed_at, judge_notes, transcript_url) VALUES (29, 40, 'approved', 'Bilal Khadim', 'Malik Junaid Aziz', '2026-01-02T21:11:19.259Z', '2026-01-02T21:15:30.583Z', NULL, 'https://qxhyujcaqmsvrryjpuxj.supabase.co/storage/v1/object/public/Transcription_Files/transcripts/Transcript_40.pdf');
INSERT INTO public.transcript_approval (id, case_id, status, submitted_by, reviewed_by, submitted_at, reviewed_at, judge_notes, transcript_url) VALUES (32, 26, 'submitted', 'Asjad Shahab', NULL, '2026-01-05T14:11:40.839Z', NULL, NULL, NULL);
INSERT INTO public.transcript_approval (id, case_id, status, submitted_by, reviewed_by, submitted_at, reviewed_at, judge_notes, transcript_url) VALUES (33, 28, 'approved', 'Bilal Khadim', 'Malik Junaid Aziz', '2026-01-08T23:35:36.430Z', '2026-01-08T23:37:39.268Z', NULL, 'https://qxhyujcaqmsvrryjpuxj.supabase.co/storage/v1/object/public/Transcription_Files/transcripts/Transcript_28.pdf');
INSERT INTO public.transcript_approval (id, case_id, status, submitted_by, reviewed_by, submitted_at, reviewed_at, judge_notes, transcript_url) VALUES (36, 31, 'approved', 'Bilal Khadim', 'Malik Junaid Aziz', '2026-01-09T05:46:50.396Z', '2026-01-09T05:56:12.864Z', NULL, 'https://qxhyujcaqmsvrryjpuxj.supabase.co/storage/v1/object/public/Transcription_Files/transcripts/Transcript_31.pdf');

-- Table: transcript_edit_history
CREATE TABLE IF NOT EXISTS public.transcript_edit_history (
    id bigint NOT NULL DEFAULT nextval('transcript_edit_history_id_seq'::regclass),
    original_transcript_id bigint NOT NULL,
    previous_text text NOT NULL,
    new_text text NOT NULL,
    edited_by character varying NOT NULL,
    role character varying NOT NULL,
    edited_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Data for transcript_edit_history
INSERT INTO public.transcript_edit_history (id, original_transcript_id, previous_text, new_text, edited_by, role, edited_at) VALUES ('31', '359', 'I am testing again.', 'updated.', 'Bilal Khadim', 'stenographer', '2026-01-02T19:48:35.864Z');
INSERT INTO public.transcript_edit_history (id, original_transcript_id, previous_text, new_text, edited_by, role, edited_at) VALUES ('32', '361', 'I am waiting for the test, but still I am testing.', 'update again', 'Bilal Khadim', 'stenographer', '2026-01-02T19:55:56.624Z');
INSERT INTO public.transcript_edit_history (id, original_transcript_id, previous_text, new_text, edited_by, role, edited_at) VALUES ('33', '364', 'I am not writing right now because we will not be able to do the demo.', 'change', 'Bilal Khadim', 'stenographer', '2026-01-02T19:57:14.608Z');
INSERT INTO public.transcript_edit_history (id, original_transcript_id, previous_text, new_text, edited_by, role, edited_at) VALUES ('34', '359', 'I am testing again.', 'updated. cha', 'Bilal Khadim', 'stenographer', '2026-01-02T20:03:01.867Z');
INSERT INTO public.transcript_edit_history (id, original_transcript_id, previous_text, new_text, edited_by, role, edited_at) VALUES ('35', '359', 'I am testing again.', 'updated. ch', 'Bilal Khadim', 'stenographer', '2026-01-02T20:06:31.653Z');
INSERT INTO public.transcript_edit_history (id, original_transcript_id, previous_text, new_text, edited_by, role, edited_at) VALUES ('37', '385', 'Let''s start the experiment', 'Let''s start court hearing', 'Bilal Khadim', 'stenographer', '2026-01-02T21:07:49.646Z');
INSERT INTO public.transcript_edit_history (id, original_transcript_id, previous_text, new_text, edited_by, role, edited_at) VALUES ('38', '387', 'case no. 122', 'present the case no. 122', 'Bilal Khadim', 'stenographer', '2026-01-02T21:08:08.859Z');
INSERT INTO public.transcript_edit_history (id, original_transcript_id, previous_text, new_text, edited_by, role, edited_at) VALUES ('39', '396', 'This is the purpose of this video.', 'this allegation is without any evidence', 'Malik Junaid Aziz', 'judge', '2026-01-02T21:15:23.131Z');
INSERT INTO public.transcript_edit_history (id, original_transcript_id, previous_text, new_text, edited_by, role, edited_at) VALUES ('40', '448', 'Let''s start. We are checking the system.', 'changed', 'Bilal Khadim', 'stenographer', '2026-01-03T08:21:55.389Z');
INSERT INTO public.transcript_edit_history (id, original_transcript_id, previous_text, new_text, edited_by, role, edited_at) VALUES ('42', '481', 'Now the beat that we are talking about is being repeated in that room.', 'Now the beat that we are talking about is being repeated in that room', 'Bilal Khadim', 'stenographer', '2026-01-09T05:46:06.227Z');
INSERT INTO public.transcript_edit_history (id, original_transcript_id, previous_text, new_text, edited_by, role, edited_at) VALUES ('43', '467', 'I will go to English school', '', 'Malik Junaid Aziz', 'judge', '2026-01-09T05:52:06.475Z');
INSERT INTO public.transcript_edit_history (id, original_transcript_id, previous_text, new_text, edited_by, role, edited_at) VALUES ('7', '124', 'Thank you for watching this video.', 'why does he change it', 'Asjad S', 'stenographer', '2025-12-26T19:12:58.311Z');
INSERT INTO public.transcript_edit_history (id, original_transcript_id, previous_text, new_text, edited_by, role, edited_at) VALUES ('8', '115', 'I have not done any work on the web data but', 'I have done work on the web but', 'Asjad S', 'stenographer', '2025-12-26T19:13:30.079Z');
INSERT INTO public.transcript_edit_history (id, original_transcript_id, previous_text, new_text, edited_by, role, edited_at) VALUES ('9', '106', 'Thank you for watching.', 'this should be your name', 'Asjad S', 'stenographer', '2025-12-26T19:14:54.995Z');
INSERT INTO public.transcript_edit_history (id, original_transcript_id, previous_text, new_text, edited_by, role, edited_at) VALUES ('10', '107', 'Thank you so much.', 'i dont know', 'Asjad S', 'stenographer', '2025-12-26T19:15:05.963Z');
INSERT INTO public.transcript_edit_history (id, original_transcript_id, previous_text, new_text, edited_by, role, edited_at) VALUES ('11', '129', 'Thanks for watching', 'we can save it', 'Asjad S', 'stenographer', '2025-12-26T19:16:28.342Z');
INSERT INTO public.transcript_edit_history (id, original_transcript_id, previous_text, new_text, edited_by, role, edited_at) VALUES ('12', '95', 'Now we will talk about some transcripts', 'new text 1 2 3', 'Ayan S', 'judge', '2025-12-26T23:23:22.523Z');
INSERT INTO public.transcript_edit_history (id, original_transcript_id, previous_text, new_text, edited_by, role, edited_at) VALUES ('13', '107', 'i dont know', 'now i know', 'Ayan S', 'judge', '2025-12-27T10:18:41.861Z');
INSERT INTO public.transcript_edit_history (id, original_transcript_id, previous_text, new_text, edited_by, role, edited_at) VALUES ('14', '95', 'new text 1 2 3', 'again new text', 'Ayan S', 'judge', '2025-12-27T10:34:04.589Z');
INSERT INTO public.transcript_edit_history (id, original_transcript_id, previous_text, new_text, edited_by, role, edited_at) VALUES ('15', '95', 'new text 1 2 3', 'again again', 'Ayan S', 'judge', '2025-12-27T10:34:20.733Z');
INSERT INTO public.transcript_edit_history (id, original_transcript_id, previous_text, new_text, edited_by, role, edited_at) VALUES ('16', '96', 'We will try our best for this case.', '2nd update', 'Ayan S', 'judge', '2025-12-27T11:39:06.494Z');
INSERT INTO public.transcript_edit_history (id, original_transcript_id, previous_text, new_text, edited_by, role, edited_at) VALUES ('17', '96', '2nd update', '2nd upda', 'Ayan S', 'judge', '2025-12-27T12:03:04.020Z');
INSERT INTO public.transcript_edit_history (id, original_transcript_id, previous_text, new_text, edited_by, role, edited_at) VALUES ('18', '96', '2nd update', '2nd updat', 'Ayan S', 'judge', '2025-12-27T12:16:09.382Z');
INSERT INTO public.transcript_edit_history (id, original_transcript_id, previous_text, new_text, edited_by, role, edited_at) VALUES ('20', '139', 'You said this. I said this. You said this.', 'you said that bilal edited it', 'Ayan S', 'judge', '2025-12-28T12:58:39.596Z');
INSERT INTO public.transcript_edit_history (id, original_transcript_id, previous_text, new_text, edited_by, role, edited_at) VALUES ('21', '131', 'Say something. Hello, Assalamualaikum. My name is Bilal.', 'Hello, Assalamualaikum. My name is Bilal.', 'Ayan S', 'judge', '2025-12-28T14:45:40.046Z');
INSERT INTO public.transcript_edit_history (id, original_transcript_id, previous_text, new_text, edited_by, role, edited_at) VALUES ('22', '131', 'Hello, Assalamualaikum. My name is Bilal.', 'Hello, Assalamualaikum. My name is Bilal. and i am ayan', 'Ayan S', 'judge', '2025-12-28T14:52:02.762Z');
INSERT INTO public.transcript_edit_history (id, original_transcript_id, previous_text, new_text, edited_by, role, edited_at) VALUES ('23', '131', 'Hello, Assalamualaikum. My name is Bilal.', 'Hello, Assalamualaikum. My name is Bilal. and i am ayan, again', 'Ayan S', 'judge', '2025-12-28T14:55:36.612Z');
INSERT INTO public.transcript_edit_history (id, original_transcript_id, previous_text, new_text, edited_by, role, edited_at) VALUES ('24', '131', 'Hello, Assalamualaikum. My name is Bilal.', 'Hello, Assalamualaikum. My name is Bilal. and i am ayan, again AGAIN', 'Ayan S', 'judge', '2025-12-28T15:01:21.784Z');
INSERT INTO public.transcript_edit_history (id, original_transcript_id, previous_text, new_text, edited_by, role, edited_at) VALUES ('25', '132', 'I am trying to test it', 'I am trying to test it and its working', 'Ayan S', 'judge', '2025-12-28T15:14:06.015Z');
INSERT INTO public.transcript_edit_history (id, original_transcript_id, previous_text, new_text, edited_by, role, edited_at) VALUES ('26', '136', 'Okay.', 'Okay. hehe', 'Ayan S', 'judge', '2025-12-28T15:15:42.579Z');
INSERT INTO public.transcript_edit_history (id, original_transcript_id, previous_text, new_text, edited_by, role, edited_at) VALUES ('41', '458', 'JazakAllah', 'lets start', 'Ayan S', 'judge', '2026-01-05T14:14:11.368Z');
INSERT INTO public.transcript_edit_history (id, original_transcript_id, previous_text, new_text, edited_by, role, edited_at) VALUES ('19', '140', 'This is a very old school This is a very old school', 'bla bla bla', 'Asjad S', 'stenographer', '2025-12-28T12:56:50.371Z');

-- Table: court_info
CREATE TABLE IF NOT EXISTS public.court_info (
    court_id integer NOT NULL DEFAULT nextval('court_info_court_id_seq'::regclass),
    court_name character varying NOT NULL,
    court_level character varying NOT NULL,
    court_city character varying NOT NULL,
    court_address text,
    court_phone_number character varying,
    court_status character varying DEFAULT 'Active'::character varying
);

-- Data for court_info
INSERT INTO public.court_info (court_id, court_name, court_level, court_city, court_address, court_phone_number, court_status) VALUES (1, 'Lahore High Court', 'High Court', 'Lahore', 'Shahrah-e-Quaid-e-Azam, The Mall, Lahore', '042-99210000', 'Active');
INSERT INTO public.court_info (court_id, court_name, court_level, court_city, court_address, court_phone_number, court_status) VALUES (2, 'District Courts Lahore', 'District Court', 'Lahore', 'H8F4+94V, Lower Mall, Data Gunj Buksh Town, Lahore', '042-99214342', 'Active');
INSERT INTO public.court_info (court_id, court_name, court_level, court_city, court_address, court_phone_number, court_status) VALUES (3, 'Sessions Court Lahore', 'Session Court', 'Lahore', 'City Courts, Islampura, Lahore', '042-99213200', 'Active');
INSERT INTO public.court_info (court_id, court_name, court_level, court_city, court_address, court_phone_number, court_status) VALUES (4, 'Cantt Courts Lahore', 'District Court', 'Lahore', '489 Tufail Rd, Saddar Town, Lahore', NULL, 'Active');
INSERT INTO public.court_info (court_id, court_name, court_level, court_city, court_address, court_phone_number, court_status) VALUES (5, 'Lahore Civil Court (Senior Block)', 'Session Court', 'Lahore', 'H893+WF6, Court St, St Nagar, Lahore', '042-99210558', 'Active');
INSERT INTO public.court_info (court_id, court_name, court_level, court_city, court_address, court_phone_number, court_status) VALUES (6, 'Anti-Terrorism Court Lahore', 'Special Court', 'Lahore', 'G8VH+CVJ, Canal Rd, Mustafabad, Lahore', '042-99212005', 'Active');
INSERT INTO public.court_info (court_id, court_name, court_level, court_city, court_address, court_phone_number, court_status) VALUES (7, 'Lahore Civil Court (LDA Complex)', 'Session Court', 'Lahore', 'LDA Complex، Court Rd, Islampura, Lahore', '042-99212006', 'Active');
INSERT INTO public.court_info (court_id, court_name, court_level, court_city, court_address, court_phone_number, court_status) VALUES (8, 'Labour Court', 'Special Court', 'Lahore', 'G879+VX4, Saddar St, Block C Muslim Town, Lahore', '0300-4423296', 'Active');

-- Table: ordersheets_approval
CREATE TABLE IF NOT EXISTS public.ordersheets_approval (
    id integer NOT NULL DEFAULT nextval('ordersheets_approval_id_seq'::regclass),
    case_id integer NOT NULL,
    ordersheet_id integer NOT NULL,
    status character varying DEFAULT 'pending'::character varying,
    submitted_by character varying,
    reviewed_by character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    reviewed_at timestamp without time zone
);

-- Data for ordersheets_approval
INSERT INTO public.ordersheets_approval (id, case_id, ordersheet_id, status, submitted_by, reviewed_by, created_at, reviewed_at) VALUES (3, 28, 16, 'submitted', 'Bilal Khadim', NULL, '2026-01-08T23:36:47.561Z', NULL);
INSERT INTO public.ordersheets_approval (id, case_id, ordersheet_id, status, submitted_by, reviewed_by, created_at, reviewed_at) VALUES (4, 31, 17, 'submitted', 'Bilal Khadim', NULL, '2026-01-09T05:49:09.858Z', NULL);

-- Table: admin_info
CREATE TABLE IF NOT EXISTS public.admin_info (
    id integer NOT NULL DEFAULT nextval('admin_info_id_seq'::regclass),
    admin_code character varying,
    admin_name character varying NOT NULL,
    admin_email character varying NOT NULL,
    admin_court integer NOT NULL,
    auth_uid uuid
);

-- Data for admin_info
INSERT INTO public.admin_info (id, admin_code, admin_name, admin_email, admin_court, auth_uid) VALUES (1, 'ADM-01', 'John Doe', 'admin@courtlog.com', 1, 'fc3c04b8-2b6a-4c2f-9594-25b35b487c67');

-- Table: chief_judge_info
CREATE TABLE IF NOT EXISTS public.chief_judge_info (
    id integer NOT NULL DEFAULT nextval('chief_judge_info_id_seq'::regclass),
    chief_judge_code character varying,
    chief_judge_name character varying,
    chief_judge_email character varying,
    chief_judge_cnic text,
    chief_judge_birthday date,
    chief_judge_court integer,
    auth_uid uuid
);

-- Data for chief_judge_info
INSERT INTO public.chief_judge_info (id, chief_judge_code, chief_judge_name, chief_judge_email, chief_judge_cnic, chief_judge_birthday, chief_judge_court, auth_uid) VALUES (1, 'CJD-01', 'Bilal K', 'chiefjudge@courtlog.com', '12345678', '1963-06-22T19:00:00.000Z', 1, 'e8491b03-3601-45a6-8c04-3f4ca06ae36e');

-- Table: stenographer_info
CREATE TABLE IF NOT EXISTS public.stenographer_info (
    id integer NOT NULL DEFAULT nextval('stenographer_info_id_seq'::regclass),
    steno_code character varying,
    steno_name character varying NOT NULL,
    steno_email character varying NOT NULL,
    steno_cnic text NOT NULL,
    steno_birthday date,
    steno_court integer NOT NULL,
    auth_uid uuid
);

-- Data for stenographer_info
INSERT INTO public.stenographer_info (id, steno_code, steno_name, steno_email, steno_cnic, steno_birthday, steno_court, auth_uid) VALUES (1, 'STN-01', 'Asjad Shahab', 'asjad@courtlog.com', '22222-0000000-0', '2005-10-16T19:00:00.000Z', 1, NULL);
INSERT INTO public.stenographer_info (id, steno_code, steno_name, steno_email, steno_cnic, steno_birthday, steno_court, auth_uid) VALUES (2, 'STN-02', 'Bilal K', 'bilal@courtlog.com', '1234567890123', '2003-03-10T19:00:00.000Z', 2, '09af0196-d0a4-4294-8e27-d80978ff618f');
