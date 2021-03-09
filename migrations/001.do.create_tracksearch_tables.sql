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
    -- (job description) is content
    jobrating INTEGER,
    interview TEXT DEFAULT '',
    postedurl TEXT DEFAULT '',
    companyname TEXT DEFAULT ''
);

-- // "id": "cbc787a0-ffaf-11e8-8eb2-f2801f1b9fd1",
-- // "name": "Software Engineer I - Target", 
-- // "modified": "2021-01-03T00:00:00.000Z", 
-- // "weekId": "b0715efe-ffaf-11e8-8eb2-f2801f1b9fd1", 
-- // "jobtitle": "Software Engineer",
-- // "companyname": "Target",
-- // "postedurl": "http://www.dummyURLplaceholder.com/",
-- // "interview": "Scheduled for 02/20/2021",
-- // "jobrating": "5",
-- // "content": "Corporis accusamus -

