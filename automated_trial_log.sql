--
-- PostgreSQL database dump
--

\restrict 0hT4gOBv2dByPYcdBi4xe5xaC9FsyjKyzTyhjIElRQexTWiX9dU6NaXmjETKIwi

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1
-- Started on 2026-01-07 18:55:42

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 25293)
-- Name: admin_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_info (
    id integer NOT NULL,
    admin_code character varying(20) NOT NULL,
    admin_name character varying(50) NOT NULL,
    admin_email character varying(50) NOT NULL,
    admin_court integer NOT NULL,
    password character varying(30) NOT NULL
);


ALTER TABLE public.admin_info OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 25302)
-- Name: admin_info_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admin_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_info_id_seq OWNER TO postgres;

--
-- TOC entry 5203 (class 0 OID 0)
-- Dependencies: 220
-- Name: admin_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admin_info_id_seq OWNED BY public.admin_info.id;


--
-- TOC entry 221 (class 1259 OID 25303)
-- Name: case_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.case_details (
    case_id integer NOT NULL,
    case_type character varying(20) NOT NULL,
    case_title character varying(50) NOT NULL,
    case_status character varying(20) NOT NULL,
    case_party1 character varying(20) NOT NULL,
    case_party2 character varying(20) NOT NULL,
    admin_code character varying(10) NOT NULL,
    steno_code character varying(10),
    judge_code character varying(10),
    court integer,
    case_code character varying(15),
    transcript character varying(3) DEFAULT 'NO'::character varying,
    ordersheet character varying(3) DEFAULT 'NO'::character varying,
    case_level character varying(20)
);


ALTER TABLE public.case_details OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 25315)
-- Name: case_details_case_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.case_details_case_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.case_details_case_id_seq OWNER TO postgres;

--
-- TOC entry 5204 (class 0 OID 0)
-- Dependencies: 222
-- Name: case_details_case_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.case_details_case_id_seq OWNED BY public.case_details.case_id;


--
-- TOC entry 223 (class 1259 OID 25316)
-- Name: case_recording; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.case_recording (
    id integer NOT NULL,
    case_id integer,
    recording_url text
);


ALTER TABLE public.case_recording OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 25322)
-- Name: case_recording_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.case_recording_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.case_recording_id_seq OWNER TO postgres;

--
-- TOC entry 5205 (class 0 OID 0)
-- Dependencies: 224
-- Name: case_recording_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.case_recording_id_seq OWNED BY public.case_recording.id;


--
-- TOC entry 225 (class 1259 OID 25323)
-- Name: chief_judge_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chief_judge_info (
    id integer NOT NULL,
    chief_judge_code character varying(10),
    chief_judge_name character varying(50),
    chief_judge_email character varying(50),
    chief_judge_cnic bigint,
    chief_judge_birthday date,
    chief_judge_court integer,
    password character varying(30)
);


ALTER TABLE public.chief_judge_info OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 25327)
-- Name: chief_judge_info_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chief_judge_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chief_judge_info_id_seq OWNER TO postgres;

--
-- TOC entry 5206 (class 0 OID 0)
-- Dependencies: 226
-- Name: chief_judge_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chief_judge_info_id_seq OWNED BY public.chief_judge_info.id;


--
-- TOC entry 227 (class 1259 OID 25328)
-- Name: court_courttype; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.court_courttype (
    court_id integer NOT NULL,
    type_id integer NOT NULL
);


ALTER TABLE public.court_courttype OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 25333)
-- Name: court_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.court_info (
    court_id integer NOT NULL,
    court_name character varying(100) NOT NULL,
    court_level character varying(50) NOT NULL,
    court_city character varying(50) NOT NULL,
    court_address text,
    court_phone_number character varying(20),
    court_status character varying(10) DEFAULT 'Active'::character varying,
    CONSTRAINT court_info_court_status_check CHECK (((court_status)::text = ANY (ARRAY[('Active'::character varying)::text, ('Inactive'::character varying)::text])))
);


ALTER TABLE public.court_info OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 25344)
-- Name: court_info_court_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.court_info_court_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.court_info_court_id_seq OWNER TO postgres;

--
-- TOC entry 5207 (class 0 OID 0)
-- Dependencies: 229
-- Name: court_info_court_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.court_info_court_id_seq OWNED BY public.court_info.court_id;


--
-- TOC entry 230 (class 1259 OID 25345)
-- Name: court_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.court_type (
    type_id integer NOT NULL,
    type_name character varying(50) NOT NULL,
    court_type_code character varying(3)
);


ALTER TABLE public.court_type OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 25350)
-- Name: court_type_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.court_type_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.court_type_type_id_seq OWNER TO postgres;

--
-- TOC entry 5208 (class 0 OID 0)
-- Dependencies: 231
-- Name: court_type_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.court_type_type_id_seq OWNED BY public.court_type.type_id;


--
-- TOC entry 232 (class 1259 OID 25351)
-- Name: edited_transcripts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.edited_transcripts (
    id bigint NOT NULL,
    original_transcript_id bigint NOT NULL,
    case_id integer NOT NULL,
    speaker character varying(100),
    edited_text text NOT NULL,
    start_time real,
    end_time real,
    edited_by character varying(255) NOT NULL,
    role character varying(20) NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT edited_transcripts_role_check CHECK (((role)::text = ANY (ARRAY[('stenographer'::character varying)::text, ('judge'::character varying)::text])))
);


ALTER TABLE public.edited_transcripts OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 25364)
-- Name: edited_transcripts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.edited_transcripts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.edited_transcripts_id_seq OWNER TO postgres;

--
-- TOC entry 5209 (class 0 OID 0)
-- Dependencies: 233
-- Name: edited_transcripts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.edited_transcripts_id_seq OWNED BY public.edited_transcripts.id;


--
-- TOC entry 234 (class 1259 OID 25365)
-- Name: hearing_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hearing_details (
    hearing_id integer NOT NULL,
    case_id integer NOT NULL,
    hearing_date date NOT NULL,
    hearing_time time without time zone NOT NULL
);


ALTER TABLE public.hearing_details OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 25372)
-- Name: hearing_details_hearing_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hearing_details_hearing_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hearing_details_hearing_id_seq OWNER TO postgres;

--
-- TOC entry 5210 (class 0 OID 0)
-- Dependencies: 235
-- Name: hearing_details_hearing_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hearing_details_hearing_id_seq OWNED BY public.hearing_details.hearing_id;


--
-- TOC entry 236 (class 1259 OID 25373)
-- Name: judge_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.judge_info (
    id integer NOT NULL,
    judge_code character varying(10),
    judge_name character varying(50) NOT NULL,
    judge_email character varying(50) NOT NULL,
    judge_cnic bigint NOT NULL,
    judge_birthday date,
    judge_court integer NOT NULL,
    password character varying(30) NOT NULL
);


ALTER TABLE public.judge_info OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 25382)
-- Name: judge_info_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.judge_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.judge_info_id_seq OWNER TO postgres;

--
-- TOC entry 5211 (class 0 OID 0)
-- Dependencies: 237
-- Name: judge_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.judge_info_id_seq OWNED BY public.judge_info.id;


--
-- TOC entry 238 (class 1259 OID 25383)
-- Name: ordersheets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ordersheets (
    id integer NOT NULL,
    case_id integer CONSTRAINT ordersheets_case_number_not_null NOT NULL,
    content_html text NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    submitted_by character varying(100),
    reviewed_by character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    reviewed_at timestamp without time zone,
    ordersheet_url text
);


ALTER TABLE public.ordersheets OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 25393)
-- Name: ordersheets_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ordersheets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ordersheets_id_seq OWNER TO postgres;

--
-- TOC entry 5212 (class 0 OID 0)
-- Dependencies: 239
-- Name: ordersheets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ordersheets_id_seq OWNED BY public.ordersheets.id;


--
-- TOC entry 240 (class 1259 OID 25394)
-- Name: original_transcript; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.original_transcript (
    id bigint NOT NULL,
    case_id integer NOT NULL,
    speaker character varying(50),
    start_time real,
    end_time real,
    message text,
    created_at timestamp without time zone DEFAULT now(),
    original_language text
);


ALTER TABLE public.original_transcript OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 25402)
-- Name: original_transcript_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.original_transcript_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.original_transcript_id_seq OWNER TO postgres;

--
-- TOC entry 5213 (class 0 OID 0)
-- Dependencies: 241
-- Name: original_transcript_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.original_transcript_id_seq OWNED BY public.original_transcript.id;


--
-- TOC entry 242 (class 1259 OID 25403)
-- Name: stenographer_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stenographer_info (
    id integer NOT NULL,
    steno_code character varying(10),
    steno_name character varying(50) NOT NULL,
    steno_email character varying(50) NOT NULL,
    steno_cnic bigint NOT NULL,
    steno_birthday date,
    steno_court integer NOT NULL,
    password character varying(30) NOT NULL
);


ALTER TABLE public.stenographer_info OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 25412)
-- Name: stenographer_info_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stenographer_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stenographer_info_id_seq OWNER TO postgres;

--
-- TOC entry 5214 (class 0 OID 0)
-- Dependencies: 243
-- Name: stenographer_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stenographer_info_id_seq OWNED BY public.stenographer_info.id;


--
-- TOC entry 244 (class 1259 OID 25413)
-- Name: transcript; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transcript (
    transcript_id integer NOT NULL,
    case_id integer NOT NULL,
    transcript text NOT NULL
);


ALTER TABLE public.transcript OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 25421)
-- Name: transcript_approval; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transcript_approval (
    id integer NOT NULL,
    case_id integer,
    status character varying(20) DEFAULT 'draft'::character varying NOT NULL,
    submitted_by character varying(255),
    reviewed_by character varying(255),
    submitted_at timestamp without time zone,
    reviewed_at timestamp without time zone,
    judge_notes text,
    transcript_url text
);


ALTER TABLE public.transcript_approval OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 25429)
-- Name: transcript_approval_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transcript_approval_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transcript_approval_id_seq OWNER TO postgres;

--
-- TOC entry 5215 (class 0 OID 0)
-- Dependencies: 246
-- Name: transcript_approval_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transcript_approval_id_seq OWNED BY public.transcript_approval.id;


--
-- TOC entry 247 (class 1259 OID 25430)
-- Name: transcript_edit_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transcript_edit_history (
    id bigint NOT NULL,
    original_transcript_id bigint NOT NULL,
    previous_text text NOT NULL,
    new_text text NOT NULL,
    edited_by character varying(255) NOT NULL,
    role character varying(20) NOT NULL,
    edited_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT transcript_edit_history_role_check CHECK (((role)::text = ANY (ARRAY[('stenographer'::character varying)::text, ('judge'::character varying)::text])))
);


ALTER TABLE public.transcript_edit_history OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 25444)
-- Name: transcript_edit_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transcript_edit_history_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transcript_edit_history_id_seq OWNER TO postgres;

--
-- TOC entry 5216 (class 0 OID 0)
-- Dependencies: 248
-- Name: transcript_edit_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transcript_edit_history_id_seq OWNED BY public.transcript_edit_history.id;


--
-- TOC entry 249 (class 1259 OID 25445)
-- Name: transcript_transcript_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transcript_transcript_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transcript_transcript_id_seq OWNER TO postgres;

--
-- TOC entry 5217 (class 0 OID 0)
-- Dependencies: 249
-- Name: transcript_transcript_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transcript_transcript_id_seq OWNED BY public.transcript.transcript_id;


--
-- TOC entry 4930 (class 2604 OID 25446)
-- Name: admin_info id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_info ALTER COLUMN id SET DEFAULT nextval('public.admin_info_id_seq'::regclass);


--
-- TOC entry 4931 (class 2604 OID 25447)
-- Name: case_details case_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.case_details ALTER COLUMN case_id SET DEFAULT nextval('public.case_details_case_id_seq'::regclass);


--
-- TOC entry 4934 (class 2604 OID 25448)
-- Name: case_recording id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.case_recording ALTER COLUMN id SET DEFAULT nextval('public.case_recording_id_seq'::regclass);


--
-- TOC entry 4935 (class 2604 OID 25449)
-- Name: chief_judge_info id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chief_judge_info ALTER COLUMN id SET DEFAULT nextval('public.chief_judge_info_id_seq'::regclass);


--
-- TOC entry 4936 (class 2604 OID 25450)
-- Name: court_info court_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.court_info ALTER COLUMN court_id SET DEFAULT nextval('public.court_info_court_id_seq'::regclass);


--
-- TOC entry 4938 (class 2604 OID 25451)
-- Name: court_type type_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.court_type ALTER COLUMN type_id SET DEFAULT nextval('public.court_type_type_id_seq'::regclass);


--
-- TOC entry 4939 (class 2604 OID 25452)
-- Name: edited_transcripts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.edited_transcripts ALTER COLUMN id SET DEFAULT nextval('public.edited_transcripts_id_seq'::regclass);


--
-- TOC entry 4941 (class 2604 OID 25453)
-- Name: hearing_details hearing_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hearing_details ALTER COLUMN hearing_id SET DEFAULT nextval('public.hearing_details_hearing_id_seq'::regclass);


--
-- TOC entry 4942 (class 2604 OID 25454)
-- Name: judge_info id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.judge_info ALTER COLUMN id SET DEFAULT nextval('public.judge_info_id_seq'::regclass);


--
-- TOC entry 4943 (class 2604 OID 25455)
-- Name: ordersheets id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ordersheets ALTER COLUMN id SET DEFAULT nextval('public.ordersheets_id_seq'::regclass);


--
-- TOC entry 4946 (class 2604 OID 25456)
-- Name: original_transcript id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.original_transcript ALTER COLUMN id SET DEFAULT nextval('public.original_transcript_id_seq'::regclass);


--
-- TOC entry 4948 (class 2604 OID 25457)
-- Name: stenographer_info id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stenographer_info ALTER COLUMN id SET DEFAULT nextval('public.stenographer_info_id_seq'::regclass);


--
-- TOC entry 4949 (class 2604 OID 25458)
-- Name: transcript transcript_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transcript ALTER COLUMN transcript_id SET DEFAULT nextval('public.transcript_transcript_id_seq'::regclass);


--
-- TOC entry 4950 (class 2604 OID 25459)
-- Name: transcript_approval id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transcript_approval ALTER COLUMN id SET DEFAULT nextval('public.transcript_approval_id_seq'::regclass);


--
-- TOC entry 4952 (class 2604 OID 25460)
-- Name: transcript_edit_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transcript_edit_history ALTER COLUMN id SET DEFAULT nextval('public.transcript_edit_history_id_seq'::regclass);


--
-- TOC entry 5167 (class 0 OID 25293)
-- Dependencies: 219
-- Data for Name: admin_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin_info (id, admin_code, admin_name, admin_email, admin_court, password) FROM stdin;
1	ADM-01	Ahmed Frahim	ahmed@gmail.com	1	ahmed123
2	ADM-02	Sabeen Shahab	sabeen@gmail.com	2	sabeen123
\.


--
-- TOC entry 5169 (class 0 OID 25303)
-- Dependencies: 221
-- Data for Name: case_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.case_details (case_id, case_type, case_title, case_status, case_party1, case_party2, admin_code, steno_code, judge_code, court, case_code, transcript, ordersheet, case_level) FROM stdin;
18	Civil	Inheritance Dispute: Farhan vs. Family	In-Progress	Farhan	Family Members	ADM-01	\N	\N	\N	CVL-2025-18	NO	NO	\N
24	Anti-Corruption	Sayasatdaan mulk ka paisa kha gaye	In-Progress	Awaam	PMLN	ADM-01	\N	\N	\N	ANT-2025-24	NO	NO	\N
23	Banking	Bilal chor, bank se pase chori karke bhaag gaya	In-Progress	Bank	Bilal	ADM-01	\N	\N	\N	BNK-2025-23	NO	NO	\N
25	Criminal	Bilal chor, bank se paise chori kar gaya	In-Progress	Ahmed	Bilal	ADM-01	\N	\N	\N	CRM-2025-25	NO	NO	\N
15	Civil	Land Ownership Case of Aslam vs. Yousaf	In-Progress	Aslam	Yousaf	ADM-02	\N	\N	\N	CVL-2025-15	NO	NO	\N
19	Family	Child Custody: Maria vs. Saad	In-Progress	Maria	Saad	ADM-02	\N	\N	\N	FAM-2025-19	NO	NO	\N
17	Commercial	Breach of Contract: XYZ Ltd vs. Qasim Traders	In-Progress	XYZ Ltd	Qasim Traders	ADM-02	\N	\N	\N	COM-2025-17	NO	NO	\N
20	Criminal	Fraud Case: State vs. Hassan	In-Progress	State	Hassan	ADM-01	\N	\N	\N	CRM-2025-20	NO	NO	\N
12	Criminal	State vs. Imran Khan Theft Case	Scheduled	State	Imran Khan	ADM-02	STN-02	JDG-02	2	CRM-2025-12	YES	NO	Subordinate Court
16	Criminal	Murder Trial: State vs. Noman	Scheduled	State	Noman	ADM-02	STN-02	JDG-02	2	CRM-2025-16	YES	NO	Subordinate Court
13	Family	Divorce Petition of Sara and Ali	In-Progress	Sara	Ali	ADM-02	\N	\N	\N	FAM-2025-13	NO	NO	\N
27	Civil	Property Dispute: Ahmed vs. Khan	Scheduled	Ahmed Ali	Hassan Khan	ADM-01	STN-01	JDG-01	1	CVL-2025-27	NO	NO	High Court
28	Criminal	Fraud Case: State vs. Malik	Scheduled	State	Tariq Malik	ADM-02	STN-02	JDG-02	2	CRM-2025-28	NO	NO	Subordinate Court
29	Family	Custody Battle: Sara vs. Imran	In-Progress	Sara Ahmed	Imran Sheikh	ADM-01	\N	\N	\N	FAM-2025-29	NO	NO	\N
30	Civil	Contract Breach: Enterprises vs. Corp	Scheduled	ABC Enterprises	XYZ Corporation	ADM-01	STN-01	JDG-01	1	CVL-2025-30	NO	NO	High Court
31	Criminal	Theft Case: State vs. Abbas	Scheduled	State	Salman Abbas	ADM-02	STN-02	JDG-02	2	CRM-2025-31	NO	NO	Subordinate Court
32	Family	Divorce Proceedings: Ayesha vs. Kamran	In-Progress	Ayesha Begum	Kamran Hussain	ADM-01	\N	\N	\N	FAM-2025-32	NO	NO	\N
33	Civil	Land Acquisition: Residents vs. Government	Scheduled	Community Residents	Municipal Authority	ADM-01	STN-01	JDG-01	1	CVL-2025-33	NO	NO	High Court
34	Criminal	Assault Case: State vs. Raza	Scheduled	State	Ali Raza	ADM-02	STN-02	JDG-02	2	CRM-2025-34	NO	NO	Subordinate Court
35	Family	Inheritance Distribution: Siblings Dispute	In-Progress	Fatima Akram	Usman Akram	ADM-02	\N	\N	\N	FAM-2025-35	NO	NO	\N
36	Civil	Tenant Eviction: Landlord vs. Tenant	Scheduled	Rashid Mahmood	Bilal Farooq	ADM-01	STN-01	JDG-01	1	CVL-2025-36	NO	NO	High Court
11	Civil	Property Dispute between Ahmed and Bilal	Completed	Ahmed	Bilal	ADM-01	STN-01	JDG-01	1	CVL-2025-11	YES	YES	High Court
14	Labor	Factory Workers vs. ABC Industries	In-Progress	Workers Union	ABC Industries	ADM-01	\N	\N	\N	LBR-2025-14	NO	NO	\N
37	Commercial	Shop under construction, burned	Scheduled	Junaid Iqbal	Rehan Akhtar	ADM-01	STN-02	JDG-02	2	COM-2025-37	YES	NO	Subordinate Court
39	Banking	Theft caught on camera	Scheduled	Waqar Zohaib	Mirza Ghalib 	ADM-01	STN-02	JDG-02	2	BNK-2025-39	NO	NO	Subordinate Court
40	Civil	Theft in uni	Completed	Professor	xyz	ADM-01	STN-02	JDG-02	2	CVL-2026-40	YES	YES	Subordinate Court
38	Election	Misrepresentation of votes in Election 2013	Scheduled	Awaam	X-party	ADM-01	STN-02	JDG-02	2	ELC-2025-38	YES	NO	Subordinate Court
44	Labor	labor work load	In-Progress	labor	company	ADM-01	\N	\N	\N	LBR-2026-44	NO	NO	Subordinate Court
26	Civil	uni filed against student s	Scheduled	uni	ahmed	ADM-01	STN-01	JDG-01	1	CVL-2025-26	YES	NO	High Court
\.


--
-- TOC entry 5171 (class 0 OID 25316)
-- Dependencies: 223
-- Data for Name: case_recording; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.case_recording (id, case_id, recording_url) FROM stdin;
\.


--
-- TOC entry 5173 (class 0 OID 25323)
-- Dependencies: 225
-- Data for Name: chief_judge_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chief_judge_info (id, chief_judge_code, chief_judge_name, chief_judge_email, chief_judge_cnic, chief_judge_birthday, chief_judge_court, password) FROM stdin;
1	CJD-01	Sher Muhammad Shahab	shahab@gmail.com	4540267123441	1963-06-23	1	shahab123
\.


--
-- TOC entry 5175 (class 0 OID 25328)
-- Dependencies: 227
-- Data for Name: court_courttype; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.court_courttype (court_id, type_id) FROM stdin;
1	1
1	2
1	3
1	4
1	6
3	2
4	3
5	4
6	5
7	6
2	10
\.


--
-- TOC entry 5176 (class 0 OID 25333)
-- Dependencies: 228
-- Data for Name: court_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.court_info (court_id, court_name, court_level, court_city, court_address, court_phone_number, court_status) FROM stdin;
1	Lahore High Court	High Court	Lahore	Shahrah-e-Quaid-e-Azam, The Mall, Lahore	042-99210000	Active
2	District Courts Lahore	District Court	Lahore	H8F4+94V, Lower Mall, Data Gunj Buksh Town, Lahore	042-99214342	Active
3	Sessions Court Lahore	Session Court	Lahore	City Courts, Islampura, Lahore	042-99213200	Active
4	Cantt Courts Lahore	District Court	Lahore	489 Tufail Rd, Saddar Town, Lahore	\N	Active
5	Lahore Civil Court (Senior Block)	Session Court	Lahore	H893+WF6, Court St, St Nagar, Lahore	042-99210558	Active
6	Anti-Terrorism Court Lahore	Special Court	Lahore	G8VH+CVJ, Canal Rd, Mustafabad, Lahore	042-99212005	Active
7	Lahore Civil Court (LDA Complex)	Session Court	Lahore	LDA Complex، Court Rd, Islampura, Lahore	042-99212006	Active
8	Labour Court	Special Court	Lahore	G879+VX4, Saddar St, Block C Muslim Town, Lahore	0300-4423296	Active
\.


--
-- TOC entry 5178 (class 0 OID 25345)
-- Dependencies: 230
-- Data for Name: court_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.court_type (type_id, type_name, court_type_code) FROM stdin;
4	Banking	BNK
1	Civil	CVL
6	Commercial	COM
2	Criminal	CRM
3	Family	FAM
7	Anti-Corruption	ANT
5	Constitutional	CNS
8	Tax	TAX
9	Labor	LBR
10	Election	ELC
11	Environmental	ENV
12	Customs	CST
13	Other	OTH
14	Rape	RPE
\.


--
-- TOC entry 5180 (class 0 OID 25351)
-- Dependencies: 232
-- Data for Name: edited_transcripts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.edited_transcripts (id, original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role, updated_at) FROM stdin;
4	124	11	ayan	why does he change it	120	125	Asjad Shahab	stenographer	2025-12-27 00:12:58.306557
5	115	11	ayan	I have done work on the web but	95	100	Asjad Shahab	stenographer	2025-12-27 00:13:30.076003
6	106	11	ayan	this should be your name	60	65	Asjad Shahab	stenographer	2025-12-27 00:14:54.992349
7	107	11	ayan	i dont know	65	70	Asjad Shahab	stenographer	2025-12-27 00:15:05.959399
8	129	11	ayan	we can save it	185	190	Asjad Shahab	stenographer	2025-12-27 00:16:28.339443
9	95	11	ayan	new text 1 2 3	0	5	Ayan Shahab	judge	2025-12-27 04:23:22.523057
11	107	11	ayan	now i know	65	70	Ayan Shahab	judge	2025-12-27 15:18:41.861385
12	95	11	ayan	again new text	0	5	Ayan Shahab	judge	2025-12-27 15:34:04.589059
13	95	11	ayan	again again	0	5	Ayan Shahab	judge	2025-12-27 15:34:20.733754
14	96	11	ayan	2nd update	5	10	Ayan Shahab	judge	2025-12-27 16:39:06.494806
15	96	11	ayan	2nd upda	5	10	Ayan Shahab	judge	2025-12-27 17:03:04.020216
16	96	11	ayan	2nd updat	5	10	Ayan Shahab	judge	2025-12-27 17:16:09.382167
17	140	15	bilal	bla bla bla	50	55	Asjad Shahab	stenographer	2025-12-28 17:56:50.366335
18	139	15	bilal	you said that bilal edited it	40	45	Ayan Shahab	judge	2025-12-28 17:58:39.596611
19	131	15	bilal	Hello, Assalamualaikum. My name is Bilal.	0	5	Ayan Shahab	judge	2025-12-28 19:45:40.046154
20	131	15	bilal	Hello, Assalamualaikum. My name is Bilal. and i am ayan	0	5	Ayan Shahab	judge	2025-12-28 19:52:02.762244
21	131	15	bilal	Hello, Assalamualaikum. My name is Bilal. and i am ayan, again	0	5	Ayan Shahab	judge	2025-12-28 19:55:36.612254
22	131	15	bilal	Hello, Assalamualaikum. My name is Bilal. and i am ayan, again AGAIN	0	5	Ayan Shahab	judge	2025-12-28 20:01:21.784144
23	132	15	bilal	I am trying to test it and its working	5	10	Ayan Shahab	judge	2025-12-28 20:14:06.015518
24	136	15	bilal	Okay. hehe	10	15	Ayan Shahab	judge	2025-12-28 20:15:42.579346
29	359	39	ayan	updated.	0	5	Bilal Khadim	stenographer	2026-01-03 00:48:35.860648
30	361	39	bilal	update again	5	10	Bilal Khadim	stenographer	2026-01-03 00:55:56.619587
31	364	39	ayan	change	10	15	Bilal Khadim	stenographer	2026-01-03 00:57:14.603891
32	359	39	ayan	updated. cha	0	5	Bilal Khadim	stenographer	2026-01-03 01:03:01.849956
33	359	39	ayan	updated. ch	0	5	Bilal Khadim	stenographer	2026-01-03 01:06:31.645047
35	385	40	judge	Let's start court hearing	0	5	Bilal Khadim	stenographer	2026-01-03 02:07:49.62982
36	387	40	judge	present the case no. 122	5	10	Bilal Khadim	stenographer	2026-01-03 02:08:08.842547
37	396	40	lawyer	this allegation is without any evidence	40	45	Malik Junaid Aziz	judge	2026-01-03 02:15:23.131317
38	448	39	ayan	changed	0	5	Bilal Khadim	stenographer	2026-01-03 13:21:55.38579
39	458	26	bilal	lets start	10	15	Ayan Shahab	judge	2026-01-05 19:14:11.368669
\.


--
-- TOC entry 5182 (class 0 OID 25365)
-- Dependencies: 234
-- Data for Name: hearing_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hearing_details (hearing_id, case_id, hearing_date, hearing_time) FROM stdin;
2	12	2025-10-02	11:30:00
6	16	2025-10-06	15:30:00
10	11	2025-12-25	12:15:00
12	26	2025-12-31	14:45:00
13	27	2025-01-15	09:00:00
14	28	2025-01-16	10:30:00
15	30	2025-01-18	11:00:00
16	31	2025-01-20	14:00:00
17	33	2025-01-22	09:30:00
18	34	2025-01-24	15:00:00
19	36	2025-01-25	10:00:00
20	37	2025-12-31	12:21:00
21	39	2026-01-13	08:00:00
22	40	2026-01-12	13:16:00
23	38	2026-01-03	12:25:00
\.


--
-- TOC entry 5184 (class 0 OID 25373)
-- Dependencies: 236
-- Data for Name: judge_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.judge_info (id, judge_code, judge_name, judge_email, judge_cnic, judge_birthday, judge_court, password) FROM stdin;
1	JDG-01	Ayan Shahab	ayan@gmail.com	4540267149911	2002-02-19	1	ayan123
2	JDG-02	Malik Junaid Aziz	junaidaziz@gmail.com	1234567890121	2003-06-06	2	ucp123
\.


--
-- TOC entry 5186 (class 0 OID 25383)
-- Dependencies: 238
-- Data for Name: ordersheets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ordersheets (id, case_id, content_html, status, submitted_by, reviewed_by, created_at, reviewed_at, ordersheet_url) FROM stdin;
6	11	\r\n<div class="ordersheet-template">\r\n\r\n  <div class="os-header">\r\n    <div class="os-form">Form No: HCJD/C-121</div>\r\n    <div class="os-title"><b>ORDER SHEET</b></div>\r\n    <div class="os-subtitle"><b>IN THE Lahore High Court</b></div>\r\n    <div class="os-subtitle"><b>JUDICIAL DEPARTMENT</b></div>\r\n    <div class="os-case"><b>Writ Petition No. 11</b></div>\r\n  </div>\r\n\r\n  <div class="os-parties">\r\n    <div>Ahmed</div>\r\n    <div><b>Versus</b></div>\r\n    <div>Bilal</div>\r\n  </div>\r\n\r\n  <table class="os-table">\r\n    <thead>\r\n    <tr>\r\n      <th class="col-serial">S.No. of order / Proceedings</th>\r\n      <th class="col-date">Date of order / Proceedings</th>\r\n      <th class="col-order">\r\n        Order with signature of Judge and that of<br>\r\n        Parties of counsel, where necessary\r\n      </th>\r\n    </tr>\r\n  </thead>\r\n    <tbody>\r\n      <tr>\r\n        <td>1</td>\r\n        <td>2025-12-25</td>\r\n        <td>\r\n          <div id="order-body" class="editable" contenteditable="true"> So mic testing, how do I mic this one? Mic testing. mic testing, hello, hello, hello, hello, hello.</div>\r\n        </td>\r\n      </tr>\r\n    </tbody>\r\n  </table>\r\n\r\n</div>\r\n	approved	Asjad Shahab	Ayan Shahab	2025-12-30 21:09:46.858355	2025-12-30 21:17:32.7035	https://qxhyujcaqmsvrryjpuxj.supabase.co/storage/v1/object/public/Transcription_Files/ordersheets/Ordersheet_11.pdf
8	40	\r\n<div class="ordersheet-template">\r\n  <div class="os-header">\r\n    <div class="os-form">Form No: HCJD/C-121</div>\r\n    <div class="os-title"><b><u>ORDER SHEET</u></b></div>\r\n    <div class="os-subtitle"><b>IN THE District Courts Lahore</b></div>\r\n    <div class="os-subtitle"><b>JUDICIAL DEPARTMENT</b></div>\r\n    <div class="os-case"><b>Writ Petition No. 40</b></div>\r\n  </div>\r\n\r\n  <div class="os-parties">\r\n    <div>Professor</div>\r\n    <div><b>Versus</b></div>\r\n    <div>xyz</div>\r\n  </div>\r\n\r\n  <table class="os-table">\r\n    <thead>\r\n    <tr>\r\n      <th class="col-serial">S.No. of order / Proceedings</th>\r\n      <th class="col-date">Date of order / Proceedings</th>\r\n      <th class="col-order">\r\n        Order with signature of Judge and that of<br>\r\n        Parties of counsel, where necessary\r\n      </th>\r\n    </tr>\r\n  </thead>\r\n    <tbody>\r\n      <tr>\r\n        <td>1</td>\r\n        <td>2026-01-12</td>\r\n        <td>Lawyer ABC<br>PROCEEDINGS:<br>A civil case, CVL-2026-40, titled 'Theft in uni', was heard in the court of Malik Junaid Aziz on 2026-01-12 at 13:16. The case involved a professor and 'xyz'. The professor accused 'xyz' of treachery under section 420. 'xyz' and his lawyer denied the allegation. A witness was presented in the court to testify.<br>ORDERS:<br>1. Statement of the lawyer of the accused was heard.<br>2. Witness was called to the stand and recorded statement.<br>NEXT DATE OF HEARING:<br>5-01-2026</td>\r\n      </tr>\r\n    </tbody>\r\n  </table>\r\n</div>	approved	Bilal Khadim	Malik Junaid Aziz	2026-01-03 02:13:29.505926	2026-01-03 02:16:12.699442	https://qxhyujcaqmsvrryjpuxj.supabase.co/storage/v1/object/public/Transcription_Files/ordersheets/Ordersheet_40.pdf
9	38	\n<div class="ordersheet-template">\n  <div class="os-header">\n    <div class="os-form">Form No: HCJD/C-121</div>\n    <div class="os-title"><b><u>ORDER SHEET</u></b></div>\n    <div class="os-subtitle"><b>IN THE District Courts Lahore</b></div>\n    <div class="os-subtitle"><b>JUDICIAL DEPARTMENT</b></div>\n    <div class="os-case"><b>Writ Petition No. 38</b></div>\n  </div>\n\n  <div class="os-parties">\n    <div>Awaam</div>\n    <div><b>Versus</b></div>\n    <div>X-party</div>\n  </div>\n\n  <table class="os-table">\n    <thead>\n    <tr>\n      <th class="col-serial">S.No. of order / Proceedings</th>\n      <th class="col-date">Date of order / Proceedings</th>\n      <th class="col-order">\n        Order with signature of Judge and that of<br/>\n        Parties of counsel, where necessary\n      </th>\n    </tr>\n  </thead>\n    <tbody>\n      <tr>\n        <td>1</td>\n        <td>2026-01-03</td>\n        <td>PROCEEDINGS:<br>The parties, Awaam and X-party, discussed the number 205 and the speaker's role during the transcription of their case, Misrepresentation of votes in Election 2013 (ELC-2025-38), before Judge Malik Junaid Aziz. The speaker's identity and recording were mentioned.<br>ORDERS:<br>1. The speaker's role and identity are to be clarified.<br>NEXT DATE OF HEARING:<br>To be fixed</td>\n      </tr>\n    </tbody>\n  </table>\n</div>	submitted	Bilal Khadim	\N	2026-01-03 12:39:34.634918	\N	\N
10	11	\n<div class="ordersheet-template">\n  <div class="os-header">\n    <div class="os-form">Form No: HCJD/C-121</div>\n    <div class="os-title"><b><u>ORDER SHEET</u></b></div>\n    <div class="os-subtitle"><b>IN THE Lahore High Court</b></div>\n    <div class="os-subtitle"><b>JUDICIAL DEPARTMENT</b></div>\n    <div class="os-case"><b>Writ Petition No. 11</b></div>\n  </div>\n\n  <div class="os-parties">\n    <div>Ahmed</div>\n    <div><b>Versus</b></div>\n    <div>Bilal</div>\n  </div>\n\n  <table class="os-table">\n    <thead>\n    <tr>\n      <th class="col-serial">S.No. of order / Proceedings</th>\n      <th class="col-date">Date of order / Proceedings</th>\n      <th class="col-order">\n        Order with signature of Judge and that of<br/>\n        Parties of counsel, where necessary\n      </th>\n    </tr>\n  </thead>\n    <tbody>\n      <tr>\n        <td>1</td>\n        <td>2025-12-25</td>\n        <td>PROCEEDINGS:<br>The Honorable Judge Ayan Shahab presided over a civil case titled 'Property Dispute between Ahmed and Bilal'. During the hearing, Ahmed and Bilal had a misunderstanding regarding some proceedings. The Judge clarified the process and asked both parties to state their cases clearly. No definitive orders were passed during this hearing.<br>ORDERS:<br>1. Clarification on proceedings process<br>2. Parties requested to state their cases clearly<br>NEXT DATE OF HEARING:<br>To be fixed</td>\n      </tr>\n    </tbody>\n  </table>\n</div>	submitted	Asjad Shahab	\N	2026-01-05 19:04:32.210042	\N	\N
11	26	\n<div class="ordersheet-template">\n\n  <div class="os-header">\n    <div class="os-form">Form No: HCJD/C-121</div>\n    <div class="os-title"><b>ORDER SHEET</b></div>\n    <div class="os-subtitle"><b>IN THE Lahore High Court</b></div>\n    <div class="os-subtitle"><b>JUDICIAL DEPARTMENT</b></div>\n    <div class="os-case"><b>Writ Petition No. 26</b></div>\n  </div>\n\n  <div class="os-parties">\n    <div>uni</div>\n    <div><b>Versus</b></div>\n    <div>ahmed</div>\n  </div>\n\n  <table class="os-table">\n    <thead>\n    <tr>\n      <th class="col-serial">S.No. of order / Proceedings</th>\n      <th class="col-date">Date of order / Proceedings</th>\n      <th class="col-order">\n        Order with signature of Judge and that of<br/>\n        Parties of counsel, where necessary\n      </th>\n    </tr>\n  </thead>\n    <tbody>\n      <tr>\n        <td>1</td>\n        <td>2025-12-31</td>\n        <td>\n          <div id="order-body" class="editable" contenteditable="true"></div>\n        </td>\n      </tr>\n    </tbody>\n  </table>\n\n</div>\n	submitted	Asjad Shahab	\N	2026-01-05 19:30:00.393466	\N	\N
12	11	\n<div class="ordersheet-template">\n\n  <div class="os-header">\n    <div class="os-form">Form No: HCJD/C-121</div>\n    <div class="os-title"><b>ORDER SHEET</b></div>\n    <div class="os-subtitle"><b>IN THE Lahore High Court</b></div>\n    <div class="os-subtitle"><b>JUDICIAL DEPARTMENT</b></div>\n    <div class="os-case"><b>Writ Petition No. 11</b></div>\n  </div>\n\n  <div class="os-parties">\n    <div>Ahmed</div>\n    <div><b>Versus</b></div>\n    <div>Bilal</div>\n  </div>\n\n  <table class="os-table">\n    <thead>\n    <tr>\n      <th class="col-serial">S.No. of order / Proceedings</th>\n      <th class="col-date">Date of order / Proceedings</th>\n      <th class="col-order">\n        Order with signature of Judge and that of<br/>\n        Parties of counsel, where necessary\n      </th>\n    </tr>\n  </thead>\n    <tbody>\n      <tr>\n        <td>1</td>\n        <td>2025-12-25</td>\n        <td>\n          <div id="order-body" class="editable" contenteditable="true"></div>\n        </td>\n      </tr>\n    </tbody>\n  </table>\n\n</div>\n	submitted	Asjad Shahab	\N	2026-01-05 19:31:37.896039	\N	\N
\.


--
-- TOC entry 5188 (class 0 OID 25394)
-- Dependencies: 240
-- Data for Name: original_transcript; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.original_transcript (id, case_id, speaker, start_time, end_time, message, created_at, original_language) FROM stdin;
95	11	ayan	0	5	Now we will talk about some transcripts	2025-12-27 00:10:29.047022	سٹارٹ کی اب ہم دونوں باتیت کریں گے کچھ ایک ٹرانسپریم بھی
96	11	ayan	5	10	We will try our best for this case.	2025-12-27 00:10:29.056169	ایک کیس کے لئے پوچھ کرتے ہیں
97	11	ayan	10	15	What are you saying? You have seen our natural talks.	2025-12-27 00:10:29.064982	کیا آپ بولے ہیں اس میں نیچلو گفتہ کو ہمارے گیر دیکھ لیں
98	11	ayan	15	20	So you also say something so that we can see how bad or how good is his digestion.	2025-12-27 00:10:29.06833	ہاں تو آپ بھی تو کچھ بولے تاکہ ہم دیکھیں اور اس کی ڈائزن کتنی وکار ہے کتنی ہے ٹھیک ہے
99	11	ayan	20	25	I will tell you after I am done with it, you should do it after you are done with it. It doesn't work like this.	2025-12-27 00:10:29.071447	ہمیں اکے بھی بولوں گا اس کا اتنا سے اکے بھی کر لینا چاہیئے یہاں سکتا ہے کہ یہ کام نہیں کرتا ہے
100	11	ayan	25	30	It was useful. It was useful. You said it yourself.	2025-12-27 00:10:29.077361	فائدہ کی پس فائدہ کی پس یہ تم نے خودی بول دی
101	11	ahmed	40	45	Yes, that's it. Actually, I don't know anything about Nokia. I don't know anything about it.	2025-12-27 00:11:00.790656	اچھا تو بہت سامجھنے ایروں میں گوھروں کیا اور کافی زیادہ انسی
102	11	ahmed	45	50	I don't know why I'm talking to you. I don't know why I'm talking to you.	2025-12-27 00:11:00.793174	کیوں کہ آپ کو اکسیلی بات کر رہے ہیں تو اس ویڈیو سے میں بات نہیں پہلے ساتھ آئے گا لیکن یہ دکھوں گے کب سے میری بات
103	11	ahmed	50	55	Now we will	2025-12-27 00:11:00.79843	اب جاکے یہ اس کو
104	11	ayan	35	40	because I don't speak majority	2025-12-27 00:11:00.869725	کیونکہ میں نے بہت زیادہ بولا
105	11	ayan	55	60	after 5-6 seconds	2025-12-27 00:11:00.900575	5-6 سکن کے بعد
106	11	ayan	60	65	Thank you for watching.	2025-12-27 00:11:33.268986	یہ تمہارے نام
107	11	ayan	65	70	Thank you so much.	2025-12-27 00:11:33.287176	کچھ میدے پر امد
108	11	ayan	70	75	I have put these 5 minutes in the video. I don't want to say this.	2025-12-27 00:11:33.301392	یہ پانچ درہوڑ پیان ڈال دیا میں نہیں بولی
109	11	ayan	75	80	So this can be fixed in few records	2025-12-27 00:11:33.306533	تو یہ کچھ ریکارڈز میں ٹھیک کر لیتا ہے
110	11	ayan	80	85	and in some regards, this is... in some regards, this is... yes	2025-12-27 00:11:33.310978	اور کچھ ڈگارڈز میں یہ ڈگارڈز میں یہ ڈگارڈز میں یہ ڈگارڈز میں یہ
111	11	ayan	90	95	Where did you write your name? You can write your name here You can click here	2025-12-27 00:12:19.027023	نام کر سکتے ہیں نام ایڈ کر سکتے ہیں یہاں پر کلک کریں
112	11	ayan	105	110	Now it should have your name in it, because you forgot it.	2025-12-27 00:12:19.06956	اب اس میں تمہارا نام آنا چاہیئے یوں کی بات تم نے بھولی ہے
113	11	ayan	110	115	we will see after few seconds	2025-12-27 00:12:19.077363	کچھ سکن کے بعد دیکھ لیتے ہیں
114	11	ayan	115	120	I have seen a lot of things like this and I am very happy about it.	2025-12-27 00:12:19.079267	لکھاتے ہیں کہ کافی بہت سال ہے اور ہم 네کٹل بہت بہت منتظر کرنے کے لئے ملکی گوھڑ گوھہ سینڈب
115	11	ayan	95	100	I have not done any work on the web data but	2025-12-27 00:12:19.139322	ویب ویڈیو اس میں یہ لوگ کام نہیں کیا ہوا لیکن
116	11	ayan	125	130	Thank you for watching this video.	2025-12-27 00:12:55.812555	سکھائی تھی بھوکت نابل سنچل
117	11	ayan	150	155	Thank you.	2025-12-27 00:12:55.820415	شکریہ
118	11	ayan	155	160	Thank you for watching this video.	2025-12-27 00:12:55.823577	یہ ویڈیو دیکھنے کے لئے
119	11	ahmed	165	170	One second is enough. Wow.	2025-12-27 00:12:55.826953	واں سینگ جو جلا رہا واں
120	11	ayan	130	135	36.46%	2025-12-27 00:12:55.83262	36 ۔ 36 ۔ 46 ۔
121	11	ayan	135	140	It's been 2 minutes of transcript, why is it still bending?	2025-12-27 00:12:55.839071	دو منٹ تنسکرپٹ ہو رہی ہے آپ تک بینڈنگ پر کیوں گا
122	11	ahmed	140	145	What do you want to do? 2 minutes	2025-12-27 00:12:55.840342	ہے بلاؤ یہ دو منٹ
123	11	ayan	145	150	He put your name on it He didn't put your name on it, he put my name on it	2025-12-27 00:12:55.848815	اس نے تمہارے نام ڈالا اس نے تمہارے نام نہیں ڈالا اس نے میرے نام ہی ڈالا
124	11	ayan	120	125	Thank you for watching this video.	2025-12-27 00:12:55.881412	پہلے چینج کھرنگا
125	11	ayan	170	175	Let me change it.	2025-12-27 00:13:33.19265	ڈی چینج اٹ
126	11	ayan	175	180	Let's start with my bag.	2025-12-27 00:13:33.209464	جو چاہتے ہیں میرے بیٹھ
127	11	ayan	180	185	Now it has done the change. Now it has done the change. Now it has done the change.	2025-12-27 00:13:33.225917	وہ صحیح کیا اس نے ایلوٹ کیا اب اس نے کر دیا چینج جوہاز بنتا ہے
128	11	ayan	190	195	looking up any suggestions that they may have for us.	2025-12-27 00:13:33.228325	کہ یہاں اپنی سکتے ہیں کہ یہاں اپنی سکتے ہیں۔
129	11	ayan	185	190	Thanks for watching	2025-12-27 00:13:33.26522	اس کو بھی ہم بچوں سکتے ہیں
130	11	ahmed	195	200	I have produced what I have.	2025-12-27 00:14:00.933599	میں نے اپنے نظروں کو کھائی رہا ہوں
131	15	bilal	0	5	Say something. Hello, Assalamualaikum. My name is Bilal.	2025-12-28 17:55:53.711052	بولو کچھ یہ اللہ اسلام علیکم میرا نام بلانے
132	15	bilal	5	10	I am trying to test it	2025-12-28 17:55:53.716394	میں اس کو تسکنے کی کوشش کر رہا ہوں
133	15	ahmed	25	30	This is also like this. Whatever I have to do with this I will show you.	2025-12-28 17:55:53.734672	میں اس کے لئے جو کرنا چاہتا ہوں میں اس کے لئے جو کرنا چاہتا ہوں میں اس کے لئے چاہتا ہوں
134	15	ahmed	15	20	I have to edit this a little bit.	2025-12-28 17:55:53.738169	یہاں میں اس کو تھوڑی بہت ویڈیو کرنی ہے
135	15	ayan	20	25	we will make it a little wider you made it expandable in fact it looks like this	2025-12-28 17:55:53.743103	we will make it a little wider you made it expandable in fact it looks like this
136	15	bilal	10	15	Okay.	2025-12-28 17:55:53.828999	ٹھیک ہے
351	39	ayan	0	5	I am testing again.	2026-01-03 00:34:42.025388	پیسے ٹیسٹ کر رہا ہوں
137	15	bilal	30	35	I would like to thank all of you for watching this video.	2025-12-28 17:56:25.487103	میں اس کو بہت بہت بہت سے کرنا چاہتا ہوں
138	15	bilal	35	40	Look what he is doing here.	2025-12-28 17:56:25.505726	یہ لیکن یہاں پہ کر رہا ہے احمد بولدی ہے اس نے بلال بلی
139	15	bilal	40	45	You said this. I said this. You said this.	2025-12-28 17:56:25.521593	یہ تم نے بولا تھا یہ میں نے بولا تھا یہ تم نے بولا تھا
140	15	bilal	50	55	This is a very old school This is a very old school	2025-12-28 17:56:25.525224	یہ بھائی نے پورا تھا اس نیوشل ٹیکس ہی و سکول ٹیکس
141	15	bilal	60	65	like this this is ok our p-transcript is ready	2025-12-28 17:56:58.653395	جیسے یہ ٹرانسکرپ بن گئی ہے
142	15	bilal	65	70	You can also edit this comment to edit	2025-12-28 17:56:58.676885	اس کا ایڈیٹ بھی کر سکتے ہیں ایڈیٹ کرنے کے لئے
143	15	bilal	70	75	What is this old school?	2025-12-28 17:56:58.700446	اور سکول میں کیا
144	15	bilal	90	95	now we are going to edit it now we are going to edit it now we are doing it	2025-12-28 17:56:58.703168	بیلٹ بیلٹ سیب ہو گیا ہم کرتے ہیں بس ٹھیک ہے
145	15	bilal	75	80	What is written here? This is the whole thing.	2025-12-28 17:56:58.755352	کیا لکھے یہاں پر؟ یہ بھائی نے پورا
146	15	bilal	80	85	That's it. Thank you.	2025-12-28 17:56:58.866955	ڈائس ڈائس
194	37	ayan	0	5	I am testing it again	2025-12-30 20:27:29.642798	اچھا میں پھر سے اس کو تیسک کر کے دیکھ رہا ہوں
195	37	ayan	5	10	How is the transcription of this?	2025-12-30 20:27:29.64679	اس کی ترانسکرپشن کیسی ہے؟
196	37	bilal	10	15	He will have to do some work because he needs some data which he can use.	2025-12-30 20:27:29.653925	وہ تو ہوگا لیکن اسی کام کرنا ہوگا کیونکہ اس کو کوئی ڈیٹا تو چاہیے رہا جو چلے گا
197	37	ayan	15	20	What will you do if it is better? It is better, but it needs work.	2025-12-30 20:27:29.659501	بہتر ہے کام کی ضرورت ہے لیکن
198	37	ayan	25	30	I am waiting for the virus to spread	2025-12-30 20:28:10.231269	میں اس کو ویڈ کر رہا ہوں کہ یہ بیرائز کریں
199	37	bilal	35	40	I have to fix this also	2025-12-30 20:28:10.250004	یہ بھی ٹھیک کرنا تھا
200	37	ayan	40	45	People are doing a lot of work. They are doing a lot of work.	2025-12-30 20:28:10.258336	بڑے لوگ کر رہے ہیں بڑی بڑی جو تھی سو سپل بڑی جو کام کر رہا ہوتا ہے
201	37	ayan	45	50	This is a strange example, but why do you do it?	2025-12-30 20:28:10.26417	وہ یہ کرتے ہیں کہ اس طرح کی چیزوں بھو پھور کے تو کرتے ہیں
202	37	ayan	50	55	We have to learn from the database, we have to learn and then we have to give it a retake.	2025-12-30 20:28:10.268552	کہ دیٹا پیسے لٹن کیا کرتے ہیں لٹن کرتے ہیں کہ اس کو ریڈیو بھی کرتے ہیں
203	37	ayan	65	70	Thank you very much.	2025-12-30 20:28:43.152651	Thank you very much.
204	37	ayan	75	80	I will fine tune it for you ok I wanted to fine tune it	2025-12-30 20:28:43.17023	میں آپ کو فائن ٹیون کرتا ہوں ٹھیک ہے بھائی فائن ٹیون بھی کرنا تھا بھائی
205	37	ayan	85	90	I am not doing a good job.	2025-12-30 20:28:43.175832	اس کے پر اس کو دیکھیں اور پہلے سے زیادہ انٹرمیر ہوں اچھا کام نہیں کر رہا
206	37	ayan	90	95	Now we need to work on it again.	2025-12-30 20:28:43.181561	ہمارا پھر سے اس میں کام کرنے کی ضرورت ہے
207	37	ayan	95	100	and it will have such a texture.	2025-12-30 20:28:43.186126	اور اس کا اس طرح سے ٹیکچر ہوگا
208	37	ayan	100	105	Yes, this will be the case.	2025-12-30 20:28:43.189261	تو یہ گرانس ہوگا
209	37	ayan	110	115	If people get trained, then their learning size will be smaller.	2025-12-30 20:29:01.256073	پھر ترین ہو گیا تو لرنی کا سیس کو چھوٹ نہیں ہوتا ہے
210	37	ayan	115	120	So, this is the model of it, I have already done this model.	2025-12-30 20:29:01.259968	تو اس کا وہ بڑل جو آتی ہے میں رہا ہوں یہ بڑل لچ کر چکا ہوتا ہے سب کچھ
352	39	ayan	5	10	I am waiting for the test, but still I am testing.	2026-01-03 00:34:42.044656	تس کر کر کے پیزار ہوگی ہو لیکن پھر بھی تسٹ کر رہا ہوں میں
353	39	ayan	10	15	I am not writing right now because we will not be able to do the demo.	2026-01-03 00:34:42.047	کیونکہ بھی ڈیموگرہ اپ ناکے جائیں گے
354	39	ayan	0	5	I am testing again.	2026-01-03 00:34:42.047142	پیسے ٹیسٹ کر رہا ہوں
355	39	ayan	5	10	I am waiting for the test, but still I am testing.	2026-01-03 00:34:42.04748	تس کر کر کے پیزار ہوگی ہو لیکن پھر بھی تسٹ کر رہا ہوں میں
356	39	ayan	10	15	I am not writing right now because we will not be able to do the demo.	2026-01-03 00:34:42.147217	کیونکہ بھی ڈیموگرہ اپ ناکے جائیں گے
357	39	bilal	15	20	This is the skin coating Is there skin coating in this?	2026-01-03 00:34:55.839024	سکنڈ کوڈنگ ہے سکنڈ کوڈنگ ہوتی ہے اس میں
358	39	bilal	15	20	This is the skin coating Is there skin coating in this?	2026-01-03 00:34:55.845114	سکنڈ کوڈنگ ہے سکنڈ کوڈنگ ہوتی ہے اس میں
359	39	ayan	0	5	I am testing again.	2026-01-03 00:36:25.28257	پیسے ٹیسٹ کر رہا ہوں
360	39	bilal	55	60	2,000 to 2,000	2026-01-03 00:36:25.290043	دو ڑو ہزار ہے
361	39	ayan	5	10	I am waiting for the test, but still I am testing.	2026-01-03 00:36:25.290535	تس کر کر کے پیزار ہوگی ہو لیکن پھر بھی تسٹ کر رہا ہوں میں
362	39	bilal	60	65	That is the only thing that I can do.	2026-01-03 00:36:25.293973	بہت زیادہ کام کرنے کے لئے
363	39	ayan	100	105	Please subscribe to my channel.	2026-01-03 00:36:25.297099	ملاکو ترے باقا نہیں کرتا
365	39	ayan	105	110	Oh yes, oh yes.	2026-01-03 00:36:25.299908	بھائی بھائی
364	39	ayan	10	15	I am not writing right now because we will not be able to do the demo.	2026-01-03 00:36:25.298222	کیونکہ بھی ڈیموگرہ اپ ناکے جائیں گے
366	39	ayan	110	115	It's all declared now.	2026-01-03 00:36:25.300859	ڈکرٹ ہو گیا ہوا
367	39	bilal	115	120	I am feeling sleepy I think	2026-01-03 00:36:25.304467	بھائیدہ بھائیدہ
371	39	ayan	130	135	But still it is closed, so let's do it again.	2026-01-03 00:36:25.31046	پھر بھی یہ بند ہے اس کو پھر کر لیتے ہیں
368	39	ayan	120	125	I will see you in the next video, take care and take care of yourself.	2026-01-03 00:36:25.305579	پڑھ لیتا نیوستریڈ ہوگا رہنسکنے پڑھے میں یوز افیکٹ و افنیستریڈ اس لئے میں اپنے ہوں
369	39	ayan	125	130	I put it in the local storage so that they can speak	2026-01-03 00:36:25.308771	لوکل سٹورچ کے نے ڈال دیا کہ بھائی سپیک کرے یہ بنت ہے
372	39	ayan	135	140	All the students should do this. The speaker should also be mapped.	2026-01-03 00:36:25.311095	لیکن اس نے سارے بڑھنے ہاں، سپیکر اور سپیکر بھی میں سے یہ اپ نیپ کرنا چاہیئے اس کو
373	39	ayan	140	145	Thank you	2026-01-03 00:36:25.316389	ایہاں بلاؤ، ایہاں بلاؤ
370	39	ayan	35	40	Thank you very much.	2026-01-03 00:36:25.309164	Thank you very much.
374	39	ayan	40	45	Thank you.	2026-01-03 00:36:25.322184	بھائی
375	39	bilal	15	20	This is the skin coating Is there skin coating in this?	2026-01-03 00:36:25.321946	سکنڈ کوڈنگ ہے سکنڈ کوڈنگ ہوتی ہے اس میں
385	40	judge	0	5	Let's start the experiment	2026-01-03 02:06:46.939787	ڈالت کی کروائی شروع کی
386	40	judge	30	35	What does the accused's lawyer want to say?	2026-01-03 02:06:46.969176	ملزم کے وکیل کیا کہنا چاہتا ہے؟
387	40	judge	5	10	case no. 122	2026-01-03 02:06:46.97943	کیس نمبر 122 پیش کیا جائے
388	40	judge	15	20	Please give your statement to the lawyer of this case.	2026-01-03 02:06:46.985546	مدعی کے وکیل اپنا بیان دیں
389	40	lawyer	10	15	Yes, sir. Case no. 22 is ready.	2026-01-03 02:06:53.717167	جی جناہ قیس نمبر ایک سب بائیس حاضر ہے
390	40	lawyer	45	50	Is there any witness?	2026-01-03 02:06:53.719383	کیا کوئی گواہ موجود ہے؟
391	40	lawyer	55	60	Please present the witness	2026-01-03 02:06:53.721495	گواہ کو پیش کیا جائے
392	40	lawyer	20	25	This step was taken under section 420.	2026-01-03 02:07:00.19683	جناب یہ قدمہ دفعہ 420 کے تاہر درج کیا گیا ہے
393	40	lawyer	50	55	Yes, there is a witness in the court.	2026-01-03 02:07:00.200345	جی ہاں ایک اینے گواہ ادالت میں موجود ہے
394	40	lawyer	25	30	It is an allegation of treachery against the accused.	2026-01-03 02:07:00.303132	منظم پر ڈھوکا دے کاکے عظام ہے
395	40	lawyer	35	40	My client did not commit any crime.	2026-01-03 02:07:00.319677	میرے موکل نے کسی قسم کا جرم نہیں کیا
396	40	lawyer	40	45	This is the purpose of this video.	2026-01-03 02:07:00.333621	یہ رزاہم بے بنیاد ہے
397	40	lawyer	60	65	I have seen it with my own eyes.	2026-01-03 02:07:26.203903	جناب میرا یہ وہاں کے اپنے آنکھوں سے دیکھا گیا ہے
398	40	judge	65	70	record the statement of the witness.	2026-01-03 02:07:26.21025	گواہ کا بیان ریکارڈ کیا جائے
399	38	bilal	0	5	Thank you very much.	2026-01-03 12:33:07.11784	ڈھوٹو بھائی
400	38	ayan	5	10	The number is 205. The number is 205. Please sign your name.	2026-01-03 12:33:36.935492	The number is 205. The number is 205. Please sign your name.
402	38	ayan	20	25	exactly the right input. We can also edit it.	2026-01-03 12:33:36.942725	ہم اس کو انڈیٹ بھی کر سکتے ہیں
401	38	ayan	25	30	We have to change it and say that we don't want it.	2026-01-03 12:33:36.941834	ہم اس کو چینج کرکے بولنے کی کہ ہم یہ چاہیئے نہیں
403	38	ayan	40	45	We have mapped the speaker as well.	2026-01-03 12:33:36.945919	سپیکر بیم اپ کر دیا
404	38	ayan	45	50	Bilal is going to sing this song Whenever the speaker will come, Bilal will sing	2026-01-03 12:33:36.948404	کہتے ہیں کہ بلال نے بہت ہو رہی ہے ابھی جب بھی سپیکر بھی آئے گا ابھی بلال صنعب کرے گا
405	38	ayan	30	35	But at the moment, it is pending.	2026-01-03 12:33:36.953906	اس کو سیف کرتے ہیں لیکن اگر اس کو سیف سلین کر سکتے ہیں تو اس کے پینڈنگ ہے
406	38	ayan	35	40	Until now, he hasn't told anyone that he has spoken.	2026-01-03 12:33:36.957834	اب تک اس نے مہت نہیں کیا کسی کو کہ یہ اس بندے نے بات بولی ہے اب یہ جب مہت
407	38	ayan	15	20	It will start after 30 seconds.	2026-01-03 12:33:36.9658	تو یہ تیس سکن کی بعد ایس کا نشور کر دے گا
408	38	ayan	10	15	We have also written in it that when we will say that...	2026-01-03 12:33:37.040183	اس میں یہ بھی لگا رہا ہم نے کہ میں جب ہم لوگ وہ بولیں گے نا
409	38	bilal	55	60	So let's leave the speaker for now.	2026-01-03 12:35:44.200615	تو وہ سپیکر مانکم چھوڑ دیتے ہیں فلا
410	38	ayan	80	85	He will search for it and will find it in Ayyan. Let's keep recording.	2026-01-03 12:35:44.204243	وہ اس کو آیاں ہی نہیں کرے گا بسکرکارڈنگ کرے
411	38	ayan	90	95	Yes sir, they are watching us. They are asking us what is going on.	2026-01-03 12:35:44.206775	یہ کہہ رہا ہے کہ وہ دیکھ رہے ہیں یہ کہہ رہا ہے کہ وہ دیکھ رہے ہیں
413	38	ayan	95	100	All that they are saying is in transcription. You also say something.	2026-01-03 12:35:44.210229	ساری بات جو بول رہے ہیں وہ ترنسکرپشن موڑی ہے اگر تم بھی کچھ بولو
412	38	ayan	85	90	Do you want me to record? Say something Yes sir	2026-01-03 12:35:44.208505	کچھ بولے سلام
414	38	bilal	105	110	He is like a judge, he tells his own story.	2026-01-03 12:35:44.21115	جیسے کہ جج ہے اپنا وہ بتاتا ہے
415	38	bilal	110	115	We have presented the case, so what can be done about it?	2026-01-03 12:35:44.213412	مکرمہ کی گز پیش کیا رہے ہیں تو اس کے پر
416	38	bilal	115	120	This is your question.	2026-01-03 12:35:44.214543	اور یہ آپ کا پرشانہ ہے
417	38	ayan	120	125	This is how I was born, I was born in a foreign language.	2026-01-03 12:35:44.217327	جو بلش میں جس طور پر دونے جگہ بہت لنگویز بارے
418	38	ayan	125	130	English morning into English morning into English morning.	2026-01-03 12:35:44.219898	انگلیش بولنے میں تو انگلیش بولنے میں تو انگلیش بولنے میں
422	38	ayan	140	145	Thank you.	2026-01-03 12:35:44.226538	شکریہ
419	38	ayan	130	135	So we have implemented bilingual method on this.	2026-01-03 12:35:44.220848	So we have implemented bilingual method on this.
420	38	bilal	60	65	As we are talking, he is transcripting it.	2026-01-03 12:35:44.221545	جیسے جیسے ہم بات کر رہے ہیں وہ تنسکپ کر رہا ہے
421	38	ayan	135	140	when the fostering is very high, that's the transcription process.	2026-01-03 12:35:44.225444	جب اس کے بعد ایک باری ایسی بھی جانتا ہے وہ ترسکرپشن بروزیس کرتے ہیں
423	38	bilal	65	70	Before I leave, I'd like to thank all of you for your support.	2026-01-03 12:35:44.2329	Before I leave, I'd like to thank all of you for your support.
424	38	ayan	70	75	This is the speaker, it is called A. Now it is also called speaker A.	2026-01-03 12:35:44.233302	یہ اسے سپیکر اے بول دیا اس کو اب بھی سپیکر اے
436	28	ahmed	55	60	How are you feeling now? Let's go down.	2026-01-03 13:11:10.787918	پتہ نہیں کیا آپ کو شعور کرتے ہیں؟ دیکھو
438	28	ahmed	85	90	How do you speak Urdu like a person who speaks English?	2026-01-03 13:11:10.796164	باز کھیل نہیں ہے تم اوردھو کس طرح بول رہے ہیں جیسے انگلش بولتا ہے ہاں
437	28	ahmed	60	65	What are you looking at?	2026-01-03 13:11:10.795074	چاہتے ہیں جا سکتے ہیں
439	28	ahmed	90	95	I don't know how to speak in English It's easy	2026-01-03 13:11:10.799768	I don't know how to speak in English It's easy
441	28	ahmed	95	100	You better speak like a dog, or else they will come. Look Ahmed, you are talking wrong.	2026-01-03 13:11:10.8046	لیکن تو بیٹا کوپوں کی طرح بولی جائے گا دی اینگل فور دو دیکھو ایباد تم غلط بات کر رہے ہو
440	28	ahmed	65	70	What is this line?	2026-01-03 13:11:10.802933	یہ کیا لائن ہے؟ کیا آپ جانتے ہیں؟
442	28	ahmed	100	105	I am talking to him calmly.	2026-01-03 13:11:10.805427	ہرام سے ہی بات کرو
443	28	ahmed	105	110	And the drone Bro, this bike looks like Farooq	2026-01-03 13:11:10.808647	اور ڈروم بھائی یہ بائیک فرق ہوتا ہے لیکن
444	28	ahmed	110	115	I think the mic is faulty The mic is fine Is the code faulty?	2026-01-03 13:11:10.810051	یہ مائیک فارگ ہو گیا مائیک ٹھیک ہے یہ کون فارگ ہو گیا
445	28	ahmed	75	80	Please	2026-01-03 13:11:10.815041	بہت بہت شکریہ
446	28	ahmed	70	75	It has improved to some extent, but now you keep quiet, nothing has happened yet.	2026-01-03 13:11:10.819722	کچھ حد تک یہ بہتر ہو شکا ہے ٹھیک ہے ابھی تم چھپ کرو ابھی کچھ نہیں ہولا
447	28	ahmed	80	85	Is the voice clear? It's not clear.	2026-01-03 13:11:10.820619	یہ جو ہے نا آہ وہ کلیر ہے وہ کلیر نہیں ہے
448	39	ayan	0	5	Let's start. We are checking the system.	2026-01-03 13:21:42.008313	سٹرٹ ہاں ہم اس کا سسٹم چیک کر رہے ہیں
449	39	bilal	5	10	How will the transcription be better?	2026-01-03 13:21:46.785478	ترسکریپشن کیسے بہتر ہوگی؟
450	39	arsalan	15	20	The translation will be in Urdu and English and it will take almost 2-3 seconds.	2026-01-03 13:21:52.203332	بردو اور انگلیش کی ترانسلیشن ہوگی اس طرح سے اور یہ ریال ٹائم بھی ہوتی ہے اس کو 2 سے 3 سیکنٹ سلوک ہوتی ہے
451	39	arsalan	55	60	Then we will map the speaker in it. Now the speaker will do this. Speaker B.	2026-01-03 13:21:52.205845	پھر ہم سپیکر میپ کر دیں گے اس کے اندر یہ ہم نے بولے کہ یہ سارے اب وہ سارے سپیکر اس کو یہ کر دے گا سپیکر بی
452	39	arsalan	35	40	Its accuracy is around 80-50%	2026-01-03 13:21:52.245008	اس کی اکویسی ایرانڈ 80، 70، 50 پرسنٹ ہے
453	39	bilal	40	45	We can use this medium model, but our laptop is not of that level, so we are not using it.	2026-01-03 13:22:09.370476	اس کا میڈیو موڈل ہی اس سے بہتر موڈل کر سکتے ہیں لیکن ہمارا لیپٹوپ اس لیول کا نہیں ہے تو ہم اس کے بارے میں اس کو نہیں ہوں
454	39	bilal	50	55	Thank you very much.	2026-01-03 13:22:09.37915	Thank you very much.
455	39	arsalan	65	70	He has scored all the marks.	2026-01-03 13:22:09.380478	اس نے سارے مارکس رکھا ہے
456	39	arsalan	60	65	Bilal will turn on speaker B and speaker A will turn on speaker A.	2026-01-03 13:22:09.385386	بلال کا بھی سرن اپ کر دے گا اور سپیکر اے باقی طور پر
457	39	bilal	30	35	Have you studied this? Sir, what we have observed...	2026-01-03 13:22:09.46046	میں اسی کیا آتی ہے آپ نے اسٹڈی کیا ہے؟ سر ہم نے جو اوزورف کیا ہے
458	26	bilal	10	15	JazakAllah	2026-01-05 19:08:20.554974	جہاں
459	26	bilal	15	20	As you know this system is transcribing complex text	2026-01-05 19:08:20.562937	کیسا کہ آپ جانتے ہیں یہ سسٹم کافی کمپلکس ٹیکس کو ٹرانسکرائب کر رہا ہے
460	26	bilal	0	5	Assalamu alaikum, my name is Bilal and I am going to test it.	2026-01-05 19:08:20.650586	اسلام علیکم میرا نام بلال ہے اور میں اس کو تسک کرنے کے لئے
461	26	bilal	20	25	and i am trying to show it	2026-01-05 19:08:20.672575	اور میں اس کو دکھانے کی کوشش کر رہا ہوں
\.


--
-- TOC entry 5190 (class 0 OID 25403)
-- Dependencies: 242
-- Data for Name: stenographer_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stenographer_info (id, steno_code, steno_name, steno_email, steno_cnic, steno_birthday, steno_court, password) FROM stdin;
1	STN-01	Asjad Shahab	asjad@gmail.com	1234567890122	2005-10-18	1	asjad123
2	STN-02	Bilal Khadim	bilal@gmail.com	1234567890123	2003-03-12	2	bilal123
3	STN-03	Muhammad Bilal	mbilal@gmail.com	1234567890122	2002-12-21	3	mbilal123
4	STN-04	xyz	xyz@gmail.com	4540267149011	2025-12-16	5	xyz123
\.


--
-- TOC entry 5192 (class 0 OID 25413)
-- Dependencies: 244
-- Data for Name: transcript; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transcript (transcript_id, case_id, transcript) FROM stdin;
1	11	Court session started at 10:00 AM.\nJudge greeted both parties.\nAhmed presented his property documents.\nBilal raised objections.\nJudge asked for witnesses.\nWitness 1 gave statement supporting Ahmed.\nWitness 2 gave statement supporting Bilal.\nAhmed lawyer argued property ownership.\nBilal lawyer questioned documents authenticity.\nJudge reviewed the submitted evidence.\nCourt paused for recess at 11:30 AM.\nSession resumed at 11:45 AM.\nBoth parties agreed to mediation.\nJudge directed parties to submit final statements.\nCourt adjourned at 12:30 PM.
2	12	Court session started at 09:30 AM.\nProsecution presented theft evidence.\nImran Khan pleaded not guilty.\nPolice officer testified about the crime scene.\nDefense lawyer cross-examined officer.\nProsecution submitted fingerprints evidence.\nDefense questioned chain of custody.\nJudge asked for closing arguments.\nProsecution summarized evidence.\nDefense emphasized lack of motive.\nJudge reminded both parties to follow procedure.\nCourt paused for lunch at 11:00 AM.\nSession resumed at 11:30 AM.\nJudge set next hearing date.\nCourt adjourned at 12:15 PM.
3	13	Court session began at 10:15 AM.\nSara presented her petition documents.\nAli responded with his statements.\nJudge asked about prior reconciliation attempts.\nBoth parties gave personal statements.\nLawyers argued custody preferences.\nWitnesses testified about child welfare.\nJudge asked social worker for report.\nSara lawyer emphasized best interest of child.\nAli lawyer questioned report accuracy.\nJudge reviewed all submitted documents.\nCourt paused for short break at 11:20 AM.\nSession resumed at 11:35 AM.\nJudge suggested mediation.\nCourt adjourned at 12:00 PM.
6	16	Court session started at 09:00 AM.\nProsecution presented case against Noman.\nDefense entered plea of not guilty.\nWitness 1 testified about the incident.\nWitness 2 provided supporting evidence.\nDefense cross-examined witnesses.\nProsecution submitted forensic report.\nDefense questioned forensic accuracy.\nJudge requested additional documentation.\nBoth parties debated legal procedures.\nCourt paused for short break at 10:30 AM.\nSession resumed at 10:45 AM.\nProsecution summarized evidence.\nDefense provided counter-arguments.\nJudge set next hearing date and adjourned session at 11:30 AM.
\.


--
-- TOC entry 5193 (class 0 OID 25421)
-- Dependencies: 245
-- Data for Name: transcript_approval; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transcript_approval (id, case_id, status, submitted_by, reviewed_by, submitted_at, reviewed_at, judge_notes, transcript_url) FROM stdin;
15	11	approved	Asjad Shahab	Ayan Shahab	2025-12-27 00:16:32.754803	2025-12-30 01:37:12.027216	\N	https://qxhyujcaqmsvrryjpuxj.supabase.co/storage/v1/object/public/Transcription_Files/transcripts/Transcript_11.pdf
27	37	submitted	Bilal Khadim	\N	2025-12-30 20:37:30.856441	\N	\N	\N
29	40	approved	Bilal Khadim	Malik Junaid Aziz	2026-01-03 02:11:19.259538	2026-01-03 02:15:30.583796	\N	https://qxhyujcaqmsvrryjpuxj.supabase.co/storage/v1/object/public/Transcription_Files/transcripts/Transcript_40.pdf
31	38	submitted	Bilal Khadim	\N	2026-01-03 12:36:41.332861	\N	\N	\N
32	26	submitted	Asjad Shahab	\N	2026-01-05 19:11:40.839309	\N	\N	\N
\.


--
-- TOC entry 5195 (class 0 OID 25430)
-- Dependencies: 247
-- Data for Name: transcript_edit_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transcript_edit_history (id, original_transcript_id, previous_text, new_text, edited_by, role, edited_at) FROM stdin;
7	124	Thank you for watching this video.	why does he change it	Asjad Shahab	stenographer	2025-12-27 00:12:58.311576
8	115	I have not done any work on the web data but	I have done work on the web but	Asjad Shahab	stenographer	2025-12-27 00:13:30.07957
9	106	Thank you for watching.	this should be your name	Asjad Shahab	stenographer	2025-12-27 00:14:54.995914
10	107	Thank you so much.	i dont know	Asjad Shahab	stenographer	2025-12-27 00:15:05.963008
11	129	Thanks for watching	we can save it	Asjad Shahab	stenographer	2025-12-27 00:16:28.342981
12	95	Now we will talk about some transcripts	new text 1 2 3	Ayan Shahab	judge	2025-12-27 04:23:22.523057
13	107	i dont know	now i know	Ayan Shahab	judge	2025-12-27 15:18:41.861385
14	95	new text 1 2 3	again new text	Ayan Shahab	judge	2025-12-27 15:34:04.589059
15	95	new text 1 2 3	again again	Ayan Shahab	judge	2025-12-27 15:34:20.733754
16	96	We will try our best for this case.	2nd update	Ayan Shahab	judge	2025-12-27 16:39:06.494806
17	96	2nd update	2nd upda	Ayan Shahab	judge	2025-12-27 17:03:04.020216
18	96	2nd update	2nd updat	Ayan Shahab	judge	2025-12-27 17:16:09.382167
19	140	This is a very old school This is a very old school	bla bla bla	Asjad Shahab	stenographer	2025-12-28 17:56:50.371686
20	139	You said this. I said this. You said this.	you said that bilal edited it	Ayan Shahab	judge	2025-12-28 17:58:39.596611
21	131	Say something. Hello, Assalamualaikum. My name is Bilal.	Hello, Assalamualaikum. My name is Bilal.	Ayan Shahab	judge	2025-12-28 19:45:40.046154
22	131	Hello, Assalamualaikum. My name is Bilal.	Hello, Assalamualaikum. My name is Bilal. and i am ayan	Ayan Shahab	judge	2025-12-28 19:52:02.762244
23	131	Hello, Assalamualaikum. My name is Bilal.	Hello, Assalamualaikum. My name is Bilal. and i am ayan, again	Ayan Shahab	judge	2025-12-28 19:55:36.612254
24	131	Hello, Assalamualaikum. My name is Bilal.	Hello, Assalamualaikum. My name is Bilal. and i am ayan, again AGAIN	Ayan Shahab	judge	2025-12-28 20:01:21.784144
25	132	I am trying to test it	I am trying to test it and its working	Ayan Shahab	judge	2025-12-28 20:14:06.015518
26	136	Okay.	Okay. hehe	Ayan Shahab	judge	2025-12-28 20:15:42.579346
31	359	I am testing again.	updated.	Bilal Khadim	stenographer	2026-01-03 00:48:35.864695
32	361	I am waiting for the test, but still I am testing.	update again	Bilal Khadim	stenographer	2026-01-03 00:55:56.624794
33	364	I am not writing right now because we will not be able to do the demo.	change	Bilal Khadim	stenographer	2026-01-03 00:57:14.608014
34	359	I am testing again.	updated. cha	Bilal Khadim	stenographer	2026-01-03 01:03:01.867537
35	359	I am testing again.	updated. ch	Bilal Khadim	stenographer	2026-01-03 01:06:31.653932
37	385	Let's start the experiment	Let's start court hearing	Bilal Khadim	stenographer	2026-01-03 02:07:49.64618
38	387	case no. 122	present the case no. 122	Bilal Khadim	stenographer	2026-01-03 02:08:08.859987
39	396	This is the purpose of this video.	this allegation is without any evidence	Malik Junaid Aziz	judge	2026-01-03 02:15:23.131317
40	448	Let's start. We are checking the system.	changed	Bilal Khadim	stenographer	2026-01-03 13:21:55.389651
41	458	JazakAllah	lets start	Ayan Shahab	judge	2026-01-05 19:14:11.368669
\.


--
-- TOC entry 5218 (class 0 OID 0)
-- Dependencies: 220
-- Name: admin_info_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admin_info_id_seq', 3, false);


--
-- TOC entry 5219 (class 0 OID 0)
-- Dependencies: 222
-- Name: case_details_case_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.case_details_case_id_seq', 45, true);


--
-- TOC entry 5220 (class 0 OID 0)
-- Dependencies: 224
-- Name: case_recording_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.case_recording_id_seq', 1, false);


--
-- TOC entry 5221 (class 0 OID 0)
-- Dependencies: 226
-- Name: chief_judge_info_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chief_judge_info_id_seq', 2, true);


--
-- TOC entry 5222 (class 0 OID 0)
-- Dependencies: 229
-- Name: court_info_court_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.court_info_court_id_seq', 8, true);


--
-- TOC entry 5223 (class 0 OID 0)
-- Dependencies: 231
-- Name: court_type_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.court_type_type_id_seq', 14, true);


--
-- TOC entry 5224 (class 0 OID 0)
-- Dependencies: 233
-- Name: edited_transcripts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.edited_transcripts_id_seq', 39, true);


--
-- TOC entry 5225 (class 0 OID 0)
-- Dependencies: 235
-- Name: hearing_details_hearing_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hearing_details_hearing_id_seq', 23, true);


--
-- TOC entry 5226 (class 0 OID 0)
-- Dependencies: 237
-- Name: judge_info_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.judge_info_id_seq', 3, true);


--
-- TOC entry 5227 (class 0 OID 0)
-- Dependencies: 239
-- Name: ordersheets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ordersheets_id_seq', 12, true);


--
-- TOC entry 5228 (class 0 OID 0)
-- Dependencies: 241
-- Name: original_transcript_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.original_transcript_id_seq', 461, true);


--
-- TOC entry 5229 (class 0 OID 0)
-- Dependencies: 243
-- Name: stenographer_info_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stenographer_info_id_seq', 4, true);


--
-- TOC entry 5230 (class 0 OID 0)
-- Dependencies: 246
-- Name: transcript_approval_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transcript_approval_id_seq', 32, true);


--
-- TOC entry 5231 (class 0 OID 0)
-- Dependencies: 248
-- Name: transcript_edit_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transcript_edit_history_id_seq', 41, true);


--
-- TOC entry 5232 (class 0 OID 0)
-- Dependencies: 249
-- Name: transcript_transcript_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transcript_transcript_id_seq', 1, false);


--
-- TOC entry 4958 (class 2606 OID 25462)
-- Name: admin_info admin_info_admin_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_info
    ADD CONSTRAINT admin_info_admin_code_key UNIQUE (admin_code);


--
-- TOC entry 4960 (class 2606 OID 25464)
-- Name: admin_info admin_info_admin_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_info
    ADD CONSTRAINT admin_info_admin_email_key UNIQUE (admin_email);


--
-- TOC entry 4962 (class 2606 OID 25466)
-- Name: admin_info admin_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_info
    ADD CONSTRAINT admin_info_pkey PRIMARY KEY (id);


--
-- TOC entry 4964 (class 2606 OID 25468)
-- Name: case_details case_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.case_details
    ADD CONSTRAINT case_details_pkey PRIMARY KEY (case_id);


--
-- TOC entry 4968 (class 2606 OID 25470)
-- Name: case_recording case_recording_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.case_recording
    ADD CONSTRAINT case_recording_pkey PRIMARY KEY (id);


--
-- TOC entry 4970 (class 2606 OID 25472)
-- Name: chief_judge_info chief_judge_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chief_judge_info
    ADD CONSTRAINT chief_judge_info_pkey PRIMARY KEY (id);


--
-- TOC entry 4966 (class 2606 OID 25474)
-- Name: case_details con_case_code; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.case_details
    ADD CONSTRAINT con_case_code UNIQUE (case_code);


--
-- TOC entry 4972 (class 2606 OID 25476)
-- Name: court_courttype court_courttype_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.court_courttype
    ADD CONSTRAINT court_courttype_pkey PRIMARY KEY (court_id, type_id);


--
-- TOC entry 4974 (class 2606 OID 25478)
-- Name: court_info court_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.court_info
    ADD CONSTRAINT court_info_pkey PRIMARY KEY (court_id);


--
-- TOC entry 4976 (class 2606 OID 25480)
-- Name: court_type court_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.court_type
    ADD CONSTRAINT court_type_pkey PRIMARY KEY (type_id);


--
-- TOC entry 4978 (class 2606 OID 25482)
-- Name: court_type court_type_type_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.court_type
    ADD CONSTRAINT court_type_type_name_key UNIQUE (type_name);


--
-- TOC entry 4980 (class 2606 OID 25484)
-- Name: edited_transcripts edited_transcripts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.edited_transcripts
    ADD CONSTRAINT edited_transcripts_pkey PRIMARY KEY (id);


--
-- TOC entry 4982 (class 2606 OID 25486)
-- Name: hearing_details hearing_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hearing_details
    ADD CONSTRAINT hearing_details_pkey PRIMARY KEY (hearing_id);


--
-- TOC entry 4984 (class 2606 OID 25488)
-- Name: judge_info judge_info_judge_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.judge_info
    ADD CONSTRAINT judge_info_judge_code_key UNIQUE (judge_code);


--
-- TOC entry 4986 (class 2606 OID 25490)
-- Name: judge_info judge_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.judge_info
    ADD CONSTRAINT judge_info_pkey PRIMARY KEY (id);


--
-- TOC entry 4988 (class 2606 OID 25492)
-- Name: ordersheets ordersheets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ordersheets
    ADD CONSTRAINT ordersheets_pkey PRIMARY KEY (id);


--
-- TOC entry 4990 (class 2606 OID 25494)
-- Name: original_transcript original_transcript_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.original_transcript
    ADD CONSTRAINT original_transcript_pkey PRIMARY KEY (id);


--
-- TOC entry 4992 (class 2606 OID 25496)
-- Name: stenographer_info stenographer_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stenographer_info
    ADD CONSTRAINT stenographer_info_pkey PRIMARY KEY (id);


--
-- TOC entry 4994 (class 2606 OID 25498)
-- Name: stenographer_info stenographer_info_steno_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stenographer_info
    ADD CONSTRAINT stenographer_info_steno_code_key UNIQUE (steno_code);


--
-- TOC entry 4998 (class 2606 OID 25500)
-- Name: transcript_approval transcript_approval_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transcript_approval
    ADD CONSTRAINT transcript_approval_pkey PRIMARY KEY (id);


--
-- TOC entry 5002 (class 2606 OID 25502)
-- Name: transcript_edit_history transcript_edit_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transcript_edit_history
    ADD CONSTRAINT transcript_edit_history_pkey PRIMARY KEY (id);


--
-- TOC entry 4996 (class 2606 OID 25504)
-- Name: transcript transcript_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transcript
    ADD CONSTRAINT transcript_pkey PRIMARY KEY (transcript_id);


--
-- TOC entry 5000 (class 2606 OID 25506)
-- Name: transcript_approval unique_case_approval; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transcript_approval
    ADD CONSTRAINT unique_case_approval UNIQUE (case_id);


--
-- TOC entry 5003 (class 2606 OID 25507)
-- Name: admin_info admin_info_admin_court_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_info
    ADD CONSTRAINT admin_info_admin_court_fkey FOREIGN KEY (admin_court) REFERENCES public.court_info(court_id);


--
-- TOC entry 5004 (class 2606 OID 25512)
-- Name: case_details case_details_admin_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.case_details
    ADD CONSTRAINT case_details_admin_code_fkey FOREIGN KEY (admin_code) REFERENCES public.admin_info(admin_code) ON UPDATE CASCADE;


--
-- TOC entry 5005 (class 2606 OID 25517)
-- Name: case_details case_details_judge_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.case_details
    ADD CONSTRAINT case_details_judge_code_fkey FOREIGN KEY (judge_code) REFERENCES public.judge_info(judge_code) ON UPDATE CASCADE;


--
-- TOC entry 5006 (class 2606 OID 25522)
-- Name: case_details case_details_steno_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.case_details
    ADD CONSTRAINT case_details_steno_code_fkey FOREIGN KEY (steno_code) REFERENCES public.stenographer_info(steno_code) ON UPDATE CASCADE;


--
-- TOC entry 5008 (class 2606 OID 25527)
-- Name: court_courttype court_courttype_court_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.court_courttype
    ADD CONSTRAINT court_courttype_court_id_fkey FOREIGN KEY (court_id) REFERENCES public.court_info(court_id) ON DELETE CASCADE;


--
-- TOC entry 5009 (class 2606 OID 25532)
-- Name: court_courttype court_courttype_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.court_courttype
    ADD CONSTRAINT court_courttype_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.court_type(type_id) ON DELETE CASCADE;


--
-- TOC entry 5015 (class 2606 OID 25537)
-- Name: original_transcript fk_case; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.original_transcript
    ADD CONSTRAINT fk_case FOREIGN KEY (case_id) REFERENCES public.case_details(case_id) ON DELETE CASCADE;


--
-- TOC entry 5018 (class 2606 OID 25542)
-- Name: transcript_approval fk_case_approval; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transcript_approval
    ADD CONSTRAINT fk_case_approval FOREIGN KEY (case_id) REFERENCES public.case_details(case_id) ON DELETE CASCADE;


--
-- TOC entry 5014 (class 2606 OID 25547)
-- Name: ordersheets fk_case_ordersheet; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ordersheets
    ADD CONSTRAINT fk_case_ordersheet FOREIGN KEY (case_id) REFERENCES public.case_details(case_id) ON DELETE CASCADE;


--
-- TOC entry 5007 (class 2606 OID 25552)
-- Name: case_recording fk_case_recording; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.case_recording
    ADD CONSTRAINT fk_case_recording FOREIGN KEY (case_id) REFERENCES public.case_details(case_id) ON DELETE CASCADE;


--
-- TOC entry 5010 (class 2606 OID 25557)
-- Name: edited_transcripts fk_editted_transcript_case; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.edited_transcripts
    ADD CONSTRAINT fk_editted_transcript_case FOREIGN KEY (case_id) REFERENCES public.case_details(case_id) ON DELETE CASCADE;


--
-- TOC entry 5011 (class 2606 OID 25562)
-- Name: edited_transcripts fk_original_transcript; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.edited_transcripts
    ADD CONSTRAINT fk_original_transcript FOREIGN KEY (original_transcript_id) REFERENCES public.original_transcript(id) ON DELETE CASCADE;


--
-- TOC entry 5012 (class 2606 OID 25567)
-- Name: hearing_details hearing_details_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hearing_details
    ADD CONSTRAINT hearing_details_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.case_details(case_id);


--
-- TOC entry 5013 (class 2606 OID 25572)
-- Name: judge_info judge_info_judge_court_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.judge_info
    ADD CONSTRAINT judge_info_judge_court_fkey FOREIGN KEY (judge_court) REFERENCES public.court_info(court_id);


--
-- TOC entry 5016 (class 2606 OID 25577)
-- Name: stenographer_info stenographer_info_steno_court_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stenographer_info
    ADD CONSTRAINT stenographer_info_steno_court_fkey FOREIGN KEY (steno_court) REFERENCES public.court_info(court_id);


--
-- TOC entry 5017 (class 2606 OID 25582)
-- Name: transcript transcript_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transcript
    ADD CONSTRAINT transcript_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.case_details(case_id);


--
-- TOC entry 5019 (class 2606 OID 25587)
-- Name: transcript_edit_history transcript_edit_history_original_transcript_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transcript_edit_history
    ADD CONSTRAINT transcript_edit_history_original_transcript_id_fkey FOREIGN KEY (original_transcript_id) REFERENCES public.original_transcript(id) ON DELETE CASCADE;


-- Completed on 2026-01-07 18:55:42

--
-- PostgreSQL database dump complete
--

\unrestrict 0hT4gOBv2dByPYcdBi4xe5xaC9FsyjKyzTyhjIElRQexTWiX9dU6NaXmjETKIwi

