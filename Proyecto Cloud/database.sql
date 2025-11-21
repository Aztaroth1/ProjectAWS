--
-- PostgreSQL database dump
--

\restrict RPbrEXSlu3iuDZndxGGgStkNIMTCExOVPKEEJeHlBq8LpBhw2FqqaVo1R8gTGnc

-- Dumped from database version 17.7
-- Dumped by pg_dump version 17.7

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
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer,
    product_id integer,
    quantity integer NOT NULL,
    price_at_purchase numeric(10,2) NOT NULL
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_id_seq OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    user_id integer
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    image_url character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
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
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    full_name character varying(100),
    role character varying(50) DEFAULT 'client'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
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
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, product_id, quantity, price_at_purchase) FROM stdin;
1	1	1	1	1200.50
2	2	1	1	1200.50
3	3	1	1	1200.50
4	4	1	1	1200.50
5	5	1	1	1200.50
6	6	1	1	1200.50
7	7	2	1	899.99
8	8	1	1	1200.50
9	9	1	1	1300.00
10	10	2	1	899.99
11	11	1	3	1300.00
12	12	2	1	899.99
13	13	1	2	1000.00
14	14	6	1	900.00
15	14	2	1	1050.00
16	14	8	1	1600.00
17	14	9	1	800.00
18	15	6	1	900.00
19	16	6	1	900.00
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, total_amount, status, created_at, user_id) FROM stdin;
1	1200.50	pending	2025-11-18 20:15:31.88913-05	\N
2	1200.50	pending	2025-11-18 20:15:49.314726-05	\N
3	1200.50	pending	2025-11-18 20:19:37.566762-05	\N
4	1200.50	completed	2025-11-18 20:34:05.694362-05	\N
5	1200.50	completed	2025-11-18 20:54:41.357123-05	\N
6	1200.50	completed	2025-11-18 20:58:33.452371-05	\N
7	899.99	completed	2025-11-18 21:03:56.268037-05	1
8	1200.50	completed	2025-11-18 22:07:40.415387-05	3
9	1300.00	completed	2025-11-18 22:29:49.654509-05	1
10	899.99	completed	2025-11-19 07:26:31.635267-05	1
11	3900.00	completed	2025-11-19 21:00:38.967098-05	1
12	899.99	completed	2025-11-19 21:23:01.831265-05	1
13	2000.00	completed	2025-11-19 22:26:05.726772-05	2
14	4350.00	completed	2025-11-19 23:01:01.81215-05	5
15	900.00	completed	2025-11-20 20:17:36.183015-05	2
16	900.00	completed	2025-11-20 20:19:30.137234-05	2
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, description, price, stock, image_url, created_at) FROM stdin;
10	Samsung galaxy s25 ultra	El Galaxy S25 Ultra es la joya de la serie S25: combina un diseño de titanio ultrarresistente con un rendimiento brutal impulsado por inteligencia artificial. Su pantalla AMOLED 2X de 6,9″ y 120 Hz te da una experiencia visual fluida y vibrante, mientras que su sistema de cámaras (incluyendo un sensor principal de 200 MP) captura cada detalle con una claridad sorprendente. Además, integra funciones avanzadas de IA para ayudarte en tareas del día a día, junto con el S Pen para productividad. Perfecto para quienes buscan potencia, creatividad y un dispositivo futurista.\r\n\r\nEspecificaciones técnicas\r\nPantalla: 6,9″ QHD+ Dynamic AMOLED 2X, 1-120 Hz. \r\nProcesador: Snapdragon 8 Elite para Galaxy. \r\nMemoria / Almacenamiento: 12 GB + 256 GB / 512 GB / 1 TB. \r\nSamsung Global Newsroom\r\nEL ESPAÑOL\r\nCámaras traseras:\r\n200 MP (gran angular, OIS) \r\nAndroid Update Tracker\r\nSamsung Global Newsroom\r\n50 MP (ultra gran angular) \r\n50 MP (telefoto 5×, OIS) \r\n10 MP (telefoto 3×, OIS) \r\nCámara frontal: 12 MP. \r\nBatería: 5.000 mAh. \r\nPor cable: 45 W según Samsung. \r\nInalámbrica: sí (Galaxy informa carga inalámbrica rápida) \r\nConectividad: 5G, Wi-Fi 7. \r\nSeguridad / Extras: Lector de huella ultrasónico bajo la pantalla, IP68 (resistencia al agua y polvo). \r\nSistema operativo: One UI 7, basado en Android 15. \r\nMateriales / Diseño: Marco de titanio + vidrio Corning Gorilla Armor 2. \r\nDimensiones / Peso: 162,8 × 77,6 × 8,2 mm; ~218 g. \r\n	1399.99	10	uploads\\image-1763607830645.png	2025-11-19 22:03:50.68926-05
1	Lenovo Ideapad 5	Lenovo IdeaPad 5 ofrece un rendimiento rápido y confiable para trabajo, estudio y entretenimiento, con un diseño delgado y elegante ideal para llevar a cualquier parte.\r\n\r\nEspecificaciones técnicas:\r\n\r\nProcesador: AMD Ryzen 5 5500U\r\n\r\nMemoria RAM: 8 GB DDR4\r\n\r\nAlmacenamiento: 512 GB SSD\r\n\r\nPantalla: 15.6" Full HD (1920 × 1080)\r\n\r\nGráficos: AMD Radeon Graphics\r\n\r\nSistema Operativo: Windows 11\r\n\r\nConectividad: WiFi 6, Bluetooth 5.1\r\n\r\nPuertos: USB-C, USB 3.1, HDMI, lector de tarjetas SD\r\n\r\nPeso: 1.66 kg	1000.00	8	uploads\\image-1763606133313.png	2025-11-18 09:56:25.960784-05
6	ASUS ROG Strix G15	ASUS ROG Strix G15 (2022) está diseñada para los jugadores más exigentes. Con una gráfica de alto rendimiento y un sistema de refrigeración optimizado, te da la potencia necesaria para dominar tanto en juegos AAA como en esports, sin sacrificar portabilidad ni estilo.\r\n\r\nEspecificaciones técnicas:\r\n\r\nProcesador: AMD Ryzen 9 6900HX \r\nTarjeta de video: NVIDIA GeForce RTX 3070 Ti (8 GB GDDR6) \r\nPantalla: 15,6″ IPS FHD (1920 × 1080) con tasa de refresco de hasta 300 Hz \r\nMemoria: 16 GB DDR4 (hasta 32 GB admitidos) \r\nAlmacenamiento: SSD NVMe (modelos con opción de varias ranuras) \r\nSistema operativo: Windows 11 Home \r\nBatería: 90 Wh (según otros modelos similares) \r\nConectividad: Wi-Fi 6, varios puertos USB y HDMI (según versión) \r\nPeso: Aproximadamente 2.3 kg según algunas versiones. \r\nB&H Photo Video\r\nDiseño: Teclado RGB por tecla, chasis con ventilación optimizada. \r\n	900.00	3	uploads\\image-1763606703567.png	2025-11-19 21:45:03.613412-05
5	ASUS VivoBook S15	ASUS VivoBook S15 S533 es un portátil elegante y moderno, ideal para estudiantes y profesionales que necesitan un equipo equilibrado entre rendimiento, diseño y portabilidad.\r\n\r\nEspecificaciones técnicas:\r\nProcesador: Intel Core i5-10210U / i7-10510U \r\nMemoria RAM: 8 GB DDR4 \r\nAlmacenamiento: SSD PCIe NVMe de 256 GB / 512 GB / 1 TB \r\nPantalla: 15.6″ Full HD (1920 × 1080), IPS, biseles delgados, relación pantalla-cuerpo del 86% \r\nGráficos: Intel UHD / NVIDIA GeForce MX250 \r\nSistema operativo: Windows 10 Home (recomiendan Windows 10 Pro para empresas) \r\nConectividad: USB-C, USB 3.2, HDMI, lector microSD \r\nTeclado: Retroiluminado, cómodo para escribir \r\nCámara: 720p HD \r\n	440.00	8	uploads\\image-1763606554060.png	2025-11-19 21:42:34.211098-05
7	Lenovo Legion 5	Lenovo Legion 5 es un portátil gamer diseñado para ofrecer gran rendimiento en juegos exigentes, con un sistema de refrigeración eficiente y una pantalla rápida que maximiza tu experiencia competitiva. Su construcción robusta y teclado RGB aportan una sensación premium sin sacrificar funcionalidad.\r\n\r\nEspecificaciones técnicas:\r\nProcesador: AMD Ryzen 7 5800H (8 núcleos, hasta 4.4 GHz)\r\nMemoria RAM: 16 GB DDR4-3200 (2×8) \r\nAlmacenamiento: 512 GB SSD NVMe \r\nTarjeta gráfica: NVIDIA GeForce RTX 3060 (6 GB GDDR6) \r\nPantalla: 15,6″ Full HD (1920 × 1080), IPS, hasta 165 Hz \r\nConectividad: Wi-Fi 6, Bluetooth 5.1 \r\nPuertos: USB-C, HDMI 2.1, varios USB 3.2, Ethernet RJ-45 \r\nBatería: Aproximadamente 60 Wh \r\nPeso: ~2,4 kg \r\nSistema de audio: altavoces estéreo con Nahimic Audio \r\n	1350.00	10	uploads\\image-1763606880363.png	2025-11-19 21:48:00.4083-05
12	Motorola Moto G Play	Rendimiento Qualcomm increíblemente rápido. Obtén la velocidad que necesitas para un gran entretenimiento con un procesador Snapdragon 680 y 4 GB de RAM.\r\nPantalla fluida + sonido estéreo inmersivo. Dale vida a tu entretenimiento con una pantalla ultra ancha de 6.5" 90Hz* HD+ más altavoces estéreo, Dolby Atmos y audio de alta resolución**.\r\nCámara Quad Pixel de 50 MP. Captura fotos más nítidas y vibrantes de día o de noche con 4 veces la sensibilidad a la luz.\r\nAlmacenamiento integrado de 64 GB****. Obtén mucho espacio para fotos, películas, canciones y aplicaciones, y agrega hasta 1 TB más con una tarjeta microSD*****.\r\nIncreíble duración de la batería. Trabaja y juega sin parar con una batería de 5000 mAh de larga duración. *****\r\nDiseño elegante y elegante. Cuidadosamente elaborado con materiales de primera calidad, con un aspecto aerodinámico, acabado mate duradero y protección contra salpicaduras.\r\n* El modo automático tiene una frecuencia de actualización mínima del dispositivo de 60Hz y una frecuencia de actualización máxima de 90Hz; la frecuencia de actualización real puede ser menor y variará según las limitaciones y requisitos de la aplicación/contenido, la configuración del modo del dispositivo y otros factores. **Se puede utilizar solo con auriculares y aplicaciones con cable compatibles de alta resolución. Verifique los dispositivos y aplicaciones aplicables para determinar la compatibilidad.	149.99	10	uploads\\image-1763608444709.png	2025-11-19 22:12:19.67225-05
13	Samsung Galaxy A16 5G	Sobre este artículo:\r\nMarca\tSamsung\r\nSistema operativo\tAndroid 14, una interfaz de usuario\r\nTamaño de la memoria RAM instalada\t4 GB\r\nModelo de CPU\tOthers\r\nVelocidad de la CPU\t2,4 GHz\r\nCapacidad de almacenamiento de memoria\t128 GB\r\nTamaño de pantalla\t6,7 Pulgadas\r\nResolución\t1880 x 2340\r\nNombre del modelo\tGalaxy A16\r\nOperador inalámbrico\tTodas las empresas de transportes	170.00	2	uploads\\image-1763608611546.png	2025-11-19 22:16:51.589575-05
2	Dell XPS 13	El Dell XPS 13 9310 es un portátil ultraligero y potente, perfecto para productividad, estudio y viajes gracias a su diseño premium de aluminio y batería de larga duración.\r\n\r\nEspecificaciones técnicas:\r\nProcesador: Intel Core i5-1135G7 \r\nMemoria RAM: 8 GB LPDDR4x \r\nAlmacenamiento: 256 GB SSD M.2 PCIe NVMe \r\nPantalla: 13,4″ FHD+ (1920 × 1200) InfinityEdge, anti-deslumbrante \r\nGráficos: Intel Iris Xe \r\nSistema operativo: Windows 10 Pro \r\nPuertos: 2 × Thunderbolt 4, lector microSD \r\nPeso: 1,2 kg (aproximadamente) \r\n	1050.00	9	uploads\\image-1763606348391.png	2025-11-18 09:56:25.960784-05
8	iphone 17 pro max	El iPhone 17 redefine lo que esperas de un teléfono insignia: su diseño refinado en aluminio incorpora vidrio con Ceramic Shield 2, mucho más resistente a rayones. Integra el potente chip A19, que combina alto rendimiento con eficiencia, y permite nuevas funciones de Apple Intelligence para mejorar tu experiencia diaria.\r\n\r\nSu pantalla Super Retina XDR de 6,3″ ofrece una tasa de refresco de hasta 120 Hz (ProMotion) y siempre activa para una visualización fluida y en tiempo real. En la parte fotográfica, monta un sistema de dos cámaras de 48 MP (Dual Fusion) que captura imágenes nítidas y vídeo de alta calidad. Además, cuenta con Face ID, carga rápida y carga inalámbrica MagSafe de hasta 25W. Apple da gran importancia a la sustentabilidad: el iPhone 17 está hecho con un 30 % de materiales reciclados. \r\n	1600.00	1	uploads\\image-1763607211214.png	2025-11-19 21:52:39.399941-05
9	Xiaomi 15 ultra	El Xiaomi 15 Ultra es el nuevo buque insignia de Xiaomi, diseñado para quienes exigen lo mejor en rendimiento y fotografía. Gracias a su potente procesador, pantalla brillante y un sistema de cámaras Leica versátil, este equipo se destaca en cada aspecto. Su batería con carga súper rápida asegura que no te quedes atrás, incluso en un día intenso de uso.	800.00	4	uploads\\image-1763607653233.png	2025-11-19 22:00:53.276247-05
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, full_name, role, created_at) FROM stdin;
1	stivenguapucal2003@hotmail.com	$2b$10$lI0qyWbNsXTm2kxxbMskI.UqGMytP6WeA1LgDkfvESUKg3Sx9J7Vq	Stiven	admin	2025-11-18 20:57:30.594388-05
2	sebasfiallos2000@hotmail.com	$2b$10$vkhxV53C7FiiPXp5NJYIi.a3LfydP9vx3BFa9TrDph1sovGW6h1py	Sebas	client	2025-11-18 21:53:37.506272-05
4	fernandoguapucal1992@hotmail.com	$2b$10$MA/GtuZ4HBSsquYpUVv5WOeAFsO1TIkTKi10GgXg2/7nSwZoaSsfu	Fernando	client	2025-11-19 20:21:02.213051-05
5	santiagoango@hotmail.com	$2b$10$HTmt9Ckkm.34nYCw2Dk5xenuZ/EDrkrvhEgF5boizyN8uoBQfAIIi	Santiago 	client	2025-11-19 22:59:14.575518-05
6	rafaelrodriguez@hotmail.com	$2b$10$zqtQhQ9VUGvTg1ACwzmScuPGhg5Oq6ri4Ih4Y/r5a5QjzKY/H3jDi	Rafael	admin	2025-11-20 19:51:12.806357-05
8	cesarsarango@hotmail.com	$2b$10$urDFHGUJLOUiZd9nyWBP2O34srQl/8QaQ7gZbNv/7uzYNdzENHapy	César 	admin	2025-11-20 19:53:10.383742-05
7	domenicaplaza@hotmail.com	$2b$10$7nnLcYOzXw4QpZA2/5uSVe0AZSXhSKHX1rmwM4zfFg94sqpmyuHz.	Doménica	admin	2025-11-20 19:52:12.984005-05
3	jessicam1956@hotmail.com	$2b$10$ES726CeTZKMZOK7hl7yyi.vOmkWWJWDftH3aGfF5dcSoV9V0hp75.	Jessica	admin	2025-11-18 22:07:29.143973-05
\.


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_id_seq', 19, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 16, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 13, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 8, true);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict RPbrEXSlu3iuDZndxGGgStkNIMTCExOVPKEEJeHlBq8LpBhw2FqqaVo1R8gTGnc

