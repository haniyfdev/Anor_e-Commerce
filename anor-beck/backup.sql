--
-- PostgreSQL database dump
--

\restrict F0L9BWh8wqehilm7hdgB0syrRiHcwMz015Wzsv8AxuOJ6mvawK08l3RrE2tdGH9

-- Dumped from database version 16.11
-- Dumped by pg_dump version 16.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO postgres;

--
-- Name: avatar_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.avatar_images (
    id integer NOT NULL,
    user_id integer NOT NULL,
    image_url character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.avatar_images OWNER TO postgres;

--
-- Name: avatar_images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.avatar_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.avatar_images_id_seq OWNER TO postgres;

--
-- Name: avatar_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.avatar_images_id_seq OWNED BY public.avatar_images.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: product_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_images (
    id integer NOT NULL,
    product_id integer NOT NULL,
    image_url character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.product_images OWNER TO postgres;

--
-- Name: product_images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_images_id_seq OWNER TO postgres;

--
-- Name: product_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_images_id_seq OWNED BY public.product_images.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    price integer NOT NULL,
    description text NOT NULL,
    location character varying NOT NULL,
    category_id integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying NOT NULL,
    hashed_password character varying NOT NULL,
    name character varying NOT NULL,
    phone character varying NOT NULL,
    location character varying,
    role character varying NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: avatar_images id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avatar_images ALTER COLUMN id SET DEFAULT nextval('public.avatar_images_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: product_images id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images ALTER COLUMN id SET DEFAULT nextval('public.product_images_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alembic_version (version_num) FROM stdin;
8b513cbc21c4
\.


--
-- Data for Name: avatar_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.avatar_images (id, user_id, image_url, created_at) FROM stdin;
1	1	/static/avatars/9424bcea-7db1-4635-8385-97b28ecbb395_polat.jpg	2026-02-07 09:19:58.822194+00
2	2	/static/avatars/0de0262c-05f6-41da-b68a-45c8896b6743_mm.jpg	2026-02-07 09:27:20.694661+00
3	3	/static/avatars/588aa13e-56ad-437a-bd81-f149143c44bb_photo_2026-02-07_14-35-11.jpg	2026-02-07 09:35:19.806935+00
4	4	/static/avatars/d9c19f4b-b174-49e3-8178-81f64ecac150_photo_2026-02-07_14-42-55.jpg	2026-02-07 09:43:04.990245+00
5	5	/static/avatars/f9e80f76-c3f9-4e19-9180-1223f3ce9713_photo_2026-02-07_14-51-08.jpg	2026-02-07 09:51:18.729149+00
6	6	/static/avatars/f8201c32-2c08-4e02-be30-9e8b0011c600_photo_2026-02-07_14-57-05.jpg	2026-02-07 09:57:12.915632+00
7	7	/static/avatars/5f5151d5-ed8d-4277-b57e-e52fb9ac401b_photo_2026-02-07_15-09-34.jpg	2026-02-07 10:09:45.248893+00
8	8	/static/avatars/7a417d9d-d2bf-443e-b7a7-a818ba584dcb_photo_2026-02-07_15-47-15.jpg	2026-02-07 10:47:25.598362+00
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name) FROM stdin;
1	Meva
2	Sabzavot
3	Urug' va don 
4	Chorva
5	Texnika
6	Ozuqa va dorilar
7	Ko'chat
8	Gullar
\.


--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_images (id, product_id, image_url, created_at) FROM stdin;
1	1	static/images/90b0ee9b-0026-4517-b9a6-2146e6f7fe7e_arcga.jpg	2026-02-07 09:20:51.995055+00
2	1	static/images/1bfcd90d-a10d-42a0-9e7b-092dbdd8b9b3_archa.jpg	2026-02-07 09:20:52.019992+00
3	2	static/images/4815b2bd-963f-4ad1-880b-3a6895b1a8d8_photo_1_2026-02-07_14-22-44.jpg	2026-02-07 09:23:07.958503+00
4	2	static/images/fa511858-6a37-4bdc-8dec-79178304a839_photo_2_2026-02-07_14-22-44.jpg	2026-02-07 09:23:07.983184+00
5	2	static/images/0a6dd6fe-80a9-40ba-b3bc-00b4aefa31de_photo_3_2026-02-07_14-22-44.jpg	2026-02-07 09:23:08.004544+00
6	2	static/images/198e5b42-6072-4452-b14a-4d90974d0fa2_photo_4_2026-02-07_14-22-44.jpg	2026-02-07 09:23:08.044955+00
7	2	static/images/d7c0f3b2-33c0-43e4-9c7e-f9389ceb5271_photo_5_2026-02-07_14-22-44.jpg	2026-02-07 09:23:08.07785+00
8	3	static/images/4abb3a46-8b9a-472f-822c-b25d22c90510_photo_1_2026-02-07_14-25-17.jpg	2026-02-07 09:25:31.143713+00
9	3	static/images/691d7b2c-1bc3-416d-b4aa-6398cd5dcbaa_photo_2_2026-02-07_14-25-17.jpg	2026-02-07 09:25:31.167549+00
10	3	static/images/d35a0739-6091-4dbb-a701-fb89c242ea52_photo_3_2026-02-07_14-25-17.jpg	2026-02-07 09:25:31.189352+00
11	3	static/images/dc660e18-9863-4838-8921-248dc0f06c87_photo_4_2026-02-07_14-25-17.jpg	2026-02-07 09:25:31.209443+00
12	3	static/images/99d91660-4395-4de0-a709-31f47cb4d5cf_photo_5_2026-02-07_14-25-17.jpg	2026-02-07 09:25:31.230357+00
13	4	static/images/4eb98df6-d86a-4aa4-afa8-6224e3e1a0f0_photo_2026-02-07_14-28-45.jpg	2026-02-07 09:29:26.564815+00
14	4	static/images/21351db6-501d-419e-98f5-3a4dea830efb_photo_2026-02-07_14-29-16.jpg	2026-02-07 09:29:26.603828+00
15	5	static/images/ee366612-6ad3-444f-bb7e-45b4fd3276bc_photo_2026-02-07_14-31-18.jpg	2026-02-07 09:31:27.422575+00
16	5	static/images/6c6895a9-0bd3-42c7-99b8-91fb6b6311c9_photo_2026-02-07_14-31-14.jpg	2026-02-07 09:31:27.442606+00
17	5	static/images/b22292f2-db41-411a-a22f-e3e90201c4bf_photo_2026-02-07_14-31-10.jpg	2026-02-07 09:31:27.465113+00
18	6	static/images/6f3bf2eb-eb8c-4411-810d-2712fb0128c5_photo_2026-02-07_14-32-46.jpg	2026-02-07 09:33:37.215479+00
19	6	static/images/fe99d043-1ffe-4b1a-8135-0423185125f9_photo_2026-02-07_14-32-42.jpg	2026-02-07 09:33:37.245298+00
20	6	static/images/cee5c396-1071-4b7f-bc82-146a52f29a79_photo_2026-02-07_14-32-38.jpg	2026-02-07 09:33:37.279439+00
21	7	static/images/d8124f22-589f-4a49-8f4f-b1e648b51cf5_photo_2026-02-07_14-37-00.jpg	2026-02-07 09:37:16.291719+00
22	7	static/images/388abf95-97b2-4cc9-8747-c9060dba91bf_photo_2026-02-07_14-36-49.jpg	2026-02-07 09:37:16.316677+00
23	7	static/images/91c24f8b-7a83-4558-8196-8f8a45bd33ff_photo_2026-02-07_14-36-26.jpg	2026-02-07 09:37:16.338935+00
24	8	static/images/5fc721b0-462f-472f-b880-e52588502658_photo_2026-02-07_14-39-10.jpg	2026-02-07 09:39:19.823267+00
25	8	static/images/298f5912-eee9-4d4e-927a-a6893bf160db_photo_2026-02-07_14-38-54.jpg	2026-02-07 09:39:19.848131+00
26	8	static/images/91b1f225-37c2-4ddd-b50a-76d45d95d279_photo_2026-02-07_14-38-44.jpg	2026-02-07 09:39:19.874431+00
27	9	static/images/48497d12-5b45-44dd-b1c3-d71ac446de1d_photo_2026-02-07_14-40-35.jpg	2026-02-07 09:41:26.574314+00
28	9	static/images/2906a2b4-1bd4-4673-8c38-dde223ba876b_photo_2026-02-07_14-40-30.jpg	2026-02-07 09:41:26.595358+00
29	10	static/images/fae988a1-832f-40d1-a118-21e83b4f6b94_photo_1_2026-02-07_14-43-54.jpg	2026-02-07 09:45:13.046515+00
30	10	static/images/700c1e53-4657-456c-b07d-718096818303_photo_2_2026-02-07_14-43-54.jpg	2026-02-07 09:45:13.077652+00
31	10	static/images/acbd2328-f2bd-4a0c-b954-b5cd26959ac4_photo_3_2026-02-07_14-43-54.jpg	2026-02-07 09:45:13.102093+00
32	10	static/images/7d77bd3c-a453-46f9-b656-25e6cc9deab5_photo_4_2026-02-07_14-43-54.jpg	2026-02-07 09:45:13.12309+00
33	11	static/images/b0ef12a5-0c21-4c16-8d60-f8bcc719979a_photo_2026-02-07_14-46-54.jpg	2026-02-07 09:48:14.473775+00
34	11	static/images/ed0f8edf-3ae3-4193-a096-931c501f5e32_photo_2026-02-07_14-46-46.jpg	2026-02-07 09:48:14.501831+00
35	11	static/images/70329b2a-e619-4fb5-909f-ec22bf553ab3_photo_2026-02-07_14-46-09.jpg	2026-02-07 09:48:14.526937+00
36	12	static/images/741ebd3e-4c03-41f3-b207-783e3f2edb81_photo_2026-02-07_14-45-57.jpg	2026-02-07 09:49:15.262734+00
37	12	static/images/33cba99e-28d3-4b92-86f3-b5c7efa4016c_photo_2026-02-07_14-45-53.jpg	2026-02-07 09:49:15.287709+00
38	13	static/images/79708551-4e9f-4df1-bc79-6aa9dee8afee_photo_2026-02-07_14-52-53.jpg	2026-02-07 09:53:52.585634+00
39	13	static/images/c016ca64-037a-4217-9211-8f8fab0933f6_photo_2026-02-07_14-52-47.jpg	2026-02-07 09:53:52.605864+00
40	13	static/images/3f28cef6-7d8f-41ea-bee6-d1e5d952c7d7_photo_2026-02-07_14-52-44.jpg	2026-02-07 09:53:52.629517+00
41	14	static/images/4a375ce0-41db-489e-a1db-0430c7358034_photo_2026-02-07_14-54-59.jpg	2026-02-07 09:55:52.687693+00
42	14	static/images/51bbcec4-2961-4705-b50a-4db62104d378_photo_2026-02-07_14-54-37.jpg	2026-02-07 09:55:52.710857+00
43	14	static/images/21081866-e027-4454-aec7-dd18285dba88_photo_2026-02-07_14-54-21.jpg	2026-02-07 09:55:52.738678+00
44	15	static/images/c1614ea1-8bec-48bd-8bce-d003f3e6a1c4_photo_2026-02-07_15-00-20.jpg	2026-02-07 10:01:32.09557+00
45	15	static/images/2481e93b-7b4e-4aa6-bcfa-daf4939c319c_photo_2026-02-07_15-00-39.jpg	2026-02-07 10:01:32.121788+00
46	16	static/images/26da8f73-483b-4eec-9038-e98e9dd3b400_photo_2026-02-07_15-11-17.jpg	2026-02-07 10:12:08.914674+00
47	16	static/images/2a31da2c-9484-4a99-8df0-366a1857561f_photo_2026-02-07_15-10-44.jpg	2026-02-07 10:12:08.940602+00
48	16	static/images/6d5dcdd4-a5bc-4806-81a4-79e73f7986f7_photo_2026-02-07_15-10-36.jpg	2026-02-07 10:12:08.972932+00
49	17	static/images/f5e21ec8-c0ac-4865-a938-c073c0357d60_photo_2026-02-07_15-41-21.jpg	2026-02-07 10:42:47.037669+00
50	17	static/images/7be339c1-002a-4ff8-b192-66e6d780e41f_photo_2026-02-07_15-41-17.jpg	2026-02-07 10:42:47.08315+00
51	17	static/images/c6f3fdd7-85d0-44f6-9e60-f8d3852844c8_photo_2026-02-07_15-41-12.jpg	2026-02-07 10:42:47.122124+00
52	18	static/images/f2b04578-5be8-4b2a-a1a5-eaa74f81444f_photo_2026-02-07_15-44-58.jpg	2026-02-07 10:45:52.090091+00
53	18	static/images/c4e09a42-007d-4409-a003-b15375e24036_photo_2026-02-07_15-44-54.jpg	2026-02-07 10:45:52.113531+00
54	19	static/images/6a9bd6f2-e80b-4aa0-8848-fd88a40d2264_photo_2026-02-07_15-49-25.jpg	2026-02-07 10:49:34.830447+00
55	19	static/images/802d6384-f0e9-4f61-9789-0e42b40db7b6_photo_2026-02-07_15-49-13.jpg	2026-02-07 10:49:34.865074+00
56	19	static/images/9e7f3f2b-19c8-42b0-9c03-219e60e65bf4_photo_2026-02-07_15-49-10.jpg	2026-02-07 10:49:34.908532+00
57	20	static/images/d1ce0f8a-b59d-4ee5-8d48-59dbfe94145e_oshqovoq.jpg	2026-02-07 17:20:13.654958+00
58	20	static/images/fc7b0c69-0f2c-4f97-8356-bac48b6fbb0b_oshqovoq1.jpg	2026-02-07 17:20:13.679503+00
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, title, price, description, location, category_id, user_id, created_at) FROM stdin;
1	Archa kochatlari	34999	Archa sotiladi \nohangaronda dastavka toshkent viloyat ichida faqat	Toshkent	7	1	2026-02-07 09:20:51.955399+00
2	kalif quyonlari sotiladi	450000	qoshli va qoshsiz eng sifatli kaliflar\nolmaliq shaharda \nolmaliq ichida dastavka bor	Toshkent	4	1	2026-02-07 09:23:07.928267+00
3	baran quyonchalar sotiladi	120001	baranlar olmaliq shahrida \nkelishtirib beramiz \nbirinchi partiya \ndastavka yo'q	Toshkent	4	1	2026-02-07 09:25:31.115154+00
4	olma	11998	qizil jizzax olmasi	Jizzax	1	2	2026-02-07 09:29:26.540749+00
5	banan	16000	jizzax issiqxonalarida bananni zori\nekvador bananidan arzon va sifatli\ndastavka tekin jizzax ichiga	Jizzax	1	2	2026-02-07 09:31:27.392194+00
6	Anor 	8300	Tojikiston export anorlari\nkamida 1 tonna sotamiz\ndastavka bepul 	Jizzax	1	2	2026-02-07 09:33:37.17965+00
7	Traktor	370000000	new holland t7060	Sirdaryo	5	3	2026-02-07 09:37:16.262059+00
8	mini traktor	35000000	andijonda yigilgan birinchi katta partiyani olganman donalab sotayapman \nkelishitirib beramiz 	Sirdaryo	5	3	2026-02-07 09:39:19.788109+00
9	Su 3454	120000	Daraxt va o'simliklarga dori sepadigan uskuna	Sirdaryo	5	3	2026-02-07 09:41:26.54753+00
10	bodring	45000	buxoro issiqxonalaridagi bodring sotiladi.\ndastavka yoq. ozlaring olib ketaslar kamida 100 kg sotiladi	Buxoro	2	4	2026-02-07 09:45:13.00696+00
11	limon	33999	qorakol issiqxonalarida yetishtirilgan limon sotiladi\nkamida 200kg olish kerek\njuda ajiyb limonlar	Buxoro	1	4	2026-02-07 09:48:14.44447+00
12	pomidor	35002	buxoro pomidori\nissiqxonaniki\ndastavka buxoro ichiga kamida 500 kg	Buxoro	2	4	2026-02-07 09:49:15.229004+00
13	sabzi urug'	119997	Kattaqo'rg'on sabzi urug'lari \nmushak sabzi chiqaradigan 	Samarqand	3	5	2026-02-07 09:53:52.558354+00
14	Makkajo'xori	6498	makkajo'xori donlari sotiladi \nhar turligi bor yorma, katta, boshoq \nhar turligi bor	Samarqand	3	5	2026-02-07 09:55:52.651195+00
15	sariq sabzi	1799	Surxondaryoni toza sariq mushak sabzilari	Surxondaryo	2	6	2026-02-07 10:01:32.067908+00
16	Lavlagi	12001	Lavlagini biri eng zorii demaymizda !\nlekin ancha sifatli lavlagilardan	Navoiy	2	7	2026-02-07 10:12:08.879045+00
17	Quyon uchun kombikorm	7500	hali yaroqlilik muddati tugashiga 2 oy bor. arzon qilib beraman\nNavoiy viloyat bo'yicha dastavka bor	Navoiy	6	7	2026-02-07 10:42:46.996029+00
18	Steroit	50000	Qo'y va mol uchun steroid'lar sotiladi\nva butun uy hayvonlariga bersa ham bo'ladi	Navoiy	6	7	2026-02-07 10:45:52.056638+00
19	Gul 	12000	tuvak va tomir gullar sotiladi. \nNamangan bo'ylab dastavka bor	Namangan	8	8	2026-02-07 10:49:34.797695+00
20	oshqovoq	14997	Oddiy jaydari uy oshqovoqi\nValgagrad zoti emas(!)\ndastavka yo'q\nmanzil chorsuda	Toshkent city	2	8	2026-02-07 17:20:13.60009+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, hashed_password, name, phone, location, role) FROM stdin;
1	polat@gmail.com	$2b$12$DVhSy7JdGGX2JH4Eia.O6uGLfByi2tR1O0Xi0rA1.bmhSgp0U4JQm	polat alemdar	+998901234567	Toshkent	user
2	memati@gmail.com	$2b$12$dI1UqcfxSM579MJwSUcEa.YP9bhmVnRF2YWMXMD5AWJFvMqTIouXe	Memati Bash	998904504545	Jizzax	user
3	abdulhay@gmail.com	$2b$12$PEjX1YVFBnHeMVuhWiAkpeyE4f9x4PWliULzqhLTNAC/htp7Flpv.	AbdulHay Coban	998903332002	Sirdaryo	user
4	iskandar@gmail.com	$2b$12$uyui4AttuiranHw2IRjpmu.VWUOqk4Fkvklu1tNgl9xxk6JwK2HcK	Iskandar Buyuk	998901110011	Buxoro	user
5	tilki@gmail.com	$2b$12$mfGWFrl4Jz728X143L8uj.VHL5CXCjB8kResSJ99iJWSe22e8Qd/m	Tilki Andrei	998903408612	Samarqand	user
6	bulut@gmail.com	$2b$12$RrCBS9/OOGtabSFON6gYuuyT57cWH8zxTqA4vdkT78hH0/NhACbGO	Yalcin Bulut	998901232323	Surxondaryo	user
7	zaza@gmail.com	$2b$12$Qcf7rK0xjMcbHPsNJSZ/netHEurI9UFLLkQ23TtKwZlaSJbTxND6a	Zaza Dayi	998945804050	Navoiy	user
8	cakir@gmail.com	$2b$12$IK.Ncuq8zmITCVVR2NRPje7Z7kLZqcCrp0teF2xcl.86lPM6sqxUu	Sulaymon Cakir	998908804343	Toshkent city	user
\.


--
-- Name: avatar_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.avatar_images_id_seq', 8, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 8, true);


--
-- Name: product_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_images_id_seq', 58, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 20, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 8, true);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: avatar_images avatar_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avatar_images
    ADD CONSTRAINT avatar_images_pkey PRIMARY KEY (id);


--
-- Name: avatar_images avatar_images_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avatar_images
    ADD CONSTRAINT avatar_images_user_id_key UNIQUE (user_id);


--
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- Name: avatar_images avatar_images_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avatar_images
    ADD CONSTRAINT avatar_images_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: product_images product_images_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: products products_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict F0L9BWh8wqehilm7hdgB0syrRiHcwMz015Wzsv8AxuOJ6mvawK08l3RrE2tdGH9

