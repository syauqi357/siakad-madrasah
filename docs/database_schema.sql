-- Database Schema Documentation
-- Generated based on Drizzle ORM Schema
-- Date: 2024-05-22

-- 1. System & Migration Tables
create table __drizzle_migrations
(
    id         SERIAL,
    hash       text not null,
    created_at numeric,
    primary key (id)
);

-- 2. User Management & Authentication
create table users
(
    id           integer not null,
    username     text    not null,
    password     text    not null,
    email        text    not null,
    role         text    not null, -- 'admin', 'teacher', 'student', etc.
    nama_lengkap text,
    nip          text,
    jabatan      text,
    primary key (id)
);

create unique index users_email_unique on users (email);
create unique index users_username_unique on users (username);

create table audit_logs
(
    id         integer                       not null,
    audit_type text                          not null,
    user_id    text                          not null,
    action     text                          not null,
    target     text,
    status     text                          not null,
    metadata   text,
    ip_address text,
    user_agent text,
    timestamp  integer default (unixepoch()) not null,
    primary key (id autoincrement)
);

-- 3. School Administrative Data
create table school_data
(
    id         integer not null,
    name       text    not null,
    npsn       integer not null,
    nsm        integer not null,
    akreditasi text    not null,
    alamat     text    not null,
    kota       text    not null,
    negara     text    not null,
    logoUrl    text    not null,
    primary key (id autoincrement)
);

create table academic_year
(
    id         integer not null,
    name       text    not null, -- e.g., "2023/2024"
    start_year integer,
    end_year   integer,
    start_date text,
    end_date   text,
    is_active  integer default 0, -- Boolean (0/1)
    primary key (id autoincrement)
);

create unique index academic_year_name_unique on academic_year (name);

-- 4. Teachers
create table teachers
(
    id             integer not null,
    user_id        integer,
    nip            text,
    full_name      text    not null,
    gender         text,
    birth_place    text,
    birth_date     text,
    religion       text,
    phone_number   text,
    personal_email text,
    profile_photo  text,
    primary key (id autoincrement),
    foreign key (user_id) references users on delete cascade
);

create unique index teachers_nip_unique on teachers (nip);
create unique index teachers_user_id_unique on teachers (user_id);

-- 5. Classes & Subjects Structure
create table classes
(
    id         integer not null,
    class_name text    not null, -- Generic Grade Level (e.g., "X", "XI", "XII")
    primary key (id autoincrement)
);

create table subjects
(
    id           integer not null,
    name         text    not null,
    subject_code text,
    primary key (id autoincrement)
);

create unique index subjects_name_unique on subjects (name);
create unique index subjects_subject_code_unique on subjects (subject_code);

create table rombel
(
    id               integer not null,
    code             text    not null, -- e.g., "X-A-2024"
    name             text    not null, -- e.g., "X IPA 1"
    class_id         integer not null, -- Links to Grade Level
    academic_year_id integer not null,
    class_advisor_id integer,          -- Homeroom Teacher
    student_capacity integer default 30,
    classroom        text,
    primary key (id autoincrement),
    foreign key (class_id) references classes,
    foreign key (academic_year_id) references academic_year,
    foreign key (class_advisor_id) references teachers
);

create unique index rombel_code_unique on rombel (code);

create table class_subject
(
    id         integer not null,
    class_id   integer not null, -- Currently links to Grade Level (classes), consider linking to rombel for specific assignments
    subject_id integer not null,
    teacher_id integer,
    primary key (id autoincrement),
    foreign key (class_id) references classes on delete cascade,
    foreign key (subject_id) references subjects,
    foreign key (teacher_id) references teachers
);

-- 6. Student Data
create table student
(
    id                       integer not null,
    student_name             text    not null,
    nisn                     integer not null,
    local_nis                integer,
    gender                   text,
    religion                 text,
    birth_place              text,
    birth_date               text,
    previous_school          text,
    phone_number             text,
    child_order              integer,
    siblings_count           integer,
    origin_region            text,
    bpjs                     text,
    id_card_number           text,
    birth_certificate_number text,
    nationality              text default 'Indonesia',
    living_with              text,
    transportation           text,
    profile_photo            text,
    created_at               text default CURRENT_TIMESTAMP,
    updated_at               text default CURRENT_TIMESTAMP,
    primary key (id autoincrement)
);

create index idx_students_local_nis on student (local_nis);
create index idx_students_nisn on student (nisn);
create index idx_students_student_name on student (student_name);
create unique index student_local_nis_unique on student (local_nis);
create unique index student_nisn_unique on student (nisn);

create table studentAddress
(
    id           integer not null,
    student_id   integer not null,
    province     text,
    regency      text,
    district     text,
    sub_district text,
    village      text,
    hamlet       text,
    street       text,
    house_number text,
    rt           text,
    rw           text,
    postal_code  text,
    primary key (id autoincrement),
    foreign key (student_id) references student on delete cascade
);

create unique index studentAddress_student_id_unique on studentAddress (student_id);

create table student_father
(
    id             integer not null,
    student_id     integer not null,
    nik            text,
    name           text,
    birth_place    text,
    birth_date     text,
    birth_year     integer,
    education      text,
    occupation     text,
    monthly_income real,
    phone_number   text,
    is_alive       integer default 1,
    primary key (id autoincrement),
    foreign key (student_id) references student on delete cascade
);

create unique index student_father_student_id_unique on student_father (student_id);

create table student_mother
(
    id             integer not null,
    student_id     integer not null,
    nik            text,
    name           text,
    birth_place    text,
    birth_date     text,
    birth_year     integer,
    education      text,
    occupation     text,
    monthly_income real,
    phone_number   text,
    is_alive       integer default 1,
    primary key (id autoincrement),
    foreign key (student_id) references student on delete cascade
);

create unique index student_mother_student_id_unique on student_mother (student_id);

-- 7. Academic Records (Scores & Attendance)
create table assessment_type
(
    id             integer not null,
    code           text    not null, -- e.g., "UH1", "UTS", "UAS"
    name           text    not null,
    default_weight integer,
    is_active      integer default true,
    created_at     text    default CURRENT_TIMESTAMP,
    primary key (id autoincrement)
);

create unique index assessment_type_code_unique on assessment_type (code);

create table student_scores
(
    id                 integer not null,
    student_id         integer not null,
    class_subject_id   integer not null, -- Links to the specific Subject taught in a Class
    assessment_type_id integer not null,
    score              real    not null,
    assessment_date    text default CURRENT_DATE,
    note               text,
    created_at         text default CURRENT_TIMESTAMP,
    primary key (id autoincrement),
    foreign key (student_id) references student on delete cascade,
    foreign key (class_subject_id) references class_subject on delete cascade,
    foreign key (assessment_type_id) references assessment_type
);

create unique index unique_student_assessment on student_scores (student_id, class_subject_id, assessment_type_id);

create table student_Attendance
(
    id             integer not null,
    student_id     integer not null,
    rombel_id      integer not null,
    date           text    not null,
    status         text    not null, -- 'hadir', 'sakit', 'izin', 'alpha'
    check_in_time  text,
    check_out_time text,
    note           text,
    primary key (id autoincrement),
    foreign key (student_id) references student on delete cascade,
    foreign key (rombel_id) references rombel
);

create index idx_student_attendance_date on student_Attendance (date);
create index idx_student_attendance_student on student_Attendance (student_id);
create unique index uniq_student_attendance on student_Attendance (student_id, rombel_id, date);
