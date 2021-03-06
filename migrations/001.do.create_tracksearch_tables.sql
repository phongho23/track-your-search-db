CREATE TABLE weeks (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL
);

CREATE TABLE jobs (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    jobtitle TEXT NOT NULL,
    "weekId" INTEGER REFERENCES weeks(id) ON DELETE CASCADE NOT NULL,
    modified TIMESTAMPTZ DEFAULT now() NOT NULL,
    content TEXT DEFAULT '', 
    jobrating INTEGER,
    interview TEXT DEFAULT '',
    postedurl TEXT DEFAULT '',
    companyname TEXT DEFAULT ''
);

